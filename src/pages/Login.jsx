import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart, Mail, Lock, Eye, EyeOff, ArrowRight,
  User, Stethoscope, Pill, ShieldCheck,
  CheckCircle, FileText, Calendar, Activity,
  Package, ClipboardList, BarChart3, Users
} from "lucide-react";

/* ── Role config — colours, copy, features ─────────────────── */
const ROLE_CONFIG = {
  PATIENT: {
    label:    "Patient",
    icon:     User,
    gradient: "from-teal-600 to-emerald-500",
    badge:    "bg-teal-500/20 text-teal-100",
    heading:  "Your health, in your hands.",
    sub:      "Access appointments, records, and AI symptom checks from anywhere.",
    perks: [
      { icon: Calendar,  text: "Book & track appointments instantly" },
      { icon: FileText,  text: "Health records available offline too" },
      { icon: ShieldCheck, text: "AI symptom checker in simple language" },
    ],
  },
  DOCTOR: {
    label:    "Doctor",
    icon:     Stethoscope,
    gradient: "from-blue-600 to-cyan-500",
    badge:    "bg-blue-500/20 text-blue-100",
    heading:  "Serve your patients better.",
    sub:      "Manage appointments, start video calls, and add records — all in one place.",
    perks: [
      { icon: Calendar,    text: "Approve and manage patient visits" },
      { icon: Activity,    text: "Start video consultations with one click" },
      { icon: ClipboardList, text: "Create health records after each visit" },
    ],
  },
  PHARMACY: {
    label:    "Pharmacy",
    icon:     Pill,
    gradient: "from-violet-600 to-purple-500",
    badge:    "bg-violet-500/20 text-violet-100",
    heading:  "Keep medicines flowing.",
    sub:      "Manage your inventory, confirm patient reservations, and track stock.",
    perks: [
      { icon: Package,       text: "Add and update medicine stock easily" },
      { icon: ClipboardList, text: "Confirm or reject patient reservations" },
      { icon: Activity,      text: "Track availability across your pharmacy" },
    ],
  },
  ADMIN: {
    label:    "Admin",
    icon:     ShieldCheck,
    gradient: "from-slate-700 to-slate-600",
    badge:    "bg-white/10 text-slate-200",
    heading:  "Platform control centre.",
    sub:      "Monitor platform health, review analytics, and manage all users.",
    perks: [
      { icon: Users,    text: "Oversee all doctors, patients & pharmacies" },
      { icon: BarChart3,text: "Real-time analytics and platform metrics" },
      { icon: ShieldCheck, text: "Secure, role-based access control" },
    ],
  },
};

const ROLE_TABS = [
  { value: "PATIENT",  label: "Patient",  icon: User },
  { value: "DOCTOR",   label: "Doctor",   icon: Stethoscope },
  { value: "PHARMACY", label: "Pharmacy", icon: Pill },
  { value: "ADMIN",    label: "Admin",    icon: ShieldCheck },
];

function Login() {
  const navigate       = useNavigate();
  const { setUser }    = useAuth();
  const [params]       = useSearchParams();

  // Pre-select role from ?role=ADMIN query param (coming from register page)
  const initialRole = params.get("role") || "PATIENT";
  const [activeRole, setActiveRole] = useState(
    ROLE_TABS.find(r => r.value === initialRole) ? initialRole : "PATIENT"
  );

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Reset form on role switch
  useEffect(() => { setError(""); }, [activeRole]);

  const cfg = ROLE_CONFIG[activeRole];
  const RoleIcon = cfg.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      const role = data.user.role;
      if (role === "PATIENT")  navigate("/patient");
      if (role === "DOCTOR")   navigate("/doctor");
      if (role === "PHARMACY") navigate("/pharmacy");
      if (role === "ADMIN")    navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-[#e8f5f0] to-[#eef4fe] flex items-center justify-center px-4 py-10">

      <Link to="/" className="fixed top-5 left-5 btn-ghost text-sm z-50">← Home</Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl animate-scale-in">

        {/* ── LEFT: Role-specific brand panel ──────── */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${cfg.gradient} text-white p-8 md:p-10 flex flex-col transition-all duration-500`}>
          {/* Decorative rings */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex flex-col h-full">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Heart className="h-5 w-5 fill-current text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">RuralCare+</span>
            </Link>

            {/* Role badge */}
            <div className={`badge ${cfg.badge} self-start mb-5 text-xs`}>
              <RoleIcon className="h-3.5 w-3.5" /> {cfg.label} Portal
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-snug mb-3">
              {cfg.heading}
            </h1>
            <p className="text-white/80 leading-relaxed mb-8 text-sm">
              {cfg.sub}
            </p>

            {/* Perks */}
            <div className="space-y-3 mt-auto">
              {cfg.perks.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">{text}</span>
                </div>
              ))}
            </div>

            {/* Admin note */}
            {activeRole === "ADMIN" && (
              <div className="mt-6 p-3 rounded-xl bg-white/10 border border-white/20 text-xs text-white/70">
                🔒 Admin accounts are created server-side only. Contact your system administrator for access.
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Login form ─────────────────────── */}
        <div className="bg-white p-8 md:p-10 flex flex-col">

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Sign in</h2>
            <p className="text-slate-500 text-sm">Select your role and enter your credentials</p>
          </div>

          {/* Role tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6">
            {ROLE_TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveRole(value)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeRole === value
                    ? "bg-white shadow-md text-slate-900 scale-[1.02]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${activeRole === value ? "text-[#00897b]" : ""}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Highlight strip for selected role */}
          <div className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${cfg.gradient} text-white px-4 py-2.5 mb-6 text-sm font-semibold`}>
            <RoleIcon className="h-4 w-4 shrink-0" />
            Signing in as <span className="font-black">{cfg.label}</span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-fade-up">
              <span className="text-red-500 shrink-0">⚠</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                  className="input-rc"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                  className="input-rc"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit — colour matches active role */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-base rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r ${cfg.gradient}`}
              style={{ boxShadow: "0 4px 14px rgba(0,0,0,.18)" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                  </span>
                  Signing in…
                </span>
              ) : (
                <><RoleIcon className="h-4 w-4" /> Sign in as {cfg.label} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <hr className="flex-1 border-slate-200" />
            <span className="text-xs text-slate-400 font-medium">NEW HERE?</span>
            <hr className="flex-1 border-slate-200" />
          </div>

          {activeRole === "ADMIN" ? (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
              <ShieldCheck className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 mb-1">Admin registration is closed</p>
              <p className="text-xs text-slate-500">Admin accounts are provisioned by the system administrator only.</p>
            </div>
          ) : (
            <p className="text-sm text-center text-slate-500">
              Don't have an account?{" "}
              <Link
                to={`/register`}
                className="font-bold hover:underline transition-colors"
                style={{ color: "#00897b" }}
              >
                Create one free →
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Login;
