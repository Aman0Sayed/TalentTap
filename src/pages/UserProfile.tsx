import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { UserProfileData } from "@/types/user-profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";

interface UserProfileDataWithCompany extends UserProfileData {
  company?: string;
  _id?: string;
}

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfileDataWithCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // About
  const [editAbout, setEditAbout] = useState(false);
  const [aboutValue, setAboutValue] = useState("");
  // Skills
  const [editSkills, setEditSkills] = useState(false);
  const [skillsValue, setSkillsValue] = useState("");
  // Contact
  const [editContact, setEditContact] = useState(false);
  const [contactValue, setContactValue] = useState({
    email: "",
    phone: "",
    linkedin: "",
  });
  // Projects
  const [editProjects, setEditProjects] = useState(false);
  const [projectsValue, setProjectsValue] = useState<any[]>([]);
  // Certifications
  const [editCertifications, setEditCertifications] = useState(false);
  const [certificationsValue, setCertificationsValue] = useState<any[]>([]);
  // Languages
  const [editLanguages, setEditLanguages] = useState(false);
  const [languagesValue, setLanguagesValue] = useState<any[]>([]);
  // Profile and Cover Image Editing State
  const [editProfileImage, setEditProfileImage] = useState(false);
  const [profileImageValue, setProfileImageValue] = useState("");
  const [editCoverImage, setEditCoverImage] = useState(false);
  const [coverImageValue, setCoverImageValue] = useState("");
  // Location
  const [editLocation, setEditLocation] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  useEffect(() => {
    // Assume user id or token is stored in localStorage after login
    const userId = id || localStorage.getItem("userId");
    if (!userId) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setAboutValue(data.about || "");
        setSkillsValue((data.skills || []).join(", "));
        setContactValue(data.contact || { email: "", phone: "", linkedin: "" });
        setProjectsValue(data.projects || []);
        setCertificationsValue(data.certifications || []);
        setLanguagesValue(data.languages || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (user) {
      setAboutValue(user.about || "");
      setSkillsValue((user.skills || []).join(", "));
      setContactValue(user.contact || { email: "", phone: "", linkedin: "" });
      setProjectsValue(user.projects || []);
      setCertificationsValue(user.certifications || []);
      setLanguagesValue(user.languages || []);
      setProfileImageValue(user.profileImage || "");
      setCoverImageValue(user.coverImage || "");
      setLocationValue(user.location || "");
    }
  }, [user]);

  // Save handler
  const saveField = async (field: string, value: any) => {
    if (!user) return;
    const userId = user.id || user._id;
    const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setUser({ ...user, [field]: value });
      if (field === "profileImage") {
        window.dispatchEvent(new CustomEvent("profileImageUpdated", { detail: value }));
      }
      if (field === "coverImage") {
        setCoverImageValue(value); // update instantly
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Cover Image Section */}
      <div className="relative w-full h-[300px]">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 z-10"></div>
        <Button
          variant="ghost"
          className="absolute top-4 right-4 bg-white/80 hover:bg-white z-20"
          size="icon"
          onClick={() => setEditCoverImage(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Dialog open={editCoverImage} onOpenChange={setEditCoverImage}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Cover Image</DialogTitle>
            </DialogHeader>
            <Input
              value={coverImageValue}
              onChange={(e) => setCoverImageValue(e.target.value)}
              placeholder="Paste image URL or upload"
              className="mb-2"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setEditCoverImage(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await saveField("coverImage", coverImageValue);
                  setEditCoverImage(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <div className="flex items-end space-x-8 mb-8">
          <div className="relative flex items-center bg-white rounded-xl shadow p-4">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full ring-4 ring-white object-cover bg-white"
            />
            <Button
              variant="ghost"
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              size="icon"
              onClick={() => setEditProfileImage(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Dialog open={editProfileImage} onOpenChange={setEditProfileImage}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile Image</DialogTitle>
                </DialogHeader>
                <Input
                  value={profileImageValue}
                  onChange={(e) => setProfileImageValue(e.target.value)}
                  placeholder="Paste image URL or upload"
                  className="mb-2"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditProfileImage(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await saveField("profileImage", profileImageValue);
                      setEditProfileImage(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col justify-center min-w-0 flex-1 bg-white rounded-xl shadow p-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {user.name}
              </h1>
              <p className="text-gray-600 ">
                {user.company ? `Recruiter at ${user.company}` : user.title}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">{user.location && user.location !== "Unknown" ? user.location : "Enter your location"}</p>
                <Button variant="ghost" size="icon" onClick={() => setEditLocation(true)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <Dialog open={editLocation} onOpenChange={setEditLocation}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Location</DialogTitle>
                  </DialogHeader>
                  {/* Dynamic country and state selection */}
                  {(() => {
                    const countryStateMap: { [key: string]: string[] } = {
                      USA: ["California", "Texas", "New York", "Florida", "Illinois", "Washington"],
                      India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat", "West Bengal"],
                      Germany: ["Bavaria", "Berlin", "Hamburg", "Hesse", "Saxony", "Bremen"],
                      Brazil: ["São Paulo", "Rio de Janeiro", "Bahia", "Paraná", "Minas Gerais", "Ceará"],
                      Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"],
                      Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Nova Scotia"],
                    };
                    const country = locationValue.split(", ")[0] || "";
                    const state = locationValue.split(", ")[1] || "";
                    return (
                      <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium">Country</label>
                        <select
                          className="border rounded p-2"
                          value={country}
                          onChange={e => {
                            setLocationValue(e.target.value ? e.target.value : "");
                          }}
                        >
                          <option value="">Select Country</option>
                          {Object.keys(countryStateMap).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <label className="text-sm font-medium">State</label>
                        <select
                          className="border rounded p-2"
                          value={state}
                          onChange={e => {
                            setLocationValue(country + (e.target.value ? `, ${e.target.value}` : ""));
                          }}
                          disabled={!country}
                        >
                          <option value="">Select State</option>
                          {country && countryStateMap[country] && countryStateMap[country].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditLocation(false)}>
                      Cancel
                    </Button>
                    <Button onClick={async () => {
                      await saveField("location", locationValue);
                      setEditLocation(false);
                    }} disabled={!locationValue || !locationValue.includes(", ") || locationValue.endsWith(", ")}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <p className="text-sm text-blue-600 mt-1">
                {user.connections}+ connections
              </p>
            </div>
            {/* Removed Add profile section and More buttons */}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">About</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditAbout(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-600">{user.about}</p>
          <Dialog open={editAbout} onOpenChange={setEditAbout}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit About</DialogTitle>
              </DialogHeader>
              <Textarea
                value={aboutValue}
                onChange={(e) => setAboutValue(e.target.value)}
                className="w-full min-h-[100px]"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditAbout(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await saveField("about", aboutValue);
                    setEditAbout(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditSkills(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {(user.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
          <Dialog open={editSkills} onOpenChange={setEditSkills}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Skills</DialogTitle>
              </DialogHeader>
              <Textarea
                value={skillsValue}
                onChange={(e) => setSkillsValue(e.target.value)}
                className="w-full min-h-[60px]"
                placeholder="Comma separated skills"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditSkills(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await saveField(
                      "skills",
                      skillsValue.split(",").map((s) => s.trim())
                    );
                    setEditSkills(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditProjects(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-4">
            {user.projects.map((project, idx) => (
              <li key={idx}>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </li>
            ))}
          </ul>
          <Dialog open={editProjects} onOpenChange={setEditProjects}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Projects</DialogTitle>
              </DialogHeader>
              {projectsValue.map((project, idx) => (
                <div key={idx} className="mb-4 flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={project.name}
                      onChange={e => setProjectsValue(prev => prev.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))}
                      placeholder="Project Name"
                      className="mb-2"
                    />
                    <Textarea
                      value={project.description}
                      onChange={e => setProjectsValue(prev => prev.map((p, i) => i === idx ? { ...p, description: e.target.value } : p))}
                      placeholder="Project Description"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => setProjectsValue(prev => prev.filter((_, i) => i !== idx))} title="Remove">
                    -
                  </Button>
                </div>
              ))}
              <Button variant="secondary" className="mb-2" onClick={() => setProjectsValue([...projectsValue, { name: '', description: '' }])}>
                + Add Project
              </Button>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditProjects(false)}>Cancel</Button>
                <Button onClick={async () => {
                  // Prevent saving if any project is empty
                  if (projectsValue.some(p => !p.name.trim() || !p.description.trim())) return;
                  await saveField('projects', projectsValue);
                  setEditProjects(false);
                }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Certifications Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Certifications</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditCertifications(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {user.certifications.map((cert, idx) => (
              <li key={idx}>
                <span className="font-medium">{cert.name}</span>{" "}
                <span className="text-gray-500 text-sm">({cert.year})</span>
              </li>
            ))}
          </ul>
          <Dialog open={editCertifications} onOpenChange={setEditCertifications}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Certifications</DialogTitle>
              </DialogHeader>
              {certificationsValue.map((cert, idx) => (
                <div key={idx} className="mb-4 flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={cert.name}
                      onChange={e => setCertificationsValue(prev => prev.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))}
                      placeholder="Certification Name"
                      className="mb-2"
                    />
                    <Input
                      value={cert.year}
                      onChange={e => setCertificationsValue(prev => prev.map((c, i) => i === idx ? { ...c, year: e.target.value } : c))}
                      placeholder="Year"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => setCertificationsValue(prev => prev.filter((_, i) => i !== idx))} title="Remove">
                    -
                  </Button>
                </div>
              ))}
              <Button variant="secondary" className="mb-2" onClick={() => setCertificationsValue([...certificationsValue, { name: '', year: '' }])}>
                + Add Certification
              </Button>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditCertifications(false)}>Cancel</Button>
                <Button onClick={async () => { await saveField('certifications', certificationsValue); setEditCertifications(false); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Languages</h2>
            <Button variant="ghost" size="icon" onClick={() => setEditLanguages(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <ul className="flex flex-wrap gap-4">
            {user.languages.map((lang, idx) => (
              <li key={idx}>
                <span className="font-medium">{lang.name}</span>{" "}
                <span className="text-gray-500 text-sm">({lang.level})</span>
              </li>
            ))}
          </ul>
          <Dialog open={editLanguages} onOpenChange={setEditLanguages}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Languages</DialogTitle>
              </DialogHeader>
              {languagesValue.map((lang, idx) => (
                <div key={idx} className="mb-4 flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={lang.name}
                      onChange={e => setLanguagesValue(prev => prev.map((l, i) => i === idx ? { ...l, name: e.target.value } : l))}
                      placeholder="Language Name"
                      className="mb-2"
                    />
                    <Input
                      value={lang.level}
                      onChange={e => setLanguagesValue(prev => prev.map((l, i) => i === idx ? { ...l, level: e.target.value } : l))}
                      placeholder="Level (e.g. Native, Professional)"
                    />
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => setLanguagesValue(prev => prev.filter((_, i) => i !== idx))} title="Remove">
                    -
                  </Button>
                </div>
              ))}
              <Button variant="secondary" className="mb-2" onClick={() => setLanguagesValue([...languagesValue, { name: '', level: '' }])}>
                + Add Language
              </Button>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditLanguages(false)}>Cancel</Button>
                <Button onClick={async () => {
                  // Prevent saving if any language is empty
                  if (languagesValue.some(l => !l.name.trim() || !l.level.trim())) return;
                  await saveField('languages', languagesValue);
                  setEditLanguages(false);
                }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditContact(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">Email:</span> {user.email}
            </li>
            <li>
              <span className="font-medium">Phone:</span> {user.contact?.phone}
            </li>
            <li>
              <span className="font-medium">LinkedIn:</span>{" "}
              <a
                href={user.contact?.linkedin}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.contact?.linkedin?.replace("https://", "")}
              </a>
            </li>
          </ul>
          <Dialog open={editContact} onOpenChange={setEditContact}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Contact Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {/* Remove email input, only allow editing phone and LinkedIn */}
                <Input
                  value={contactValue.phone}
                  onChange={(e) =>
                    setContactValue({ ...contactValue, phone: e.target.value })
                  }
                  placeholder="Phone"
                />
                <Input
                  value={contactValue.linkedin}
                  onChange={(e) =>
                    setContactValue({ ...contactValue, linkedin: e.target.value })
                  }
                  placeholder="LinkedIn"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditContact(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await saveField("contact", { phone: contactValue.phone, linkedin: contactValue.linkedin });
                    setEditContact(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
