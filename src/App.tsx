import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./pages/Dashboard";
import { JobPostings } from "./pages/JobPostings";
import { ApplicantTracking } from "./pages/ApplicantTracking";
import { ResumeParser } from "./pages/ResumeParser";
import { InterviewScheduling } from "./pages/InterviewScheduling";
import { Communication } from "./pages/Communication";
import { TeamCollaboration } from "./pages/TeamCollaboration";
import { Analytics } from "./pages/Analytics";
import { AuthPage } from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import { Candidates } from "./pages/Candidates";
import CandidateDetail from "./pages/CandidateDetail";
import DashboardJobSeeker from "./pages/DashboardJobSeeker";
import JobFinding from "./pages/JobFinding";
import JobTracking from "./pages/JobTracking";
import JobSeekerInterviewScheduling from "./pages/JobSeekerInterviewScheduling";
import JobSeekerCommunication from "./pages/JobSeekerCommunication";
import Community from "./pages/Community";
import CommunityProfile from "./pages/CommunityProfile";
import UploadResume from "./pages/UploadResume";
import ViewResume from "./pages/ViewResume";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<AuthPage onAuthenticated={() => { window.localStorage.setItem('isAuthenticated', 'true'); window.location.href = '/dashboard'; }} />} />
          <Route path="/" element={<Index />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<JobPostings />} />
            <Route path="job-tracking" element={<JobTracking />} />
            <Route path="applicants" element={<ApplicantTracking />} />
            <Route path="resumes" element={<ResumeParser />} />
            <Route path="interviews" element={<InterviewScheduling />} />
            <Route path="communication" element={<JobSeekerCommunication />} />
            <Route path="collaboration" element={<TeamCollaboration />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:id" element={<CandidateDetail />} />
            <Route path="dashboard-seeker" element={<DashboardJobSeeker />} />
            <Route path="job-finding" element={<JobFinding />} />
            <Route path="community" element={<Community />} />
            <Route path="communityprofile/:id" element={<CommunityProfile />} />
            <Route path="upload-resume" element={<UploadResume />} />
            <Route path="view-resume" element={<ViewResume />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
