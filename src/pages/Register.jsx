import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart, User, Mail, Lock, Phone, MapPin, Eye, EyeOff,
  ArrowRight, Stethoscope, Pill, ShieldCheck, CheckCircle
} from "lucide-react";

// ADMIN is intentionally excluded — admin accounts are created server-side only
const ROLES = [
  { value: "PATIENT",  label: "Patient",   icon: User,        desc: "Book appointments & manage health",  color: "from-teal-500 to-emerald-400" },
  { value: "DOCTOR",   label: "Doctor",    icon: Stethoscope, desc: "Manage patients & consultations",    color: "from-blue-500 to-cyan-400" },
  { value: "PHARMACY", label: "Pharmacy",  icon: Pill,        desc: "Manage stock & reservations",        color: "from-violet-500 to-purple-400" },
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phone: "", village: "", role: "PATIENT",
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [step, setStep]         = useState(1); // 1 = role pick, 2 = details

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0faf8] via-[#e8f5f0] to-[#eef4fe] flex items-center justify-center px-4 py-10">

      <Link to="/" className="fixed top-5 left-5 btn-ghost text-sm z-50">← Home</Link>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch animate-scale-in">

        {/* ── LEFT: Form ───────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 animate-fade-up">

          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-[#00897b] text-white shadow-md"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? "text-[#00897b]" : "text-slate-400"}`}>
                  {s === 1 ? "Choose role" : "Your details"}
                </span>
                {s < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${step > s ? "bg-[#00897b]" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-fade-up">
              <span className="text-red-500 mt-0.5">⚠</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* STEP 1: Role selection */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-black text-slate-900 mb-1">I am a…</h2>
              <p className="text-slate-500 text-sm mb-7">Choose your role to set up the right account.</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {ROLES.map(({ value, label, icon: Icon, desc, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: value })}
                    className={`text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
                      formData.role === value
                        ? "border-[#00897b] bg-[#f0faf8] shadow-md"
                        : "border-slate-200 bg-white hover:border-[#b2dfdb] hover:bg-[#f8fffe]"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                    {formData.role === value && (
                      <div className="mt-2">
                        <CheckCircle className="h-4 w-4 text-[#00897b]" />
                      </div>
                    )}
                  </button>
                ))}

                {/* Admin tile — locked, redirects to login */}
                <Link
                  to="/login?role=ADMIN"
                  className="text-left rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md text-xs font-bold text-slate-700">
                      <Lock className="h-3 w-3" /> Sign in instead
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white mb-3">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-slate-400 text-sm flex items-center gap-1.5">
                    Admin <Lock className="h-3 w-3" />
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">Restricted — sign in only</p>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary w-full py-3.5 text-base"
              >
                Continue as {selectedRole?.label} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Details form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-up">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-[#00897b] font-semibold mb-5 hover:underline flex items-center gap-1"
              >
                ← Change role
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-1">Create account</h2>
              <p className="text-slate-500 text-sm mb-6">
                Registering as a{" "}
                <span className="font-bold text-[#00897b]">{selectedRole?.label}</span>
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required style={{ paddingLeft: "2.5rem" }} className="input-rc" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={{ paddingLeft: "2.5rem" }} className="input-rc" />
                  </div>
                </div>

                {/* Phone + Village */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" style={{ paddingLeft: "2.5rem" }} className="input-rc" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Village</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                      <input name="village" value={formData.village} onChange={handleChange} placeholder="Village name" style={{ paddingLeft: "2.5rem" }} className="input-rc" />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
                    <input
                      name="password" type={showPwd ? "text" : "password"}
                      value={formData.password} onChange={handleChange}
                      placeholder="Create a strong password" required
                      style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                      className="input-rc"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-base mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="flex gap-1">
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                        <span className="loading-dot" />
                      </span>
                      Creating account…
                    </span>
                  ) : (
                    <>Create account <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#00897b] hover:text-[#006157] transition-colors">
              Sign in →
            </Link>
          </p>
        </div>

        {/* ── RIGHT: Brand panel ───────────────────── */}
        <div className="relative overflow-hidden rounded-3xl gradient-animated text-white p-8 md:p-10 flex flex-col order-first lg:order-last">
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-8 -right-8  w-64 h-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col h-full">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Heart className="h-5 w-5 fill-current text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">RuralCare+</span>
            </Link>

            <div className="badge bg-white/20 text-white text-xs mb-6 self-start">
              Free for all patients
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-snug mb-4">
              Join 2,400+ families<br />
              <span className="text-teal-200">across 173 villages.</span>
            </h1>
            <p className="text-teal-100 leading-relaxed mb-8">
              Whether you're a patient, doctor, pharmacy, or admin — your personal health dashboard is one registration away.
            </p>

            {/* Checklist */}
            <div className="space-y-3 mt-auto">
              {[
                "Secure encrypted health data",
                "Works offline — anytime access",
                "AI-powered symptom analysis",
                "Video consultations on any device",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-teal-200" />
                  </div>
                  <span className="text-sm text-teal-50">{item}</span>
                </div>
              ))}
            </div>

            {/* Floating user avatars */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-teal-300","bg-blue-300","bg-violet-300","bg-amber-300","bg-pink-300"].map((c,i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold`}>
                    {["P","D","R","A","S"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-teal-100">+2,400 members joined</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
