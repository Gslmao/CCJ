import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft, FileText, User, Calendar, ThumbsUp, ThumbsDown, Check } from "lucide-react";

interface CaseData {
  id: string;
  title: string;
  description: string;
  judge_id: string;
  created_at: string;
  files: { name: string; url: string }[];
  votes: {
    for: number;
    against: number;
  };
  userVote: boolean | null;
}

// Mock case data
const MOCK_CASE: CaseData = {
  id: "1",
  title: "Property Dispute - Smith vs. Johnson",
  description:
    "This case involves a dispute over property boundaries between neighboring landowners. The plaintiff claims that the defendant has encroached upon their land by approximately 2 meters along the eastern boundary. Evidence includes survey documents from 1985 and 2023, photographs of the disputed area, and testimony from three witnesses.",
  judge_id: "JDG-2024-001",
  created_at: "2024-01-15",
  files: [
    { name: "Survey_1985.pdf", url: "#" },
    { name: "Survey_2023.pdf", url: "#" },
    { name: "Property_Photos.zip", url: "#" },
  ],
  votes: {
    for: 24,
    against: 18,
  },
  userVote: null,
};

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const caseDataSet = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/cases/getcase/${id}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    setCaseData(data.case);
    setIsLoading(false);
  }

  useEffect(() => {
    caseDataSet();
  }, [id]);

  const handleVote = async (voteFor: boolean) => {
    if (!caseData || caseData.userVote !== null) return;

    setIsVoting(true);

    // ===== BACKEND INTEGRATION POINT =====
    // API ENDPOINT: POST /api/cases/:caseId/vote
    // HEADERS: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    // REQUEST BODY: { voteFor: boolean }
    // EXPECTED RESPONSE: {
    //   success: boolean,
    //   votes: { for: number, against: number },
    //   userVote: boolean
    // }
    // Note: Backend should check if user has already voted and return error if so
    // TODO: Replace with actual API call:
    // const token = localStorage.getItem('token');
    // const response = await fetch(`/api/cases/${id}/vote`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + token,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ voteFor })
    // });

    // Simulate API call
    // setTimeout(() => {
    //   setCaseData((prev) => {
    //     if (!prev) return prev;
    //     return {
    //       ...prev,
    //       votes: {
    //         ...prev.votes,
    //         [voteFor ? "for" : "against"]: prev.votes[voteFor ? "for" : "against"] + 1,
    //       },
    //       userVote: voteFor,
    //     };
    //   });
    //   setIsVoting(false);
    // }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <Layout showNav userName={user?.username} onLogout={handleLogout}>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Loading case details...</p>
        </div>
      </Layout>
    );
  }

  if (!caseData) {
    return (
      <Layout showNav userName={user?.username} onLogout={handleLogout}>
        <div className="max-w-3xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Case not found</p>
        </div>
      </Layout>
    );
  }

  const totalVotes = caseData.votes.for + caseData.votes.against;
  const forPercentage = totalVotes > 0 ? (caseData.votes.for / totalVotes) * 100 : 50;

  return (
    <Layout showNav userName={user?.username} onLogout={handleLogout}>
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground mb-6 transition-colors duration-200 hover:text-foreground animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Case Header */}
        <div className="card-flat mb-6 animate-fade-in">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-md bg-gold-light">
              <FileText className="h-6 w-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-semibold text-foreground">{caseData.title}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Judge: {caseData.judge_id}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(caseData.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-medium text-foreground mb-2">Case Description</h3>
            <p className="text-muted-foreground leading-relaxed">{caseData.description}</p>
          </div>
        </div>

        {/* Uploaded Files */}
        <div className="card-flat mb-6 animate-fade-in-delay">
          <h3 className="text-lg font-medium text-foreground mb-4">Supporting Documents</h3>
          {caseData.files.length > 0 ? (
            <ul className="space-y-2">
              {caseData.files.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    className="flex items-center gap-3 p-3 rounded-md bg-muted transition-colors duration-200 hover:bg-muted/70"
                  >
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="text-foreground">{file.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No documents uploaded</p>
          )}
        </div>

        {/* Voting Section */}
        <div className="card-flat animate-fade-in-delay-2">
          <h3 className="text-lg font-medium text-foreground mb-4">Cast Your Vote</h3>

          {/* Vote Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-success font-medium">For Defendant: {caseData.votes.for}</span>
              <span className="text-destructive font-medium">Against: {caseData.votes.against}</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden flex">
              <div
                className="bg-success transition-all duration-500"
                style={{ width: `${forPercentage}%` }}
              />
              <div
                className="bg-destructive transition-all duration-500"
                style={{ width: `${100 - forPercentage}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Total votes: {totalVotes}
            </p>
          </div>

          {/* Vote Buttons */}
          {caseData.userVote ? (
            <div className="flex items-center justify-center gap-3 p-4 rounded-md bg-muted animate-fade-in">
              <Check className="h-5 w-5 text-success" />
              <span className="text-foreground">
                You voted
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleVote(true)}
                disabled={isVoting}
                className="btn-success flex-1 rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ThumbsUp className="h-5 w-5" />
                Vote For Defendant
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={isVoting}
                className="btn-destructive flex-1 rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ThumbsDown className="h-5 w-5" />
                Vote Against Defendant
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CaseDetails;
