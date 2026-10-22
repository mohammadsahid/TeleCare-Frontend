import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Stethoscope, ClipboardList, ArrowRight, Heart, HeartPulse,
  Pill, Video, Users, Activity, Calendar, LogOut,
  CheckCircle, AlertCircle, User, Sparkles
} from "lucide-react";

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const quickLinks = [
    { to: "/doctor/appointments", icon: ClipboardList, label: "Appointments",   desc: "Review and approve patient visits",        gradient: "from-teal-500 to-emerald-400" },
    { to: "/symptom-checker",     icon: HeartPulse,    label: "Symptom Checker", desc: "Use AI to help assess patient symptoms",  gradient: "from-blue-500 to-cyan-400" },
    { to: "/medicine-finder",     icon: Pill,          label: "Medicine Finder", desc: "Locate medicines and pharmacy stock",     gradient: "from-violet-500 to-purple-400" },
  ];

  const stats = [
    { icon: Calendar,   label: "Today's Visits",    value: "—", color: "from-teal-500 to-emerald-400" },
    { icon: Users,      label: "Total Patients",     value: "—", color: "from-blue-500 to-cyan-400" },
    { icon: Activity,   label: "Pending Reviews",    value: "—", color: "from-amber-500 to-orange-400" },
    { icon: CheckCircle,label: "Completed Today",    value: "—", color: "from-emerald-500 to-green-400" },
  ];

  return (
    <div className="rc-page">
      {/* Header */}
      <header className="rc-header">
        <div className="rc-container"><div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-black text-slate-900 hidden sm:block">
                Rural<span className="text-[#00897b]">Care+</span>
              </span>
            </Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span> Doctor Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/doctor/appointments" className="btn-ghost text-sm hidden sm:inline-flex">
              <Calendar className="h-4 w-4" /> Appointments
            </Link>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">Dr. {user?.name || "Doctor"}</span>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div></div>
      </header>

      <main className="rc-container py-8">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-3xl gradient-animated text-white p-8 md:p-10 mb-8 animate-fade-up">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm font-medium">{greeting}, Doctor</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Dr. {user?.name || "Healthcare"} 👨‍⚕️
              </h2>
              <p className="text-teal-100 max-w-md leading-relaxed">
                Review appointments, start video consultations, and add health records for your patients.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/doctor/appointments"
                className="bg-white text-[#00897b] font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-teal-50 transition-colors text-sm shadow-lg">
                <ClipboardList className="h-4 w-4" /> View Appointments
              </Link>
              <Link to="/doctor/appointments"
                className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-white/10 transition-colors text-sm">
                <Video className="h-4 w-4" /> Start Video Call
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color }) => (
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

        {/* Priority action */}
        <div className="rc-card mb-6 border-l-4 border-[#00897b] animate-fade-up">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-[#e0f5f1] flex items-center justify-center text-[#00897b] flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 mb-1">Pending appointments need your attention</p>
              <p className="text-sm text-slate-500 mb-4">Review and approve or reject new patient bookings from your appointment center.</p>
              <Link to="/doctor/appointments" className="btn-primary text-sm">
                Go to appointments <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <p className="section-label mb-1">Quick access</p>
        <h3 className="text-xl font-black text-slate-900 mb-5">Doctor tools</h3>

        <div className="grid sm:grid-cols-3 gap-5">
          {quickLinks.map(({ to, icon: Icon, label, desc, gradient }, i) => (
            <Link key={label} to={to}
              className={`group rc-card card-lift animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{label}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#00897b] opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="h-3 w-3 animate-bounce-x" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12 py-6">
        <div className="rc-container flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-[#00897b] fill-current" />
          <span className="text-sm text-slate-500">RuralCare+ · Smart Healthcare for Rural Communities · © 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default DoctorDashboard;
