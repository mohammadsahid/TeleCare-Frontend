import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#00897b", "#26a69a", "#80cbc4", "#b2dfdb"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-slate-900 mb-1">{label}</p>
        <p className="text-[#00897b] font-black text-lg">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function AdminCharts({ stats }) {
  const data = [
    { name: "Patients",     value: stats.totalPatients     || 0 },
    { name: "Doctors",      value: stats.totalDoctors      || 0 },
    { name: "Appointments", value: stats.totalAppointments || 0 },
    { name: "Records",      value: stats.totalRecords      || 0 },
  ];

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="28%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0faf8", radius: 8 }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AdminCharts;
