import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReviewStep } from "../ReviewStep";
import type { SiteSurvey } from "shared";
import type { SurveyValidationError } from "../../../hooks/useSurveyWizard";

const COMPLETE_SURVEY: Partial<SiteSurvey> = {
  storeInfo: {
    storeId: "AB-123",
    storeName: "Test Store",
    storeAddress: "123 Main St",
    storeType: "Drive-Thru",
    contactName: "John",
    contactPhone: "+1 555-123-4567",
  },
  hardware: {
    cameraCount: 2,
    cameraModel: "VisionAI Cam Pro",
    mountType: "Ceiling",
    processingUnitModel: "Edge 200",
    processingUnitSerial: "SN-12345",
    firmwareVersion: "v2.4.1",
  },
  network: {
    connectionType: "Ethernet",
    ipAssignment: "DHCP",
    internetSpeed: "50 Mbps",
    powerSource: "PoE",
    upsAvailable: true,
  },
  camerasPlacements: [
    {
      cameraId: "cam-1",
      cameraName: "Front Door",
      mountHeight: 10,
      angle: "Overhead",
      fieldOfView: "Wide",
      poiCount: 3,
      notes: "",
    },
  ],
};

const NO_ERRORS: SurveyValidationError[] = [];
const SAMPLE_ERRORS: SurveyValidationError[] = [
  { step: 0, stepLabel: "Store Info", field: "storeId", message: "Store ID is required" },
  { step: 1, stepLabel: "Hardware", field: "cameraCount", message: "At least 1 camera required" },
];

function renderReview(
  overrides: Partial<Parameters<typeof ReviewStep>[0]> = {},
) {
  const defaults = {
    surveyData: COMPLETE_SURVEY,
    validationErrors: NO_ERRORS,
    onStepClick: vi.fn(),
    onSubmit: vi.fn(),
    isSubmitting: false,
    allValid: true,
  };
  return render(<ReviewStep {...defaults} {...overrides} />);
}

describe("ReviewStep", () => {
  it("RS-1: renders summary of all steps", () => {
    renderReview();
    expect(screen.getByText(/Step 1: Store Info/)).toBeInTheDocument();
    expect(screen.getByText(/Step 2: Hardware/)).toBeInTheDocument();
    expect(screen.getByText(/Step 3: Network/)).toBeInTheDocument();
    expect(screen.getByText(/Step 4: Cameras/)).toBeInTheDocument();
  });

  it("RS-2: missing fields show red highlight", () => {
    const { container } = renderReview({
      surveyData: { storeInfo: undefined },
      validationErrors: SAMPLE_ERRORS,
    });
    // The "Missing" text should appear for fields without data
    const missingEls = container.querySelectorAll(".text-\\[\\#FF0000\\]");
    expect(missingEls.length).toBeGreaterThan(0);
  });

  it("RS-3: submit button disabled when incomplete", () => {
    renderReview({ allValid: false });
    const button = screen.getByRole("button", { name: /submit survey/i });
    expect(button).toBeDisabled();
  });

  it("RS-4: error banner lists all missing fields", () => {
    renderReview({ validationErrors: SAMPLE_ERRORS });
    expect(screen.getByText(/Store ID is required/)).toBeInTheDocument();
    expect(screen.getByText(/At least 1 camera required/)).toBeInTheDocument();
  });

  it("RS-5: edit button navigates to the correct step", () => {
    const onStepClick = vi.fn();
    renderReview({ onStepClick });
    const editButtons = screen.getAllByLabelText(/edit/i);
    fireEvent.click(editButtons[0]); // Click "Edit Store Info"
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});
