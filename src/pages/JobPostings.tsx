import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Calendar, DollarSign, Users, Edit, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/api/client";

interface Job {
  _id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  applicants: number;
  status: string;
  description?: string;
  requirements?: string;
  company?: string;
  createdAt?: string;
  postedBy?: any;
}

export const JobPostings = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: ""
  });

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userCompany, setUserCompany] = useState<string>("");

  const jobsPerPage = 3;

  useEffect(() => {
    api.get("/jobs")
      .then(({ data }) => setJobs(data));
    // Fetch current user's company
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get(`/users/${userId}`)
        .then(({ data }) => setUserCompany(data.company || ""));
    }
  }, []);

  // Filter and search logic
  const filteredJobs = jobs.filter(job => {
    // Only show jobs from the user's company
    if (userCompany && job.company !== userCompany) return false;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || job.department.toLowerCase() === departmentFilter;
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  const handleCreateJob = async () => {
    const postedBy = localStorage.getItem("userId") || "";
    let company = userCompany;
    // If not loaded yet, fetch it now (edge case)
    if (!company && postedBy) {
      const { data } = await api.get(`/users/${postedBy}`);
      company = data.company || "";
      setUserCompany(company);
    }
    const jobPayload = {
      ...newJob,
      company,
      location: newJob.location,
      description: newJob.description,
      requirements: newJob.requirements.split(',').map(r => r.trim()),
      postedBy,
    };
    const { data: created } = await api.post("/jobs", jobPayload);
    setJobs([...jobs, created]);
      setNewJob({
        title: "",
        department: "",
        location: "",
        type: "",
        salary: "",
        description: "",
        requirements: ""
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsEditDialogOpen(true);
  };

  const handleUpdateJob = async () => {
    if (editingJob && editingJob._id) {
      let reqs = editingJob.requirements;
      if (Array.isArray(reqs)) {
        reqs = reqs.join(', ');
      }
      const { data: updated } = await api.patch(`/jobs/${editingJob._id}`, {
        ...editingJob,
        requirements: (reqs || "").split(',').map(r => r.trim()).filter(Boolean),
      });
      setJobs(jobs.map(job => job._id === updated._id ? updated : job));
      setEditingJob(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteJob = async (jobId: string | undefined) => {
    if (!jobId) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs(jobs.filter(job => job._id !== jobId));
  };

  const handleViewApplications = async (jobId: string | undefined) => {
    if (!jobId) return;
    const { data: applications } = await api.get(`/jobs/${jobId}/applications`);
    // You can display these in a modal or page
    console.log(applications);
    alert(`Applications: ${JSON.stringify(applications, null, 2)}`);
  };

  const resetForm = () => {
    setNewJob({
      title: "",
      department: "",
      location: "",
      type: "",
      salary: "",
      description: "",
      requirements: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1">Create and manage your job listings</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => setNewJob({...newJob, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Employment Type</Label>
                  <Select onValueChange={(value) => setNewJob({...newJob, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  placeholder="e.g. $120,000 - $160,000"
                />
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  placeholder="List the required skills and qualifications..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateJob} className="flex-1">
                  Create Job Posting
                </Button>
                <Button variant="outline" onClick={() => {resetForm(); setIsCreateDialogOpen(false);}}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10" 
                  placeholder="Search job postings..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={(value) => {
              setDepartmentFilter(value);
              setCurrentPage(1); // Reset to first page when filtering
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1); // Reset to first page when filtering
            }}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-6">
        {paginatedJobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No jobs.</p>
            </CardContent>
          </Card>
        ) : (
          paginatedJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <Badge variant={
                        job.status === "Active" ? "default" : 
                        job.status === "Draft" ? "secondary" : 
                        "outline"
                      }>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {job.posted}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditJob(job)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewApplications(job._id)}
                    >
                      View Applications
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{job.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteJob(job._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Job Dialog */}
      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}> */}
      {/* <DialogContent className="max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-4 overflow-y-auto max-h-[90vh]"> */}
          {/* <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
          </DialogHeader> */}
          {/* {editingJob && <div className="space-y-4"> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                <div>
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={editingJob.title}
                    onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select 
                    value={editingJob.department} 
                    onValueChange={(value) => setEditingJob({...editingJob, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              /* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editingJob.location}
                    onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Employment Type</Label>
                  <Select 
                    value={editingJob.type} 
                    onValueChange={(value) => setEditingJob({...editingJob, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-salary">Salary Range</Label>
                <Input
                  id="edit-salary"
                  value={editingJob.salary}
                  onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingJob.status} 
                  onValueChange={(value) => setEditingJob({...editingJob, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description || ""}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-requirements">Requirements</Label>
                <Textarea
                  id="edit-requirements"
                  value={editingJob.requirements || ""}
                  onChange={(e) => setEditingJob({...editingJob, requirements: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleUpdateJob} className="flex-1">
                  Update Job
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};
