import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StoreInfoStep } from "../StoreInfoStep";

const EMPTY_ERRORS: Record<string, string> = {};
const NO_OP = () => {};

function renderStep(
  data: Record<string, unknown> = {},
  errors: Record<string, string> = EMPTY_ERRORS,
) {
  return render(
    <StoreInfoStep data={data} errors={errors} onChange={NO_OP} />,
  );
}

describe("StoreInfoStep", () => {
  it("SI-1: renders all 6 fields", () => {
    renderStep();
    expect(screen.getByPlaceholderText("AA-000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Main St Drive-Thru")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123 Main St, City, ST 00000")).toBeInTheDocument();
    expect(screen.getByText("Select type…")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Smith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1 555-123-4567")).toBeInTheDocument();
  });

  it("SI-2: invalid storeId shows inline error", () => {
    renderStep({}, { storeId: "must follow pattern AA-000" });
    expect(screen.getByText("must follow pattern AA-000")).toBeInTheDocument();
  });

  it("SI-3: valid form passes validation (no error elements)", () => {
    const validData = {
      storeId: "AB-123",
      storeName: "Test Store",
      storeAddress: "123 Main St",
      storeType: "Drive-Thru",
      contactName: "John",
      contactPhone: "+1 555-123-4567",
    };
    const { container } = renderStep(validData);
    const errorEls = container.querySelectorAll(".text-\\[\\#FF0000\\]");
    expect(errorEls.length).toBe(0);
  });

  it("SI-4: all inputs meet 48px min height", () => {
    const { container } = renderStep();
    const inputs = container.querySelectorAll("input, textarea, select");
    inputs.forEach((el) => {
      expect(el.className).toContain("min-h-[48px]");
    });
  });
});
