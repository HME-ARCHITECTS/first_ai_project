import type { SiteSurvey } from "shared";
import type { SurveyValidationError } from "../../hooks/useSurveyWizard";
import { ErrorBanner } from "./ErrorBanner";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { useState } from "react";

interface ReviewStepProps {
  surveyData: Partial<SiteSurvey>;
  validationErrors: SurveyValidationError[];
  onStepClick: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  allValid: boolean;
}

const STEP_LABELS = ["Store Info", "Hardware", "Network", "Cameras", "Review"];

export function ReviewStep({
  surveyData,
  validationErrors,
  onStepClick,
  onSubmit,
  isSubmitting,
  allValid,
}: ReviewStepProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0, 1, 2, 3]));

  const toggle = (step: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const errorsForStep = (step: number) =>
    validationErrors.filter((e) => e.step === step);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Step 5: Review & Submit</h2>

      <ErrorBanner errors={validationErrors} />

      {/* Step 1: Store Info */}
      <Section
        step={0}
        label={STEP_LABELS[0]}
        expanded={expanded.has(0)}
        onToggle={() => toggle(0)}
        onEdit={() => onStepClick(0)}
        hasErrors={errorsForStep(0).length > 0}
      >
        <ReviewField label="Store ID" value={surveyData.storeInfo?.storeId} />
        <ReviewField label="Store Name" value={surveyData.storeInfo?.storeName} />
        <ReviewField label="Address" value={surveyData.storeInfo?.storeAddress} />
        <ReviewField label="Type" value={surveyData.storeInfo?.storeType} />
        <ReviewField label="Contact" value={surveyData.storeInfo?.contactName} />
        <ReviewField label="Phone" value={surveyData.storeInfo?.contactPhone} />
      </Section>

      {/* Step 2: Hardware */}
      <Section
        step={1}
        label={STEP_LABELS[1]}
        expanded={expanded.has(1)}
        onToggle={() => toggle(1)}
        onEdit={() => onStepClick(1)}
        hasErrors={errorsForStep(1).length > 0}
      >
        <ReviewField label="Camera Count" value={surveyData.hardware?.cameraCount} />
        <ReviewField label="Camera Model" value={surveyData.hardware?.cameraModel} />
        <ReviewField label="Mount Type" value={surveyData.hardware?.mountType} />
        <ReviewField label="Processing Unit" value={surveyData.hardware?.processingUnitModel} />
        <ReviewField label="Serial" value={surveyData.hardware?.processingUnitSerial} />
        <ReviewField label="Firmware" value={surveyData.hardware?.firmwareVersion} />
      </Section>

      {/* Step 3: Network */}
      <Section
        step={2}
        label={STEP_LABELS[2]}
        expanded={expanded.has(2)}
        onToggle={() => toggle(2)}
        onEdit={() => onStepClick(2)}
        hasErrors={errorsForStep(2).length > 0}
      >
        <ReviewField label="Connection" value={surveyData.network?.connectionType} />
        <ReviewField label="SSID" value={surveyData.network?.networkSsid ?? "—"} />
        <ReviewField label="IP Assignment" value={surveyData.network?.ipAssignment} />
        <ReviewField label="Internet Speed" value={surveyData.network?.internetSpeed} />
        <ReviewField label="Power" value={surveyData.network?.powerSource} />
        <ReviewField label="UPS" value={surveyData.network?.upsAvailable ? "Yes" : "No"} />
      </Section>

      {/* Step 4: Cameras */}
      <Section
        step={3}
        label={STEP_LABELS[3]}
        expanded={expanded.has(3)}
        onToggle={() => toggle(3)}
        onEdit={() => onStepClick(3)}
        hasErrors={errorsForStep(3).length > 0}
      >
        {surveyData.camerasPlacements?.map((cam, i) => (
          <div key={cam.cameraId} className="border-b border-gray-700 pb-2 mb-2">
            <p className="font-semibold">Camera {i + 1}: {cam.cameraName}</p>
            <ReviewField label="Height" value={`${cam.mountHeight} ft`} />
            <ReviewField label="Angle" value={cam.angle} />
            <ReviewField label="FOV" value={cam.fieldOfView} />
            <ReviewField label="POIs" value={cam.poiCount} />
            {cam.notes && <ReviewField label="Notes" value={cam.notes} />}
          </div>
        )) ?? <p className="text-gray-500">No camera placements</p>}
      </Section>

      <button
        onClick={onSubmit}
        disabled={!allValid || isSubmitting}
        className={`w-full min-h-[48px] rounded-lg font-bold text-lg transition-colors ${
          allValid && !isSubmitting
            ? "bg-[#39FF14] text-black hover:bg-green-400"
            : "bg-gray-600 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Submitting…" : "Submit Survey"}
      </button>
    </div>
  );
}

function Section({
  step,
  label,
  expanded,
  onToggle,
  onEdit,
  hasErrors,
  children,
}: {
  step: number;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  hasErrors: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-lg ${hasErrors ? "border-[#FF0000]" : "border-gray-600"}`}>
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${hasErrors ? "text-[#FF0000]" : ""}`}>
            Step {step + 1}: {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-400 hover:text-white"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>
      {expanded && <div className="px-3 pb-3 space-y-1">{children}</div>}
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value?: string | number }) {
  const missing = value === undefined || value === "" || value === null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={missing ? "text-[#FF0000]" : "text-white"}>
        {missing ? "Missing" : String(value)}
      </span>
    </div>
  );
}
