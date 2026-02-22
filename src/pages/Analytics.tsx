
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Download, Users, Clock, Target, DollarSign, Calendar, Award, Filter } from "lucide-react";

export const Analytics = () => {
  const monthlyData = [
    { month: "Jan", applications: 156, interviews: 45, hires: 8, offers: 12 },
    { month: "Feb", applications: 189, interviews: 52, hires: 11, offers: 15 },
    { month: "Mar", applications: 234, interviews: 67, hires: 14, offers: 18 },
    { month: "Apr", applications: 198, interviews: 58, hires: 12, offers: 16 },
    { month: "May", applications: 267, interviews: 71, hires: 16, offers: 21 },
    { month: "Jun", applications: 245, interviews: 69, hires: 15, offers: 19 }
  ];

  const sourceData = [
    { name: "LinkedIn", value: 35, color: "#0077B5" },
    { name: "Job Boards", value: 28, color: "#FF6B6B" },
    { name: "Company Website", value: 20, color: "#4ECDC4" },
    { name: "Referrals", value: 12, color: "#45B7D1" },
    { name: "Social Media", value: 5, color: "#96CEB4" }
  ];

  const funnelData = [
    { stage: "Applications", count: 1847, percentage: 100 },
    { stage: "Screening", count: 924, percentage: 50 },
    { stage: "Phone Interview", count: 462, percentage: 25 },
    { stage: "Technical Interview", count: 185, percentage: 10 },
    { stage: "Final Interview", count: 92, percentage: 5 },
    { stage: "Offers", count: 46, percentage: 2.5 },
    { stage: "Hires", count: 38, percentage: 2.1 }
  ];

  const departmentData = [
    { department: "Engineering", applications: 567, hires: 23, timeToHire: 28 },
    { department: "Product", applications: 234, hires: 12, timeToHire: 32 },
    { department: "Design", applications: 189, hires: 8, timeToHire: 25 },
    { department: "Marketing", applications: 156, hires: 6, timeToHire: 22 },
    { department: "Sales", applications: 134, hires: 9, timeToHire: 18 }
  ];

  const metrics = [
    { 
      label: "Time to Hire", 
      value: "26 days", 
      change: "-3 days", 
      trend: "down", 
      icon: Clock,
      color: "text-green-600" 
    },
    { 
      label: "Cost per Hire", 
      value: "$3,240", 
      change: "+$120", 
      trend: "up", 
      icon: DollarSign,
      color: "text-red-600" 
    },
    { 
      label: "Offer Acceptance Rate", 
      value: "87%", 
      change: "+5%", 
      trend: "up", 
      icon: Target,
      color: "text-green-600" 
    },
    { 
      label: "Quality of Hire", 
      value: "4.2/5", 
      change: "+0.3", 
      trend: "up", 
      icon: Award,
      color: "text-green-600" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">Track recruitment metrics and generate insights</p>
        </div>
        <div className="flex space-x-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className={`text-sm mt-1 ${metric.color}`}>
                    {metric.change} from last period
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Monthly Recruitment Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Applications" />
                <Line type="monotone" dataKey="interviews" stroke="#10B981" strokeWidth={2} name="Interviews" />
                <Line type="monotone" dataKey="offers" stroke="#F59E0B" strokeWidth={2} name="Offers" />
                <Line type="monotone" dataKey="hires" stroke="#8B5CF6" strokeWidth={2} name="Hires" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source of Hire */}
        <Card>
          <CardHeader>
            <CardTitle>Source of Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="hires" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Funnel Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4 w-1/3">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <span className="text-sm text-gray-500">({stage.count})</span>
                </div>
                <div className="flex-1 mx-4">
                  <Progress value={stage.percentage} className="h-3" />
                </div>
                <div className="text-sm font-medium w-20 text-right">
                  {stage.percentage}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Hire by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Average Time to Hire by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dept.department}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(dept.timeToHire / 40) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-16">{dept.timeToHire} days</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">New Applications</span>
                </div>
                <span className="font-semibold text-blue-600">+47 this week</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Interviews Scheduled</span>
                </div>
                <span className="font-semibold text-green-600">23 this week</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Offers Extended</span>
                </div>
                <span className="font-semibold text-purple-600">8 this week</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-orange-600" />
                  <span className="text-sm">New Hires</span>
                </div>
                <span className="font-semibold text-orange-600">6 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Download className="w-6 h-6" />
              <span>Monthly Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Download className="w-6 h-6" />
              <span>Department Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Download className="w-6 h-6" />
              <span>Candidate Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
