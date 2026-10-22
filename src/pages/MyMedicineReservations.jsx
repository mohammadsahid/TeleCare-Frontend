import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, Pill, Building2, Package, CheckCircle,
  Clock, XCircle, MessageSquare, LogOut, User,
  ShoppingCart, ArrowRight
} from "lucide-react";

const STATUS_CFG = {
  CONFIRMED: { label: "Confirmed", cls: "badge-green",  icon: CheckCircle, dot: "bg-emerald-400" },
  CANCELLED: { label: "Cancelled", cls: "badge-red",    icon: XCircle,     dot: "bg-red-400"     },
  PENDING:   { label: "Pending",   cls: "badge-amber",  icon: Clock,       dot: "bg-amber-400"   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={`badge ${cfg.cls}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

function MyMedicineReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await API.get("/medicines/my-reservations");
      setReservations(data.reservations || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const confirmed = reservations.filter(r => r.status === "CONFIRMED").length;
  const pending   = reservations.filter(r => r.status === "PENDING").length;

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
              <Pill className="h-3.5 w-3.5 text-[#00897b]" /> My Reservations
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-fade-up">
          {[
            { icon: ShoppingCart, label: "Total",     value: reservations.length, color: "from-teal-500 to-emerald-400" },
            { icon: CheckCircle,  label: "Confirmed", value: confirmed,           color: "from-emerald-500 to-green-400" },
            { icon: Clock,        label: "Pending",   value: pending,             color: "from-amber-500 to-orange-400" },
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
            <p className="section-label mb-0.5">Medicine orders</p>
            <h2 className="text-xl font-black text-slate-900">My reservations</h2>
          </div>
          <Link to="/medicine-finder" className="btn-primary text-sm">
            <Pill className="h-4 w-4" /> Reserve more
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="rc-card">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-12 w-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-36" />
                    <div className="skeleton h-3 w-48" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && reservations.length === 0 && (
          <div className="empty-state animate-fade-up">
            <div className="empty-state-icon"><ShoppingCart className="h-7 w-7" /></div>
            <h3 className="font-black text-slate-900 text-lg">No reservations yet</h3>
            <p className="text-slate-500 text-sm max-w-xs">Search for medicines and reserve them before you travel.</p>
            <Link to="/medicine-finder" className="btn-primary text-sm mt-2">
              <Pill className="h-4 w-4" /> Find medicines
            </Link>
          </div>
        )}

        {/* Cards */}
        {!loading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((r, i) => (
              <div key={r._id} className="rc-card animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white shrink-0">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-black text-slate-900">{r.medicine?.name || "Medicine"}</h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#00897b]" />
                        {r.pharmacy?.name || "Local pharmacy"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-[#00897b]" />
                        Qty: {r.quantity}
                      </span>
                    </div>

                    {r.message && (
                      <div className="flex items-start gap-2 bg-[#f0faf8] rounded-xl px-3 py-2 border border-[#c8eae3] text-xs text-[#00695c]">
                        <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{r.message}</span>
                      </div>
                    )}
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

export default MyMedicineReservations;
