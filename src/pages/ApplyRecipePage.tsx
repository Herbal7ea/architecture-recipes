import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { recipes } from "../data/recipes";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "../lib/utils";

export function ApplyRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find((r) => r.id === id);
  const [currentStep, setCurrentStep] = useState(0);

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link to="/" className="text-primary mt-4 inline-block hover:underline">← Back</Link>
      </div>
    );
  }

  const step = recipe.steps[currentStep];
  const isLast = currentStep === recipe.steps.length - 1;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link
        to={`/recipe/${recipe.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to {recipe.title}
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Apply: {recipe.title}</h1>
        <p className="text-muted-foreground mt-1">Follow each step to implement this pattern.</p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-1">
        {recipe.steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStep(i)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : i < currentStep
                  ? "bg-green-100 text-green-700"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </button>
            {i < recipe.steps.length - 1 && (
              <div className={cn("w-8 h-0.5", i < currentStep ? "bg-green-300" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            Step {currentStep + 1} of {recipe.steps.length}
          </span>
          <h2 className="text-xl font-semibold mt-1">{step.title}</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
        </div>

        {step.files && (
          <div className="bg-secondary/50 rounded-lg p-3">
            <span className="text-xs font-medium text-muted-foreground">Files to create:</span>
            <div className="mt-1 space-y-1">
              {step.files.map((f) => (
                <code key={f} className="block text-sm font-mono text-foreground">{f}</code>
              ))}
            </div>
          </div>
        )}

        {step.code && (
          <div className="bg-[oklch(0.16_0_0)] rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm font-mono text-[oklch(0.9_0_0)] whitespace-pre">{step.code}</pre>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          Previous
        </button>
        {isLast ? (
          <button
            onClick={() => navigate(`/recipe/${recipe.id}/summary`)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Finish <Check className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
