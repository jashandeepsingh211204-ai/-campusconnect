import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useSettings } from "../context/SettingsContext.jsx";

function DashboardLayout({ children }) {
  const { settings } = useSettings();

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        settings.darkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="ml-64 min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;