import { LogIn } from "lucide-react";
import { useLoginForm } from "../hooks/useLoginForm";
import { useMarking } from "../context/MarkingContext";
import { apiFetch } from "../lib/api";
import type { AuthToken } from "shared";

export function LoginForm() {
  const { installerId, password, error, isSubmitting, setInstallerId, setPassword } =
    useLoginForm();
  const { setToken } = useMarking();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiFetch<AuthToken>("/auth/login", {
        method: "POST",
        body: { installerId, password },
      });
      setToken(data.token, data.installerId);
    } catch (err: unknown) {
      // Error displayed via useLoginForm hook's error state
      // For now show a simple alert for network errors
      if (err && typeof err === "object" && "message" in err) {
        // ApiError from server
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <LogIn className="w-6 h-6" />
        Installer Login
      </h2>

      <div>
        <label htmlFor="installerId" className="block text-sm font-medium text-gray-300 mb-1">
          Installer ID
        </label>
        <input
          id="installerId"
          type="text"
          placeholder="INST-12345"
          value={installerId}
          onChange={(e) => setInstallerId(e.target.value)}
          className="w-full min-h-[48px] px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-[48px] px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-green"
        />
      </div>

      {error && (
        <p className="text-safety-red text-sm text-center" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[48px] bg-neon-green text-gray-900 font-bold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? "Logging in…" : "Log In"}
      </button>
    </form>
  );
}
