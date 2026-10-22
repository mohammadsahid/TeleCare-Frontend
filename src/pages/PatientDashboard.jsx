import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, BookOpen, FileText, Search, HeartPulse,
  Pill, AlertCircle, Video, Activity, ArrowRight,
  Calendar, ShieldCheck, LogOut, Bell, Sparkles,
  ClipboardList, User
} from "lucide-react";

/* ── Shared header used across patient pages ─────────────────── */
export function PageHeader({ subtitle, backTo, backLabel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="rc-header">
      <div className="rc-container">
        <div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/patient" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Heart className="h-4 w-4 fill-current" />
            </div>
            <span className="text-lg font-black text-slate-900 hidden sm:block">
              Rural<span className="text-[#00897b]">Care+</span>
            </span>
          </Link>
          {subtitle && (
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span>
              {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {backTo && (
            <Link to={backTo} className="btn-ghost text-sm hidden sm:inline-flex">
              ← {backLabel || "Back"}
            </Link>
          )}
          <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
            <User className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user?.name || "Patient"}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="h-9 w-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div></div>
    </header>
  );
}

/* ── Quick-action card ────────────────────────────────────────── */
function QuickCard({ to, icon: Icon, label, desc, gradient, delay }) {
  return (
    <Link
      to={to}
      className="group rc-card card-lift animate-fade-up cursor-pointer"
      style={{ animationDelay: delay }}
    >
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-5 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="font-bold text-slate-900 mb-1">{label}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#00897b] opacity-0 group-hover:opacity-100 transition-opacity">
        Open <ArrowRight className="h-3 w-3 animate-bounce-x" />
      </div>
    </Link>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
function PatientDashboard() {
  const { user } = useAuth();
  const [videoAppointment, setVideoAppointment] = useState(null);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    fetchMyAppointments();
    const interval = setInterval(fetchMyAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const { data } = await API.get("/appointments/my");
      const started = (data.appointments || []).find(a => a.videoStartedAt);
      setVideoAppointment(started || null);
    } catch {}
  };

  const quickActions = [
    { to: "/book-appointment", icon: BookOpen,    label: "Book Appointment",   desc: "Schedule a visit with a doctor in minutes.",         gradient: "from-teal-500 to-emerald-400",  delay: "0.1s" },
    { to: "/appointments",     icon: Calendar,     label: "My Appointments",    desc: "Review upcoming and past visits.",                   gradient: "from-blue-500 to-cyan-400",      delay: "0.15s" },
    { to: "/records",          icon: FileText,     label: "Health Records",     desc: "Prescriptions, diagnoses, and visit notes.",         gradient: "from-violet-500 to-purple-400",  delay: "0.2s" },
    { to: "/search-medicine",  icon: Search,       label: "Search Medicine",    desc: "Find medicine stock at nearby pharmacies.",          gradient: "from-amber-500 to-orange-400",   delay: "0.25s" },
    { to: "/medicine-finder",  icon: Pill,         label: "Medicine Finder",    desc: "Reserve medicines before you travel.",               gradient: "from-rose-500 to-pink-400",      delay: "0.3s" },
    { to: "/symptom-checker",  icon: HeartPulse,   label: "AI Symptom Checker", desc: "Get AI-powered guidance on your symptoms.",         gradient: "from-indigo-500 to-blue-400",    delay: "0.35s" },
  ];

  return (
    <div className="rc-page">
      <PageHeader subtitle="Patient Dashboard" />

      <main className="rc-container py-8">

        {/* ── Video call alert ───────────────────── */}
        {videoAppointment && (
          <div className="mb-8 notif-pill animate-scale-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative pulse-ring h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                  <Video className="h-5 w-5 relative z-10" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 mb-0.5">Your doctor is ready!</p>
                  <p className="text-sm text-emerald-800">
                    Dr. {videoAppointment.doctor?.name || "your doctor"} · {videoAppointment.date} at {videoAppointment.time}
                  </p>
                </div>
              </div>
              <a
                href={videoAppointment.meetingRoom ? `https://meet.jit.si/${videoAppointment.meetingRoom}` : "#"}
                target="_blank" rel="noreferrer"
                className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm shrink-0"
              >
                <Video className="h-4 w-4" /> Join Video Call
              </a>
            </div>
          </div>
        )}

        {/* ── Hero welcome strip ─────────────────── */}
        <div className="relative overflow-hidden rounded-3xl gradient-animated text-white p-8 md:p-10 mb-8 animate-fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm font-medium">{greeting}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                {user?.name || "Healthy Patient"} 👋
              </h2>
              <p className="text-teal-100 max-w-md leading-relaxed">
                Your health dashboard is ready. Book appointments, check symptoms, find medicines — all in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/book-appointment" className="bg-white text-[#00897b] font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-teal-50 transition-colors text-sm shadow-lg">
                <BookOpen className="h-4 w-4" /> Book Appointment
              </Link>
              <Link to="/symptom-checker" className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-white/10 transition-colors text-sm">
                <HeartPulse className="h-4 w-4" /> Check Symptoms
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Calendar,     label: "Appointments",  value: "—", color: "from-teal-500 to-emerald-400" },
            { icon: FileText,     label: "Health Records", value: "—", color: "from-blue-500 to-cyan-400" },
            { icon: Pill,         label: "Reservations",  value: "—", color: "from-violet-500 to-purple-400" },
            { icon: ShieldCheck,  label: "All Secure",    value: "✓",  color: "from-amber-500 to-orange-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card flex items-center gap-4 animate-fade-up">
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick actions grid ─────────────────── */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="section-label mb-0.5">Quick actions</p>
            <h3 className="text-xl font-black text-slate-900">What do you need today?</h3>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map(qa => <QuickCard key={qa.label} {...qa} />)}
        </div>
      </main>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6">
        <div className="rc-container flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-[#00897b] fill-current" />
          <span className="text-sm text-slate-500">RuralCare+ · Smart Healthcare for Rural Communities · © 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default PatientDashboard;
