import { Outlet, Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaNotesMedical,
  FaPills,
  FaVideo,
  FaHome,
} from "react-icons/fa";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-slate-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">
          Rural HealthCare
        </h2>

        <nav className="space-y-4">
          <Link
            to="/patient"
            className="flex items-center gap-2"
          >
            <FaHome />
            Dashboard
          </Link>

          <Link
            to="/book-appointment"
            className="flex items-center gap-2"
          >
            <FaCalendarCheck />
            Appointments
          </Link>

          <Link
            to="/records"
            className="flex items-center gap-2"
          >
            <FaNotesMedical />
            Health Records
          </Link>

          <Link
            to="/search-medicine"
            className="flex items-center gap-2"
          >
            <FaPills />
            Medicines
          </Link>

          <Link
            to="/video-consultation"
            className="flex items-center gap-2"
          >
            <FaVideo />
            Video Consult
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;