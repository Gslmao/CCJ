import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Plus, FileText, Calendar, Check, X } from "lucide-react";

interface Case {
  id: string;
  title: string;
  createdAt: string;
  status: "pending" | "active" | "closed";
  approved?: boolean;
}

// Mock data for initial display
const MOCK_CASES: Case[] = [
  { id: "1", title: "Property Dispute - Smith vs. Johnson", createdAt: "2024-01-15", status: "active" },
  { id: "2", title: "Contract Breach - ABC Corp", createdAt: "2024-01-10", status: "pending" },
  { id: "3", title: "Inheritance Claim - Williams Estate", createdAt: "2024-01-05", status: "closed" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [user, setUser] = useState<{ username: string; email: string; role?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  async function fetchCases(){
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userole');
      
      let endpoint = 'http://localhost:3000/cases/all';
      
      // If user is a judge, fetch cases assigned to them
      // if (role === 'judge') {
      //   endpoint = 'http://localhost:3000/cases/judge';
      // }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (!response.ok) {
        console.error('Failed to fetch cases:', response.status);
        setCases(MOCK_CASES);
        return;
      }
      
      const data = await response.json();
      console.log(data.cases);
      setCases(Array.isArray(data.cases.cases) ? data.cases.cases : []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCases(MOCK_CASES);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("userole");
    
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser({
        username: userObj || '',
        email: '',
        role: storedRole || ''
      });
    }

    // Fetch cases from backend
    const loadCases = async () => {
      await fetchCases();
      setIsLoading(false);
    };
    
    loadCases();
  }, []);

  const handleLogout = () => {
    // ===== BACKEND INTEGRATION POINT =====
    // API ENDPOINT: POST /api/auth/logout
    // HEADERS: { 'Authorization': 'Bearer ' + token }
    // EXPECTED RESPONSE: { success: boolean }
    // TODO: Add actual API call:
    // await fetch('/api/auth/logout', {
    //   method: 'POST',
    //   headers: { 'Authorization': 'Bearer ' + token }
    // });

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userole");
    localStorage.removeItem("userID");
    navigate("/login");
  };

  const getStatusColor = (status: Case["status"]) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-secondary/20 text-secondary-foreground";
      case "closed":
        return "bg-muted text-muted-foreground";
    }
  };

  const handleApprove = async (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApprovingId(caseId);
    
    try {
      const token = localStorage.getItem('token');
      
      // ===== BACKEND INTEGRATION POINT =====
      // API ENDPOINT: PATCH /cases/:caseId/approve
      // HEADERS: { 'Authorization': 'Bearer ' + token }
      // EXPECTED RESPONSE: { success: boolean, message: string }
      // TODO: Uncomment to use actual API:

      const response = await fetch(`http://localhost:3000/cases/${caseId}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (response.ok) {
        setCases(prev => prev.map(c => c.id === caseId ? { ...c, approved: true } : c));
      }

      setCases(prev => prev.map(c => c.id === caseId ? { ...c, approved: true } : c));
    } catch (error) {
      console.error('Error approving case:', error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setApprovingId(caseId);
    
    try {
      const token = localStorage.getItem('token');
      
      // ===== BACKEND INTEGRATION POINT =====
      // API ENDPOINT: PATCH /cases/:caseId/reject
      // HEADERS: { 'Authorization': 'Bearer ' + token }
      // EXPECTED RESPONSE: { success: boolean, message: string }
      // TODO: Uncomment to use actual API:

      const response = await fetch(`http://localhost:3000/cases/${caseId}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (response.ok) {
        setCases(prev => prev.filter(c => c.id !== caseId));
      }


      setCases(prev => prev.filter(c => c.id !== caseId));
    } catch (error) {
      console.error('Error rejecting case:', error);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <Layout showNav userName={user?.username} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-foreground">Case Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              {user?.role === 'judge' ? 'Review assigned cases' : 'Manage your court cases'}
            </p>
            {user && (
              <div className="mt-3 text-sm">
                <p className="text-foreground">
                  <span className="font-medium">User:</span> {user.username}
                </p>
                {user.role && (
                  <p className="text-foreground">
                    <span className="font-medium">Role:</span> <span className="capitalize">{user.role}</span>
                  </p>
                )}
              </div>
            )}
          </div>
          {user?.role !== 'judge' && user?.role !== 'juror' && (
            <button onClick={() => navigate("/create-case")} className="btn-primary rounded-md inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Case
            </button>
          )}
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="card-flat text-center py-12">
              <p className="text-muted-foreground">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="card-flat text-center py-12 animate-fade-in">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {user?.role === 'judge' ? 'No Cases Assigned' : 'No Cases Yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {user?.role === 'judge' 
                  ? 'No cases have been assigned to you' 
                  : user?.role === 'juror'
                  ? 'No cases have been assigned for Jury Duty'
                  : 'Start by creating your first case'}
              </p>
              {user?.role !== 'judge' && user?.role !== 'juror' && (
                <button onClick={() => navigate("/create-case")} className="btn-secondary rounded-md inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Case
                </button>
              )}
            </div>
          ) : (
            cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="card-flat animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <button
                  onClick={() => navigate(`/case/${caseItem.id}`)}
                  className="block w-full text-left hover:bg-muted/50 transition-colors p-4 -m-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-gold-light">
                        <FileText className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{caseItem.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(caseItem.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(caseItem.status)} capitalize`}>
                      {caseItem.status}
                    </span>
                  </div>
                </button>

                {/* Judge Approval/Rejection Buttons */}
                {user?.role === 'judge' && caseItem.approved !== true && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                    <button
                      onClick={(e) => handleApprove(caseItem.id, e)}
                      disabled={approvingId === caseItem.id}
                      className="btn-success flex-1 rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={(e) => handleReject(caseItem.id, e)}
                      disabled={approvingId === caseItem.id}
                      className="btn-destructive flex-1 rounded-md inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}

                {/* Show approved status for judges */}
                {user?.role === 'judge' && caseItem.approved === true && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-success">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Approved</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
