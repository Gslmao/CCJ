import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Scale } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simple validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (!role) {
      setError("Please select a role");
      setIsSubmitting(false);
      return;
    }

    // ===== BACKEND INTEGRATION POINT =====
    // API ENDPOINT: POST /api/auth/signup
    // REQUEST BODY: { username: string, email: string, password: string, role: string }
    // EXPECTED RESPONSE: { success: boolean, message: string }
    // TODO: Replace with actual API call:
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      });

      if (response.ok) {
        setIsSubmitting(false);
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Signup failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-light mb-4">
            <Scale className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-3xl font-serif font-semibold text-foreground">Create Account</h2>
          <p className="text-muted-foreground mt-2">Join the Chief's Court Justice System</p>
        </div>

        {/* Form */}
        <div className="card-flat animate-fade-in-delay">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                className="input-flat"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-flat"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="input-flat"
                placeholder="Create a password (min 8 characters)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="input-flat"
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-foreground">
                Select Your Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="input-flat"
              >
                <option value="">Choose a role</option>
                <option value="judge">Judge</option>
                <option value="juror">Juror</option>
                <option value="defendant">Defendant</option>
                <option value="plaintiff">Plaintiff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="link-underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
