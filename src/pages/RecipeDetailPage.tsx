import { useParams, Link } from "react-router-dom";
import { recipes } from "../data/recipes";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";

const complexityColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

export function RecipeDetailPage() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link to="/" className="text-primary mt-4 inline-block hover:underline">← Back to recipes</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> All recipes
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", complexityColors[recipe.complexity])}>
            {recipe.complexity}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
      </div>

      {/* Diagram */}
      <div className="bg-secondary/50 border border-border rounded-xl p-5">
        <pre className="text-sm font-mono text-foreground overflow-x-auto whitespace-pre">{recipe.diagram}</pre>
      </div>

      {/* Tradeoffs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-green-700">
            <CheckCircle className="w-4 h-4" /> Strengths
          </h3>
          <ul className="space-y-1.5">
            {recipe.tradeoffs.pros.map((p, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-green-500 mt-0.5">+</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-border rounded-xl p-5 space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-red-600">
            <XCircle className="w-4 h-4" /> Tradeoffs
          </h3>
          <ul className="space-y-1.5">
            {recipe.tradeoffs.cons.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-red-400 mt-0.5">−</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Use Cases */}
      <div className="border border-border rounded-xl p-5 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> When to use
        </h3>
        <ul className="space-y-1.5">
          {recipe.useCases.map((uc, i) => (
            <li key={i} className="text-sm text-muted-foreground">• {uc}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <Link
        to={`/recipe/${recipe.id}/apply`}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Apply this recipe <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
