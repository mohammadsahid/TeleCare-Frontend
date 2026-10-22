import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Heart, CheckCircle2, XCircle, ClipboardList,
  Package, User, Building2, LogOut, Clock,
  AlertCircle, ShoppingCart
} from "lucide-react";

const STATUS_CFG = {
  CONFIRMED: { label: "Confirmed", cls: "badge-green",  icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", cls: "badge-red",    icon: XCircle      },
  PENDING:   { label: "Pending",   cls: "badge-amber",  icon: Clock        },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.PENDING;
  const Icon = cfg.icon;
  return <span className={`badge ${cfg.cls}`}><Icon className="h-3 w-3" />{cfg.label}</span>;
}

function PharmacyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [acting, setActing]             = useState({});
  const [toast, setToast]               = useState(null);
  const { user, logout }                = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => { fetchReservations(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReservations = async () => {
    try {
      const { data } = await API.get("/medicines/reservations");
      setReservations(data.reservations || []);
    } catch {}
    finally { setLoading(false); }
  };

  const act = async (id, action) => {
    setActing(prev => ({ ...prev, [id]: action }));
    try {
      await API.put(`/medicines/reservation/${id}/${action}`);
      showToast(`Reservation ${action === "confirm" ? "confirmed" : "cancelled"}.`);
      fetchReservations();
    } catch { showToast("Action failed. Please try again.", "error"); }
    finally { setActing(prev => ({ ...prev, [id]: null })); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const pending   = reservations.filter(r => r.status === "PENDING").length;
  const confirmed = reservations.filter(r => r.status === "CONFIRMED").length;

  return (
    <div className="rc-page">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] animate-slide-in flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-semibold text-sm ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-[#00897b] text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <header className="rc-header">
        <div className="rc-container"><div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/pharmacy" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <span className="text-lg font-black text-slate-900 hidden sm:block">
                Rural<span className="text-[#00897b]">Care+</span>
              </span>
            </Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span>
              <ClipboardList className="h-3.5 w-3.5 text-[#00897b]" /> Pharmacy Reservations
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/pharmacy" className="btn-ghost text-sm hidden sm:inline-flex">← Dashboard</Link>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user?.name || "Pharmacy"}</span>
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
            { icon: Clock,        label: "Pending",   value: pending,             color: "from-amber-500 to-orange-400" },
            { icon: CheckCircle2, label: "Confirmed", value: confirmed,           color: "from-emerald-500 to-green-400" },
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
              <strong>{pending} reservation{pending > 1 ? "s" : ""}</strong> waiting for your confirmation.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="section-label mb-0.5">Patient orders</p>
            <h2 className="text-xl font-black text-slate-900">Medicine reservations</h2>
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
        {!loading && reservations.length === 0 && (
          <div className="empty-state animate-fade-up">
            <div className="empty-state-icon"><ClipboardList className="h-7 w-7" /></div>
            <h3 className="font-black text-slate-900 text-lg">No reservations yet</h3>
            <p className="text-slate-500 text-sm">Patient medicine reservations will appear here.</p>
          </div>
        )}

        {/* Reservation cards */}
        {!loading && reservations.length > 0 && (
          <div className="space-y-4">
            {reservations.map((r, i) => (
              <div key={r._id} className={`rc-card animate-fade-up ${r.status === "PENDING" ? "ring-1 ring-amber-200" : ""}`}
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white shrink-0">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-slate-900">{r.medicine?.name || "Medicine"}</h3>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#00897b]" />
                          {r.patient?.name || "Patient"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-[#00897b]" />
                          Qty: {r.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {r.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => act(r._id, "confirm")}
                          disabled={!!acting[r._id]}
                          className="btn-primary text-sm"
                        >
                          {acting[r._id] === "confirm"
                            ? <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                            : <><CheckCircle2 className="h-4 w-4" /> Confirm</>
                          }
                        </button>
                        <button
                          onClick={() => act(r._id, "cancel")}
                          disabled={!!acting[r._id]}
                          className="btn-ghost text-sm border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {acting[r._id] === "cancel"
                            ? <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                            : <><XCircle className="h-4 w-4" /> Cancel</>
                          }
                        </button>
                      </>
                    ) : (
                      <div className={`badge text-sm ${r.status === "CONFIRMED" ? "badge-green" : "badge-slate"}`}>
                        {r.status === "CONFIRMED" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                        {r.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
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

export default PharmacyReservations;
