import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Building2, Users, ChevronDown } from "lucide-react";
import { fetchCompanyList } from "@/lib/fetchCompanyList";
import { useCompanyManagers } from "@/lib/useCompanyManagers";
import api from "@/api/client";

interface AuthPageProps {
  onAuthenticated: () => void;
}

export const AuthPage = ({ onAuthenticated }: AuthPageProps) => {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "", // Add role field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState<string[]>([]);
  const [companyMode, setCompanyMode] = useState<'choose' | 'create'>("choose");
  const [pendingApproval, setPendingApproval] = useState(false);
  const [showCreateCompanyField, setShowCreateCompanyField] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const managers = useCompanyManagers(companyList);

  useEffect(() => {
    if (signUpData.role !== "jobseeker") {
      fetchCompanyList()
        .then((companies) => setCompanyList(companies as string[]))
        .catch(() => setCompanyList([]));
    }
  }, [signUpData.role]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signInData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signInData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!signInData.password) {
      newErrors.password = "Password is required";
    } else if (signInData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signUpData.firstName) {
      newErrors.firstName = "First name is required";
    }
    
    if (!signUpData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!signUpData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signUpData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!signUpData.password) {
      newErrors.password = "Password is required";
    } else if (signUpData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!signUpData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (signUpData.role !== "jobseeker" && !signUpData.company) {
      newErrors.company = "Company name is required";
    }
    // Only require role if not creating a company
    if (!(showCreateCompanyField && signUpData.role === "")) {
      if (!signUpData.role) {
        newErrors.role = "Role is required";
      }
    }
    if (companyMode === "create" && signUpData.company) {
      if (companyList.includes(signUpData.company.trim())) {
        newErrors.company = "This company name already exists. Please choose another name.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const { data } = await api.post('/login', signInData);
      if (data.success) {
        if (data.user && (data.user.id || data.user._id)) {
          localStorage.setItem("userId", data.user.id || data.user._id);
          localStorage.setItem("userProfile", JSON.stringify(data.user));
        }
        setIsLoading(false);
        onAuthenticated();
      } else {
        setIsLoading(false);
        setErrors({ password: data.message || "Invalid credentials" });
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ password: err.response?.data?.message || "Server error. Please try again." });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // If creating a company, set role to recruiter and manager
    let signUpPayload = { ...signUpData };
    let companyManager = false;
    let companyStatus = "waiting";
    if (showCreateCompanyField && signUpData.company) {
      signUpPayload.role = "recruiter";
      companyManager = true;
      companyStatus = "approved";
    } else if (signUpData.role === "recruiter") {
      if (companyMode === "create") {
        companyManager = true;
        companyStatus = "approved";
      }
    }
    setIsLoading(true);
    setErrors({});
    try {
      const { data: user } = await api.post('/users', {
        name: `${signUpPayload.firstName} ${signUpPayload.lastName}`,
        email: signUpPayload.email,
        password: signUpPayload.password,
        company: signUpPayload.company,
        role: signUpPayload.role,
        companyManager,
        companyStatus,
      });
      if (user && (user.id || user._id)) {
        localStorage.setItem("userId", user.id || user._id);
        localStorage.setItem("userProfile", JSON.stringify(user));
      }
      setIsLoading(false);
      if (user.companyStatus === "waiting") {
        setPendingApproval(true);
      } else {
        onAuthenticated();
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ email: err.response?.data?.message || "Registration failed" });
    }
  };

  let mainForm = (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Get Started</CardTitle>
        <p className="text-gray-600">Sign in to your account or create a new one</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
              {/* Create Company as a field button, only when no role is selected and not already showing the field */}
              {signUpData.role === "" && !showCreateCompanyField && (
                <div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCreateCompanyField(true);
                    }}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Create Company
                  </Button>
                </div>
              )}
              {/* Show Enter Company Name field if Create Company is selected, with a red cancel button (not for jobseeker) */}
              {signUpData.role === "" && showCreateCompanyField && (
                <div className="mt-2">
                  <Label htmlFor="newCompany">New Company Name</Label>
                  <Input
                    id="newCompany"
                    value={signUpData.company}
                    onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCreateCompanyField(false);
                      setSignUpData({ ...signUpData, company: "" });
                    }}
                    className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Not Create a Company
                  </Button>
                </div>
              )}
              {/* Role selection, hidden if Create Company field is open */}
              {(!showCreateCompanyField || signUpData.role !== "") && (
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={signUpData.role}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, role: e.target.value });
                      if (e.target.value === "recruiter") setCompanyMode("choose");
                    }}
                    disabled={isLoading}
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select your role</option>
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>
              )}
              {/* Recruiter: Show company search bar with dropdown grid, toggled by arrow icon */}
              {signUpData.role === "recruiter" && (
                <div>
                  <Label htmlFor="company">Company</Label>
                  <div className="relative w-full flex justify-end">
                    <div className="relative w-[350px]">
                      <div className="flex items-center">
                        <input
                          type="text"
                          placeholder="Search company..."
                          value={companySearch}
                          onChange={e => setCompanySearch(e.target.value)}
                          className="w-full p-2 border rounded-t outline-none"
                          style={{paddingLeft: '2.5rem'}}
                          disabled={isLoading}
                          onFocus={e => setShowCompanyDropdown(true)}
                        />
                        <span className="absolute left-2 top-3 text-gray-400 pointer-events-none">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>
                        </span>
                        <button
                          type="button"
                          className="ml-2 p-1 rounded hover:bg-gray-100"
                          onClick={() => setShowCompanyDropdown((v) => !v)}
                          tabIndex={-1}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      {showCompanyDropdown && (
                        <div className="absolute right-0 mt-2 w-[350px] bg-white border rounded-b shadow-lg max-h-80 overflow-y-auto z-10 grid grid-cols-2 gap-2 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                          {companyList.filter(c => c.toLowerCase().includes(companySearch.toLowerCase())).length === 0 && (
                            <div className="col-span-2 p-2 text-gray-400">No companies found</div>
                          )}
                          {companyList.filter(c => c.toLowerCase().includes(companySearch.toLowerCase())).map((company) => (
                            <div
                              key={company}
                              className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-blue-50 ${signUpData.company === company ? 'bg-blue-100' : ''}`}
                              onClick={() => {
                                setSignUpData({ ...signUpData, company });
                                setCompanySearch(company);
                                setShowCompanyDropdown(false);
                              }}
                              tabIndex={0}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  setSignUpData({ ...signUpData, company });
                                  setCompanySearch(company);
                                  setShowCompanyDropdown(false);
                                }
                              }}
                            >
                              {managers[company]?.profileImage ? (
                                <img src={managers[company].profileImage} alt={managers[company].name} className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User className="w-4 h-4" /></span>
                              )}
                              <span>{company}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
              )}
              {/* Any other role: Hide both company dropdown and create button, and do not show New Company Name for jobseeker */}
              {signUpData.role !== "recruiter" && signUpData.role !== "" && signUpData.role !== "jobseeker" && (
                <div>
                  <Label htmlFor="company">Company</Label>
                  <div className="flex">
                    <select
                      id="company"
                      value={signUpData.company}
                      onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                      disabled={isLoading}
                      required
                      className="flex-1 p-2 border rounded-l"
                      style={{ display: companyMode === "choose" ? "block" : "none" }}
                    >
                      <option value="">Select a company</option>
                      {companyList.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                    {/* Only allow companyMode toggle for non-recruiters */}
                    <Button
                      onClick={() => setCompanyMode(companyMode === "choose" ? "create" : "choose")}
                      disabled={isLoading}
                      className="rounded-l-none"
                    >
                      {companyMode === "choose" ? "Create New" : "Choose Existing"}
                    </Button>
                  </div>
                  {/* Only show new company input if not recruiter, not jobseeker, and in create mode */}
                  {companyMode === "create" && (
                    <div className="mt-2">
                      <Label htmlFor="newCompany">New Company Name</Label>
                      <Input
                        id="newCompany"
                        value={signUpData.company}
                        onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  )}
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-0">
      <div className="w-full max-w-md flex-1">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TalentTap</h1>
          <p className="text-gray-600">Your complete Applicant Tracking System</p>
        </div>
        {pendingApproval ? (
          <Card className="shadow-xl text-center p-8">
            <h2 className="text-xl font-semibold mb-2">Waiting for Manager Approval</h2>
            <p className="text-gray-600">Your request to join <span className="font-bold">{signUpData.company}</span> has been sent. You will be able to access your account once the manager approves your request.</p>
          </Card>
        ) : mainForm}
      </div>
      {/* Footer with website features */}
      <div className="w-full mt-8 flex-shrink-0">
        <footer className="w-full text-left text-blue-200 text-sm border-t border-blue-800 pt-6 pb-8 bg-blue-950 bg-opacity-90 rounded-none shadow-lg px-12">
          <div className="mb-4 font-semibold text-blue-100 text-base">Website Features</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 text-lg"><span>🏢</span> <span>Company Management</span></div>
            <div className="flex items-center gap-3 text-lg"><span>👥</span> <span>Team Controls</span></div>
            <div className="flex items-center gap-3 text-lg"><span>🔑</span> <span>Role-Based Access</span></div>
            <div className="flex items-center gap-3 text-lg"><span>✅</span> <span>Approval Workflows</span></div>
            <div className="flex items-center gap-3 text-lg"><span>🔍</span> <span>Smart Search</span></div>
            <div className="flex items-center gap-3 text-lg"><span>📋</span> <span>ATS Integration</span></div>
            <div className="flex items-center gap-3 text-lg"><span>📱</span> <span>Mobile Optimized</span></div>
            <div className="flex items-center gap-3 text-lg"><span>🤝</span> <span>Collaboration Tools</span></div>
          </div>
        </footer>
      </div>
    </div>
  );
};
