import { Outlet, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors">
            <BookOpen className="w-5 h-5 text-primary" />
            Architecture Recipes
          </Link>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            PoC
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
