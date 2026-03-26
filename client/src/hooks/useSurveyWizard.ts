import { useState, useCallback, useRef, useEffect } from "react";
import {
  SurveyStoreInfoSchema,
  SurveyHardwareSchema,
  SurveyNetworkSchema,
  SurveyCameraPlacementsSchema,
  SiteSurveySchema,
} from "shared";
import type { SiteSurvey } from "shared";
import { apiFetch } from "../lib/api";
import { useMarking } from "../context/MarkingContext";

export interface SurveyValidationError {
  step: number;
  stepLabel: string;
  field: string;
  message: string;
}

const STORAGE_KEY = "vision-ai-survey-draft";
const STEP_LABELS = ["Store", "Hardware", "Network", "Cameras", "Review"];
const STEP_SCHEMAS = [
  SurveyStoreInfoSchema,
  SurveyHardwareSchema,
  SurveyNetworkSchema,
  SurveyCameraPlacementsSchema,
];

// Map data key per step
const STEP_KEYS: (keyof SiteSurvey)[] = [
  "storeInfo",
  "hardware",
  "network",
  "camerasPlacements",
];

function loadDraft(): Partial<SiteSurvey> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraftToStorage(data: Partial<SiteSurvey>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useSurveyWizard() {
  const { token, installerId } = useMarking();
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<Partial<SiteSurvey>>(loadDraft);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [invalidSteps, setInvalidSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraft, setIsDraft] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const surveyDataRef = useRef(surveyData);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    surveyDataRef.current = surveyData;
  }, [surveyData]);

  // Auto-save to localStorage (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveDraftToStorage(surveyData);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [surveyData]);

  const validateStep = useCallback((step: number): boolean => {
    if (step >= 4) return true; // Review step — no own fields
    const schema = STEP_SCHEMAS[step];
    const key = STEP_KEYS[step];
    const data = surveyDataRef.current[key];

    const result = schema.safeParse(data);
    if (result.success) {
      setErrors({});
      setCompletedSteps((prev) => new Set(prev).add(step));
      setInvalidSteps((prev) => {
        const next = new Set(prev);
        next.delete(step);
        return next;
      });
      return true;
    }

    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : "unknown";
      newErrors[field] = issue.message;
    }
    setErrors(newErrors);
    setInvalidSteps((prev) => new Set(prev).add(step));
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.delete(step);
      return next;
    });
    return false;
  }, []);

  const validateAll = useCallback((): { valid: boolean; errors: SurveyValidationError[] } => {
    const allErrors: SurveyValidationError[] = [];
    const newInvalid = new Set<number>();
    const newCompleted = new Set<number>();

    for (let step = 0; step < 4; step++) {
      const schema = STEP_SCHEMAS[step];
      const key = STEP_KEYS[step];
      const data = surveyDataRef.current[key];
      const result = schema.safeParse(data);

      if (result.success) {
        newCompleted.add(step);
      } else {
        newInvalid.add(step);
        for (const issue of result.error.issues) {
          allErrors.push({
            step,
            stepLabel: STEP_LABELS[step],
            field: issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : String(issue.path[0] ?? "unknown"),
            message: issue.message,
          });
        }
      }
    }

    setInvalidSteps(newInvalid);
    setCompletedSteps(newCompleted);
    return { valid: allErrors.length === 0, errors: allErrors };
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step <= 4) {
      setCurrentStep(step);
      setErrors({});
    }
  }, []);

  const nextStep = useCallback((): boolean => {
    const valid = validateStep(currentStep);
    if (valid && currentStep < 4) {
      setCurrentStep((s) => s + 1);
    }
    return valid;
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setErrors({});
    }
  }, [currentStep]);

  const updateStepData = useCallback((step: number, data: Record<string, unknown>) => {
    const key = STEP_KEYS[step];
    if (!key) return;
    setSurveyData((prev) => ({ ...prev, [key]: data }));
  }, []);

  const saveDraft = useCallback(async () => {
    const id = surveyDataRef.current.id ?? crypto.randomUUID();
    const draft = {
      ...surveyDataRef.current,
      id,
      installerId: installerId ?? "",
      status: "draft" as const,
      updatedAt: new Date().toISOString(),
      createdAt: surveyDataRef.current.createdAt ?? new Date().toISOString(),
    };
    setSurveyData(draft);
    saveDraftToStorage(draft);

    if (token) {
      try {
        await apiFetch(`/surveys/${id}`, { method: "PUT", body: draft, token });
      } catch {
        // Offline — saved locally
      }
    }
  }, [token, installerId]);

  const submitSurvey = useCallback(async (): Promise<boolean> => {
    const { valid } = validateAll();
    if (!valid || !token) return false;

    setIsSubmitting(true);
    try {
      const id = surveyDataRef.current.id ?? crypto.randomUUID();
      const payload: SiteSurvey = {
        ...surveyDataRef.current as SiteSurvey,
        id,
        installerId: installerId ?? "",
        status: "draft",
        createdAt: surveyDataRef.current.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Validate locally first
      const localResult = SiteSurveySchema.safeParse(payload);
      if (!localResult.success) return false;

      await apiFetch("/surveys", { method: "POST", body: payload, token });
      setIsDraft(false);
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [token, installerId, validateAll]);

  return {
    currentStep,
    surveyData,
    completedSteps,
    invalidSteps,
    errors,
    isDraft,
    isSubmitting,
    stepLabels: STEP_LABELS,
    goToStep,
    nextStep,
    prevStep,
    updateStepData,
    validateStep,
    validateAll,
    saveDraft,
    submitSurvey,
  };
}
