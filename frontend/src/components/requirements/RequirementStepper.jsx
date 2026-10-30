// src/components/requirements/RequirementStepper.jsx

import {
  FileText,
  Layers,
  Briefcase,
  Sparkles,
  ChevronRight,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const STEPS = [
  {
    id: "create-requirement",
    stepNumber: "01",
    title: "Create Requirement",
    subtitle: "Idea & Specifications",
    description: "Customer describes the custom craft, budget & deadline",
    icon: FileText,
  },
  {
    id: "active-requirements",
    stepNumber: "02",
    title: "Active Requirements",
    subtitle: "Status & RFQ Dashboard",
    description: "Live custom requests awaiting or receiving artisan quotes",
    icon: Layers,
  },
  {
    id: "creator-quotations",
    stepNumber: "03",
    title: "Creator Quotations",
    subtitle: "Artisan Bids & Review",
    description: "Verified makers review specs and submit custom quotes",
    icon: Briefcase,
  },
  {
    id: "quotation-comparison",
    stepNumber: "04",
    title: "Quotation Comparison",
    subtitle: "Compare & Commission",
    description: "Compare prices, delivery days, ratings and select maker",
    icon: Sparkles,
  },
];

export default function RequirementStepper({
  activeStep = "active-requirements",
  onStepChange,
  requirementsCount = 0,
  quotationsCount = 0,
  selectedRequirementId = null,
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === activeStep);
  const progressPercent = Math.round(((currentIndex + 1) / STEPS.length) * 100);

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      onStepChange(STEPS[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onStepChange(STEPS[currentIndex - 1].id);
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl shadow-xs p-4 sm:p-5 mb-8">
      {/* Top Header: Flow Label & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-border/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-dark animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase text-ink">
            Custom Order Journey Pipeline
          </span>
          <span className="text-xs text-ink-muted">
            • Step {currentIndex + 1} of {STEPS.length}:{" "}
            <strong className="text-amber-dark font-semibold">
              {STEPS[currentIndex]?.title}
            </strong>
          </span>
        </div>

        {/* Quick Stepper Forward / Back Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-ink-soft hover:text-ink hover:bg-cream disabled:opacity-40 disabled:pointer-events-none transition-all"
            title="Go to previous stage"
          >
            <ArrowLeft size={13} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === STEPS.length - 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ink text-cream hover:bg-amber-dark text-xs font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            title="Advance to next stage"
          >
            Next Step
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Progress Track Bar */}
      <div className="w-full bg-cream rounded-full h-1.5 my-3.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber to-amber-dark h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Sequential Stepper Buttons Row (Replaces the old button line!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {STEPS.map((step, index) => {
          const isActive = step.id === activeStep;
          const isCompleted = index < currentIndex;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(step.id)}
              className={`
                group relative p-3 sm:p-3.5 rounded-xl text-left transition-all duration-300 border flex items-start gap-3
                ${
                  isActive
                    ? "bg-ink text-cream border-ink ring-2 ring-amber/30 shadow-md -translate-y-0.5"
                    : isCompleted
                    ? "bg-cream/70 border-forest/30 text-ink hover:border-amber/60 hover:bg-white"
                    : "bg-white border-border text-ink-soft hover:text-ink hover:border-amber/50 hover:bg-cream/40"
                }
              `}
            >
              {/* Step Number Circle */}
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors
                  ${
                    isActive
                      ? "bg-amber text-ink shadow-xs"
                      : isCompleted
                      ? "bg-forest/20 text-forest font-bold"
                      : "bg-cream-dark text-ink-muted group-hover:text-ink"
                  }
                `}
              >
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : step.stepNumber}
              </div>

              {/* Title, Subtitle, & Counts */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`
                      text-xs sm:text-sm font-semibold truncate
                      ${isActive ? "text-cream" : "text-ink group-hover:text-amber-dark"}
                    `}
                  >
                    {step.title}
                  </h4>

                  {/* Badges for counts */}
                  {step.id === "active-requirements" && (
                    <span
                      className={`
                        text-[10px] font-bold px-1.5 py-0.5 rounded-full
                        ${
                          isActive
                            ? "bg-amber text-ink"
                            : "bg-amber/15 text-amber-dark"
                        }
                      `}
                    >
                      {requirementsCount}
                    </span>
                  )}

                  {step.id === "creator-quotations" && (
                    <span
                      className={`
                        text-[10px] font-bold px-1.5 py-0.5 rounded-full
                        ${
                          isActive
                            ? "bg-amber text-ink"
                            : "bg-forest/15 text-forest"
                        }
                      `}
                    >
                      {quotationsCount}
                    </span>
                  )}
                </div>

                <p
                  className={`
                    text-[11px] truncate mt-0.5
                    ${isActive ? "text-amber-light font-medium" : "text-ink-soft"}
                  `}
                >
                  {step.id === "quotation-comparison" && selectedRequirementId
                    ? `Compare (${selectedRequirementId})`
                    : step.subtitle}
                </p>
              </div>

              {/* Active Pulsing Indicator */}
              {isActive && (
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
