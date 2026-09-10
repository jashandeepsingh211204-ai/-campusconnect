import { useEffect, useState } from "react";
import {
  Trash2,
  Pin,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

export default function AdminNotices() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    important: false,
    pinned: false,
  });

  const [notices, setNotices] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ---------------------------------------------------------
  // Load existing notices
  // ---------------------------------------------------------
  const fetchNotices = async () => {
    try {
      setLoadingNotices(true);
      setError("");

      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        setError("Please log in first.");
        return;
      }

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
          data.message || "Failed to load notices."
        );
      }

      setNotices(data.announcements || []);
    } catch (err) {
      console.error("Load notices error:", err);
      setError(
        err.message || "Failed to load notices."
      );
    } finally {
      setLoadingNotices(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ---------------------------------------------------------
  // Form changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ---------------------------------------------------------
  // Create notice
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.title.trim() ||
      !form.content.trim()
    ) {
      setError(
        "Title and content are required."
      );
      return;
    }

    const token = localStorage.getItem(
      "campusconnect_token"
    );

    if (!token) {
      setError("Please log in first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/notices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create notice."
        );
      }

      setMessage(
        "Notice created successfully."
      );

      setForm({
        title: "",
        content: "",
        category: "",
        important: false,
        pinned: false,
      });

      // Refresh notice list
      await fetchNotices();
    } catch (err) {
      console.error(
        "Create notice error:",
        err
      );

      setError(
        err.message ||
          "Failed to create notice."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Delete notice
  // ---------------------------------------------------------
  const handleDelete = async (noticeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(noticeId);
      setMessage("");
      setError("");

      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        setError("Please log in first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/notices/${noticeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete notice."
        );
      }

      // Remove deleted notice immediately
      setNotices((previous) =>
        previous.filter(
          (notice) =>
            notice.id !== noticeId
        )
      );

      setMessage(
        "Notice deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete notice error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete notice."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------------------------
  // Date formatter
  // ---------------------------------------------------------
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Notice Management
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Create and manage academic announcements
            and notices for students.
          </p>
        </div>

        {/* ================================================= */}
        {/* CREATE NOTICE                                     */}
        {/* ================================================= */}

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
            Create New Notice
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Notice Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter notice title"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Notice Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Enter notice details"
                rows={7}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Example: Academic, Exam, General"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4 sm:flex-row">

              <label className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="important"
                  checked={form.important}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                Important Update
              </label>

              <label className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="pinned"
                  checked={form.pinned}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                Pin Announcement
              </label>

            </div>

            {/* Messages */}
            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-green-700 dark:bg-green-950 dark:text-green-300">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Notice..."
                : "Create Notice"}
            </button>

          </form>
        </div>

        {/* ================================================= */}
        {/* PREVIOUS NOTICES                                  */}
        {/* ================================================= */}

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Previous Notices
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage notices already published.
              </p>
            </div>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {notices.length} Notices
            </span>
          </div>

          {loadingNotices ? (
            <div className="flex items-center justify-center rounded-xl bg-slate-50 p-8 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Loading notices...
              </div>
            </div>
          ) : notices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No notices found.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create your first notice above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {notice.title}
                        </h3>

                        {notice.important && (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                            Important
                          </span>
                        )}

                        {notice.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            <Pin size={12} />
                            Pinned
                          </span>
                        )}

                      </div>

                      {notice.category && (
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          {notice.category}
                        </p>
                      )}

                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {notice.content}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        Published{" "}
                        {formatDate(
                          notice.publishedAt
                        )}
                      </p>

                    </div>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(notice.id)
                      }
                      disabled={
                        deletingId === notice.id
                      }
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      {deletingId ===
                      notice.id ? (
                        <>
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Delete
                        </>
                      )}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}