import { useState } from "react";
import {
  Bell,
  Lock,
  Mail,
  Moon,
  Sun,
  Save,
  ShieldCheck,
} from "lucide-react";

import { useSettings } from "../context/SettingsContext.jsx";

function Settings() {
  const { settings, toggleSetting } = useSettings();

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] =
    useState("notifications");

  const handleSave = () => {
    // Settings are already saved automatically by SettingsContext.
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const navItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "email",
      label: "Email Preferences",
      icon: Mail,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: settings.darkMode ? Sun : Moon,
    },
  ];

  return (
    <div
      className={`min-h-screen space-y-6 rounded-2xl p-1 transition-colors ${
        settings.darkMode
          ? "text-slate-100"
          : "text-slate-900"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Settings
        </h1>

        <p
          className={`mt-1 text-sm ${
            settings.darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          Manage your CampusConnect preferences and
          account settings.
        </p>
      </div>

      {/* Success */}
      {saved && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            settings.darkMode
              ? "border-green-800 bg-green-950 text-green-300"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
        >
          <ShieldCheck size={20} />
          Settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Navigation */}
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            settings.darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <p
            className={`mb-3 px-3 text-xs font-semibold uppercase tracking-wider ${
              settings.darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            Settings
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveSection(item.id)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : settings.darkMode
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Notifications */}
          {activeSection === "notifications" && (
            <SettingsCard
              darkMode={settings.darkMode}
              icon={<Bell size={21} />}
              title="Notifications"
              description="Choose which notification preferences you want to keep enabled."
            >
              <div className="space-y-5">
                <ToggleSetting
                  title="Email Notifications"
                  description="Receive important campus updates by email."
                  enabled={settings.emailNotifications}
                  onChange={() =>
                    toggleSetting(
                      "emailNotifications"
                    )
                  }
                  darkMode={settings.darkMode}
                />

                <ToggleSetting
                  title="Assignment Notifications"
                  description="Get reminders about upcoming assignments and deadlines."
                  enabled={
                    settings.assignmentNotifications
                  }
                  onChange={() =>
                    toggleSetting(
                      "assignmentNotifications"
                    )
                  }
                  darkMode={settings.darkMode}
                />

                <ToggleSetting
                  title="Exam Notifications"
                  description="Receive reminders about upcoming examinations."
                  enabled={settings.examNotifications}
                  onChange={() =>
                    toggleSetting(
                      "examNotifications"
                    )
                  }
                  darkMode={settings.darkMode}
                />

                <ToggleSetting
                  title="Announcement Notifications"
                  description="Get notified when new campus announcements are posted."
                  enabled={
                    settings.announcementNotifications
                  }
                  onChange={() =>
                    toggleSetting(
                      "announcementNotifications"
                    )
                  }
                  darkMode={settings.darkMode}
                />

                <ToggleSetting
                  title="Weekly Summary"
                  description="Receive a weekly summary of your academic activity."
                  enabled={settings.weeklySummary}
                  onChange={() =>
                    toggleSetting("weeklySummary")
                  }
                  darkMode={settings.darkMode}
                />
              </div>
            </SettingsCard>
          )}

          {/* Email */}
          {activeSection === "email" && (
            <SettingsCard
              darkMode={settings.darkMode}
              icon={<Mail size={21} />}
              title="Email Preferences"
              description="Manage your email notification preferences."
            >
              <ToggleSetting
                title="Email Notifications"
                description="Receive important campus updates by email."
                enabled={settings.emailNotifications}
                onChange={() =>
                  toggleSetting(
                    "emailNotifications"
                  )
                }
                darkMode={settings.darkMode}
              />

              <p
                className={`mt-5 text-xs ${
                  settings.darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Your preference is stored locally in this
                browser.
              </p>
            </SettingsCard>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <SettingsCard
              darkMode={settings.darkMode}
              icon={
                settings.darkMode ? (
                  <Sun size={21} />
                ) : (
                  <Moon size={21} />
                )
              }
              title="Appearance"
              description="Manage your appearance preference."
            >
              <ToggleSetting
                title={
                  settings.darkMode
                    ? "Light Mode"
                    : "Dark Mode"
                }
                description="Use a dark appearance across CampusConnect."
                enabled={settings.darkMode}
                onChange={() =>
                  toggleSetting("darkMode")
                }
                darkMode={settings.darkMode}
              />

              <p
                className={`mt-4 text-xs ${
                  settings.darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Your preference is stored locally in this
                browser.
              </p>
            </SettingsCard>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <SettingsCard
              darkMode={settings.darkMode}
              icon={<Lock size={21} />}
              title="Security"
              description="Account security settings are managed through CampusConnect authentication."
            >
              <p
                className={`text-sm leading-6 ${
                  settings.darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Password and authentication management is
                not available in the current Settings data.
              </p>
            </SettingsCard>
          )}

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
  darkMode,
}) {
  return (
    <section
      className={`rounded-2xl border p-6 shadow-sm transition-colors ${
        darkMode
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            darkMode
              ? "bg-blue-950 text-blue-400"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {icon}
        </div>

        <div>
          <h2
            className={`font-semibold ${
              darkMode
                ? "text-slate-100"
                : "text-slate-900"
            }`}
          >
            {title}
          </h2>

          <p
            className={`text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function ToggleSetting({
  title,
  description,
  enabled,
  onChange,
  darkMode,
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div>
        <h3
          className={`text-sm font-medium ${
            darkMode
              ? "text-slate-100"
              : "text-slate-900"
          }`}
        >
          {title}
        </h3>

        <p
          className={`mt-1 text-sm ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
          enabled
            ? "bg-blue-600"
            : darkMode
            ? "bg-slate-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;