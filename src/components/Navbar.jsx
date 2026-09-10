import { useEffect, useState } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle2,
  CalendarDays,
  FileText,
  Megaphone,
  X,
  LogOut,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] = useState([]);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const [notificationError, setNotificationError] =
    useState("");

  const [readNotificationIds, setReadNotificationIds] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "campusconnect_read_notifications"
        );

        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    });

  // =========================================================
  // PROFILE MENU
  // =========================================================

  const [showProfileMenu, setShowProfileMenu] =
    useState(false);

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [searchLoading, setSearchLoading] = useState(false);

  // =========================================================
  // LOAD REAL ANNOUNCEMENTS
  // =========================================================

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        setNotifications([]);
        return;
      }

      try {
        setLoadingNotifications(true);
        setNotificationError("");

        const response = await fetch(
          `${API_URL}/api/announcements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load notifications."
          );
        }

        setNotifications(data.announcements || []);
      } catch (error) {
        console.error(
          "Notification error:",
          error
        );

        setNotificationError(
          "Unable to load notifications."
        );

        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // =========================================================
  // SAVE READ NOTIFICATIONS
  // =========================================================

  useEffect(() => {
    localStorage.setItem(
      "campusconnect_read_notifications",
      JSON.stringify(readNotificationIds)
    );
  }, [readNotificationIds]);

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = notifications.filter(
    (notification) =>
      !readNotificationIds.includes(notification.id)
  ).length;

  // =========================================================
  // MARK ONE NOTIFICATION AS READ
  // =========================================================

  const markAsRead = (id) => {
    setReadNotificationIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });
  };

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================

  const markAllAsRead = () => {
    const ids = notifications.map(
      (notification) => notification.id
    );

    setReadNotificationIds((current) => {
      return Array.from(
        new Set([...current, ...ids])
      );
    });
  };

  // =========================================================
  // FORMAT NOTIFICATION DATE
  // =========================================================

  const formatNotificationTime = (dateValue) => {
    if (!dateValue) {
      return "Not available in the provided document.";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available in the provided document.";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (difference < minute) {
      return "Just now";
    }

    if (difference < hour) {
      const minutes = Math.floor(
        difference / minute
      );

      return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    if (difference < day) {
      const hours = Math.floor(
        difference / hour
      );

      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    if (difference < 7 * day) {
      const days = Math.floor(
        difference / day
      );

      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // NOTIFICATION ICON
  // =========================================================

  const getNotificationIcon = (category) => {
    const value = String(
      category || ""
    ).toLowerCase();

    if (
      value.includes("exam") ||
      value.includes("test")
    ) {
      return <CalendarDays size={18} />;
    }

    if (
      value.includes("assignment") ||
      value.includes("material") ||
      value.includes("study")
    ) {
      return <FileText size={18} />;
    }

    return <Megaphone size={18} />;
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = async (value) => {
    setSearchQuery(value);

    const query = value.trim().toLowerCase();

    // Empty search
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // ---------------------------------------------------------
    // Direct section navigation
    // ---------------------------------------------------------

    const sectionRoutes = {
      course: "/courses",
      courses: "/courses",

      material: "/materials",
      materials: "/materials",

      assignment: "/assignments",
      assignments: "/assignments",

      exam: "/exams",
      exams: "/exams",

      announcement: "/announcements",
      announcements: "/announcements",

      "ai tutor": "/ai-tutor",
      ai: "/ai-tutor",

      profile: "/profile",
      settings: "/settings",
    };

    if (sectionRoutes[query]) {
      setShowSearchResults(false);

      navigate(sectionRoutes[query]);

      return;
    }

    // ---------------------------------------------------------
    // Search official academic subjects
    // ---------------------------------------------------------

    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        setSearchResults([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Search failed."
        );
      }

      const programme = data.programme;

      if (!programme) {
        setSearchResults([]);
        return;
      }

      const results = [];

      // -------------------------------------------------------
      // Search semester + subjects
      // -------------------------------------------------------

      programme.semesters?.forEach(
        (semester) => {
          semester.subjects?.forEach(
            (subject) => {
              const searchableText = `
                ${subject.code || ""}
                ${subject.name || ""}
                ${subject.category || ""}
                Semester ${
                  semester.number || ""
                }
              `.toLowerCase();

              if (
                searchableText.includes(query)
              ) {
                results.push({
                  id: subject.id,
                  code: subject.code,
                  name: subject.name,
                  semester:
                    semester.number,
                  type: "Subject",
                });
              }
            }
          );
        }
      );

      setSearchResults(
        results.slice(0, 8)
      );
    } catch (error) {
      console.error(
        "Search error:",
        error
      );

      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================================================
  // SEARCH ENTER KEY
  // =========================================================

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return;
    }

    // If exactly one result exists,
    // open that subject.
    if (searchResults.length === 1) {
      navigate(
        `/courses/${searchResults[0].id}`
      );

      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);

      return;
    }

    // Direct section navigation
    const sectionRoutes = {
      course: "/courses",
      courses: "/courses",

      material: "/materials",
      materials: "/materials",

      assignment: "/assignments",
      assignments: "/assignments",

      exam: "/exams",
      exams: "/exams",

      announcement: "/announcements",
      announcements: "/announcements",

      "ai tutor": "/ai-tutor",
      ai: "/ai-tutor",

      profile: "/profile",
      settings: "/settings",
    };

    if (sectionRoutes[query]) {
      navigate(sectionRoutes[query]);

      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();

    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowSearchResults(false);

    navigate("/login", {
      replace: true,
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="flex w-96 items-center">
        <div className="relative w-full">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              handleSearch(
                event.target.value
              )
            }
            onKeyDown={
              handleSearchKeyDown
            }
            onFocus={() => {
              if (
                searchQuery.trim()
              ) {
                setShowSearchResults(
                  true
                );
              }
            }}
            placeholder="Search courses, materials, assignments..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* =================================================
              SEARCH RESULTS
          ================================================== */}

          {showSearchResults && (
            <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

              {/* Loading */}
              {searchLoading && (
                <div className="px-4 py-4 text-sm text-slate-500">
                  Searching...
                </div>
              )}

              {/* Results */}
              {!searchLoading &&
                searchResults.length > 0 && (
                  <div className="max-h-80 overflow-y-auto">

                    {searchResults.map(
                      (result) => (
                        <button
                          key={
                            result.id
                          }
                          type="button"
                          onClick={() => {
                            navigate(
                              `/courses/${result.id}`
                            );

                            setSearchQuery(
                              ""
                            );

                            setSearchResults(
                              []
                            );

                            setShowSearchResults(
                              false
                            );
                          }}
                          className="w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-indigo-50"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {
                              result.code
                            }
                          </p>

                          <p className="text-sm text-slate-600">
                            {
                              result.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Semester{" "}
                            {
                              result.semester
                            }{" "}
                            •{" "}
                            {
                              result.type
                            }
                          </p>
                        </button>
                      )
                    )}

                  </div>
                )}

              {/* No Results */}
              {!searchLoading &&
                searchResults.length ===
                  0 && (
                  <div className="px-4 py-5">

                    <p className="text-sm font-medium text-slate-700">
                      No matching academic result
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Not available in the provided document.
                    </p>

                  </div>
                )}

            </div>
          )}

        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="flex items-center gap-5">

        {/* ===================================================
            NOTIFICATIONS
        ==================================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setShowNotifications(
                !showNotifications
              );

              setShowProfileMenu(false);
              setShowSearchResults(false);
            }}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Bell size={21} />

            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

              {/* Notification Header */}

              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-500">
                    {unreadCount} unread
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                  className="rounded p-1 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>

              </div>

              {/* Notification List */}

              <div className="max-h-96 overflow-y-auto">

                {/* Loading */}

                {loadingNotifications && (
                  <div className="px-4 py-8 text-center">

                    <p className="text-sm text-slate-500">
                      Loading notifications...
                    </p>

                  </div>
                )}

                {/* Error */}

                {!loadingNotifications &&
                  notificationError && (
                    <div className="px-4 py-8 text-center">

                      <p className="text-sm text-red-500">
                        {
                          notificationError
                        }
                      </p>

                    </div>
                  )}

                {/* No notifications */}

                {!loadingNotifications &&
                  !notificationError &&
                  notifications.length ===
                    0 && (
                    <div className="px-4 py-8 text-center">

                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Bell size={20} />
                      </div>

                      <p className="text-sm font-medium text-slate-700">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Not available in the provided document.
                      </p>

                    </div>
                  )}

                {/* Real Notifications */}

                {!loadingNotifications &&
                  notifications.map(
                    (notification) => {
                      const isRead =
                        readNotificationIds.includes(
                          notification.id
                        );

                      return (
                        <button
                          key={
                            notification.id
                          }
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          className={`w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${
                            !isRead
                              ? "bg-indigo-50/40"
                              : ""
                          }`}
                        >
                          <div className="flex gap-3">

                            <div className="mt-0.5 text-indigo-600">
                              {getNotificationIcon(
                                notification.category
                              )}
                            </div>

                            <div className="flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p className="text-sm font-medium text-slate-800">
                                  {
                                    notification.title
                                  }
                                </p>

                                {!isRead && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                )}

                              </div>

                              {notification.category && (
                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    notification.category
                                  }
                                </p>
                              )}

                              <p className="mt-1 text-xs text-slate-400">
                                {formatNotificationTime(
                                  notification.publishedAt
                                )}
                              </p>

                            </div>

                          </div>
                        </button>
                      );
                    }
                  )}

              </div>

              {/* Notification Footer */}

              <div className="flex items-center justify-between px-4 py-3">

                <button
                  type="button"
                  onClick={
                    markAllAsRead
                  }
                  disabled={
                    notifications.length ===
                      0 ||
                    unreadCount === 0
                  }
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CheckCircle2
                    size={14}
                  />

                  Mark all as read
                </button>

                <Link
                  to="/announcements"
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  View announcements
                </Link>

              </div>

            </div>
          )}

        </div>

        {/* ===================================================
            PROFILE
        ==================================================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(
                !showProfileMenu
              );

              setShowNotifications(false);
              setShowSearchResults(false);
            }}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50"
          >

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">

              {user?.name
                ? user.name
                    .split(" ")
                    .map(
                      (name) =>
                        name[0]
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "CC"}

            </div>

            {/* User information */}

            <div className="hidden text-left sm:block">

              <p className="text-sm font-semibold text-slate-800">
                {user?.name ||
                  "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role ||
                  "STUDENT"}
              </p>

            </div>

            <ChevronDown
              size={17}
              className="text-slate-400"
            />

          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          {showProfileMenu && (
            <div className="absolute right-0 top-14 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

              <Link
                to="/profile"
                onClick={() =>
                  setShowProfileMenu(
                    false
                  )
                }
                className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                My Profile
              </Link>

              <Link
                to="/settings"
                onClick={() =>
                  setShowProfileMenu(
                    false
                  )
                }
                className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                Settings
              </Link>

              <div className="border-t border-slate-200" />

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut
                  size={17}
                />

                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;