import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, HeartPulse, Send, Sparkles, ShieldCheck,
  AlertTriangle, BookOpen, LogOut, User, Bot,
  RefreshCw, ChevronRight, Lightbulb, Activity
} from "lucide-react";

const QUICK_SYMPTOMS = [
  "Fever and chills",
  "Headache and dizziness",
  "Cough and cold",
  "Stomach pain",
  "Body aches",
  "Shortness of breath",
];

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState("");
  const [charCount, setCharCount] = useState(0);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const resultRef               = useRef(null);
  const textareaRef             = useRef(null);

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    try {
      setLoading(true);
      setResult("");
      const { data } = await API.post("/symptoms", { symptoms });
      setResult(data.result || "No recommendation available.");
    } catch (err) {
      setResult("⚠ Unable to analyse symptoms right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setSymptoms(""); setResult(""); setCharCount(0); };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const addQuickSymptom = (s) => {
    const val = symptoms ? `${symptoms}, ${s.toLowerCase()}` : s.toLowerCase();
    setSymptoms(val);
    setCharCount(val.length);
    textareaRef.current?.focus();
  };

  return (
    <div className="rc-page">
      {/* Header */}
      <header className="rc-header">
        <div className="rc-container"><div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/patient" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-black text-slate-900 hidden sm:block">
                Rural<span className="text-[#00897b]">Care+</span>
              </span>
            </Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span>
              <Bot className="h-3.5 w-3.5 text-[#00897b]" />
              AI Symptom Checker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/patient" className="btn-ghost text-sm hidden sm:inline-flex">← Dashboard</Link>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user?.name || "Patient"}</span>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div></div>
      </header>

      <main className="rc-container py-8">
        <div className="max-w-3xl mx-auto">

          {/* Page title */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-400 items-center justify-center text-white mb-4 mx-auto">
              <Bot className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">AI Symptom Checker</h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Describe how you feel and get instant, AI-powered guidance on what to do next.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 mb-6 animate-fade-up delay-100">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Not a diagnosis.</strong> This tool provides general health guidance only. Always consult a qualified doctor for medical decisions.
            </p>
          </div>

          {/* Quick symptom chips */}
          <div className="rc-card mb-6 animate-fade-up delay-150">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-4 w-4 text-[#00897b]" />
              <p className="text-sm font-bold text-slate-700">Quick add — common symptoms</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SYMPTOMS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addQuickSymptom(s)}
                  className="px-3 py-1.5 rounded-full bg-[#f0faf8] border border-[#b2dfdb] text-sm text-[#00695c] font-medium hover:bg-[#e0f5f1] hover:border-[#00897b] transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="rc-card mb-6 animate-fade-up delay-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Describe your symptoms
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={5}
                value={symptoms}
                onChange={e => { setSymptoms(e.target.value); setCharCount(e.target.value.length); }}
                placeholder="e.g. I have had a fever of 101°F for two days, along with a sore throat, body aches, and fatigue…"
                className="input-rc resize-none leading-relaxed"
                style={{ borderRadius: "0.875rem" }}
              />
              <span className="absolute bottom-3 right-4 text-xs text-slate-400">{charCount} chars</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleCheck}
                disabled={loading || !symptoms.trim()}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                    </span>
                    Analysing…
                  </span>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Check Symptoms</>
                )}
              </button>

              {(symptoms || result) && (
                <button onClick={handleReset} className="btn-ghost text-sm">
                  <RefreshCw className="h-3.5 w-3.5" /> Start over
                </button>
              )}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="rc-card animate-fade-up space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">AI is thinking…</p>
                  <p className="text-xs text-slate-500">Analysing your symptoms</p>
                </div>
              </div>
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-4/6" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div ref={resultRef} className="animate-scale-in">
              <div className="rc-card border-l-4 border-[#00897b]">
                <div className="flex items-start gap-4 mb-5">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center text-white flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-black text-slate-900">AI Health Analysis</p>
                      <span className="badge badge-teal text-xs">
                        <ShieldCheck className="h-3 w-3" /> Reviewed
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Based on the symptoms you described</p>
                  </div>
                </div>

                <div className="bg-[#f8fdfc] border border-[#d0ede8] rounded-2xl p-5 mb-5">
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm">{result}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/book-appointment" className="btn-primary text-sm">
                    <BookOpen className="h-4 w-4" /> Book appointment
                  </Link>
                  <button onClick={handleReset} className="btn-ghost text-sm">
                    <RefreshCw className="h-3.5 w-3.5" /> Check again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tips sidebar (shows when no result yet) */}
          {!result && !loading && (
            <div className="grid sm:grid-cols-2 gap-4 mt-2 animate-fade-up delay-300">
              {[
                { icon: Activity,  title: "Be specific",    desc: "Include when symptoms started, their severity, and any pattern (worse in morning, after eating, etc.)" },
                { icon: HeartPulse,title: "Stay accurate",  desc: "Avoid self-diagnosing. Use this as a guide to decide if you need to book an appointment." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rc-card flex gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#e0f5f1] flex items-center justify-center text-[#00897b] flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm mb-0.5">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12 py-6">
        <div className="rc-container flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-[#00897b] fill-current" />
          <span className="text-sm text-slate-500">RuralCare+ · © 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default SymptomChecker;
