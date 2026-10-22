import { useEffect, useState } from "react";
import API from "../api/axios";
import { Package, AlertTriangle, XCircle, TrendingDown } from "lucide-react";

function MedicineAnalytics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/admin/medicine-analytics");
        setData(res.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-14 rounded-2xl" />
        <div className="skeleton h-14 rounded-2xl" />
        <div className="skeleton h-14 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-400 text-center py-4">Unable to load analytics.</p>;
  }

  const metrics = [
    {
      icon: Package,
      label: "Total Medicines",
      value: data.totalMedicines || 0,
      color: "from-teal-500 to-emerald-400",
      bg: "bg-teal-50",
      text: "text-teal-700",
    },
    {
      icon: AlertTriangle,
      label: "Low Stock",
      value: data.lowStockCount || 0,
      color: "from-amber-500 to-orange-400",
      bg: "bg-amber-50",
      text: "text-amber-700",
      warn: data.lowStockCount > 0,
    },
    {
      icon: XCircle,
      label: "Out of Stock",
      value: data.outOfStockCount || 0,
      color: "from-rose-500 to-red-400",
      bg: "bg-red-50",
      text: "text-red-700",
      warn: data.outOfStockCount > 0,
    },
  ];

  return (
    <div className="space-y-3">
      {metrics.map(({ icon: Icon, label, value, color, bg, text, warn }) => (
        <div
          key={label}
          className={`flex items-center gap-3 rounded-2xl p-3 border ${warn ? "border-red-100 bg-red-50/50" : "border-slate-100 bg-slate-50/50"}`}
        >
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </div>
          <div className={`text-xl font-black ${warn ? text : "text-slate-900"}`}>
            {value.toLocaleString()}
          </div>
        </div>
      ))}

      {/* Stock health bar */}
      {data.totalMedicines > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-600">Stock health</p>
            <p className="text-xs text-slate-400">
              {Math.round(((data.totalMedicines - data.outOfStockCount) / data.totalMedicines) * 100)}% available
            </p>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${((data.totalMedicines - data.outOfStockCount) / data.totalMedicines) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicineAnalytics;
