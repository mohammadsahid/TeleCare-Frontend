import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addMedicine } from "../services/medicineService";
import {
  Pill, ClipboardList, CheckCircle2, ArrowRight, Heart,
  LogOut, User, Package, TrendingUp, Plus, Search,
  AlertTriangle, ShoppingBag, Sparkles
} from "lucide-react";

function PharmacyDashboard() {
  const [name, setName]           = useState("");
  const [quantity, setQuantity]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const { user, logout }          = useAuth();
  const navigate                  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(false); setLoading(true);
    try {
      await addMedicine({ name, quantity });
      setSuccess(true);
      setName(""); setQuantity("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Unable to add medicine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const quickLinks = [
    { to: "/pharmacy-reservations", icon: ClipboardList, label: "Reservations",    desc: "Review and confirm patient orders",          gradient: "from-teal-500 to-emerald-400" },
    { to: "/medicine-finder",       icon: Search,        label: "Medicine Finder",  desc: "Search stock across all pharmacies",         gradient: "from-blue-500 to-cyan-400" },
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
              <span className="text-slate-300">/</span> Pharmacy Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/pharmacy-reservations" className="btn-ghost text-sm hidden sm:inline-flex">
              <ClipboardList className="h-4 w-4" /> Reservations
            </Link>
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

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl gradient-animated text-white p-8 md:p-10 mb-8 animate-fade-up">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm font-medium">Pharmacy management</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Welcome, {user?.name || "Pharmacy"} 💊
              </h2>
              <p className="text-teal-100 max-w-md leading-relaxed">
                Manage your medicine inventory, handle patient reservations, and keep your pharmacy running smoothly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/pharmacy-reservations"
                className="bg-white text-[#00897b] font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-teal-50 transition-colors text-sm shadow-lg">
                <ClipboardList className="h-4 w-4" /> View Reservations
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package,      label: "Total Stock",      value: "—", color: "from-teal-500 to-emerald-400" },
            { icon: ShoppingBag,  label: "Pending Orders",   value: "—", color: "from-blue-500 to-cyan-400" },
            { icon: CheckCircle2, label: "Confirmed Today",  value: "—", color: "from-violet-500 to-purple-400" },
            { icon: AlertTriangle,label: "Low Stock Items",  value: "—", color: "from-amber-500 to-orange-400" },
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

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {quickLinks.map(({ to, icon: Icon, label, desc, gradient }, i) => (
            <Link key={label} to={to}
              className="group rc-card card-lift animate-fade-up"
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

        {/* Add medicine form */}
        <div className="rc-card animate-fade-up delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-[#e0f5f1] flex items-center justify-center text-[#00897b]">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Add new medicine</h3>
              <p className="text-sm text-slate-500">Update your pharmacy inventory</p>
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 animate-fade-up">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">Medicine added to inventory successfully!</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-fade-up">
              <span className="text-red-500 mt-0.5">⚠</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Medicine name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                className="input-rc"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 100"
                className="input-rc"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                  Adding…
                </span>
              ) : (
                <><Plus className="h-4 w-4" /> Add Medicine</>
              )}
            </button>
          </form>
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

export default PharmacyDashboard;
