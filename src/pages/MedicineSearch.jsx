import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Heart, Search, Pill, Phone, Package, Tag,
  LogOut, User, ArrowRight, Building2, AlertCircle
} from "lucide-react";

function MedicineSearch() {
  const [name, setName]         = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleSearch = async () => {
    if (!name.trim()) return;
    setLoading(true); setSearched(false);
    try {
      const { data } = await API.get(`/medicines/search?name=${encodeURIComponent(name)}`);
      setMedicines(data.medicines || []);
    } catch (err) {
      setMedicines([]);
    } finally { setLoading(false); setSearched(true); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

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
              <Search className="h-3.5 w-3.5 text-[#00897b]" /> Medicine Search
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
              <Search className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Medicine Search</h1>
            <p className="text-slate-500 max-w-sm mx-auto">
              Check medicine availability at pharmacies near you before traveling.
            </p>
          </div>

          {/* Search bar */}
          <div className="rc-card mb-6 animate-fade-up delay-100">
            <label className="block text-sm font-bold text-slate-700 mb-3">Search by medicine name</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Paracetamol, Metformin…"
                  className="input-rc pl-11"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !name.trim()}
                className="btn-primary shrink-0"
              >
                {loading ? (
                  <span className="flex gap-1"><span className="loading-dot" /><span className="loading-dot" /><span className="loading-dot" /></span>
                ) : (
                  <><Search className="h-4 w-4" /> Search</>
                )}
              </button>
            </div>

            {searched && (
              <p className="mt-3 text-sm text-slate-500">
                {medicines.length > 0
                  ? <><span className="font-bold text-[#00897b]">{medicines.length}</span> result{medicines.length !== 1 ? "s" : ""} for "<strong>{name}</strong>"</>
                  : <>No medicines found for "<strong>{name}</strong>". Try a different name.</>
                }
              </p>
            )}
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1,2].map(i => (
                <div key={i} className="rc-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="skeleton h-12 w-12 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="skeleton h-4 w-40" />
                      <div className="skeleton h-3 w-28" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="skeleton h-16 rounded-2xl" />
                    <div className="skeleton h-16 rounded-2xl" />
                    <div className="skeleton h-16 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && searched && medicines.length === 0 && (
            <div className="empty-state animate-fade-up">
              <div className="empty-state-icon"><Pill className="h-7 w-7" /></div>
              <h3 className="font-black text-slate-900">No results found</h3>
              <p className="text-slate-500 text-sm max-w-xs">Try a different name or check the medicine finder for reservations.</p>
              <Link to="/medicine-finder" className="btn-primary text-sm mt-2">
                <Pill className="h-4 w-4" /> Go to Medicine Finder
              </Link>
            </div>
          )}

          {/* Results */}
          {!loading && medicines.length > 0 && (
            <div className="space-y-4 animate-fade-up">
              {medicines.map((med, i) => (
                <div key={med._id} className="rc-card animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shrink-0">
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
                      {med.quantity > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { icon: Package, label: "Available",  value: `${med.quantity || 0} units` },
                      { icon: Tag,     label: "Category",   value: med.category || "General" },
                      { icon: Phone,   label: "Phone",      value: med.pharmacy?.phone || "N/A" },
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

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <AlertCircle className="h-3.5 w-3.5 text-[#00897b] shrink-0" />
                    <p className="text-xs text-slate-500">
                      Want to reserve this medicine?{" "}
                      <Link to="/medicine-finder" className="font-bold text-[#00897b] hover:underline">
                        Use the Medicine Finder →
                      </Link>
                    </p>
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

export default MedicineSearch;
