import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  CalendarDays,
  Megaphone,
  Bot,
  User,
  Settings,
  LogOut,
  BellRing,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      path: "/courses",
      icon: BookOpen,
    },
    {
      name: "Study Materials",
      path: "/materials",
      icon: FileText,
    },
    {
      name: "Assignments",
      path: "/assignments",
      icon: ClipboardList,
    },
    {
      name: "Exams",
      path: "/exams",
      icon: CalendarDays,
    },
    {
      name: "Announcements",
      path: "/announcements",
      icon: Megaphone,
    },
    {
      name: "AI Tutor",
      path: "/ai-tutor",
      icon: Bot,
    },
  ];

  const handleLogout = () => {
    // Remove CampusConnect authentication token
    localStorage.removeItem("campusconnect_token");

    // Go back to login page
    navigate("/login", { replace: true });

    // Refresh authentication state completely
    window.location.reload();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-24 items-center gap-3 border-b border-slate-200 px-6">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          <BookOpen size={26} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            CampusConnect
          </h1>

          <p className="text-sm text-slate-500">
            Digital Campus
          </p>
        </div>

      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* Admin Navigation */}
        {user?.role === "ADMIN" && (
          <div className="mt-8">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Admin
            </p>

            <nav className="space-y-1">

              <NavLink
                to="/admin/notices"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`
                }
              >
                <BellRing size={21} />
                <span>Notice Management</span>
              </NavLink>

            </nav>

          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 p-4">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`
          }
        >
          <User size={21} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`
          }
        >
          <Settings size={21} />
          <span>Settings</span>
        </NavLink>

        {/* Functional Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={21} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;