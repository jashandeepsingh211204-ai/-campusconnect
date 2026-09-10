
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Calendar,
  Pin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusconnect_token");

      const response = await fetch(`${API_URL}/api/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load announcements.");
      }

      const data = await response.json();

      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error("Announcements error:", err);
      setError(err.message || "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const importantAnnouncements = useMemo(
    () => announcements.filter((item) => item.important),
    [announcements]
  );

  const latestAnnouncements = useMemo(
    () => announcements.filter((item) => !item.important),
    [announcements]
  );

  const formatDate = (date) => {
    if (!date) {
      return "Not available in the provided document.";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available in the provided document.";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={20} />
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
            <Bell size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Announcements
            </h1>

            <p className="text-gray-500 mt-1">
              Academic notices and important updates
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle size={20} />
            {error}
          </div>

          <button
            onClick={fetchAnnouncements}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Important Updates */}
      {!error && (
        <>
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-red-500" size={20} />

              <h2 className="text-xl font-semibold text-gray-900">
                Important Updates
              </h2>
            </div>

            {importantAnnouncements.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-gray-500">
                  No important announcements available.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Not available in the provided document.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {importantAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    formatDate={formatDate}
                    important
                  />
                ))}
              </div>
            )}
          </section>

          {/* Latest Announcements */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-indigo-600" size={20} />

              <h2 className="text-xl font-semibold text-gray-900">
                Latest Announcements
              </h2>
            </div>

            {latestAnnouncements.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-gray-500">
                  No announcements available.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Not available in the provided document.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {latestAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  formatDate,
  important = false,
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        important
          ? "border-red-200"
          : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {announcement.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                <Pin size={12} />
                Pinned
              </span>
            )}

            {announcement.category && (
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {announcement.category}
              </span>
            )}

            {announcement.important && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                Important
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {announcement.title}
          </h3>

          <p className="mt-2 text-gray-600 whitespace-pre-wrap">
            {announcement.content}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={15} />

            <span>
              {formatDate(announcement.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


