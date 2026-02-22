import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const interviews = [
  // Example: Uncomment to show a sample interview
  // { id: 1, job: "Frontend Developer", company: "TechCorp", date: "2024-06-15", time: "10:00 AM" },
];

const JobSeekerInterviewScheduling = () => (
  <div className="p-4 space-y-6">
    <Card className="shadow">
      <CardHeader>
        <CardTitle>Interview Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {interviews.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <Calendar className="mx-auto mb-2 w-8 h-8 text-blue-400" />
            <div className="font-semibold">No interviews scheduled yet.</div>
            <div className="text-sm mt-2">Once you are shortlisted, your interviews will appear here.</div>
          </div>
        ) : (
          <ul className="space-y-4">
            {interviews.map(interview => (
              <li key={interview.id} className="border rounded p-4 flex flex-col gap-2 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{interview.job}</span>
                  <span className="text-gray-500 text-sm">{interview.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-semibold">{interview.date}</span>
                  <Clock className="w-4 h-4 text-gray-400 ml-4" />
                  <span className="text-gray-500 text-xs">{interview.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  </div>
);

export default JobSeekerInterviewScheduling;
