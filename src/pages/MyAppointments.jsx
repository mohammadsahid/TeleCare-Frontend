import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, Activity, Calendar, Video, AlertCircle,
  LogOut, User, Clock, Stethoscope, FileText,
  BookOpen, ChevronRight, CheckCircle, XCircle, RefreshCw
} from "lucide-react";

const STATUS_CONFIG = {
  CONFIRMED: { label: "Confirmed",  cls: "badge-green",  icon: CheckCircle,  dot: "bg-emerald-400" },
  CANCELLED: { label: "Cancelled",  cls: "badge-red",    icon: XCircle,      dot: "bg-red-400" },
  PENDING:   { label: "Pending",    cls: "badge-amber",  icon: Clock,        dot: "bg-amber-400" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

function AppointmentCard({ appointment }) {
  const hasVideo = !!appointment.videoStartedAt;
  const cfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.PENDING;

  return (
    <div className={`rc-card animate-fade-up transition-shadow ${hasVideo ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>

      {/* Video alert strip */}
      {hasVideo && (
        <div className="notif-pill mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative pulse-ring h-9 w-9 rounded-2xl bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
                <Video className="h-4 w-4 relative z-10" />
              </div>
              <div>
                <p className="font-bold text-emerald-900 text-sm">Doctor is ready — video call in progress!</p>
                <p className="text-xs text-emerald-700">Click Join Now to enter the consultation</p>
              </div>
            </div>
            <Link
              to={appointment.meetingRoom ? `https://meet.jit.si/${appointment.meetingRoom}` : "#"}
              target="_blank" rel="noreferrer"
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm shrink-0"
            >
              <Video className="h-4 w-4" /> Join Now
            </Link>
          </div>
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Doctor avatar + name */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-lg shrink-0">
            {(appointment.doctor?.name || "D")[0]}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-slate-900">Dr. {appointment.doctor?.name || "Doctor"}</h3>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-sm text-slate-500">{appointment.doctor?.specialty || "General Physician"}</p>
          </div>
        </div>

        {/* View records */}
        <Link to="/records" className="btn-ghost text-sm shrink-0 hidden sm:inline-flex">
          <FileText className="h-3.5 w-3.5" /> Records
        </Link>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          { icon: Calendar, label: "Date",    value: appointment.date || "—" },
          { icon: Clock,    label: "Time",    value: appointment.time || "—" },
          { icon: FileText, label: "Reason",  value: appointment.reason || "General consultation" },
          { icon: Activity, label: "Status",  value: <StatusBadge status={appointment.status} /> },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[#f8fdfc] rounded-2xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="h-3.5 w-3.5 text-[#00897b]" />
              <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/appointments/my");
      setAppointments(data.appointments || []);
    } catch {}
    finally { setLoading(false); }
  };

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
              <Calendar className="h-3.5 w-3.5 text-[#00897b]" /> My Appointments
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

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-up">
          {[
            { label: "Total",     value: appointments.length, color: "from-teal-500 to-emerald-400",   icon: Calendar },
            { label: "Confirmed", value: confirmed,            color: "from-emerald-500 to-green-400",  icon: CheckCircle },
            { label: "Pending",   value: pending,              color: "from-amber-500 to-orange-400",   icon: Clock },
            { label: "Cancelled", value: appointments.length - confirmed - pending, color: "from-rose-500 to-red-400", icon: XCircle },
          ].map(({ label, value, color, icon: Icon }) => (
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
            <p className="section-label mb-0.5">Appointments</p>
            <h2 className="text-xl font-black text-slate-900">Your visits</h2>
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="skeleton h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48" />
                    <div className="skeleton h-3 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4].map(j => <div key={j} className="skeleton h-16 rounded-2xl" />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">No appointments yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">Book a visit with a doctor to see your appointments here.</p>
            <Link to="/book-appointment" className="btn-primary text-sm mt-2">
              <BookOpen className="h-4 w-4" /> Book your first appointment
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map(a => <AppointmentCard key={a._id} appointment={a} />)}
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

export default MyAppointments;
