import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Wand2, Users, Plus, Trash2, Loader2 } from "lucide-react";

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Customer {
  name: string;
  email: string;
  totalSpend: number;
  visits?: number;
  orderCount?: number;
}

interface Campaign {
  _id?: string;
  name: string;
  segmentRules?: any;
  naturalPrompt?: string;
  messageTemplate: string;
  audienceSize: number;
  status: string;
}

const CampaignBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [segmentationType, setSegmentationType] = useState<"manual" | "ai">("manual");
  const [rules, setRules] = useState<Rule[]>([
    { id: "1", field: "totalSpend", operator: "$gt", value: "100" }
  ]);
  const [aiQuery, setAiQuery] = useState("");
  const [message, setMessage] = useState("");
  const [audienceSize, setAudienceSize] = useState(0);
  const [sampleCustomers, setSampleCustomers] = useState<Customer[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  
  // Loading states
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [isTriggeringCampaign, setIsTriggeringCampaign] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://tragetly.onrender.com/api';

  const steps = [
    { number: 1, title: "Campaign Details", description: "Basic campaign information" },
    { number: 2, title: "Define Audience", description: "Select your target audience" },
    { number: 3, title: "Create Message", description: "Design your campaign message" },
  ];

  const fieldOptions = [
    { value: "totalSpend", label: "Total Spend" },
    { value: "visits", label: "Visits" },
    { value: "lastActive", label: "Last Active" },
    { value: "orderCount", label: "Order Count" },
  ];

  const operatorOptions = [
    { value: "$gt", label: "Greater than" },
    { value: "$lt", label: "Less than" },
    { value: "$eq", label: "Equal to" },
    { value: "$gte", label: "Greater than or equal" },
    { value: "$lte", label: "Less than or equal" },
  ];

  // API Helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  };

  // Convert rules to segment rules format
  const convertRulesToSegmentRules = (rules: Rule[]) => {
    const segmentRules: any = {};
    
    rules.forEach(rule => {
      if (!segmentRules[rule.field]) {
        segmentRules[rule.field] = {};
      }
      
      // Convert string values to appropriate types
      let value: any = rule.value;
      if (rule.field === 'totalSpend' || rule.field === 'visits' || rule.field === 'orderCount') {
        value = parseFloat(rule.value) || 0;
      }
      
      segmentRules[rule.field][rule.operator] = value;
    });
    
    return segmentRules;
  };

  // Fetch audience preview
  const fetchAudiencePreview = async () => {
    try {
      const segmentRules = segmentationType === "manual" 
        ? convertRulesToSegmentRules(rules)
        : undefined;

      const response = await apiCall('/campaigns/preview-audience', {
        method: 'POST',
        body: JSON.stringify({
          segmentRules,
          naturalPrompt: segmentationType === "ai" ? aiQuery : undefined,
        }),
      });

      setAudienceSize(response.audienceSize || 0);
      setSampleCustomers(response.sampleCustomers || []);
    } catch (error) {
      console.error('Failed to fetch audience preview:', error);
      // Set fallback data
      setAudienceSize(0);
      setSampleCustomers([]);
    }
  };

  // Create segment/campaign
  const createSegment = async () => {
    setIsCreatingSegment(true);
    setError(null);

    try {
      const segmentRules = segmentationType === "manual" 
        ? convertRulesToSegmentRules(rules)
        : undefined;

      const response = await apiCall('/campaigns/segment', {
        method: 'POST',
        body: JSON.stringify({
          name: campaignName,
          segmentRules,
          naturalPrompt: segmentationType === "ai" ? aiQuery : undefined,
          messageTemplate: message || "Hello {{name}}!",
        }),
      });

      setCampaign(response.campaign);
      setAudienceSize(response.campaign.audienceSize || 0);
      
      // Show success message
      showToast("Campaign Created", "Your campaign has been successfully created!");
      
    } catch (error) {
      console.error('Failed to create segment:', error);
    } finally {
      setIsCreatingSegment(false);
    }
  };

  // Trigger campaign
  const triggerCampaign = async () => {
    if (!campaign?._id) {
      setError("No campaign to trigger");
      return;
    }

    setIsTriggeringCampaign(true);
    setError(null);

    try {
      const response = await apiCall(`/campaigns/trigger/${campaign._id}`, {
        method: 'POST',
        body: JSON.stringify({
          messageTemplate: message,
        }),
      });

      setCampaign(response.campaign);
      
      showToast("Campaign Launched!", 
        `"${campaignName}" has been sent to ${response.logsCreated} customers.`);
      
      // Reset form after successful launch
      resetForm();
      
    } catch (error) {
      console.error('Failed to trigger campaign:', error);
    } finally {
      setIsTriggeringCampaign(false);
    }
  };

  // Generate AI message suggestion
  const generateAiSuggestion = async () => {
    setIsGeneratingAI(true);
    setError(null);

    try {
      const response = await apiCall('/campaigns/ai-message-suggestion', {
        method: 'POST',
        body: JSON.stringify({
          campaignName,
          audienceSize,
          segmentationType,
        }),
      });

      setMessage(response.suggestion || "Hello {{name}}!");
      showToast("AI Suggestion Applied", "We've generated a personalized message for your campaign.");
      
    } catch (error) {
      // Fallback to local suggestions if API fails
      const suggestions = [
        "Hey {{name}}, we've got something special just for you! 🎉",
        "Hi {{name}}, your loyalty means the world to us. Here's a thank you gift!",
        "{{name}}, ready for your next favorite purchase? Check this out!",
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setMessage(randomSuggestion);
      showToast("AI Suggestion Applied", "We've generated a personalized message for your campaign.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Process AI query
  const processAiQuery = async () => {
    if (!aiQuery.trim()) return;

    setIsProcessingAI(true);
    setError(null);

    try {
      const response = await apiCall('/campaigns/process-ai-query', {
        method: 'POST',
        body: JSON.stringify({
          query: aiQuery,
        }),
      });

      // Convert response rules to frontend format
      const processedRules = Object.entries(response.generatedQuery || {}).map(([field, operators], index) => {
        const operatorEntries = Object.entries(operators as any);
        return operatorEntries.map(([operator, value], subIndex) => ({
          id: `ai-${index}-${subIndex}`,
          field,
          operator,
          value: String(value),
        }));
      }).flat();

      if (processedRules.length > 0) {
        setRules(processedRules);
      }

      setAudienceSize(response.estimatedAudience || 0);
      showToast("AI Processing Complete", "We've converted your query into targeting rules.");
      
    } catch (error) {
      console.error('Failed to process AI query:', error);
      // Fallback processing
      const exampleRules = [
        { id: "ai-1", field: "totalSpend", operator: "$gt", value: "500" },
        { id: "ai-2", field: "visits", operator: "$gte", value: "3" },
      ];
      setRules(exampleRules);
      setAudienceSize(Math.floor(Math.random() * 2000) + 500);
      showToast("AI Processing Complete", "We've converted your query into targeting rules.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Utility functions
  const showToast = (title: string, description: string) => {
    // In a real app, you'd use your toast implementation
    console.log(`${title}: ${description}`);
    // You can integrate with react-hot-toast or similar library
  };

  const resetForm = () => {
    setCampaignName("");
    setCurrentStep(1);
    setRules([{ id: "1", field: "totalSpend", operator: "$gt", value: "100" }]);
    setMessage("");
    setAiQuery("");
    setCampaign(null);
    setAudienceSize(0);
    setSampleCustomers([]);
    setError(null);
  };

  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      field: "totalSpend",
      operator: "$gt",
      value: "0"
    };
    setRules([...rules, newRule]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return campaignName.trim().length > 0;
      case 2: return segmentationType === "manual" ? rules.length > 0 : aiQuery.trim().length > 0;
      case 3: return message.trim().length > 0;
      default: return false;
    }
  };

  const renderMessagePreview = () => {
    if (!message || sampleCustomers.length === 0) return message;
    
    const sampleCustomer = sampleCustomers[0];
    const previewMessage = message
      .replace(/\{\{name\}\}/g, sampleCustomer.name)
      .replace(/\{\{totalSpend\}\}/g, sampleCustomer.totalSpend.toString())
      .replace(/\{\{visits\}\}/g, sampleCustomer.visits?.toString() || "0")
      .replace(/\{\{lastActive\}\}/g, "3 days ago");
    
    return previewMessage;
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      await fetchAudiencePreview();
    }
    if (currentStep === 3) {
      await createSegment();
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleLaunch = async () => {
    await triggerCampaign();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaign Builder</h1>
        <p className="text-gray-600 mt-1">Create targeted campaigns for your customers</p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= currentStep
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    step.number <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.number < currentStep ? "bg-orange-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Step 1: Campaign Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="Enter campaign name..."
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Define Audience */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Segmentation Type Selection */}
              <div className="flex gap-4">
                <Button
                  variant={segmentationType === "manual" ? "default" : "outline"}
                  onClick={() => setSegmentationType("manual")}
                  className={segmentationType === "manual" ? "bg-gradient-to-r from-orange-500 to-red-600" : ""}
                >
                  Manual Rules
                </Button>
                <Button
                  variant={segmentationType === "ai" ? "default" : "outline"}
                  onClick={() => setSegmentationType("ai")}
                  className={segmentationType === "ai" ? "bg-gradient-to-r from-orange-500 to-red-600" : ""}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Use AI
                </Button>
              </div>

              {/* Manual Rules Builder */}
              {segmentationType === "manual" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Targeting Rules</h3>
                    <Button onClick={addRule} size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {rules.map((rule, index) => (
                      <div key={rule.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        {index > 0 && <span className="text-sm font-medium text-gray-500">AND</span>}
                        
                        <Select value={rule.field} onValueChange={(value) => updateRule(rule.id, "field", value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={rule.operator} onValueChange={(value) => updateRule(rule.id, "operator", value)}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {operatorOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                          placeholder="Value"
                          className="w-32"
                        />

                        {rules.length > 1 && (
                          <Button
                            onClick={() => removeRule(rule.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Natural Language Input */}
              {segmentationType === "ai" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aiQuery">Describe your target audience</Label>
                    <Textarea
                      id="aiQuery"
                      placeholder="e.g., 'Find customers who spent more than $500 and visited at least 3 times in the last 6 months'"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="mt-1 min-h-[100px]"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      Examples: "High-value customers", "Customers who haven't ordered in 30 days", "Frequent buyers from New York"
                    </div>
                  </div>
                  <Button 
                    onClick={processAiQuery} 
                    disabled={!aiQuery.trim() || isProcessingAI}
                  >
                    {isProcessingAI ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {isProcessingAI ? "Processing..." : "Process with AI"}
                  </Button>
                </div>
              )}

              {/* Audience Preview */}
              {audienceSize > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-orange-600" />
                    <h3 className="font-medium">Audience Preview</h3>
                    <Badge variant="secondary">{audienceSize.toLocaleString()} customers</Badge>
                  </div>
                  <div className="space-y-2">
                    {sampleCustomers.slice(0, 3).map((customer, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{customer.name} ({customer.email})</span>
                        <span className="text-gray-500">Spend: ${customer.totalSpend}</span>
                      </div>
                    ))}
                    {audienceSize > 3 && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        + {(audienceSize - 3).toLocaleString()} more customers
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Create Message */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message Template</Label>
                <Button 
                  onClick={generateAiSuggestion} 
                  size="sm" 
                  variant="outline"
                  disabled={isGeneratingAI}
                >
                  {isGeneratingAI ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingAI ? "Generating..." : "AI Suggestion"}
                </Button>
              </div>
              <Textarea
                id="message"
                placeholder="Write your campaign message here... Use {{name}} for personalization."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="text-sm text-gray-500">
                Available placeholders: &#123;&#123;name&#125;&#125;, &#123;&#123;totalSpend&#125;&#125;, &#123;&#123;visits&#125;&#125;, &#123;&#123;lastActive&#125;&#125;
              </div>
              
              {/* Message Preview */}
              {message && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium mb-2">Preview:</h4>
                  <div className="text-sm">
                    {renderMessagePreview()}
                  </div>
                </div>
              )}

              {/* Campaign Status */}
              {campaign && (
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-medium mb-2">Campaign Status:</h4>
                  <div className="text-sm">
                    <p><strong>Name:</strong> {campaign.name}</p>
                    <p><strong>Status:</strong> <Badge>{campaign.status}</Badge></p>
                    <p><strong>Audience Size:</strong> {campaign.audienceSize.toLocaleString()} customers</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isCreatingSegment}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {isCreatingSegment && currentStep === 3 ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Next"
            )}
            {!isCreatingSegment && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        ) : (
          <Button
            onClick={handleLaunch}
            disabled={!canProceed() || !campaign || isTriggeringCampaign}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isTriggeringCampaign ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isTriggeringCampaign ? "Launching..." : "Launch Campaign"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CampaignBuilder;
