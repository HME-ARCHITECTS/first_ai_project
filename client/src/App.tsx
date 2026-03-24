import { Camera } from "lucide-react";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="w-10 h-10 text-neon-green" />
        <h1 className="text-3xl font-bold">Vision AI Installer Tool</h1>
      </div>
      <p className="text-gray-400 text-center max-w-md">
        Skeleton ready. Run a spec to build features.
      </p>
    </div>
  );
}

export default App;
