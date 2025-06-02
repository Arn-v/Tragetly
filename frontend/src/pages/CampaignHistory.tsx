
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, BarChart3, Users, Send, AlertCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock campaign data
  const campaigns = [
    {
      id: "1",
      name: "Summer Sale 2024",
      status: "completed",
      audienceSize: 2500,
      sent: 2450,
      delivered: 2380,
      opened: 1654,
      clicked: 425,
      failed: 50,
      createdAt: "2024-07-15",
      lastActivity: "2024-07-20"
    },
    {
      id: "2",
      name: "Welcome New Customers",
      status: "active",
      audienceSize: 450,
      sent: 450,
      delivered: 448,
      opened: 312,
      clicked: 89,
      failed: 2,
      createdAt: "2024-07-18",
      lastActivity: "2024-07-18"
    },
    {
      id: "3",
      name: "Black Friday Preview",
      status: "draft",
      audienceSize: 5200,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      createdAt: "2024-07-10",
      lastActivity: "2024-07-10"
    },
    {
      id: "4",
      name: "Customer Retention",
      status: "completed",
      audienceSize: 1800,
      sent: 1800,
      delivered: 1785,
      opened: 1205,
      clicked: 380,
      failed: 15,
      createdAt: "2024-07-05",
      lastActivity: "2024-07-12"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <BarChart3 className="w-4 h-4" />;
      case "active": return <Send className="w-4 h-4" />;
      case "draft": return <Users className="w-4 h-4" />;
      case "failed": return <AlertCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateEngagementRate = (campaign: any) => {
    if (campaign.sent === 0) return 0;
    return Math.round((campaign.clicked / campaign.sent) * 100);
  };

  const calculateDeliveryRate = (campaign: any) => {
    if (campaign.sent === 0) return 0;
    return Math.round((campaign.delivered / campaign.sent) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign History</h1>
          <p className="text-gray-600 mt-1">View and analyze your marketing campaigns</p>
        </div>
        <Button 
          onClick={() => navigate("/campaign-builder")}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(campaign.status)}
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(campaign.status)} variant="secondary">
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audience */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Audience Size</span>
                <span className="font-medium">{campaign.audienceSize.toLocaleString()}</span>
              </div>

              {/* Delivery Stats */}
              {campaign.status !== "draft" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sent</span>
                    <span>{campaign.sent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivered</span>
                    <span className="text-green-600">{campaign.delivered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Opened</span>
                    <span className="text-blue-600">{campaign.opened.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Clicked</span>
                    <span className="text-purple-600">{campaign.clicked.toLocaleString()}</span>
                  </div>
                  {campaign.failed > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Failed</span>
                      <span className="text-red-600">{campaign.failed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Performance Metrics */}
              {campaign.status !== "draft" && (
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Delivery Rate</span>
                    <span className="font-medium">{calculateDeliveryRate(campaign)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-medium">{calculateEngagementRate(campaign)}%</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {campaign.status === "draft" ? "Created" : "Last activity"}: {campaign.lastActivity}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/campaign/${campaign.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first campaign"
              }
            </p>
            <Button 
              onClick={() => navigate("/campaign-builder")}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignHistory;
