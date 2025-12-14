import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";

const CreateCase = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [judgeId, setJudgeId] = useState("");
  
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? storedUser : null;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ===== BACKEND INTEGRATION POINT =====
    // API ENDPOINT: POST /api/cases
    // CONTENT-TYPE: multipart/form-data
    // REQUEST BODY (FormData):
    //   - title: string
    //   - description: string
    //   - judgeId: string
    //   - files: File[] (multiple files)
    // HEADERS: { 'Authorization': 'Bearer ' + token }
    // EXPECTED RESPONSE: { success: boolean, caseId: string }
    const token = localStorage.getItem('token');
    const submitData = new FormData();
    submitData.append('title', caseTitle);
    submitData.append('description', caseDescription);
    submitData.append('judge_id', judgeId);
    // files.forEach((file) => submitData.append('files', file));
    
    console.log('Form Data Before Submit:', { caseTitle, caseDescription, judgeId });
    
    try {
      const response = await fetch('http://localhost:3000/cases/new', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: submitData
      });
      console.log('Response:', response);
      
      if (response.ok) {
        setIsSubmitting(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error creating case:', error);
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout showNav userName={user} onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-muted-foreground mb-6 transition-colors duration-200 hover:text-foreground animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-serif font-semibold text-foreground">Create New Case</h2>
          <p className="text-muted-foreground mt-2">Submit a new case to the court</p>
        </div>

        {/* Form */}
        <div className="card-flat animate-fade-in-delay">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Case Title
              </label>
              <input
                type="text"
                id="title"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                required
                className="input-flat"
                placeholder="Enter case title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Case Description
              </label>
              <textarea
                id="description"
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
                required
                rows={5}
                className="input-flat resize-none"
                placeholder="Provide a detailed description of the case"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="judgeId" className="block text-sm font-medium text-foreground">
                Judge ID
              </label>
              <input
                type="text"
                id="judgeId"
                value={judgeId}
                onChange={(e) => setJudgeId(e.target.value)}
                required
                className="input-flat"
                placeholder="Enter assigned judge ID"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Supporting Documents
              </label>
              <div className="border-2 border-dashed border-border rounded-md p-6 text-center transition-colors duration-200 hover:border-secondary">
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="files"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload files or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB each
                  </span>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-md animate-fade-in"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-secondary" />
                        <span className="text-sm text-foreground truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 rounded-md transition-colors duration-200 hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Case"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn-outline rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCase;
