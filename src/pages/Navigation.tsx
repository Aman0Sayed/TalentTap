import { 
  LayoutDashboard, 
  BriefcaseIcon, 
  Users, 
  FileText, 
  Calendar,
  ClipboardCheck,
  MessageSquare,
  UserCheck,
  BarChart3,
  Menu,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/client";

const recruiterNavigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "jobs", label: "Job Postings", icon: BriefcaseIcon, path: "/jobs" },
  { id: "applicants", label: "Applicant Tracking", icon: Users, path: "/applicants" },
  { id: "candidates", label: "Candidates", icon: Users, path: "/candidates" },
  { id: "resumes", label: "Resume Parser", icon: FileText, path: "/resumes" },
  { id: "interviews", label: "Interview Scheduling", icon: Calendar, path: "/interviews" },
  { id: "communication", label: "Communication", icon: MessageSquare, path: "/communication" },
  { id: "collaboration", label: "Team Collaboration", icon: UserCheck, path: "/collaboration" },
  { id: "analytics", label: "Analytics & Reporting", icon: BarChart3, path: "/analytics" },
  { id: "community", label: "Community", icon: Users, path: "/community" }, // Added Community for recruiter
];

const jobSeekerNavigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "jobs", label: "Job Finding", icon: Search, path: "/jobs" },
  { id: "job-tracking", label: "Job Tracking", icon: BriefcaseIcon, path: "/job-tracking" },
  { id: "interview-scheduling", label: "Interview Scheduling", icon: Calendar, path: "/interview-scheduling" },
  { id: "communication", label: "Communication", icon: MessageSquare, path: "/communication" },
  { id: "community", label: "Community", icon: Users, path: "/community" }, // Already present for jobseeker
];

export const Navigation = ({ role }: { role?: string | null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = role === "jobseeker" ? jobSeekerNavigationItems : recruiterNavigationItems;
  const [hasResume, setHasResume] = useState(false);
  const [showCollabDot, setShowCollabDot] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    api.get(`/users/${userId}`)
      .then(({ data: user }) => {
        setHasResume(!!(user.resume && user.resume.filename));
      });
  }, [location]);

  useEffect(() => {
    setShowCollabDot(localStorage.getItem("pendingReqSeen") !== "true");
  }, [location]);

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
       <div> <br></br> 
       </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={`w-full justify-start px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="text-sm flex items-center">
                  {item.label}
                  {item.id === "collaboration" && showCollabDot && (
                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-600 align-middle animate-pulse" />
                  )}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="p-4 border-t border-gray-200 flex">
        {hasResume ? (
          <Button className="w-full" variant="outline" onClick={() => navigate('/view-resume')}>
            View Resume
          </Button>
        ) : (
          <Button className="w-full" variant="secondary" onClick={() => navigate('/upload-resume')}>
            Upload Resume
          </Button>
        )}
      </div>
    </Sidebar>
  );
};
