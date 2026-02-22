// This is a fallback user profile generator for missing fields
export function buildUserProfileFromUser(user) {
  if (user.role === "jobseeker") {
    return {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title || "Job Seeker",
      location: user.location || "Unknown",
      about: user.about || "No about info yet.",
      skills: user.skills || [],
      projects: user.projects || [],
      certifications: user.certifications || [],
      languages: user.languages || [],
      contact: user.contact || { email: user.email, phone: "", linkedin: "" },
      profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=E0E7FF&color=3730A3&size=128`,
      coverImage: user.coverImage || "ADD_BG_IMG_PLACEHOLDER",
      company: "", // Hide company for job seekers
      experience: user.experience || [],
      education: user.education || [],
      connections: user.connections || 0,
      resume: user.resume
        ? {
            filename: user.resume.filename,
            mimetype: user.resume.mimetype,
            uploadedAt: user.resume.uploadedAt,
          }
        : undefined,
    };
  }
  // Set default title based on role
  let defaultTitle = "";
  if (user.role === "manager") {
    defaultTitle = user.company ? `Manager at ${user.company}` : "Manager at TalentTap";
  } else if (user.role === "recruiter") {
    defaultTitle = user.company ? `Recruiter at ${user.company}` : "Recruiter at TalentTap";
  } else {
    defaultTitle = user.title || "";
  }
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title || defaultTitle,
    location: user.location || "Unknown",
    connections: user.connections || 0,
    about: user.about || "No about info yet.",
    experience: user.experience || [],
    education: user.education || [],
    skills: user.skills || [],
    projects: user.projects || [],
    certifications: user.certifications || [],
    languages: user.languages || [],
    contact: user.contact || { email: user.email, phone: "", linkedin: "" },
    profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=E0E7FF&color=3730A3&size=128`,
    coverImage: user.coverImage || "ADD_BG_IMG_PLACEHOLDER",
    company: user.company || "",
  };
}
