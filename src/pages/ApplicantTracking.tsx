import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowRight, Mail, Phone, Calendar } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type ApplicantStatus = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: ApplicantStatus;
  appliedDate: string;
  avatar?: string;
  score?: number;
}

export const ApplicantTracking = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      position: "Frontend Developer",
      status: "interview",
      appliedDate: "2024-01-15",
      score: 85
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 234-5678",
      position: "Product Manager",
      status: "screening",
      appliedDate: "2024-01-14",
      score: 92
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 345-6789",
      position: "UX Designer",
      status: "offer",
      appliedDate: "2024-01-12",
      score: 88
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1 (555) 456-7890",
      position: "Backend Developer",
      status: "applied",
      appliedDate: "2024-01-16",
      score: 78
    }
  ]);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");

  const stages: { status: ApplicantStatus; label: string; color: string }[] = [
    { status: "applied", label: "Applied", color: "bg-gray-100 text-gray-800" },
    { status: "screening", label: "Screening", color: "bg-yellow-100 text-yellow-800" },
    { status: "interview", label: "Interview", color: "bg-blue-100 text-blue-800" },
    { status: "offer", label: "Offer", color: "bg-purple-100 text-purple-800" },
    { status: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
    { status: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" }
  ];

  const getApplicantsByStatus = (status: ApplicantStatus) => {
    return applicants.filter(applicant => {
      const matchesStatus = applicant.status === status;
      const matchesSearch =
        search.trim() === "" ||
        applicant.name.toLowerCase().includes(search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(search.toLowerCase()) ||
        applicant.position.toLowerCase().includes(search.toLowerCase());
      const matchesPosition =
        positionFilter === "all" ||
        applicant.position.toLowerCase().includes(positionFilter.toLowerCase());
      return matchesStatus && matchesSearch && matchesPosition;
    });
  };

  const moveApplicant = (applicantId: number, newStatus: ApplicantStatus) => {
    // In a real app, this would update the backend
    console.log(`Moving applicant ${applicantId} to ${newStatus}`);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    const applicantId = parseInt(draggableId);
    setApplicants((prev) => {
      // Find the applicant being moved
      const applicant = prev.find((a) => a.id === applicantId);
      if (!applicant) return prev;
      // Remove from old position
      let newApplicants = prev.filter((a) => a.id !== applicantId);
      // Get all applicants in the destination column
      const destApplicants = newApplicants.filter(
        (a) => a.status === destination.droppableId
      );
      // Calculate the index in the full array where to insert
      let insertAt = 0;
      for (let i = 0, count = 0; i < newApplicants.length; i++) {
        if (newApplicants[i].status === destination.droppableId) {
          if (count === destination.index) {
            insertAt = i;
            break;
          }
          count++;
        }
        // If at end, insert after last
        if (i === newApplicants.length - 1) {
          insertAt = newApplicants.length;
        }
      }
      // Insert applicant at the correct position with new status
      const updatedApplicant = { ...applicant, status: destination.droppableId as ApplicantStatus };
      newApplicants = [
        ...newApplicants.slice(0, insertAt),
        updatedApplicant,
        ...newApplicants.slice(insertAt)
      ];
      return newApplicants;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicant Tracking</h1>
          <p className="text-gray-600 mt-1">Track candidates through your hiring pipeline</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Export Data
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search applicants..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="product">Product Manager</SelectItem>
                <SelectItem value="design">UX Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {stages.map((stage) => {
            const stageApplicants = getApplicantsByStatus(stage.status);
            return (
              <Droppable droppableId={stage.status} key={stage.status}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-w-[280px] max-w-[340px] ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''}`}
                    style={{ minHeight: 180 }}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <span className="truncate">{stage.label}</span>
                        <Badge variant="secondary" className={stage.color}>
                          {stageApplicants.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="space-y-3 min-h-[40px]">
                        {stageApplicants.map((applicant, idx) => (
                          <Draggable draggableId={applicant.id.toString()} index={idx} key={applicant.id}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 hover:shadow-md transition-shadow cursor-pointer bg-white ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                              >
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={applicant.avatar} />
                                        <AvatarFallback>
                                          {applicant.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-sm">{applicant.name}</p>
                                        <p className="text-xs text-gray-500">{applicant.position}</p>
                                      </div>
                                    </div>
                                    {applicant.score && (
                                      <Badge variant="outline" className="text-xs">
                                        {applicant.score}%
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="space-y-1 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <Mail className="w-3 h-3 mr-1" />
                                      <span className="truncate">{applicant.email}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="w-3 h-3 mr-1" />
                                      <span>{applicant.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      <span>Applied {applicant.appliedDate}</span>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-2">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                      View Profile
                                    </Button>
                                    {stage.status !== "hired" && stage.status !== "rejected" && (
                                      <Button size="sm" variant="outline" className="text-xs">
                                        <ArrowRight className="w-3 h-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{applicants.length}</p>
              <p className="text-sm text-gray-600">Total Applicants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {getApplicantsByStatus("hired").length}
              </p>
              <p className="text-sm text-gray-600">Hired</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {getApplicantsByStatus("interview").length}
              </p>
              <p className="text-sm text-gray-600">In Interview</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round((getApplicantsByStatus("hired").length / applicants.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
