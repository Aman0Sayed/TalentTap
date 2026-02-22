import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfileData } from "@/types/user-profile";
import api from "@/api/client";

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<UserProfileData | null>(null);

  useEffect(() => {
    // Fetch candidate from backend by id
    const fetchCandidate = async () => {
      try {
        const { data: u } = await api.get(`/users/${id}`);
        if (!u || u.error) return setCandidate(null);
        // Map backend user to UserProfileData shape
        setCandidate({
          id: u._id ? String(u._id) : u.id,
          name: u.name || '',
          email: u.email || '',
          title: u.title || 'Candidate',
          location: u.location || '',
          connections: u.connections || Math.floor(Math.random() * 200),
          about: u.about || '',
          experience: u.experience || [],
          education: u.education || [],
          skills: u.skills || [],
          projects: u.projects || [],
          certifications: u.certifications || [],
          languages: u.languages || [],
          contact: u.contact || { email: u.email || '', phone: '', linkedin: '' },
          profileImage: u.profileImage || `https://randomuser.me/api/portraits/men/32.jpg`,
          coverImage: u.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=600&q=80',
        });
      } catch {
        setCandidate(null);
      }
    };
    fetchCandidate();
  }, [id]);

  if (!candidate) {
    return <div className="max-w-2xl mx-auto py-12 text-center text-gray-500">Candidate not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        ← Back to Candidates
      </Button>
      <Card>
        <div className="h-40 w-full rounded-t-lg bg-gray-200 mb-4" style={{ backgroundImage: `url(${candidate.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <CardHeader className="flex flex-row items-center gap-6 -mt-16">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={candidate.profileImage} alt={candidate.name} />
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{candidate.name}</CardTitle>
            <div className="text-gray-600">{candidate.title}</div>
            <div className="text-xs text-gray-400">{candidate.location}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-700">{candidate.about}</div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Skills:</div>
            <div className="flex gap-2 flex-wrap">
              {candidate.skills.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Experience:</div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {candidate.experience.map((exp, i) => (
                <li key={i}>{exp.title} at {exp.company} ({exp.period})</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Education:</div>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {candidate.education.map((edu, i) => (
                <li key={i}>{edu.degree} - {edu.school} ({edu.period})</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Contact:</div>
            <div className="text-sm text-gray-700">Email: {candidate.contact.email}</div>
            <div className="text-sm text-gray-700">Phone: {candidate.contact.phone}</div>
            <div className="text-sm text-blue-700 underline cursor-pointer" onClick={() => window.open(`https://${candidate.contact.linkedin}`, '_blank')}>LinkedIn</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateDetail;
