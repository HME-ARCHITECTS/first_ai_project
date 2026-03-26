import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Camera, PointOfInterest } from "shared";
import { flushQueue } from "../lib/offlineQueue";

interface MarkingState {
  token: string | null;
  installerId: string | null;
  cameras: Camera[];
  selectedCamera: Camera | null;
  pois: PointOfInterest[];
  isMarkingMode: boolean;
  isOnline: boolean;
}

interface MarkingActions {
  setToken: (token: string, installerId: string) => void;
  setCameras: (cameras: Camera[]) => void;
  selectCamera: (camera: Camera) => void;
  addPoi: (poi: PointOfInterest) => void;
  removePoi: (id: string) => void;
  toggleMarkingMode: () => void;
  syncOfflineQueue: () => Promise<void>;
}

const STORAGE_KEY = "vision-ai-session";

function loadState(): Partial<MarkingState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: MarkingState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const MarkingContext = createContext<(MarkingState & MarkingActions) | null>(null);

export function MarkingProvider({ children }: { children: ReactNode }) {
  const saved = loadState();

  const [token, setTokenState] = useState<string | null>(saved.token ?? null);
  const [installerId, setInstallerId] = useState<string | null>(saved.installerId ?? null);
  const [cameras, setCamerasState] = useState<Camera[]>(saved.cameras ?? []);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(saved.selectedCamera ?? null);
  const [pois, setPois] = useState<PointOfInterest[]>(saved.pois ?? []);
  const [isMarkingMode, setIsMarkingMode] = useState(saved.isMarkingMode ?? false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Keep refs in sync to avoid stale closures
  const poisRef = useRef(pois);
  poisRef.current = pois;

  // Save to localStorage on every state change
  useEffect(() => {
    saveState({ token, installerId, cameras, selectedCamera, pois, isMarkingMode, isOnline });
  }, [token, installerId, cameras, selectedCamera, pois, isMarkingMode, isOnline]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const setToken = useCallback((t: string, id: string) => {
    setTokenState(t);
    setInstallerId(id);
  }, []);

  const setCameras = useCallback((c: Camera[]) => {
    setCamerasState(c);
  }, []);

  const selectCamera = useCallback((c: Camera) => {
    setSelectedCamera(c);
    setPois([]);
  }, []);

  const addPoi = useCallback((poi: PointOfInterest) => {
    setPois((prev) => [...prev, poi]);
  }, []);

  const removePoi = useCallback((id: string) => {
    setPois((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleMarkingMode = useCallback(() => {
    setIsMarkingMode((prev) => !prev);
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    await flushQueue();
  }, []);

  const value: MarkingState & MarkingActions = {
    token,
    installerId,
    cameras,
    selectedCamera,
    pois,
    isMarkingMode,
    isOnline,
    setToken,
    setCameras,
    selectCamera,
    addPoi,
    removePoi,
    toggleMarkingMode,
    syncOfflineQueue,
  };

  return (
    <MarkingContext.Provider value={value}>{children}</MarkingContext.Provider>
  );
}

export function useMarking(): MarkingState & MarkingActions {
  const ctx = useContext(MarkingContext);
  if (!ctx) throw new Error("useMarking must be used within MarkingProvider");
  return ctx;
}
