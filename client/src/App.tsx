import { useState } from "react";
import { Camera, ClipboardList } from "lucide-react";
import { MarkingProvider, useMarking } from "./context/MarkingContext";
import { LoginForm } from "./components/LoginForm";
import { CameraList } from "./components/CameraList";
import { VideoCanvas } from "./components/VideoCanvas";
import { MarkingToggle } from "./components/MarkingToggle";
import { PoiList } from "./components/PoiList";
import { SurveyWizard } from "./components/survey/SurveyWizard";

type AppView = "cameras" | "survey";

function AppContent() {
  const { token, selectedCamera, isMarkingMode, toggleMarkingMode } = useMarking();
  const [view, setView] = useState<AppView>("cameras");

  // Not logged in → show login
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex items-center gap-3 mb-8">
          <Camera className="w-10 h-10 text-neon-green" />
          <h1 className="text-3xl font-bold">Vision AI Installer Tool</h1>
        </div>
        <LoginForm />
      </div>
    );
  }

  // Navigation bar (visible when logged in)
  const NavBar = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Camera className="w-8 h-8 text-neon-green" />
        <h1 className="text-2xl font-bold">Vision AI Installer Tool</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("cameras")}
          className={`min-w-[48px] min-h-[48px] px-3 flex items-center gap-2 rounded-lg ${
            view === "cameras"
              ? "bg-[#39FF14] text-black font-bold"
              : "bg-gray-700 text-white"
          }`}
        >
          <Camera className="w-4 h-4" /> Cameras
        </button>
        <button
          onClick={() => setView("survey")}
          className={`min-w-[48px] min-h-[48px] px-3 flex items-center gap-2 rounded-lg ${
            view === "survey"
              ? "bg-[#39FF14] text-black font-bold"
              : "bg-gray-700 text-white"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Survey
        </button>
      </div>
    </div>
  );

  // Survey view
  if (view === "survey") {
    return (
      <div className="min-h-screen p-4">
        {NavBar}
        <SurveyWizard />
      </div>
    );
  }

  // Logged in but no camera selected → show camera list
  if (!selectedCamera) {
    return (
      <div className="min-h-screen p-4">
        {NavBar}
        <CameraList />
      </div>
    );
  }

  // Camera selected → marking view
  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex items-center justify-between">
        {NavBar}
        <span className="text-sm text-gray-400">{selectedCamera.name}</span>
      </div>

      <VideoCanvas />

      <div className="flex items-center justify-between">
        <MarkingToggle isActive={isMarkingMode} onToggle={toggleMarkingMode} />
      </div>

      <PoiList />
    </div>
  );
}

function App() {
  return (
    <MarkingProvider>
      <AppContent />
    </MarkingProvider>
  );
}

export default App;
