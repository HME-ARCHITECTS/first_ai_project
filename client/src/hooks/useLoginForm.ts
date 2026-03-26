import { useState, useCallback } from "react";
import { LoginCredentialsSchema } from "shared";
import { apiFetch } from "../lib/api";
import type { AuthToken } from "shared";

export function useLoginForm() {
  const [installerId, setInstallerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    setError("");

    const validation = LoginCredentialsSchema.safeParse({ installerId, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return false;
    }

    setIsSubmitting(true);
    try {
      const data = await apiFetch<AuthToken>("/auth/login", {
        method: "POST",
        body: { installerId, password },
      });
      setIsSubmitting(false);
      return !!data.token;
    } catch (err: unknown) {
      setIsSubmitting(false);
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Network error — are you offline?");
      }
      return false;
    }
  }, [installerId, password]);

  return {
    installerId,
    password,
    error,
    isSubmitting,
    setInstallerId,
    setPassword,
    handleSubmit,
  };
}
