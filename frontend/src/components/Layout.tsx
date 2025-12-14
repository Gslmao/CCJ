import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Layout = ({ children, showNav = false, userName, onLogout }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
              <Scale className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="text-xl font-serif font-semibold text-foreground">Chief's Court</h1>
                <p className="text-xs text-muted-foreground">Justice System</p>
              </div>
            </Link>

            {showNav && (
              <nav className="flex items-center gap-6">
                {userName && (
                  <span className="text-sm text-muted-foreground">
                    Welcome, <span className="font-medium text-foreground">{userName}</span>
                  </span>
                )}
                <Link to="/dashboard" className="text-sm text-foreground transition-colors duration-200 hover:text-secondary">
                  Dashboard
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="btn-outline text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                )}
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © 2024 Chief's Court of Justice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
