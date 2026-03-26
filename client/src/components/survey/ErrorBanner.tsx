interface ErrorBannerProps {
  errors: { step: number; stepLabel: string; field: string; message: string }[];
}

export function ErrorBanner({ errors }: ErrorBannerProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-900/50 border border-[#FF0000] rounded-lg p-4 mb-4" role="alert">
      <p className="text-[#FF0000] font-bold mb-2">
        Survey incomplete — please fill in all required fields before submitting.
      </p>
      <ul className="space-y-1 text-sm">
        {errors.map((err, i) => (
          <li key={i} className="text-red-300">
            Step {err.step + 1} — {err.stepLabel}: {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
