import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileText,
  Layers,
  Loader2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const NOT_AVAILABLE = "Not available in the provided document.";

export default function AdminAcademicContent() {
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openSemester, setOpenSemester] = useState(null);

  useEffect(() => {
    loadAcademicContent();
  }, []);

  const loadAcademicContent = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("campusconnect_token");

      const response = await fetch(`${API_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load academic content."
        );
      }

      setProgramme(data.programme || null);
    } catch (err) {
      console.error("Academic content error:", err);
      setError(
        err.message || "Failed to load academic content."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleSemester = (semesterNumber) => {
    setOpenSemester(
      openSemester === semesterNumber
        ? null
        : semesterNumber
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
        <div className="flex justify-center py-32">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2
              size={22}
              className="animate-spin"
            />
            Loading academic content...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 dark:bg-slate-900">
          <p className="text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const semesters = programme?.semesters || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950">
              <GraduationCap
                size={24}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Official Academic Content
              </p>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Academic Content Management
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
            Browse the official programme structure imported
            from the provided university academic document.
          </p>
        </div>

        {/* Programme */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950">
              <BookOpen
                size={22}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Programme
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {programme?.name || NOT_AVAILABLE}
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {programme?.specialization
                  ? `Specialization in ${programme.specialization}`
                  : NOT_AVAILABLE}
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {programme?.university?.name ||
                  "Panjab University"}
              </p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="space-y-4">

          {semesters.map((semester) => {
            const isOpen =
              openSemester === semester.number;

            return (
              <div
                key={semester.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >

                {/* Semester header */}
                <button
                  type="button"
                  onClick={() =>
                    toggleSemester(semester.number)
                  }
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950">
                      <Layers
                        size={22}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Semester {semester.number}
                      </p>

                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {semester.name ||
                          `Semester ${semester.number}`}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {semester.subjects?.length || 0} subjects
                      </p>
                    </div>

                  </div>

                  {isOpen ? (
                    <ChevronDown
                      size={22}
                      className="text-slate-500"
                    />
                  ) : (
                    <ChevronRight
                      size={22}
                      className="text-slate-500"
                    />
                  )}

                </button>

                {/* Subjects */}
                {isOpen && (
                  <div className="border-t border-slate-200 p-5 dark:border-slate-800">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      {(semester.subjects || []).map(
                        (subject) => (
                          <div
                            key={subject.id}
                            className="rounded-xl border border-slate-200 p-5 dark:border-slate-700"
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div>
                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    {subject.code}
                                  </span>

                                  {subject.category && (
                                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                      {subject.category}
                                    </span>
                                  )}

                                </div>

                                <h3 className="mt-3 font-bold text-slate-900 dark:text-white">
                                  {subject.name}
                                </h3>
                              </div>

                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">

                              <Info
                                label="Credits"
                                value={subject.credits}
                              />

                              <Info
                                label="Total Marks"
                                value={
                                  subject.totalMarks
                                }
                              />

                              <Info
                                label="Lectures"
                                value={
                                  subject.lectures
                                }
                              />

                              <Info
                                label="Type"
                                value={
                                  subject.type ||
                                  NOT_AVAILABLE
                                }
                              />

                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">

                              <SmallBadge
                                icon={
                                  <FileText size={14} />
                                }
                                text={`${
                                  subject.syllabusUnits
                                    ?.length || 0
                                } Units`}
                              />

                              <SmallBadge
                                text={`${
                                  subject.exams?.length ||
                                  0
                                } Exams`}
                              />

                              <SmallBadge
                                text={`${
                                  subject.materials
                                    ?.length || 0
                                } Materials`}
                              />

                              <SmallBadge
                                text={`${
                                  subject.books?.length ||
                                  0
                                } Books`}
                              />

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>
            );
          })}

        </div>

        {/* Source policy */}
        <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-900 dark:bg-indigo-950/30">

          <h2 className="font-bold text-indigo-900 dark:text-indigo-200">
            Source-of-Truth
          </h2>

          <p className="mt-2 text-sm leading-6 text-indigo-800 dark:text-indigo-300">
            Academic information shown here is based on the
            provided university programme document. If a value
            is not available in the provided document, CampusConnect
            must display:
          </p>

          <p className="mt-3 font-semibold text-indigo-900 dark:text-indigo-200">
            {NOT_AVAILABLE}
          </p>

        </div>

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? value
          : NOT_AVAILABLE}
      </p>
    </div>
  );
}

function SmallBadge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {icon}
      {text}
    </span>
  );
}