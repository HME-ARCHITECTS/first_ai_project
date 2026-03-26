import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, WifiOff } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: WifiOff,
};

const COLORS = {
  success: "bg-neon-green text-gray-900",
  error: "bg-safety-red text-white",
  warning: "bg-orange-500 text-white",
};

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg min-w-[250px] ${COLORS[toast.type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
