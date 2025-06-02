
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Megaphone, TrendingUp, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Orders",
      value: "1,234",
      change: "+8%",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Campaigns",
      value: "67",
      change: "+23%",
      icon: Megaphone,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Revenue",
      value: "$124,531",
      change: "+15%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: "Summer Sale Promotion",
      status: "Active",
      audienceSize: 1250,
      sent: 1200,
      opened: 850,
      clicked: 320,
    },
    {
      id: 2,
      name: "New Product Launch",
      status: "Completed",
      audienceSize: 800,
      sent: 800,
      opened: 640,
      clicked: 180,
    },
    {
      id: 3,
      name: "Customer Retention",
      status: "Draft",
      audienceSize: 450,
      sent: 0,
      opened: 0,
      clicked: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <Link to="/campaign-builder">
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Campaigns</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Track your latest campaign performance</p>
          </div>
          <Link to="/campaign-history">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <Badge variant={campaign.status === "Active" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Audience:</span> {campaign.audienceSize.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Sent:</span> {campaign.sent.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Opened:</span> {campaign.opened.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Clicked:</span> {campaign.clicked.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Link to={`/campaign/${campaign.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
