import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseIcon, CheckCircle, Calendar } from "lucide-react";

const applications = [
  { id: 1, job: "Frontend Developer", company: "TechCorp", status: "Interview Scheduled", date: "2024-06-10" },
  { id: 2, job: "UI Designer", company: "Designify", status: "Applied", date: "2024-06-08" },
  { id: 3, job: "Backend Engineer", company: "CloudBase", status: "Offer Received", date: "2024-06-05" },
];

const JobTracking = () => (
  <div className="p-4 space-y-6">
    <Card className="shadow">
      <CardHeader>
        <CardTitle>Job Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {applications.map(app => (
            <li key={app.id} className="border rounded p-4 flex flex-col gap-2 bg-white">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{app.job}</span>
                <span className="text-gray-500 text-sm">{app.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-semibold">{app.status}</span>
                <Calendar className="w-4 h-4 text-gray-400 ml-4" />
                <span className="text-gray-500 text-xs">{app.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default JobTracking;
