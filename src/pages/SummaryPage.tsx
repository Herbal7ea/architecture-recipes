import { useParams, Link } from "react-router-dom";
import { recipes } from "../data/recipes";
import { ArrowLeft, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export function SummaryPage() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);
  const [copied, setCopied] = useState(false);

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link to="/" className="text-primary mt-4 inline-block hover:underline">← Back</Link>
      </div>
    );
  }

  const handleCopy = () => {
    const text = recipe.steps
      .map((s, i) => `## Step ${i + 1}: ${s.title}\n${s.description}${s.code ? `\n\n\`\`\`\n${s.code}\n\`\`\`` : ""}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <Link
        to={`/recipe/${recipe.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {recipe.title}
      </Link>

      <div className="text-center space-y-3 py-6">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">Recipe Complete!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          You've walked through all the steps for <strong>{recipe.title}</strong>. Here's a summary of what was covered.
        </p>
      </div>

      {/* Steps summary */}
      <div className="border border-border rounded-xl divide-y divide-border">
        {recipe.steps.map((step, i) => (
          <div key={step.id} className="p-4 flex gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium text-sm">
                Step {i + 1}: {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied!" : "Copy as Markdown"}
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Explore more recipes
        </Link>
      </div>
    </div>
  );
}
