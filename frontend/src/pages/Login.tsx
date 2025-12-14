import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Scale } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // ===== BACKEND INTEGRATION POINT =====
    // API ENDPOINT: POST /api/auth/login
    // REQUEST BODY: { email: string, password: string }
    // EXPECTED RESPONSE: { success: boolean, token: string, user: { id, username, email } }
    // TODO: Replace with actual API call:
    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      setError('Login failed. Please check your credentials.');
      setIsSubmitting(false);
      return;
    }
    
    const data = await response.json();
    console.log(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userole', data.role);
    setIsSubmitting(false);
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-light mb-4">
            <Scale className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-3xl font-serif font-semibold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to access the Justice System</p>
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
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
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
                name="password"
                required
                minLength={0}
                className="input-flat"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing In..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="link-underline">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
