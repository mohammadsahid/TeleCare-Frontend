import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-slate-900 mb-1">{label}</p>
        <p className="text-blue-600 font-black text-lg">{payload[0].value} appointments</p>
      </div>
    );
  }
  return null;
};

function DoctorWorkloadChart({ workload }) {
  if (!workload || workload.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-sm text-slate-400">
        No workload data available yet.
      </div>
    );
  }

  const data = workload.map(w => ({
    name: w.doctorName?.split(" ").slice(-1)[0] || "Dr.",
    fullName: w.doctorName,
    value: w.totalAppointments,
  }));

  const BLUES = ["#1565c0","#1976d2","#1e88e5","#42a5f5","#64b5f6","#90caf9"];

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff", radius: 8 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={BLUES[i % BLUES.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DoctorWorkloadChart;
