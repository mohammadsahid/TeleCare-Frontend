import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { dbPromise } from "../utils/db";
import {
  Heart, FileText, ShieldCheck, LogOut, User,
  Stethoscope, Pill, StickyNote, Calendar, BookOpen,
  WifiOff, ArrowRight, Activity, ClipboardList
} from "lucide-react";

function RecordCard({ record, index }) {
  const date = new Date(record.createdAt || record.date || Date.now());
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  const gradients = [
    "from-teal-500 to-emerald-400",
    "from-blue-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-amber-500 to-orange-400",
  ];

  return (
    <div className="rc-card animate-fade-up" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white shrink-0`}>
            <ClipboardList className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 text-lg mb-0.5 truncate">
              {record.diagnosis || "Medical Note"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          </div>
        </div>
        <Link to="/book-appointment" className="btn-ghost text-sm shrink-0">
          <BookOpen className="h-3.5 w-3.5" /> Follow-up
        </Link>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {/* Prescription */}
        <div className="bg-[#f8fdfc] rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="h-3.5 w-3.5 text-[#00897b]" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prescription</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{record.prescription || "Not specified"}</p>
        </div>

        {/* Notes */}
        <div className="bg-[#f8fdfc] rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="h-3.5 w-3.5 text-[#00897b]" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor's Notes</span>
          </div>
          <p className="text-sm text-slate-700">{record.notes || "No additional notes."}</p>
        </div>
      </div>
    </div>
  );
}

function HealthRecords() {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [offline, setOffline]   = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get("/health-records/my-records");
      setRecords(data.records || []);
      setOffline(false);
      const db = await dbPromise;
      for (const record of data.records || []) {
        await db.put("records", record);
      }
    } catch {
      setOffline(true);
      const db = await dbPromise;
      const offlineRecords = await db.getAll("records");
      setRecords(offlineRecords || []);
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

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
              <FileText className="h-3.5 w-3.5 text-[#00897b]" /> Health Records
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

        {/* Offline banner */}
        {offline && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 animate-fade-up">
            <WifiOff className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Offline mode.</strong> Showing cached records from your device.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-fade-up">
          {[
            { icon: FileText,    label: "Total Records",  value: records.length, color: "from-teal-500 to-emerald-400" },
            { icon: ShieldCheck, label: "Secure Storage", value: "✓",            color: "from-blue-500 to-cyan-400" },
            { icon: Activity,    label: "Offline Ready",  value: "✓",            color: "from-violet-500 to-purple-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card flex items-center gap-3">
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-0.5">Medical history</p>
            <h2 className="text-xl font-black text-slate-900">Your health records</h2>
          </div>
          <Link to="/book-appointment" className="btn-primary text-sm">
            <BookOpen className="h-4 w-4" /> Book follow-up
          </Link>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="rc-card">
                <div className="flex items-center gap-4 mb-5">
                  <div className="skeleton h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48" />
                    <div className="skeleton h-3 w-24" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="skeleton h-20 rounded-2xl" />
                  <div className="skeleton h-20 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && records.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">No records yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Health records appear after your doctor creates them following a consultation.
            </p>
            <Link to="/book-appointment" className="btn-primary text-sm mt-2">
              <BookOpen className="h-4 w-4" /> Book an appointment
            </Link>
          </div>
        )}

        {/* Records list */}
        {!loading && records.length > 0 && (
          <div className="space-y-4">
            {records.map((r, i) => <RecordCard key={r._id} record={r} index={i} />)}
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

export default HealthRecords;
