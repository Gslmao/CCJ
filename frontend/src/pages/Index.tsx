import { useNavigate } from "react-router-dom";
import { Scale, UserPlus, LogIn, Shield, FileText, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-8 animate-fade-in">
              <Scale className="h-10 w-10 text-secondary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6 animate-fade-in">
              Chief's Court of Justice
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-10 animate-fade-in-delay">
              A modern platform for transparent case management, judicial proceedings, and community voting on legal matters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-2">
              <button
                onClick={() => {
                  console.log("Create account button clicked");
                  navigate("/signup");
                }}
                className="btn-secondary rounded-md inline-flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <UserPlus className="h-5 w-5" />
                Create Account
              </button>
              <button
                onClick={() => {
                  console.log("Sign in button clicked");
                  navigate("/login");
                }}
                className="btn-flat bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 rounded-md inline-flex items-center gap-2 w-full sm:w-auto justify-center hover:bg-primary-foreground/20 cursor-pointer"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the judicial process with modern tools for case management and community participation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="card-flat text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-light mb-5">
                <FileText className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
                Submit Cases
              </h3>
              <p className="text-muted-foreground text-sm">
                Create and submit cases with detailed descriptions, evidence, and supporting documents.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-flat text-center animate-fade-in-delay">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-light mb-5">
                <Shield className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
                Fair Proceedings
              </h3>
              <p className="text-muted-foreground text-sm">
                Assigned judges review cases thoroughly, ensuring fair and impartial proceedings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-flat text-center animate-fade-in-delay-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-light mb-5">
                <Users className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
                Community Voting
              </h3>
              <p className="text-muted-foreground text-sm">
                Registered users can vote on cases, providing transparent community input.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-secondary" />
              <span className="font-serif font-semibold text-foreground">Chief's Court</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Chief's Court of Justice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
