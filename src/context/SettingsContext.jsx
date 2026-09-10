import { createContext, useContext, useEffect, useState } from "react";

const SETTINGS_KEY = "campusconnect_settings";

const defaultSettings = {
  emailNotifications: true,
  assignmentNotifications: true,
  examNotifications: true,
  announcementNotifications: true,
  weeklySummary: true,
  darkMode: false,
};
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // Load saved settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);

      if (stored) {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      }
    } catch (error) {
      console.error("Failed to load CampusConnect settings:", error);
    }
  }, []);

  // Apply dark mode globally
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );

    document.body.classList.toggle(
      "dark-mode",
      settings.darkMode
    );
  }, [settings.darkMode]);

  const updateSettings = (updates) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        ...updates,
      };

      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(newSettings)
      );

      return newSettings;
    });
  };

  const toggleSetting = (name) => {
    updateSettings({
      [name]: !settings[name],
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
};