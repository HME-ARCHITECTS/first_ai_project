import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoginForm } from "../../components/LoginForm";
import { MarkingProvider } from "../../context/MarkingContext";

function renderWithProvider() {
  return render(
    <MarkingProvider>
      <LoginForm />
    </MarkingProvider>
  );
}

describe("LoginForm", () => {
  it("F-1: renders installer ID and password fields", () => {
    renderWithProvider();
    expect(screen.getByLabelText(/installer id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("F-2: installer ID field has placeholder", () => {
    renderWithProvider();
    expect(screen.getByPlaceholderText("INST-12345")).toBeInTheDocument();
  });

  it("F-3: password field has placeholder", () => {
    renderWithProvider();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });

  it("F-4: all inputs meet 48px min height", () => {
    renderWithProvider();
    const installerInput = screen.getByLabelText(/installer id/i);
    const passwordInput = screen.getByLabelText(/password/i);
    // Check the min-h-[48px] class is applied
    expect(installerInput.className).toContain("min-h-[48px]");
    expect(passwordInput.className).toContain("min-h-[48px]");
  });

  it("F-5: submit button has min height", () => {
    renderWithProvider();
    const button = screen.getByRole("button", { name: /log in/i });
    expect(button.className).toContain("min-h-[48px]");
  });

  it("F-6: renders the login heading", () => {
    renderWithProvider();
    expect(screen.getByText(/installer login/i)).toBeInTheDocument();
  });
});
