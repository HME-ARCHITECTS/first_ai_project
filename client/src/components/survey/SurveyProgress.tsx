import { Check, AlertTriangle } from "lucide-react";

interface SurveyProgressProps {
  currentStep: number;
  completedSteps: Set<number>;
  invalidSteps: Set<number>;
  stepLabels: string[];
  onStepClick: (step: number) => void;
}

export function SurveyProgress({
  currentStep,
  completedSteps,
  invalidSteps,
  stepLabels,
  onStepClick,
}: SurveyProgressProps) {
  return (
    <div className="flex items-center justify-between w-full mb-6">
      {stepLabels.map((label, i) => {
        const isActive = i === currentStep;
        const isCompleted = completedSteps.has(i);
        const isInvalid = invalidSteps.has(i);
        const canClick = i <= currentStep || completedSteps.has(i);

        let bgColor = "bg-gray-500"; // default incomplete
        if (isActive) bgColor = "bg-[#39FF14]";
        else if (isInvalid) bgColor = "bg-[#FF0000]";
        else if (isCompleted) bgColor = "bg-[#39FF14]";

        return (
          <div key={i} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 ${
                    completedSteps.has(i - 1) ? "bg-[#39FF14]" : "bg-gray-600"
                  }`}
                />
              )}
              <button
                onClick={() => canClick && onStepClick(i)}
                disabled={!canClick}
                className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${bgColor} ${
                  isActive || isCompleted ? "text-black" : "text-white"
                } ${canClick ? "cursor-pointer" : "cursor-default opacity-70"}`}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {isInvalid && !isActive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isCompleted && !isActive ? (
                  <Check className="w-5 h-5" />
                ) : (
                  i + 1
                )}
              </button>
              {i < stepLabels.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${
                    completedSteps.has(i) ? "bg-[#39FF14]" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
            <span
              className={`text-xs mt-1 ${
                isActive ? "text-[#39FF14] font-bold" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
