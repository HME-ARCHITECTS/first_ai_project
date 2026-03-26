import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSurveyWizard } from "../useSurveyWizard";
import { MarkingProvider } from "../../context/MarkingContext";
import type { ReactNode } from "react";

// Mock the api module
vi.mock("../../lib/api", () => ({
  apiFetch: vi.fn().mockResolvedValue({}),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <MarkingProvider>{children}</MarkingProvider>;
}

const VALID_STORE_INFO = {
  storeId: "AB-123",
  storeName: "Test Store",
  storeAddress: "123 Main St, City 00000",
  storeType: "Drive-Thru" as const,
  contactName: "John",
  contactPhone: "+1 555-123-4567",
};

const VALID_HARDWARE = {
  cameraCount: 2,
  cameraModel: "VisionAI Cam Pro",
  mountType: "Ceiling" as const,
  processingUnitModel: "Edge 200",
  processingUnitSerial: "SN-12345",
  firmwareVersion: "v2.4.1",
};

// VALID_NETWORK available for future tests
// const VALID_NETWORK = {
//   connectionType: "Ethernet" as const,
//   ipAssignment: "DHCP" as const,
//   internetSpeed: "50 Mbps",
//   powerSource: "PoE" as const,
//   upsAvailable: true,
// };

describe("useSurveyWizard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("SW-1: initial state starts at step 0", () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });
    expect(result.current.currentStep).toBe(0);
  });

  it("SW-2: nextStep advances when step is valid", () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    // Fill store info
    act(() => {
      result.current.updateStepData(0, VALID_STORE_INFO);
    });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("SW-3: nextStep blocks when step is invalid", () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(0);
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
  });

  it("SW-4: prevStep goes back", () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    // Advance to step 1 with valid data
    act(() => {
      result.current.updateStepData(0, VALID_STORE_INFO);
    });
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(1);

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(0);
  });

  it("SW-5: validateAll returns all errors", () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    let validation: ReturnType<typeof result.current.validateAll>;
    act(() => {
      validation = result.current.validateAll();
    });

    expect(validation!.valid).toBe(false);
    expect(validation!.errors.length).toBeGreaterThan(0);
    expect(validation!.errors[0]).toHaveProperty("step");
    expect(validation!.errors[0]).toHaveProperty("stepLabel");
    expect(validation!.errors[0]).toHaveProperty("field");
    expect(validation!.errors[0]).toHaveProperty("message");
  });

  it("SW-6: draft saves to localStorage", async () => {
    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    act(() => {
      result.current.updateStepData(0, VALID_STORE_INFO);
    });

    await act(async () => {
      await result.current.saveDraft();
    });

    const stored = localStorage.getItem("vision-ai-survey-draft");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.storeInfo.storeId).toBe("AB-123");
  });

  it("SW-7: hydrates from localStorage on init", () => {
    const draft = { storeInfo: VALID_STORE_INFO, hardware: VALID_HARDWARE };
    localStorage.setItem("vision-ai-survey-draft", JSON.stringify(draft));

    const { result } = renderHook(() => useSurveyWizard(), { wrapper });

    expect(result.current.surveyData.storeInfo?.storeId).toBe("AB-123");
    expect(result.current.surveyData.hardware?.cameraModel).toBe("VisionAI Cam Pro");
  });
});
