import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, Phone, MessageSquare, Clock, User, Plus, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: "interview" | "rejection" | "offer" | "follow-up";
}

interface Communication {
  id: number;
  candidate: string;
  type: "email" | "phone" | "message";
  subject?: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  sender: string;
}

export const Communication = () => {
  const { toast } = useToast();
  
  const [templates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {position} Role",
      content: "Dear {candidate_name},\n\nWe are pleased to invite you for an interview for the {position} role at our company.\n\nInterview Details:\nDate: {interview_date}\nTime: {interview_time}\nLocation: {interview_location}\n\nPlease confirm your availability.\n\nBest regards,\n{interviewer_name}",
      type: "interview"
    },
    {
      id: 2,
      name: "Application Received",
      subject: "Thank you for your application",
      content: "Dear {candidate_name},\n\nThank you for your interest in the {position} role at our company. We have received your application and will review it carefully.\n\nWe will be in touch within the next few days regarding next steps.\n\nBest regards,\nHR Team",
      type: "follow-up"
    },
    {
      id: 3,
      name: "Job Offer",
      subject: "Job Offer - {position} Role",
      content: "Dear {candidate_name},\n\nWe are delighted to offer you the position of {position} at our company.\n\nOffer Details:\nSalary: {salary}\nStart Date: {start_date}\n\nPlease review the attached offer letter and let us know your decision by {response_deadline}.\n\nWelcome to the team!\n\nBest regards,\n{hiring_manager}",
      type: "offer"
    }
  ]);

  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 1,
      candidate: "Sarah Johnson",
      type: "email",
      subject: "Interview Invitation - Frontend Developer Role",
      content: "Dear Sarah, We are pleased to invite you for an interview...",
      timestamp: "2024-01-18 10:30 AM",
      status: "read",
      sender: "John Smith"
    },
    {
      id: 2,
      candidate: "Mike Chen",
      type: "email",
      subject: "Thank you for your application",
      content: "Dear Mike, Thank you for your interest in the Product Manager role...",
      timestamp: "2024-01-17 2:15 PM",
      status: "delivered",
      sender: "HR Team"
    },
    {
      id: 3,
      candidate: "Emily Davis",
      type: "phone",
      content: "Phone screening call - discussed background and role expectations",
      timestamp: "2024-01-16 4:00 PM",
      status: "sent",
      sender: "Alex Turner"
    }
  ]);

  const [newEmail, setNewEmail] = useState({
    candidate: "",
    template: "",
    subject: "",
    content: "",
    customVariables: {} as Record<string, string>
  });

  const [replyStates, setReplyStates] = useState<Record<number, { isOpen: boolean; message: string }>>({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Sample data for placeholder replacement
  const sampleData = {
    candidate_name: "John Doe",
    candidate_email: "john.doe@example.com", 
    position: "Senior Frontend Developer",
    department: "Engineering",
    interview_date: "January 25, 2024",
    interview_time: "2:00 PM EST",
    interview_location: "Conference Room A / Zoom",
    company_name: "TalentTap Inc.",
    hiring_manager: "Sarah Wilson",
    interviewer_name: "Alex Turner",
    salary: "$95,000 - $110,000",
    start_date: "February 15, 2024",
    response_deadline: "January 30, 2024"
  };

  const replacePlaceholders = (text: string, candidateName?: string): string => {
    let result = text;
    const data = {
      ...sampleData,
      ...(candidateName && { candidate_name: candidateName })
    };
    
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return result;
  };

  const handleViewCommunication = (comm: Communication) => {
    setSelectedCommunication(comm);
    setViewModalOpen(true);
  };

  const handleUseTemplate = (template: EmailTemplate) => {
    const filledSubject = replacePlaceholders(template.subject);
    const filledContent = replacePlaceholders(template.content);
    
    setNewEmail({
      candidate: "",
      template: template.id.toString(),
      subject: filledSubject,
      content: filledContent,
      customVariables: {}
    });
    setEmailDialogOpen(true);
  };

  const handleSendEmail = () => {
    if (!newEmail.candidate.trim() || !newEmail.subject.trim() || !newEmail.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCommunication: Communication = {
      id: Date.now(),
      candidate: newEmail.candidate,
      type: "email",
      subject: newEmail.subject,
      content: newEmail.content,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: "sent",
      sender: "You"
    };

    setCommunications(prev => [newCommunication, ...prev]);
    
    // Reset form
    setNewEmail({
      candidate: "",
      template: "",
      subject: "",
      content: "",
      customVariables: {}
    });
    
    setEmailDialogOpen(false);
    
    toast({
      title: "Email Sent",
      description: `Email sent successfully to ${newCommunication.candidate}`,
    });
  };

  const handleReply = (commId: number) => {
    setReplyStates(prev => ({
      ...prev,
      [commId]: { isOpen: true, message: "" }
    }));
  };

  const handleReplySubmit = (commId: number) => {
    const replyMessage = replyStates[commId]?.message;
    if (!replyMessage?.trim()) return;

    const originalComm = communications.find(c => c.id === commId);
    if (!originalComm) return;

    const newReply: Communication = {
      id: Date.now(),
      candidate: originalComm.candidate,
      type: "email",
      subject: `Re: ${originalComm.subject || "Previous conversation"}`,
      content: replyMessage,
      timestamp: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: "sent",
      sender: "You"
    };

    setCommunications(prev => [newReply, ...prev]);
    setReplyStates(prev => ({
      ...prev,
      [commId]: { isOpen: false, message: "" }
    }));
  };

  const handleReplyCancel = (commId: number) => {
    setReplyStates(prev => ({
      ...prev,
      [commId]: { isOpen: false, message: "" }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-yellow-100 text-yellow-800";
      case "read":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "phone":
        return <Phone className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "rejection":
        return "bg-red-100 text-red-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "follow-up":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      const filledSubject = replacePlaceholders(template.subject, newEmail.candidate);
      const filledContent = replacePlaceholders(template.content, newEmail.candidate);
      
      setNewEmail({
        ...newEmail,
        template: templateId,
        subject: filledSubject,
        content: filledContent
      });
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch =
      search.trim() === "" ||
      comm.candidate.toLowerCase().includes(search.toLowerCase()) ||
      (comm.subject && comm.subject.toLowerCase().includes(search.toLowerCase())) ||
      comm.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || comm.type === typeFilter;
    const matchesStatus = statusFilter === "all" || comm.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-600 mt-1">Manage candidate communications and email templates</p>
        </div>
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Send Email to Candidate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate">Candidate</Label>
                  <Input
                    id="candidate"
                    value={newEmail.candidate}
                    onChange={(e) => setNewEmail({...newEmail, candidate: e.target.value})}
                    placeholder="Enter candidate name or email"
                  />
                </div>
                <div>
                  <Label htmlFor="template">Email Template</Label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>
              <div>
                <Label htmlFor="content">Message</Label>
                <Textarea
                  id="content"
                  value={newEmail.content}
                  onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                  placeholder="Email content"
                  rows={10}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendEmail}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Communication Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Communication Details</DialogTitle>
          </DialogHeader>
          {selectedCommunication && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(selectedCommunication.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCommunication.candidate}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Badge className={getStatusColor(selectedCommunication.status)}>
                      {selectedCommunication.status}
                    </Badge>
                    <span>•</span>
                    <span>{selectedCommunication.timestamp}</span>
                    <span>•</span>
                    <span>by {selectedCommunication.sender}</span>
                  </div>
                </div>
              </div>
              
              {selectedCommunication.subject && (
                <div>
                  <Label className="font-medium">Subject:</Label>
                  <p className="text-gray-700 mt-1">{selectedCommunication.subject}</p>
                </div>
              )}
              
              <div>
                <Label className="font-medium">Message:</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCommunication.content}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setViewModalOpen(false);
                  handleReply(selectedCommunication.id);
                }}>
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="communications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="communications">Communication History</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="communications" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="Search communications..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Communication Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCommunications.map((comm) => (
                  <div key={comm.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {comm.type === 'email' && <Mail className="w-4 h-4" />}
                          {comm.type === 'phone' && <Phone className="w-4 h-4" />}
                          {comm.type === 'message' && <MessageSquare className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{comm.candidate}</h4>
                            <Badge className={
                              comm.status === 'sent' ? "bg-blue-100 text-blue-800" :
                              comm.status === 'delivered' ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {comm.status}
                            </Badge>
                          </div>
                          {comm.subject && (
                            <p className="font-medium text-sm text-gray-700 mb-1">{comm.subject}</p>
                          )}
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{comm.content}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{comm.timestamp}</span>
                            <span>•</span>
                            <User className="w-3 h-3" />
                            <span>by {comm.sender}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReply(comm.id)}
                          disabled={replyStates[comm.id]?.isOpen}
                        >
                          Reply
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCommunication(comm)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                    
                    {/* Reply Interface */}
                    {replyStates[comm.id]?.isOpen && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-t">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Reply to {comm.candidate}</Label>
                          <Textarea
                            placeholder="Type your reply here..."
                            value={replyStates[comm.id]?.message || ""}
                            onChange={(e) => setReplyStates(prev => ({
                              ...prev,
                              [comm.id]: { ...prev[comm.id], message: e.target.value }
                            }))}
                            rows={3}
                            className="resize-none"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReplyCancel(comm.id)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleReplySubmit(comm.id)}
                              disabled={!replyStates[comm.id]?.message?.trim()}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Email Templates</h2>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                    </div>
                    <Badge className={
                      template.type === 'interview' ? "bg-blue-100 text-blue-800" :
                      template.type === 'rejection' ? "bg-red-100 text-red-800" :
                      template.type === 'offer' ? "bg-green-100 text-green-800" :
                      "bg-purple-100 text-purple-800"
                    }>
                      {template.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-32 overflow-hidden">
                      {template.content.substring(0, 200)}...
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Variables Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Candidate:</p>
                  <p className="text-gray-600">{`{candidate_name}`}</p>
                  <p className="text-gray-600">{`{candidate_email}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Position:</p>
                  <p className="text-gray-600">{`{position}`}</p>
                  <p className="text-gray-600">{`{department}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Interview:</p>
                  <p className="text-gray-600">{`{interview_date}`}</p>
                  <p className="text-gray-600">{`{interview_time}`}</p>
                  <p className="text-gray-600">{`{interview_location}`}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Company:</p>
                  <p className="text-gray-600">{`{company_name}`}</p>
                  <p className="text-gray-600">{`{hiring_manager}`}</p>
                  <p className="text-gray-600">{`{interviewer_name}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
