import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseIcon, Search, Calendar, CheckCircle } from "lucide-react";

const stats = [
  { label: "Jobs Applied", value: "5", icon: BriefcaseIcon, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Interviews Scheduled", value: "2", icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
  { label: "Offers Received", value: "1", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  { label: "Jobs Saved", value: "8", icon: Search, color: "text-orange-600", bg: "bg-orange-100" },
];

const recentActivity = [
  { action: "Applied to", job: "Frontend Developer", company: "TechCorp", date: "2024-06-10" },
  { action: "Interview scheduled for", job: "UI Designer", company: "Designify", date: "2024-06-08" },
  { action: "Saved job", job: "Backend Engineer", company: "CloudBase", date: "2024-06-05" },
];

const DashboardJobSeeker = () => (
  <div className="p-4 space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-lg font-semibold ${stat.color}`}>{stat.label}</CardTitle>
            <stat.icon className={`w-6 h-6 ${stat.color} ${stat.bg} p-1 rounded`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
    <div>
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentActivity.map((item, idx) => (
              <li key={idx} className="flex items-center justify-between text-gray-700">
                <span>{item.action} <span className="font-semibold">{item.job}</span> at <span className="font-semibold">{item.company}</span></span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DashboardJobSeeker;
