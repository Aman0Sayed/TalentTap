import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, CheckCircle, Clock, AlertCircle, Plus, Search, Filter } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fetchUsersByCompany } from "@/lib/fetchUsersByCompany";
import { fetchPendingJoinRequests, approveJoinRequest, rejectJoinRequest, removeTeamMember } from "@/lib/companyManagerActions";
import { useLocation } from "react-router-dom";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status: "active" | "busy" | "away" | "waiting";
}

interface Note {
  id: number;
  candidate: string;
  position: string;
  author: string;
  content: string;
  timestamp: string;
  type: "note" | "feedback" | "concern";
  isPrivate: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  candidate: string;
  position: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

// Draggable Task Card Component
const DraggableTaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id, resizeObserverConfig: {} });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <Badge className={getPriorityColor(task.priority)} variant="outline">
            {task.priority}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">{task.description}</p>
        <div className="text-xs text-gray-500">
          <p>Candidate: {task.candidate}</p>
          <p>Assignee: {task.assignee}</p>
          <p>Due: {task.dueDate}</p>
        </div>
      </div>
    </Card>
  );
};

export const TeamCollaboration = () => {
  const [notes] = useState<Note[]>([
    {
      id: 1,
      candidate: "Sarah Johnson",
      position: "Frontend Developer",
      author: "John Smith",
      content: "Candidate showed strong React skills during technical discussion. Recommend moving to final interview round.",
      timestamp: "2024-01-18 2:30 PM",
      type: "feedback",
      isPrivate: false
    },
    {
      id: 2,
      candidate: "Mike Chen",
      position: "Product Manager",
      author: "Emily Davis",
      content: "Great product vision and leadership experience. Would be a strong addition to the product team.",
      timestamp: "2024-01-17 4:15 PM",
      type: "note",
      isPrivate: false
    },
    {
      id: 3,
      candidate: "David Wilson",
      position: "Backend Developer",
      author: "Alex Turner",
      content: "Concerns about scalability knowledge. May need additional technical assessment.",
      timestamp: "2024-01-16 11:45 AM",
      type: "concern",
      isPrivate: true
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Schedule final interview",
      description: "Coordinate final interview round with leadership team",
      assignee: "Sarah Wilson",
      candidate: "Sarah Johnson",
      position: "Frontend Developer",
      dueDate: "2024-01-22",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      title: "Check references",
      description: "Contact previous employers for reference verification",
      assignee: "Sarah Wilson",
      candidate: "Mike Chen",
      position: "Product Manager",
      dueDate: "2024-01-20",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 3,
      title: "Prepare offer letter",
      description: "Draft and review offer letter with legal team",
      assignee: "Emily Davis",
      candidate: "Emily Rodriguez",
      position: "UX Designer",
      dueDate: "2024-01-19",
      status: "completed",
      priority: "high"
    }
  ]);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [companyMembers, setCompanyMembers] = useState<TeamMember[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [activeTab, setActiveTab] = useState("notes");
  const [showPendingDot, setShowPendingDot] = useState(false);

  useEffect(() => {
    // Get current user from localStorage (same as UserProfile)
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        setCurrentUser(user);
        console.log('Current user loaded:', user); // DEBUG
        if (user.company) {
          fetchUsersByCompany(user.company).then((users) => {
            setCompanyMembers(
              users.map((u: any) => ({
                id: u._id || u.id,
                name: u.name,
                role: u.role || u.title || "Member",
                email: u.email,
                avatar: u.profileImage,
                status: u.companyStatus === "waiting" ? "waiting" : "active",
                companyStatus: u.companyStatus,
              }))
            );
          });
        }
        if (user.company && (user.role && user.role.toLowerCase() === "manager")) {
          fetchPendingJoinRequests(user.company).then((reqs) => {
            const pending = reqs.filter((r:any) => r.companyStatus === "waiting");
            setPendingRequests(pending);
            // Notification logic: if there are pending requests and user hasn't visited, show dot
            const seen = localStorage.getItem("pendingReqSeen");
            if (pending.length > 0 && seen !== "true") {
              setShowPendingDot(true);
            } else {
              setShowPendingDot(false);
            }
          });
        }
      });
  }, [refreshFlag]);

  // When tab changes, if user visits 'requests', clear notification
  useEffect(() => {
    if (activeTab === "requests" && pendingRequests.length > 0) {
      localStorage.setItem("pendingReqSeen", "true");
      setShowPendingDot(false);
    }
  }, [activeTab, pendingRequests.length]);

  // Drag and drop state
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped over a column
    const overStatus = over.id as string;
    if (["pending", "in-progress", "completed"].includes(overStatus)) {
      setTasks(prev => 
        prev.map(task => 
          task.id === activeTask.id 
            ? { ...task, status: overStatus as Task["status"] }
            : task
        )
      );
    }

    setActiveTask(null);
  };

  const [newNote, setNewNote] = useState({
    candidate: "",
    position: "",
    content: "",
    type: "note",
    isPrivate: false
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    candidate: "",
    position: "",
    dueDate: "",
    priority: "medium"
  });

  const [noteSearch, setNoteSearch] = useState("");
  const [noteTypeFilter, setNoteTypeFilter] = useState("all");

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      noteSearch.trim() === "" ||
      note.author.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.candidate.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.position.toLowerCase().includes(noteSearch.toLowerCase()) ||
      note.content.toLowerCase().includes(noteSearch.toLowerCase());
    const matchesType = noteTypeFilter === "all" || note.type === noteTypeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-red-100 text-red-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case "note":
        return <MessageSquare className="w-4 h-4" />;
      case "feedback":
        return <CheckCircle className="w-4 h-4" />;
      case "concern":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "bg-blue-100 text-blue-800";
      case "feedback":
        return "bg-green-100 text-green-800";
      case "concern":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Real-time status helper
  const getRealtimeStatus = (member: any) => {
    if (member.status === 'waiting') return { label: 'request pending', color: 'bg-yellow-100 text-yellow-800' };
    if (member.lastActive) {
      const last = new Date(member.lastActive).getTime();
      const now = Date.now();
      if (now - last < 2 * 60 * 1000) return { label: 'active', color: 'bg-green-100 text-green-800' };
      return { label: 'offline', color: 'bg-gray-200 text-gray-600' };
    }
    return { label: member.status || 'offline', color: 'bg-gray-200 text-gray-600' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          {currentUser?.company && (
            <Badge
              className="bg-green-100 text-green-800 border-none shadow-sm px-3 py-1 text-sm font-semibold transition hover:shadow-lg hover:bg-green-200/90 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 inline-flex items-center mt-2 mb-1"
              style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.2)', cursor: 'pointer' }}
            >
              <span className="mr-1">🏢</span> {currentUser.company}
            </Badge>
          )}
          <p className="text-gray-600 mt-1">Collaborate with your hiring team on candidate evaluations</p>
        </div>
      </div>

      <Tabs defaultValue="notes" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        {/* Debug: Show current user role */}
        {currentUser && (
          <div style={{display:'none'}}>
            DEBUG: currentUser.role = [{String(currentUser.role)}]
          </div>
        )}
        <TabsList>
          <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          {currentUser?.role && String(currentUser.role).trim().toLowerCase() === "manager" && (
            <TabsTrigger value="requests">
              Request Manage
              {showPendingDot && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-600 align-middle animate-pulse" />
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          {/* Notes Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Candidate Notes & Comments</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Candidate Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="candidate">Candidate</Label>
                      <Input
                        id="candidate"
                        value={newNote.candidate}
                        onChange={(e) => setNewNote({...newNote, candidate: e.target.value})}
                        placeholder="Candidate name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newNote.position}
                        onChange={(e) => setNewNote({...newNote, position: e.target.value})}
                        placeholder="Position"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="type">Note Type</Label>
                    <Select onValueChange={(value) => setNewNote({...newNote, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select note type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">General Note</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="concern">Concern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Note Content</Label>
                    <Textarea
                      id="content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      placeholder="Write your note here..."
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={newNote.isPrivate}
                      onChange={(e) => setNewNote({...newNote, isPrivate: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="private" className="text-sm">
                      Make this note private (only visible to you)
                    </Label>
                  </div>
                  <Button className="w-full">
                    Add Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                      placeholder="Search notes..."
                      value={noteSearch}
                      onChange={e => setNoteSearch(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={noteTypeFilter} onValueChange={setNoteTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Note Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="note">Notes</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="concern">Concerns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {note.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{note.author}</p>
                        <p className="text-xs text-gray-500">{note.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getNoteTypeColor(note.type)}>
                        <div className="flex items-center space-x-1">
                          {getNoteTypeIcon(note.type)}
                          <span>{note.type}</span>
                        </div>
                      </Badge>
                      {note.isPrivate && (
                        <Badge variant="secondary">
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      {note.candidate} - {note.position}
                    </p>
                  </div>
                  <p className="text-gray-700">{note.content}</p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Tasks Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Task Board</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Task description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select onValueChange={(value) => setNewTask({...newTask, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyMembers.map((member) => (
                            <SelectItem key={member.id} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="candidate">Related Candidate</Label>
                      <Input
                        id="candidate"
                        value={newTask.candidate}
                        onChange={(e) => setNewTask({...newTask, candidate: e.target.value})}
                        placeholder="Candidate name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button className="w-full">
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Task Columns with Drag and Drop */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-6 overflow-x-auto pb-2">
              {["pending", "in-progress", "completed"].map((status) => (
                <Card key={status} className="flex-1 min-w-[280px] max-w-[340px] min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="capitalize truncate">{status.replace("-", " ")}</span>
                      <Badge variant="secondary">
                        {tasks.filter(task => task.status === status).length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <SortableContext
                      items={tasks.filter(task => task.status === status).map(task => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {tasks
                        .filter(task => task.status === status)
                        .map((task) => (
                          <DraggableTaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                    {/* Drop zone indicator */}
                    <div 
                      className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                      id={status}
                    >
                      Drop tasks here
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DragOverlay>
              {activeTask ? <DraggableTaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>

        {currentUser?.role && currentUser.role.toLowerCase() === "manager" && (
          <TabsContent value="requests" className="space-y-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pending Recruiter Join Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-500">No pending requests.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req) => {
                      const status = getRealtimeStatus(req);
                      return (
                        <div key={req.id || req._id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={req.avatar} />
                              <AvatarFallback>{req.name?.split(' ').map((n:any) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{req.name}</p>
                              <p className="text-xs text-gray-500">{req.email}</p>
                              <Badge className={status.color + ' mt-1'}>{status.label}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={async () => { await approveJoinRequest(req.id || req._id); setRefreshFlag(f => f+1); }}>Approve</Button>
                            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={async () => { await rejectJoinRequest(req.id || req._id); setRefreshFlag(f => f+1); }}>Reject</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="team" className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companyMembers.map((member) => {
                  const status = getRealtimeStatus(member);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                          <Badge className={status.color + ' mt-1'}>{status.label}</Badge>
                        </div>
                      </div>
                      {currentUser?.role === "manager" && currentUser.id !== member.id && (
                        <Button size="sm" variant="destructive" onClick={async () => { await removeTeamMember(String(member.id)); setRefreshFlag(f => f+1); }}>
                          Remove
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{notes.length}</p>
                  <p className="text-sm text-gray-600">Total Notes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {tasks.filter(task => task.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-600">Completed Tasks</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {tasks.filter(task => task.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
