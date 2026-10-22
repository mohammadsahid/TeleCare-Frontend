import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, Search, Pill, Phone, Package, Tag,
  LogOut, User, CheckCircle2, Building2, Minus, Plus,
  ShoppingCart, AlertCircle
} from "lucide-react";

function MedicineFinder() {
  const [search, setSearch]     = useState("");
  const [medicines, setMedicines] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [loading, setLoading]   = useState(false);
  const [reserving, setReserving] = useState({});
  const [reserved, setReserved] = useState({});
  const [searched, setSearched] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const findMedicine = async () => {
    if (!search.trim()) return;
    setLoading(true); setSearched(false);
    try {
      const { data } = await API.get(`/medicines/search?name=${encodeURIComponent(search)}`);
      setMedicines(data.medicines || []);
    } catch { setMedicines([]); }
    finally { setLoading(false); setSearched(true); }
  };

  const adjustQty = (id, delta) => {
    setQuantity(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const reserve = async (id) => {
    setReserving(prev => ({ ...prev, [id]: true }));
    try {
      await API.post("/medicines/reserve", { medicineId: id, quantity: quantity[id] || 1 });
      setReserved(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setReserved(prev => ({ ...prev, [id]: false })), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to reserve medicine.");
    } finally {
      setReserving(prev => ({ ...prev, [id]: false }));
    }
  };

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
              <Pill className="h-3.5 w-3.5 text-[#00897b]" /> Medicine Finder
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
            <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-400 items-center justify-center text-white mb-4 mx-auto">
              <Pill className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Medicine Finder</h1>
            <p className="text-slate-500 max-w-sm mx-auto">
              Search, find, and reserve medicines at nearby pharmacies before you travel.
            </p>
          </div>

          {/* Search */}
          <div className="rc-card mb-6 animate-fade-up delay-100">
            <label className="block text-sm font-bold text-slate-700 mb-3">Search medicine to reserve</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && findMedicine()}
                  placeholder="e.g. Metformin, Amoxicillin…"
                  className="input-rc pl-11"
                />
              </div>
              <button
                onClick={findMedicine}
                disabled={loading || !search.trim()}
                className="btn-primary shrink-0"
              >
                {loading
                  ? <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                  : <><Search className="h-4 w-4" /> Find</>
                }
              </button>
            </div>
            {searched && (
              <p className="mt-3 text-sm text-slate-500">
                {medicines.length > 0
                  ? <><span className="font-bold text-[#00897b]">{medicines.length}</span> result{medicines.length !== 1 ? "s" : ""} found</>
                  : <>No medicines found for "<strong>{search}</strong>".</>
                }
              </p>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1,2].map(i => (
                <div key={i} className="rc-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="skeleton h-12 w-12 rounded-2xl" />
                    <div className="space-y-2 flex-1"><div className="skeleton h-4 w-40" /><div className="skeleton h-3 w-28" /></div>
                  </div>
                  <div className="skeleton h-24 rounded-2xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && medicines.length === 0 && (
            <div className="empty-state animate-fade-up">
              <div className="empty-state-icon"><Pill className="h-7 w-7" /></div>
              <h3 className="font-black text-slate-900">No results</h3>
              <p className="text-slate-500 text-sm">Try a different medicine name or check back later.</p>
            </div>
          )}

          {/* Results */}
          {!loading && medicines.length > 0 && (
            <div className="space-y-4 animate-fade-up">
              {medicines.map((med, i) => (
                <div key={med._id} className="rc-card animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white shrink-0">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 text-lg">{med.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Building2 className="h-3.5 w-3.5" />
                        {med.pharmacy?.name || "Local pharmacy"}
                      </div>
                    </div>
                    <span className={`badge ${med.quantity > 10 ? "badge-green" : med.quantity > 0 ? "badge-amber" : "badge-red"}`}>
                      {med.quantity > 0 ? `${med.quantity} left` : "Out of stock"}
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { icon: Package, label: "Stock",    value: `${med.quantity || 0} units` },
                      { icon: Phone,   label: "Contact",  value: med.pharmacy?.phone || "N/A" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-[#f8fdfc] rounded-2xl p-3 border border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="h-3.5 w-3.5 text-[#00897b]" />
                          <span className="text-xs text-slate-500 font-medium">{label}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reserve row */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-700 shrink-0">Quantity:</span>
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-full px-2 py-1">
                      <button onClick={() => adjustQty(med._id, -1)}
                        className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-black text-slate-900 w-6 text-center tabular-nums">
                        {quantity[med._id] || 1}
                      </span>
                      <button onClick={() => adjustQty(med._id, 1)}
                        className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => reserve(med._id)}
                      disabled={reserving[med._id] || reserved[med._id] || med.quantity === 0}
                      className={`btn-primary text-sm ml-auto transition-all duration-300 ${reserved[med._id] ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                    >
                      {reserved[med._id] ? (
                        <><CheckCircle2 className="h-4 w-4" /> Reserved!</>
                      ) : reserving[med._id] ? (
                        <span className="flex items-center gap-2">
                          <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span> Reserving…
                        </span>
                      ) : (
                        <><ShoppingCart className="h-4 w-4" /> Reserve</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

export default MedicineFinder;
