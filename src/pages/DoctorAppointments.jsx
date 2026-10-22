import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Heart, CalendarDays, User, ClipboardList, CheckCircle2,
  XCircle, Video, PlusCircle, LogOut, Clock, AlertCircle,
  Stethoscope, FileText, ChevronDown, ChevronUp, Save
} from "lucide-react";

const STATUS = {
  PENDING:   { label: "Pending",   cls: "badge-amber",  dot: "bg-amber-400"  },
  CONFIRMED: { label: "Confirmed", cls: "badge-green",  dot: "bg-emerald-400" },
  CANCELLED: { label: "Cancelled", cls: "badge-red",    dot: "bg-red-400"     },
};

function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.PENDING;
  return <span className={`badge ${cfg.cls}`}><span className={`inline-block h-1.5 w-1.5 rounded-full ${cfg.dot}`} />{cfg.label}</span>;
}

function AppointmentCard({ appointment, onApprove, onReject, onStartVideo, onSelectRecord, selectedId }) {
  const isSelected = selectedId === appointment._id;
  const isPending  = appointment.status === "PENDING";

  return (
    <div className={`rc-card animate-fade-up transition-all duration-300 ${isSelected ? "ring-2 ring-[#00897b] ring-offset-2" : ""}`}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

        {/* Left: patient info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-black text-lg shrink-0">
            {(appointment.patient?.name || "P")[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-black text-slate-900">{appointment.patient?.name || "Unknown patient"}</h3>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-[#00897b]" />{appointment.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#00897b]" />{appointment.time}</span>
            </div>
            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <span className="font-semibold text-slate-900">Reason: </span>{appointment.reason || "General consultation"}
            </p>
            {appointment.notes && (
              <p className="text-xs text-slate-500 mt-2 italic">Notes: {appointment.notes}</p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex flex-wrap lg:flex-col gap-2 lg:items-stretch lg:min-w-[160px]">
          {isPending ? (
            <>
              <button onClick={() => onApprove(appointment._id)}
                className="btn-primary text-sm flex-1 lg:flex-none justify-center">
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button onClick={() => onReject(appointment._id)}
                className="btn-ghost text-sm flex-1 lg:flex-none justify-center border-red-200 text-red-600 hover:bg-red-50">
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onStartVideo(appointment._id)}
                className="btn-primary text-sm justify-center">
                <Video className="h-4 w-4" /> Notify & Start Video
              </button>
              {appointment.meetingRoom && (
                <a href={`https://meet.jit.si/${appointment.meetingRoom}`} target="_blank" rel="noreferrer"
                  className="btn-ghost text-sm justify-center text-[#00897b] border-[#b2dfdb] hover:bg-[#e0f5f1]">
                  <Video className="h-4 w-4" /> Join Video
                </a>
              )}
              <button
                onClick={() => onSelectRecord(isSelected ? null : appointment._id)}
                className={`text-sm justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold border transition-colors ${
                  isSelected
                    ? "bg-[#00897b] text-white border-[#00897b]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                {isSelected ? "Cancel record" : "Add record"}
                {isSelected ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [recordData, setRecordData]     = useState({ diagnosis: "", prescription: "", notes: "" });
  const [selectedId, setSelectedId]     = useState(null);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();
  const recordSectionRef                = useRef(null);

  useEffect(() => { fetchAppointments(); }, []);

  useEffect(() => {
    if (selectedId && recordSectionRef.current) {
      recordSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/doctor/appointments");
      setAppointments(data.appointments || []);
    } catch {} finally { setLoading(false); }
  };

  const approveAppointment = async (id) => {
    try { await API.put(`/doctor/appointments/${id}/approve`); fetchAppointments(); showToast("Appointment approved!"); }
    catch { showToast("Failed to approve.", "error"); }
  };
  const rejectAppointment = async (id) => {
    try { await API.put(`/doctor/appointments/${id}/reject`); fetchAppointments(); showToast("Appointment rejected."); }
    catch { showToast("Failed to reject.", "error"); }
  };
  const startVideoCall = async (id) => {
    try { await API.post(`/doctor/appointments/${id}/start-video`); fetchAppointments(); showToast("Patient notified — video call started!"); }
    catch { showToast("Unable to start video call.", "error"); }
  };
  const createRecord = async () => {
    if (!recordData.diagnosis.trim()) { showToast("Please enter a diagnosis.", "error"); return; }
    setSaving(true);
    try {
      await API.post(`/doctor/appointments/${selectedId}/record`, recordData);
      showToast("Health record created successfully!");
      setSelectedId(null);
      setRecordData({ diagnosis: "", prescription: "", notes: "" });
      fetchAppointments();
    } catch { showToast("Failed to save record.", "error"); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const pending   = appointments.filter(a => a.status === "PENDING").length;
  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;

  return (
    <div className="rc-page">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] animate-slide-in flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-semibold text-sm ${
          toast.type === "error"
            ? "bg-red-600 text-white"
            : "bg-[#00897b] text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="rc-header">
        <div className="rc-container"><div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/doctor" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-black text-slate-900 hidden sm:block">
                Rural<span className="text-[#00897b]">Care+</span>
              </span>
            </Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span>
              <CalendarDays className="h-3.5 w-3.5 text-[#00897b]" /> Appointments
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/doctor" className="btn-ghost text-sm hidden sm:inline-flex">← Dashboard</Link>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <Stethoscope className="h-3.5 w-3.5 text-[#00897b]" />
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-up">
          {[
            { icon: CalendarDays, label: "Total",     value: appointments.length, color: "from-teal-500 to-emerald-400" },
            { icon: Clock,        label: "Pending",   value: pending,             color: "from-amber-500 to-orange-400" },
            { icon: CheckCircle2, label: "Confirmed", value: confirmed,           color: "from-emerald-500 to-green-400" },
            { icon: Video,        label: "Video",     value: appointments.filter(a => a.videoStartedAt).length, color: "from-blue-500 to-cyan-400" },
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

        {/* Pending alert */}
        {pending > 0 && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 animate-fade-up">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>{pending} appointment{pending > 1 ? "s" : ""}</strong> waiting for your approval.
            </p>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-0.5">Patient visits</p>
            <h2 className="text-xl font-black text-slate-900">Manage appointments</h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="rc-card">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48" />
                    <div className="skeleton h-3 w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><CalendarDays className="h-7 w-7" /></div>
            <h3 className="font-black text-slate-900 text-lg">No appointments yet</h3>
            <p className="text-slate-500 text-sm">Appointments from patients will appear here.</p>
          </div>
        )}

        {/* Appointment cards */}
        {!loading && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map(a => (
              <AppointmentCard
                key={a._id}
                appointment={a}
                onApprove={approveAppointment}
                onReject={rejectAppointment}
                onStartVideo={startVideoCall}
                onSelectRecord={(id) => setSelectedId(id)}
                selectedId={selectedId}
              />
            ))}
          </div>
        )}

        {/* Health record form */}
        {selectedId && (
          <div ref={recordSectionRef} className="mt-6 rc-card border-l-4 border-[#00897b] animate-scale-in">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-2xl bg-[#e0f5f1] flex items-center justify-center text-[#00897b] shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Create Health Record</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Save diagnosis and notes for this patient</p>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="btn-ghost text-sm">Cancel</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Diagnosis <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={recordData.diagnosis}
                  onChange={e => setRecordData({ ...recordData, diagnosis: e.target.value })}
                  placeholder="Primary diagnosis"
                  className="input-rc"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prescription</label>
                <input
                  type="text"
                  value={recordData.prescription}
                  onChange={e => setRecordData({ ...recordData, prescription: e.target.value })}
                  placeholder="Medicines prescribed"
                  className="input-rc"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
              <textarea
                rows={3}
                value={recordData.notes}
                onChange={e => setRecordData({ ...recordData, notes: e.target.value })}
                placeholder="Additional clinical notes…"
                className="input-rc resize-none leading-relaxed"
                style={{ borderRadius: "0.875rem" }}
              />
            </div>

            <button onClick={createRecord} disabled={saving} className="btn-primary">
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span> Saving…
                </span>
              ) : (
                <><Save className="h-4 w-4" /> Save Record</>
              )}
            </button>
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

export default DoctorAppointments;
