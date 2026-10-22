import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import AdminCharts from "../components/AdminCharts";
import DoctorWorkloadChart from "../components/DoctorWorkloadChart";
import MedicineAnalytics from "../components/MedicineAnalytics";
import {
  BarChart3, ShieldCheck, Users, Activity, Heart,
  LogOut, User, TrendingUp, Stethoscope, FileText,
  Pill, ArrowRight, RefreshCw, Sparkles
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [workload, setWorkload] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  useEffect(() => { fetchStats(); fetchWorkload(); }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch {}
  };

  const fetchWorkload = async () => {
    try {
      const { data } = await API.get("/admin/doctor-workload");
      setWorkload(data.workload || []);
    } catch {}
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchWorkload()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!stats) {
    return (
      <div className="rc-page flex items-center justify-center min-h-screen">
        <div className="rc-card text-center p-12">
          <div className="flex gap-1.5 justify-center mb-4">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
          <p className="text-slate-600 font-medium">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    { icon: Users,       label: "Total Patients",     value: stats.totalPatients    || 0, color: "from-teal-500 to-emerald-400",  bg: "bg-teal-50",   text: "text-teal-700",   trend: "+12% this month" },
    { icon: Stethoscope, label: "Total Doctors",      value: stats.totalDoctors     || 0, color: "from-blue-500 to-cyan-400",     bg: "bg-blue-50",   text: "text-blue-700",   trend: "+3 this week" },
    { icon: Activity,    label: "Total Appointments", value: stats.totalAppointments|| 0, color: "from-violet-500 to-purple-400", bg: "bg-violet-50", text: "text-violet-700", trend: "+24 today" },
    { icon: FileText,    label: "Health Records",     value: stats.totalRecords     || 0, color: "from-amber-500 to-orange-400",  bg: "bg-amber-50",  text: "text-amber-700",  trend: "All secure" },
  ];

  return (
    <div className="rc-page">
      {/* Header */}
      <header className="rc-header">
        <div className="rc-container"><div className="rc-header-inner px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-xl bg-[#00897b] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-slate-900 hidden sm:block">
                Rural<span className="text-[#00897b]">Care+</span>
              </span>
            </Link>
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500">
              <span className="text-slate-300">/</span> Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleRefresh}
              className={`btn-ghost text-sm hidden sm:inline-flex ${refreshing ? "opacity-60 pointer-events-none" : ""}`}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin-slow" : ""}`} /> Refresh
            </button>
            <div className="flex items-center gap-2 bg-slate-100 rounded-full pl-3 pr-1 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00897b]" />
              <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user?.name || "Admin"}</span>
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
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-200" />
                <span className="text-teal-100 text-sm font-medium">Platform overview</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">
                Welcome back, {user?.name || "Admin"} 🛡️
              </h2>
              <p className="text-teal-100 max-w-md leading-relaxed">
                Monitor platform health, review analytics, and manage the entire RuralCare+ network.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 shrink-0">
              <TrendingUp className="h-6 w-6 text-teal-200" />
              <div>
                <p className="text-sm text-teal-100">Platform status</p>
                <p className="font-black text-white">All systems live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metricCards.map(({ icon: Icon, label, value, color, bg, text, trend }, i) => (
            <div key={label} className={`stat-card animate-fade-up`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className={`badge ${bg} ${text} text-xs`}>↑</div>
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">{value.toLocaleString()}</p>
              <p className="text-sm text-slate-500 font-medium mb-2">{label}</p>
              <p className={`text-xs font-semibold ${text}`}>{trend}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid xl:grid-cols-[1.6fr_1fr] gap-6 mb-6">
          {/* Platform analytics */}
          <div className="rc-card animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="section-label mb-0.5">Analytics</p>
                <h3 className="text-lg font-black text-slate-900">Platform overview</h3>
              </div>
              <div className="badge badge-teal">
                <BarChart3 className="h-3 w-3" /> Live data
              </div>
            </div>
            <AdminCharts stats={stats} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rc-card animate-fade-up delay-100">
              <div className="mb-4">
                <p className="section-label mb-0.5">Workload</p>
                <h3 className="text-lg font-black text-slate-900">Doctor capacity</h3>
                <p className="text-sm text-slate-500 mt-1">Appointment distribution across doctors</p>
              </div>
              <DoctorWorkloadChart workload={workload} />
            </div>

            <div className="rc-card animate-fade-up delay-200">
              <div className="mb-4">
                <p className="section-label mb-0.5">Inventory</p>
                <h3 className="text-lg font-black text-slate-900">Medicine analytics</h3>
                <p className="text-sm text-slate-500 mt-1">Stock and reservation overview</p>
              </div>
              <MedicineAnalytics />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white mt-4 py-6">
        <div className="rc-container flex items-center justify-center gap-2">
          <Heart className="h-4 w-4 text-[#00897b] fill-current" />
          <span className="text-sm text-slate-500">RuralCare+ Admin · © 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;
