import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAcademicContent from "./pages/AdminAcademicContent";

import DashboardLayout from "./layouts/DashboardLayout";

import AdminNotices from "./pages/AdminNotices";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import SubjectDetails from "./pages/SubjectDetails";
import StudyMaterials from "./pages/StudyMaterials";
import Assignments from "./pages/Assignments";
import Exams from "./pages/Exams";
import Announcements from "./pages/Announcements";
import AITutor from "./pages/AITutor";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";

import { useAuth } from "./context/AuthContext";

function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            CampusConnect
          </div>

          <p className="mt-2 text-slate-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route
  path="/admin/academic-content"
  element={<AdminAcademicContent />}
/>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/notices" element={<AdminNotices />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Courses */}
        <Route
          path="/courses"
          element={<Courses />}
        />

        <Route
          path="/courses/:id"
          element={<SubjectDetails />}
        />

        {/* Study Materials */}
        <Route
          path="/materials"
          element={<StudyMaterials />}
        />

        {/* Assignments */}
        <Route
          path="/assignments"
          element={<Assignments />}
        />

        {/* Exams */}
        <Route
          path="/exams"
          element={<Exams />}
        />

        {/* Announcements */}
        <Route
          path="/announcements"
          element={<Announcements />}
        />

        {/* AI Tutor */}
        <Route
          path="/ai-tutor"
          element={<AITutor />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* Admin Notice Management */}
        <Route
          path="/admin/notices"
          element={
            <AdminRoute>
              <AdminNotices />
            </AdminRoute>
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route
        path="/login"
        element={<SignIn />}
      />

      {/* Protected application */}
      <Route
        path="/*"
        element={<ProtectedRoutes />}
      />

    </Routes>
  );
}

export default App;