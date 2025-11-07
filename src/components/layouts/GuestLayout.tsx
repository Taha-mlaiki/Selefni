import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface GuestLayoutProps {
  children: ReactNode;
}

export const GuestLayout = ({ children }: GuestLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            CreditSim
          </Link>
          <nav>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              Admin Access
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
