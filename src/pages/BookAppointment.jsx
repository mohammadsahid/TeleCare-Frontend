import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, BookOpen, Calendar, Clock, FileText,
  LogOut, User, CheckCircle, Stethoscope, ChevronRight,
  AlertTriangle, ArrowRight
} from "lucide-react";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor]   = useState("");
  const [date, setDate]       = useState("");
  const [time, setTime]       = useState("");
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const { user, logout }      = useAuth();
  const navigate              = useNavigate();

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await API.get("/doctors");
      setDoctors(data.doctors || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      await API.post("/appointments", { doctor, date, time, reason });
      setSuccess(true);
      setDoctor(""); setDate(""); setTime(""); setReason("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const selectedDoc = doctors.find(d => d._id === doctor);

  // Build tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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
              <BookOpen className="h-3.5 w-3.5 text-[#00897b]" />
              Book Appointment
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
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-400 items-center justify-center text-white mb-4 mx-auto">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Book an Appointment</h1>
            <p className="text-slate-500 max-w-md mx-auto">
              Select a doctor, pick a time, and describe your reason. Takes under a minute.
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8 animate-fade-up delay-100">
            {[
              { n: 1, label: "Pick doctor",  done: !!doctor },
              { n: 2, label: "Date & time",  done: !!(date && time) },
              { n: 3, label: "Reason",       done: !!reason },
            ].map(({ n, label, done }, i, arr) => (
              <div key={n} className="flex items-center gap-2 flex-1">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                  done ? "bg-[#00897b] text-white shadow-md" : "bg-slate-200 text-slate-500"
                }`}>
                  {done ? <CheckCircle className="h-3.5 w-3.5" /> : n}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap ${done ? "text-[#00897b]" : "text-slate-400"}`}>{label}</span>
                {i < arr.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full mx-1 transition-colors duration-300 ${done ? "bg-[#00897b]" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Success banner */}
          {success && (
            <div className="mb-6 animate-scale-in">
              <div className="rc-card border border-emerald-200 bg-emerald-50 text-center py-8">
                <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-emerald-900 mb-2">Appointment booked!</h3>
                <p className="text-emerald-700 text-sm mb-6">
                  Your doctor will review and confirm your appointment shortly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/appointments" className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-sm">
                    View appointments <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={() => setSuccess(false)} className="btn-ghost text-sm">
                    Book another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-fade-up">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up delay-150">

              {/* Doctor select */}
              <div className="rc-card">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  <span className="flex items-center gap-2 mb-3">
                    <Stethoscope className="h-4 w-4 text-[#00897b]" /> Choose your doctor
                  </span>
                </label>
                <select
                  value={doctor}
                  onChange={e => setDoctor(e.target.value)}
                  className="input-rc"
                  required
                >
                  <option value="">Select a doctor…</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name}{doc.specialty ? ` — ${doc.specialty}` : ""}
                    </option>
                  ))}
                </select>

                {/* Selected doctor card */}
                {selectedDoc && (
                  <div className="mt-4 flex items-center gap-3 p-3 bg-[#f0faf8] rounded-2xl border border-[#b2dfdb] animate-fade-up">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {selectedDoc.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Dr. {selectedDoc.name}</p>
                      <p className="text-xs text-slate-500">{selectedDoc.specialty || "General Physician"}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-[#00897b] ml-auto" />
                  </div>
                )}
              </div>

              {/* Date & time */}
              <div className="rc-card">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                  <Calendar className="h-4 w-4 text-[#00897b]" /> Pick a date & time
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label>
                    <input
                      type="date"
                      value={date}
                      min={minDate}
                      onChange={e => setDate(e.target.value)}
                      className="input-rc"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="input-rc"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="rc-card">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#00897b]" /> Reason for visit
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Briefly describe why you need to see the doctor…"
                  className="input-rc resize-none leading-relaxed"
                  style={{ borderRadius: "0.875rem" }}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? (
                  <span className="flex items-center gap-3 justify-center">
                    <span className="flex gap-1">
                      <span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" />
                    </span>
                    Booking…
                  </span>
                ) : (
                  <><BookOpen className="h-5 w-5" /> Confirm Appointment</>
                )}
              </button>
            </form>
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

export default BookAppointment;
