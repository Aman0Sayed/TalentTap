import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const messages = [
  { id: 1, from: "Recruiter@TechCorp", subject: "Interview Invitation", date: "2024-06-12", content: "We'd like to invite you for an interview for the Frontend Developer position." },
  { id: 2, from: "Recruiter@CloudBase", subject: "Offer Letter", date: "2024-06-10", content: "Congratulations! We are pleased to offer you the Backend Engineer position." },
];

const JobSeekerCommunication = () => (
  <div className="p-4 space-y-6">
    <Card className="shadow">
      <CardHeader>
        <CardTitle>Communication</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {messages.map(msg => (
            <li key={msg.id} className="border rounded p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{msg.subject}</span>
                <span className="text-xs text-gray-400">{msg.date}</span>
              </div>
              <div className="text-gray-700 text-sm mb-1">From: {msg.from}</div>
              <div className="text-gray-600 text-sm">{msg.content}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default JobSeekerCommunication;
