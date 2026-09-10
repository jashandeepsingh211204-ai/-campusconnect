import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  Layers,
  ClipboardList,
  FileText,
  Bell,
  FolderKanban,
  GraduationCap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";
const NOT_AVAILABLE = "Not available in the provided document.";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [programme, setProgramme] = useState(null);
  const [students, setStudents] = useState(null);
  const [notices, setNotices] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusconnect_token");

      const [courseResponse, noticeResponse] = await Promise.all([
        fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/announcements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setProgramme(courseData.programme || null);
      }

      if (noticeResponse.ok) {
        const noticeData = await noticeResponse.json();
        setNotices(noticeData.announcements || []);
      }

      /*
       * Student count will be connected to an admin-only
       * backend endpoint later.
       *
       * We intentionally do NOT invent a student count.
       */
      setStudents(null);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const semesters = programme?.semesters || [];

  const subjects = semesters.reduce(
    (total, semester) => total + (semester.subjects?.length || 0),
    0
  );

  const assignments = semesters.reduce(
    (total, semester) =>
      total +
      (semester.subjects || []).reduce(
        (subjectTotal, subject) =>
          subjectTotal + (subject.assignments?.length || 0),
        0
      ),
    0
  );

  const exams = semesters.reduce(
    (total, semester) =>
      total +
      (semester.subjects || []).reduce(
        (subjectTotal, subject) =>
          subjectTotal + (subject.exams?.length || 0),
        0
      ),
    0
  );

  const projects = semesters.reduce(
    (total, semester) =>
      total +
      (semester.subjects || []).reduce(
        (subjectTotal, subject) =>
          subjectTotal + (subject.projects?.length || 0),
        0
      ),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 size={22} className="animate-spin" />
            Loading admin dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
            CampusConnect Administration
          </p>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage academic information, notices and the CampusConnect
            platform.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Programme */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950">
                  <GraduationCap
                    size={24}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Official Programme
                  </p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {programme?.name || NOT_AVAILABLE}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                {programme?.specialization
                  ? `Specialization in ${programme.specialization}`
                  : NOT_AVAILABLE}
              </p>
            </div>

            <action
              onClick={() => navigate("/admin/notices")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Manage Notices
              <ArrowRight size={18} />
            </action>

          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Users size={22} />}
            label="Students"
            value={
              students !== null
                ? students
                : NOT_AVAILABLE
            }
          />

          <StatCard
            icon={<Layers size={22} />}
            label="Semesters"
            value={semesters.length}
          />

          <StatCard
            icon={<BookOpen size={22} />}
            label="Subjects"
            value={subjects}
          />

          <StatCard
            icon={<Bell size={22} />}
            label="Notices"
            value={notices?.length ?? 0}
          />

        </div>

        {/* Academic statistics */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <StatCard
            icon={<ClipboardList size={22} />}
            label="Assignments"
            value={assignments}
          />

          <StatCard
            icon={<FileText size={22} />}
            label="Exams"
            value={exams}
          />

          <StatCard
            icon={<FolderKanban size={22} />}
            label="Projects"
            value={projects}
          />

        </div>

        {/* Management */}
        <div className="mt-8">

          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Management
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            <ManagementCard
              icon={<Bell size={22} />}
              title="Notice Management"
              description="Create and manage academic announcements and notices."
              button="Manage Notices"
              onClick={() => navigate("/admin/notices")}
            />

            <ManagementCard
              icon={<BookOpen size={22} />}
              title="Academic Content"
              description="Review official programme, semester and subject information."
              button="View Academic Content"
              onClick={() => navigate("/courses")}
            />

            <ManagementCard
              icon={<Users size={22} />}
              title="Student Management"
              description="Student management will be connected to the admin API."
              button="Coming Next"
              disabled
            />

            <ManagementCard
              icon={<FileText size={22} />}
              title="Assignments"
              description="Review assignment information available in the academic database."
              button="View Assignments"
              onClick={() => navigate("/courses")}
            />

            <ManagementCard
              icon={<FolderKanban size={22} />}
              title="Projects"
              description="Review project requirements and project-related academic information."
              button="View Projects"
              onClick={() => navigate("/courses")}
            />

            <ManagementCard
              icon={<GraduationCap size={22} />}
              title="Source Documents"
              description="Academic information must remain traceable to the provided documents."
              button="Source Workflow"
              disabled
            />

          </div>
        </div>

        {/* Recent Notices */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Recent Notices
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest announcements currently available.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/notices")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </button>
          </div>

          {!notices || notices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No notices available.
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create a notice from Notice Management.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.slice(0, 5).map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {notice.title}
                      </h3>

                      {notice.category && (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          {notice.category}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {notice.important && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                          Important
                        </span>
                      )}

                      {notice.pinned && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Pinned
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Source of truth */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/30">

          <h2 className="font-bold text-indigo-900 dark:text-indigo-200">
            Academic Source-of-Truth Policy
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-800 dark:text-indigo-300">
            CampusConnect uses the provided university academic documents
            as the primary source of academic information. Information not
            available in those documents must not be invented.
          </p>

        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between gap-4">

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          {icon}
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>

      </div>
    </div>
  );
}

function ManagementCard({
  icon,
  title,
  description,
  button,
  onClick,
  disabled = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="mb-4 inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <button
        onClick={onClick}
        disabled={disabled}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {button}
        {!disabled && <ArrowRight size={16} />}
      </button>

    </div>
  );
}