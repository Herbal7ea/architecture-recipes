import { useState } from "react";
import { Link } from "react-router-dom";
import { recipes, categories } from "../data/recipes";
import { Search, ArrowRight, Database, Layout, Server, TestTube } from "lucide-react";
import { cn } from "../lib/utils";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Database, Layout, Server, TestTube,
};

const complexityColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

export function BrowsePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = !activeCategory || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Patterns</h1>
        <p className="text-muted-foreground mt-1">
          Browse proven architectural recipes and apply them to your project.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search patterns, tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              )}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Recipe Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="group border border-border rounded-xl p-5 bg-card hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-sm text-muted-foreground">{recipe.subtitle}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", complexityColors[recipe.complexity])}>
                {recipe.complexity}
              </span>
              {recipe.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No recipes match your search.</p>
      )}
    </div>
  );
}
