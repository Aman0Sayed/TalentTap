import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Calendar as CalendarIcon, User, Video, MapPin, Plus, Phone } from "lucide-react";

interface Interview {
  id: number;
  candidate: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: "video" | "phone" | "in-person";
  status: "scheduled" | "completed" | "cancelled";
  duration: number;
}

export const InterviewScheduling = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [interviews] = useState<Interview[]>([
    {
      id: 1,
      candidate: "Sarah Johnson",
      position: "Frontend Developer",
      interviewer: "John Smith",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "video",
      status: "scheduled",
      duration: 60
    },
    {
      id: 2,
      candidate: "Mike Chen",
      position: "Product Manager",
      interviewer: "Emily Davis",
      date: "2024-01-20",
      time: "2:00 PM",
      type: "video",
      status: "scheduled",
      duration: 45
    },
    {
      id: 3,
      candidate: "David Wilson",
      position: "Backend Developer",
      interviewer: "Alex Turner",
      date: "2024-01-21",
      time: "11:00 AM",
      type: "phone",
      status: "scheduled",
      duration: 30
    }
  ]);

  const [newInterview, setNewInterview] = useState({
    candidate: "",
    position: "",
    interviewer: "",
    date: "",
    time: "",
    type: "video",
    duration: 60,
    notes: ""
  });

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const interviewers = [
    "John Smith", "Emily Davis", "Alex Turner", "Sarah Wilson", "Mike Johnson"
  ];

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "in-person":
        return <MapPin className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTodaysInterviews = () => {
    const today = new Date().toISOString().split('T')[0];
    return interviews.filter(interview => interview.date === today);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Scheduling</h1>
          <p className="text-gray-600 mt-1">Schedule and manage interviews with candidates</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate">Candidate</Label>
                  <Input
                    id="candidate"
                    value={newInterview.candidate}
                    onChange={(e) => setNewInterview({...newInterview, candidate: e.target.value})}
                    placeholder="Enter candidate name"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newInterview.position}
                    onChange={(e) => setNewInterview({...newInterview, position: e.target.value})}
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interviewer">Interviewer</Label>
                  <Select onValueChange={(value) => setNewInterview({...newInterview, interviewer: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {interviewers.map((interviewer) => (
                        <SelectItem key={interviewer} value={interviewer}>
                          {interviewer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Interview Type</Label>
                  <Select onValueChange={(value) => setNewInterview({...newInterview, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select onValueChange={(value) => setNewInterview({...newInterview, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select onValueChange={(value) => setNewInterview({...newInterview, duration: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                  placeholder="Add any notes or agenda items..."
                  rows={3}
                />
              </div>
              <Button className="w-full">
                Schedule Interview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
            Today's Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getTodaysInterviews().length > 0 ? (
            <div className="space-y-3">
              {getTodaysInterviews().map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getInterviewIcon(interview.type)}
                      <span className="font-medium">{interview.time}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{interview.candidate}</p>
                      <p className="text-sm text-gray-600">{interview.position} • {interview.interviewer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Join Meeting
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No interviews scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar and Interview List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Interview List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium">{interview.date.split('-')[2]}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(interview.date).toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">{interview.candidate}</p>
                      <p className="text-sm text-gray-600">{interview.position}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{interview.time} • {interview.duration}min</span>
                        <span>•</span>
                        <User className="w-3 h-3" />
                        <span>{interview.interviewer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getInterviewIcon(interview.type)}
                      <span className="text-xs capitalize">{interview.type}</span>
                    </div>
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
