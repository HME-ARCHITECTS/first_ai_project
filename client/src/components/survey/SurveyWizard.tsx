import { useSurveyWizard } from "../../hooks/useSurveyWizard";
import type { SurveyCameraPlacement } from "shared";
import { SurveyProgress } from "./SurveyProgress";
import { StoreInfoStep } from "./StoreInfoStep";
import { HardwareStep } from "./HardwareStep";
import { NetworkStep } from "./NetworkStep";
import { CameraPlacementStep } from "./CameraPlacementStep";
import { ReviewStep } from "./ReviewStep";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useState } from "react";

export function SurveyWizard() {
  const wizard = useSurveyWizard();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [allValidationErrors, setAllValidationErrors] = useState<
    ReturnType<typeof wizard.validateAll>["errors"]
  >([]);

  const handleSubmit = async () => {
    const { valid, errors } = wizard.validateAll();
    setAllValidationErrors(errors);
    if (!valid) return;

    const success = await wizard.submitSurvey();
    if (success) setSubmitSuccess(true);
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#39FF14] flex items-center justify-center">
          <span className="text-4xl text-black">✓</span>
        </div>
        <h2 className="text-2xl font-bold">Survey Submitted!</h2>
        <p className="text-gray-400">
          Your site survey has been submitted for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wizard.isDraft && (
        <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-full">
          DRAFT
        </span>
      )}

      <SurveyProgress
        currentStep={wizard.currentStep}
        completedSteps={wizard.completedSteps}
        invalidSteps={wizard.invalidSteps}
        stepLabels={wizard.stepLabels}
        onStepClick={wizard.goToStep}
      />

      {wizard.currentStep === 0 && (
        <StoreInfoStep
          data={wizard.surveyData.storeInfo ?? {}}
          errors={wizard.errors}
          onChange={(data) => wizard.updateStepData(0, data)}
        />
      )}

      {wizard.currentStep === 1 && (
        <HardwareStep
          data={wizard.surveyData.hardware ?? {}}
          errors={wizard.errors}
          onChange={(data) => wizard.updateStepData(1, data)}
        />
      )}

      {wizard.currentStep === 2 && (
        <NetworkStep
          data={wizard.surveyData.network ?? {}}
          errors={wizard.errors}
          onChange={(data) => wizard.updateStepData(2, data)}
        />
      )}

      {wizard.currentStep === 3 && (
        <CameraPlacementStep
          data={(wizard.surveyData.camerasPlacements ?? []) as SurveyCameraPlacement[]}
          errors={wizard.errors}
          onChange={(placements) => wizard.updateStepData(3, placements as unknown as Record<string, unknown>)}
        />
      )}

      {wizard.currentStep === 4 && (
        <ReviewStep
          surveyData={wizard.surveyData}
          validationErrors={allValidationErrors}
          onStepClick={wizard.goToStep}
          onSubmit={handleSubmit}
          isSubmitting={wizard.isSubmitting}
          allValid={allValidationErrors.length === 0 || wizard.completedSteps.size >= 4}
        />
      )}

      {/* Navigation bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <button
          onClick={wizard.prevStep}
          disabled={wizard.currentStep === 0}
          className={`min-w-[48px] min-h-[48px] px-4 flex items-center gap-2 rounded-lg ${
            wizard.currentStep > 0
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          onClick={wizard.saveDraft}
          className="min-w-[48px] min-h-[48px] px-4 flex items-center gap-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          <Save className="w-4 h-4" /> Save Draft
        </button>

        {wizard.currentStep < 4 && (
          <button
            onClick={wizard.nextStep}
            className="min-w-[48px] min-h-[48px] px-4 flex items-center gap-2 rounded-lg bg-[#39FF14] text-black font-bold hover:bg-green-400"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
