import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, User, Linkedin } from "lucide-react";
import api from "@/api/client";

const CommunityProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      {/* Profile Header */}
      <Card className="overflow-visible shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative h-44 rounded-t-lg w-full">
          {/* Cover Image as background */}
          {user.coverImage && user.coverImage !== "ADD_BG_IMG_PLACEHOLDER" ? (
            <img src={user.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover rounded-t-lg opacity-70 z-0" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg z-0" />
          )}
          {/* Overlay for text visibility */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-t-lg z-10" />
          {/* Profile image, centered and overlapping the cover */}
          <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 z-20">
            <div className="w-36 h-36 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-36 h-36 rounded-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-blue-600" />
              )}
            </div>
          </div>
        </div>
        <CardContent className="pt-20 flex flex-col items-center pb-8">
          <h2 className="text-3xl font-bold text-gray-900 mt-4">{user.name}</h2>
          <div className="text-blue-800 font-semibold text-lg mb-1">{user.title || user.role}</div>
          <div className="flex flex-wrap gap-4 text-gray-700 text-base mb-2 justify-center">
            <span className="flex items-center"><Mail className="w-4 h-4 mr-1" />{user.email}</span>
            {user.contact?.phone && <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{user.contact.phone}</span>}
            {user.location && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{user.location}</span>}
            {user.contact?.linkedin && (
              <a href={user.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-700 hover:underline"><Linkedin className="w-4 h-4 mr-1" />LinkedIn</a>
            )}
          </div>
          <div className="text-gray-400 text-xs">User ID: {user._id || user.id}</div>
        </CardContent>
      </Card>

      {/* About/Summary */}
      {user.about && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-blue-700">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-base leading-relaxed">{user.about}</p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-blue-700">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience */}
      {user.experience && user.experience.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700"><Briefcase className="w-5 h-5 mr-2" />Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.experience.map((exp: any, idx: number) => (
              <div key={idx} className="border-l-4 border-blue-300 pl-4">
                <h4 className="font-semibold text-base text-blue-900">{exp.position}</h4>
                <p className="text-xs text-gray-600">{exp.company} • {exp.duration}</p>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {user.projects && user.projects.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-blue-700">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.projects.map((project: any, idx: number) => (
                <div key={idx} className="border-l-4 border-green-300 pl-4">
                  <h4 className="font-semibold text-base text-green-900">{project.name}</h4>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {user.education && user.education.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700"><GraduationCap className="w-5 h-5 mr-2" />Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.education.map((edu: any, idx: number) => (
              <div key={idx}>
                <h4 className="font-semibold text-base text-blue-900">{edu.degree}</h4>
                <p className="text-xs text-gray-600">{edu.institution} • {edu.year}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {user.certifications && user.certifications.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-blue-700">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.certifications.map((cert: any, idx: number) => (
                <div key={idx}>
                  <span className="font-semibold text-green-900">{cert.name}</span>
                  {cert.year && <span className="text-xs text-gray-500 ml-2">({cert.year})</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages */}
      {user.languages && user.languages.length > 0 && (
        <Card className="shadow border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-blue-700">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs border-blue-200 text-blue-800">{lang.name} {lang.level && <span className="text-gray-400">({lang.level})</span>}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityProfile;
