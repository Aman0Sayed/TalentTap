
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, FolderOpen } from "lucide-react";

interface ParsedProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  score: number;
}

export const ResumeParser = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedProfile, setParsedProfile] = useState<ParsedProfile | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload and parsing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Simulate parsed resume data
          const mockParsedData: ParsedProfile = {
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            summary: "Experienced frontend developer with 5+ years in React, TypeScript, and modern web technologies. Passionate about creating user-centered applications and mentoring junior developers.",
            experience: [
              {
                position: "Senior Frontend Developer",
                company: "TechCorp Inc",
                duration: "2022 - Present",
                description: "Led development of customer-facing web applications using React and TypeScript. Improved application performance by 40% and reduced load times by 2 seconds."
              },
              {
                position: "Frontend Developer",
                company: "StartupXYZ",
                duration: "2020 - 2022",
                description: "Developed responsive web applications and collaborated with design teams to implement pixel-perfect UI components."
              }
            ],
            education: [
              {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of California, Berkeley",
                year: "2020"
              }
            ],
            skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Node.js", "Git", "AWS", "Redux"],
            score: 87
          };

          setParsedProfile(mockParsedData);
          
          toast({
            title: "Resume Parsed Successfully",
            description: "The resume has been processed and profile created.",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const resetParser = () => {
    setParsedProfile(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resume Parser</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Upload resumes to automatically generate candidate profiles</p>
        </div>
        {parsedProfile && (
          <Button variant="outline" onClick={resetParser} className="w-full sm:w-auto">
            Parse New Resume
          </Button>
        )}
      </div>

      {!parsedProfile ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
                  Drop a PDF or Word document here, or click to browse
                </p>
                
                {/* Custom File Upload Button */}
                <div className="relative inline-block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    id="resume-upload"
                  />
                  <label 
                    htmlFor="resume-upload" 
                    className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    <FolderOpen className="w-5 h-5" />
                    <span className="text-sm sm:text-base">
                      {isUploading ? 'Processing...' : 'Browse Files'}
                    </span>
                  </label>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing resume...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="text-xs text-gray-500 space-y-1">
                    {uploadProgress < 30 && <p>• Uploading file...</p>}
                    {uploadProgress >= 30 && uploadProgress < 60 && <p>• Extracting text...</p>}
                    {uploadProgress >= 60 && uploadProgress < 90 && <p>• Parsing information...</p>}
                    {uploadProgress >= 90 && <p>• Generating profile...</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Automatic Extraction</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Automatically extract contact information, work experience, education, and skills
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6 text-center">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Profile Generation</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Generate structured candidate profiles ready for review and scoring
                </p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <Award className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Skills Matching</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Automatically match candidate skills with job requirements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Parsed Profile Display */
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{parsedProfile.name}</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 space-y-1 sm:space-y-0">
                      <div className="flex items-center justify-center sm:justify-start">
                        <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{parsedProfile.email}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{parsedProfile.phone}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span>{parsedProfile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{parsedProfile.score}%</div>
                  <div className="text-sm text-gray-600">Match Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Summary & Experience & Education */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{parsedProfile.summary}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parsedProfile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold text-sm sm:text-base">{exp.position}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {parsedProfile.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-sm sm:text-base">{edu.degree}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Skills & Actions */}
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {parsedProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full text-sm" variant="outline">
                    Add to Pipeline
                  </Button>
                  <Button className="w-full text-sm" variant="outline">
                    Schedule Interview
                  </Button>
                  <Button className="w-full text-sm" variant="outline">
                    Send Email
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
