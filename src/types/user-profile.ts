export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  title: string;
  location: string;
  connections: number;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    location: string;
    logo: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
    logo: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    year: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
  };
  profileImage: string;
  coverImage: string;
}
