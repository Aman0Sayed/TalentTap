import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewResume() {
  const [resumeMeta, setResumeMeta] = useState<{ filename: string; mimetype: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then(res => res.json())
      .then(user => {
        if (user.resume && user.resume.filename) {
          setResumeMeta({ filename: user.resume.filename, mimetype: user.resume.mimetype });
        }
      });
  }, []);

  const handlePullResume = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setDeleting(true);
    try {
      await fetch(`http://localhost:5000/api/users/${userId}/resume`, {
        method: "DELETE"
      });
    } catch {}
    setDeleting(false);
    window.location.href = "/upload-resume";
  };

  const userId = localStorage.getItem("userId");
  const resumeUrl = userId ? `http://localhost:5000/api/users/${userId}/resume` : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
        {showResume && resumeUrl && resumeMeta ? (
          <>
            <Button variant="ghost" className="mb-4 self-start" onClick={() => setShowResume(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {resumeMeta.mimetype === "application/pdf" ? (
              <div className="w-full h-[70vh] flex justify-center items-center">
                <iframe
                  src={resumeUrl}
                  title="Resume"
                  className="w-full h-full border rounded-lg"
                  style={{ minHeight: 500 }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <p className="mb-4 text-gray-700">Preview not supported for this file type.</p>
                <Button asChild className="mb-4 w-full flex items-center gap-2" variant="secondary">
                  <a href={resumeUrl} download={resumeMeta.filename}>
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <FileText className="w-14 h-14 text-blue-500 mb-2" />
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Uploaded Resume</h1>
            {resumeMeta && resumeUrl ? (
              <>
                <Button className="w-full mt-2 flex items-center justify-center gap-2 mb-4" onClick={() => setShowResume(true)}>
                  <FileText className="w-4 h-4" /> View Resume
                </Button>
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  onClick={handlePullResume}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4" /> {deleting ? "Removing..." : "Pull Resume"}
                </Button>
              </>
            ) : (
              <div className="text-gray-500">No resume uploaded yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
