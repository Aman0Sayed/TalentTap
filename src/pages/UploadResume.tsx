import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CloudUpload, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadResume() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If a resume is already uploaded, redirect to view-resume
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => res.json())
      .then((user) => {
        if (user.resume && user.resume.filename) {
          navigate("/view-resume", { replace: true });
        }
      });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFileName(file.name);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    const userId = localStorage.getItem("userId");
    if (!fileInputRef.current?.files?.[0] || !userId) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", fileInputRef.current.files[0]);
    formData.append("userId", userId);
    try {
      const res = await fetch("http://localhost:5000/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/view-resume";
        }, 1200);
      }
    } catch {
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <CloudUpload className="w-14 h-14 text-blue-500 mb-2" />
          <h1 className="text-2xl font-bold mb-1 text-gray-900">
            Upload Your Resume
          </h1>
          <p className="text-gray-500 text-center text-sm max-w-xs">
            Accepted format:{" "}
            <span className="font-semibold">PDF only</span>. Max file size: 5MB.
          </p>
        </div>
        <label
          htmlFor="resume-upload"
          className="w-full cursor-pointer flex flex-col items-center border-2 border-dashed border-blue-300 rounded-xl py-8 px-4 hover:bg-blue-50 transition mb-4"
        >
          <input
            id="resume-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-blue-600 font-medium">Click to select file</span>
          {fileName && <span className="mt-2 text-gray-700">{fileName}</span>}
        </label>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <Button
          onClick={handleUpload}
          disabled={uploading || !fileName}
          className="w-full mt-2"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </Button>
        {success && (
          <div className="flex items-center gap-2 mt-4 text-green-600">
            <CheckCircle2 className="w-5 h-5" /> Resume uploaded successfully!
          </div>
        )}
      </div>
    </div>
  );
}
