import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import BookAppointment from "./pages/BookAppointment";
import ViewAppointments from "./pages/ViewAppointments";
import MyAppointments from "./pages/MyAppointments";

import DoctorAppointments from "./pages/DoctorAppointments";

import HealthRecords from "./pages/HealthRecords";
import MedicineSearch from "./pages/MedicineSearch";

import SymptomChecker from "./pages/SymptomChecker";

import MedicineFinder from "./pages/MedicineFinder";

import MyMedicineReservations from "./pages/MyMedicineReservations";
import PharmacyReservations from "./pages/PharmacyReservations";

import ProtectedRoute from "./components/ProtectedRoute";
import FloatingSymptomButton from "./components/FloatingSymptomButton";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/symptom-checker"
          element={
            <ProtectedRoute>
              <SymptomChecker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicine-finder"
          element={
            <ProtectedRoute>
              <MedicineFinder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pharmacy"
          element={
            <ProtectedRoute>
              <PharmacyDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <ViewAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        <Route path="/records" element={<HealthRecords />} />

        <Route
          path="/search-medicine"
          element={
            <ProtectedRoute>
              <MedicineSearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyMedicineReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pharmacy-reservations"
          element={
            <ProtectedRoute>
              <PharmacyReservations />
            </ProtectedRoute>
          }
        />
      </Routes>
      <FloatingSymptomButton />
    </BrowserRouter>
  );
}

export default App;
