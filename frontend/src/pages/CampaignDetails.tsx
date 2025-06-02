
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const CampaignDetails = () => {
  const { id } = useParams();

  // Mock campaign data - replace with actual API call
  const campaign = {
    id: parseInt(id || "1"),
    name: "Summer Sale Promotion",
    status: "Completed",
    audienceSize: 1250,
    sent: 1200,
    delivered: 1180,
    opened: 850,
    clicked: 320,
    failed: 20,
    createdAt: "2024-01-15T10:30:00",
    completedAt: "2024-01-15T14:45:00",
    message: "Hey {{name}}, our summer sale is here! Get 25% off all items. Don't miss out! 🌞",
    targetingRules: [
      { field: "totalSpend", operator: "$gt", value: "100" },
      { field: "visits", operator: "$gte", value: "3" }
    ]
  };

  // Mock communication logs
  const communicationLogs = [
    {
      id: 1,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      status: "DELIVERED",
      sentAt: "2024-01-15T10:35:00",
      deliveredAt: "2024-01-15T10:35:15",
      openedAt: "2024-01-15T11:20:00",
      clickedAt: "2024-01-15T11:22:00",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      status: "DELIVERED",
      sentAt: "2024-01-15T10:35:00",
      deliveredAt: "2024-01-15T10:35:12",
      openedAt: "2024-01-15T13:45:00",
      clickedAt: null,
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      status: "FAILED",
      sentAt: "2024-01-15T10:35:00",
      deliveredAt: null,
      openedAt: null,
      clickedAt: null,
    },
    // Add more logs...
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "default";
      case "FAILED": return "destructive";
      case "PENDING": return "secondary";
      default: return "outline";
    }
  };

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return "0.0";
    return ((numerator / denominator) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/campaign-history">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <Badge variant={campaign.status === "Completed" ? "default" : "secondary"}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">
            Created on {new Date(campaign.createdAt).toLocaleDateString()}
            {campaign.completedAt && ` • Completed on ${new Date(campaign.completedAt).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{campaign.audienceSize.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Target Audience</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{campaign.sent.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Messages Sent</p>
            <p className="text-xs text-gray-500 mt-1">
              {calculateRate(campaign.sent, campaign.audienceSize)}% of audience
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{campaign.delivered.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-xs text-gray-500 mt-1">
              {calculateRate(campaign.delivered, campaign.sent)}% delivery rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">{campaign.clicked.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Clicked</p>
            <p className="text-xs text-gray-500 mt-1">
              {calculateRate(campaign.clicked, campaign.delivered)}% click rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Message Template</h4>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                {campaign.message}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Targeting Rules</h4>
              <div className="space-y-2">
                {campaign.targetingRules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {rule.field} {rule.operator} {rule.value}
                    </Badge>
                    {index < campaign.targetingRules.length - 1 && (
                      <span className="text-gray-500">AND</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {calculateRate(campaign.delivered, campaign.sent)}%
                </div>
                <div className="text-sm text-gray-600">Delivery Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {calculateRate(campaign.opened, campaign.delivered)}%
                </div>
                <div className="text-sm text-gray-600">Open Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {calculateRate(campaign.clicked, campaign.delivered)}%
                </div>
                <div className="text-sm text-gray-600">Click Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {calculateRate(campaign.failed, campaign.sent)}%
                </div>
                <div className="text-sm text-gray-600">Failure Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Communication Logs</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Detailed delivery status for each customer
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Delivered At</TableHead>
                  <TableHead>Opened At</TableHead>
                  <TableHead>Clicked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communicationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.customerName}</div>
                        <div className="text-sm text-gray-500">{log.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(log.sentAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.deliveredAt ? new Date(log.deliveredAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.openedAt ? new Date(log.openedAt).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.clickedAt ? new Date(log.clickedAt).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetails;
