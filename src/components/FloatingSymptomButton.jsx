import { Link, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";

function FloatingSymptomButton() {
  const location = useLocation();
  const hiddenPaths = ["/login", "/register"];

  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip label */}
      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap">
          AI Symptom Checker
        </div>
        {/* Arrow */}
        <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 rounded-sm" />
      </div>

      {/* Button */}
      <Link
        to="/symptom-checker"
        aria-label="Open AI Symptom Checker"
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #00897b, #26a69a)" }}
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#00897b] animate-ping opacity-20" />
        <span className="absolute inset-0 rounded-full bg-[#00897b] opacity-10 scale-125" />

        {/* Shadow */}
        <span className="absolute inset-0 rounded-full" style={{
          boxShadow: "0 8px 32px rgba(0,137,123,0.55), 0 2px 8px rgba(0,137,123,0.35)"
        }} />

        <Bot className="h-6 w-6 relative z-10" />
      </Link>
    </div>
  );
}

export default FloatingSymptomButton;
