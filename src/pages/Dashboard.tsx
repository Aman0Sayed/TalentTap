import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  BriefcaseIcon,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  UserPlus,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Active Jobs",
      value: "24",
      icon: BriefcaseIcon,
      change: "+3",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Applicants",
      value: "1,847",
      icon: Users,
      change: "+127",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Interviews Scheduled",
      value: "32",
      icon: Calendar,
      change: "+8",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Offers Extended",
      value: "12",
      icon: CheckCircle,
      change: "+4",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const recentActivity = [
    {
      action: "New application received",
      candidate: "Sarah Johnson",
      position: "Frontend Developer",
      time: "2 minutes ago",
    },
    {
      action: "Interview scheduled",
      candidate: "Mike Chen",
      position: "Product Manager",
      time: "15 minutes ago",
    },
    {
      action: "Offer extended",
      candidate: "Emily Davis",
      position: "UX Designer",
      time: "1 hour ago",
    },
    {
      action: "Application reviewed",
      candidate: "David Wilson",
      position: "Backend Developer",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">📊 Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Welcome back! Here's what's happening with your recruitment.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md transition-all w-full md:w-auto"
          onClick={() => navigate("/jobs")}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-xl transition-shadow border border-gray-100 w-full"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} this week</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hiring Pipeline */}
        <Card className="lg:col-span-2 border border-gray-100 w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Hiring Pipeline Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: "Applied", value: 324 },
                { label: "Screening", value: 89 },
                { label: "Interview", value: 45 },
                { label: "Offer", value: 12 },
                { label: "Hired", value: 8 },
              ].map((stage, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {stage.label} ({stage.value})
                    </span>
                    <span className="text-xs text-gray-500">
                      {stage.value} candidates
                    </span>
                  </div>
                  <Progress
                    value={Math.min(stage.value, 100)}
                    className="h-2 bg-blue-100 rounded [&>div]:bg-blue-500"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-100 w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-xl border"
                >
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    {activity.candidate} - {activity.position}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-gray-100 w-full">
        <CardHeader>
          <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col justify-center items-center border hover:bg-blue-50 transition text-center"
            >
              <BriefcaseIcon className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Create Job</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col justify-center items-center border hover:bg-green-50 transition text-center"
            >
              <Users className="w-6 h-6 text-green-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Review Applications</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col justify-center items-center border hover:bg-purple-50 transition text-center"
            >
              <Calendar className="w-6 h-6 text-purple-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">Schedule Interview</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col justify-center items-center border hover:bg-orange-50 transition text-center"
            >
              <TrendingUp className="w-6 h-6 text-orange-600 mb-1" />
              <span className="text-sm font-medium text-gray-700">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
