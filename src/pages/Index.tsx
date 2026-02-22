import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigation } from "@/pages/Navigation";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { getUserRole } from "@/lib/role";
import DashboardJobSeeker from "@/pages/DashboardJobSeeker";
import JobFinding from "@/pages/JobFinding";
import { Dashboard } from "@/pages/Dashboard";
import { JobPostings } from "@/pages/JobPostings";
import api from "@/api/client";

export const TopBar = ({ onLogout, onAvatarClick }: { onLogout: () => void; onAvatarClick: () => void }) => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get(`/users/${userId}`)
        .then(({ data }) => {
          setProfileImage(data.profileImage);
          setCompany(data.company || "");
        });
    }
    // Listen for profile image update event
    const handler = (e: any) => {
      setProfileImage(e.detail);
    };
    window.addEventListener("profileImageUpdated", handler);
    return () => window.removeEventListener("profileImageUpdated", handler);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="text-2xl font-bold text-indigo-700 tracking-tight">TalentTap</div>
      <div className="flex items-center gap-2">
        {company && (
          <div
            className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold transition hover:shadow-lg hover:bg-green-200/90 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
            style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.2)', cursor: 'pointer' }}
            title="Your Team"
          >
            <span className="mr-1">🏢</span> {company}
          </div>
        )}
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-3 text-red-600 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-1" />
          Sign Out
        </Button>
        <Button
          variant="ghost"
          className="rounded-lg p-0 w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-all"
          onClick={onAvatarClick}
        >
          <Avatar className="w-9 h-9 rounded-lg overflow-hidden">
            <AvatarImage src={profileImage} alt="Profile" className="rounded-lg object-cover" />
          </Avatar>
        </Button>
      </div>
    </div>
  );
};

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [role, setRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
    // Get user role from localStorage or API
    setRole(getUserRole());
  }, [isAuthenticated, location.pathname, navigate]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAvatarClick = () => {
    navigate("/profile");
  };

  if (!isAuthenticated && location.pathname !== "/login") {
    return null;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  // Role-based dashboard and job page
  let dashboardComponent = <Dashboard />;
  let jobsComponent = <JobPostings />;
  if (role === "jobseeker") {
    dashboardComponent = <DashboardJobSeeker />;
    jobsComponent = <JobFinding />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <div className="fixed w-full z-40">
          <TopBar onLogout={handleLogout} onAvatarClick={handleAvatarClick} />
        </div>
        <div className="flex w-full">
          <Navigation role={role} />
          <main className="flex-1 p-6 overflow-auto pt-24">
            {/* Render dashboard or jobs page based on route and role, do not render Outlet for these routes */}
            {location.pathname.endsWith("/dashboard") ? dashboardComponent :
              location.pathname.endsWith("/jobs") ? jobsComponent :
              <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
