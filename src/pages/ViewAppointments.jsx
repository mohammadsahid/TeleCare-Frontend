import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, Calendar, Clock, User, Stethoscope,
  FileText, LogOut, CheckCircle, XCircle, Activity,
  BookOpen, Bot, ArrowRight, ChevronRight
} from "lucide-react";

const STATUS_CFG = {
  CONFIRMED: { label: "Confirmed", cls: "badge-green",  icon: CheckCircle },
  CANCELLED: { label: "Cancelled", cls: "badge-red",    icon: XCircle     },
  PENDING:   { label: "Pending",   cls: "badge-amber",  icon: Clock       },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  const Icon = cfg.icon;
  return <span className={`badge ${cfg.cls}`}><Icon className="h-3 w-3" />{cfg.label}</span>;
}

function ViewAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/appointments");
        setAppointments(data.appointments || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;
  const pending   = appointments.filter(a => a.status === "PENDING").length;

  return (
    <div className="rc-page">
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
              <Calendar className="h-3.5 w-3.5 text-[#00897b]" /> All Appointments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user?.name || "User"}</span>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div></div>
      </header>

      <main className="rc-container py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-up">
          {[
            { icon: Calendar,    label: "Total",     value: appointments.length,                         color: "from-teal-500 to-emerald-400" },
            { icon: CheckCircle, label: "Confirmed", value: confirmed,                                   color: "from-emerald-500 to-green-400" },
            { icon: Clock,       label: "Pending",   value: pending,                                     color: "from-amber-500 to-orange-400" },
            { icon: XCircle,     label: "Cancelled", value: appointments.length - confirmed - pending,   color: "from-rose-500 to-red-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card flex items-center gap-3">
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-0.5">Overview</p>
            <h2 className="text-xl font-black text-slate-900">All appointments</h2>
          </div>
          <Link to="/book-appointment" className="btn-primary text-sm">
            <BookOpen className="h-4 w-4" /> Book new
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="rc-card">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2"><div className="skeleton h-4 w-48" /><div className="skeleton h-3 w-64" /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && appointments.length === 0 && (
          <div className="empty-state animate-fade-up">
            <div className="empty-state-icon"><Calendar className="h-7 w-7" /></div>
            <h3 className="font-black text-slate-900 text-lg">No appointments yet</h3>
            <p className="text-slate-500 text-sm">Book a visit with a doctor to get started.</p>
            <Link to="/book-appointment" className="btn-primary text-sm mt-2">
              <BookOpen className="h-4 w-4" /> Book appointment
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((a, i) => (
              <div key={a._id} className="rc-card animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-lg shrink-0">
                      {(a.doctor?.name || "D")[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-slate-900">Dr. {a.doctor?.name || "Doctor"}</h3>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-[#00897b]" />{a.patient?.name || "Patient"}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#00897b]" />{a.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#00897b]" />{a.time}</span>
                      </div>
                      {a.reason && (
                        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                          {a.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI checker prompt */}
                  <div className="flex items-center gap-3 bg-[#f0faf8] rounded-2xl px-4 py-3 border border-[#c8eae3] shrink-0 self-start lg:max-w-[200px]">
                    <Bot className="h-4 w-4 text-[#00897b] shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#00897b]">AI Symptom Check</p>
                      <Link to="/symptom-checker" className="text-xs text-slate-600 flex items-center gap-0.5 mt-0.5 hover:text-[#00897b] transition-colors">
                        Check now <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default ViewAppointments;
