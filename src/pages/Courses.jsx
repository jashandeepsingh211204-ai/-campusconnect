
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Loader2,
  AlertCircle,
  Building2,
  Clock3,
  Award,
  FileText,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function Courses() {
  const navigate = useNavigate();

  const [programme, setProgramme] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("campusconnect_token");

        if (!token) {
          setError("Authentication token not found.");
          return;
        }

        const response = await fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch courses");
        }

        setProgramme(data.programme);
      } catch (err) {
        console.error("Courses fetch error:", err);
        setError(err.message || "Failed to load academic structure.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleSemester = (semesterNumber) => {
    setExpandedSemester((current) =>
      current === semesterNumber ? null : semesterNumber
    );
  };

  const getCategoryStyle = (category) => {
    if (category === "DSC") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (category === "DSE") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading academic structure...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle
            size={42}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-bold text-red-800">
            Unable to load courses
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <BookOpen
            size={48}
            className="mx-auto text-slate-400"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Programme not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Not available in the provided document.
          </p>
        </div>
      </div>
    );
  }

  const semesters = programme.semesters || [];

  const totalSubjects = semesters.reduce(
    (total, semester) =>
      total + (semester.subjects?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>Academics</span>
          <ChevronRight size={15} />
          <span>Courses</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Course Structure
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Official academic structure based on the provided Panjab University
          programme document.
        </p>
      </div>

      {/* PROGRAMME CARD */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/15 p-3">
                  <GraduationCap size={28} />
                </div>

                <div>
                  <p className="text-sm font-medium text-indigo-100">
  {programme.university?.name ||
    "Not available in the provided document."}
</p>

                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                    {programme.name}
                  </h2>
                </div>
              </div>

              {programme.specialization && (
                <p className="mt-4 text-sm font-medium text-indigo-100">
                  Specialization: {programme.specialization}
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-100">
                Examination
              </p>

              <p className="mt-1 text-lg font-bold">
                {programme.examination ||
                  "Not available in the provided document."}
              </p>
            </div>
          </div>
        </div>

        {/* PROGRAMME INFORMATION */}
        <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <div className="flex items-center gap-3 p-5">
            <div className="rounded-xl bg-indigo-50 p-3">
              <Clock3
                size={20}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Duration
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {programme.duration ||
                  "Not available in the provided document."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <div className="rounded-xl bg-emerald-50 p-3">
              <Award
                size={20}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Credits
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {programme.totalCredits ??
                  "Not available in the provided document."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <div className="rounded-xl bg-blue-50 p-3">
              <Building2
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Mode
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {programme.mode ||
                  "Not available in the provided document."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <div className="rounded-xl bg-purple-50 p-3">
              <BookOpen
                size={20}
                className="text-purple-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Subjects
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {totalSubjects}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SOURCE NOTICE */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <FileText
          size={20}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <div>
          <p className="text-sm font-semibold text-amber-900">
            Source-based academic information
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Course information shown here is based on the provided Panjab
            University programme source. Information not present in that
            source is not invented.
          </p>
        </div>
      </div>

      {/* SEMESTERS */}
      <div className="space-y-4">
        {semesters.map((semester) => {
          const subjects = semester.subjects || [];
          const isExpanded =
            expandedSemester === semester.number;

          return (
            <div
              key={semester.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* SEMESTER HEADER */}
              <button
                type="button"
                onClick={() =>
                  toggleSemester(semester.number)
                }
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                    S{semester.number}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">
                      {semester.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {subjects.length}{" "}
                      {subjects.length === 1
                        ? "subject"
                        : "subjects"}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 rounded-xl bg-slate-100 p-2">
                  {isExpanded ? (
                    <ChevronDown
                      size={20}
                      className="text-slate-600"
                    />
                  ) : (
                    <ChevronRight
                      size={20}
                      className="text-slate-600"
                    />
                  )}
                </div>
              </button>

              {/* SEMESTER CONTENT */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                  {semester.description && (
                    <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                      <p className="text-sm leading-6 text-indigo-900">
                        {semester.description}
                      </p>
                    </div>
                  )}

                  {subjects.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                      <BookOpen
                        size={34}
                        className="mx-auto text-slate-400"
                      />

                      <p className="mt-3 text-sm text-slate-500">
                        Not available in the provided document.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {/* SUBJECT TOP */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                {subject.code}
                              </p>

                              <h4 className="mt-2 text-base font-bold leading-6 text-slate-900">
                                {subject.name}
                              </h4>
                            </div>

                            {subject.category && (
                              <span
                                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${getCategoryStyle(
                                  subject.category
                                )}`}
                              >
                                {subject.category}
                              </span>
                            )}
                          </div>

                          {/* SUBJECT DETAILS */}
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Lectures
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {subject.theoryPracticalLectures ||
                                  "Not available in the provided document."}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Credits
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {subject.credits ??
                                  "Not available in the provided document."}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                University Exam
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {subject.universityExamMarks ??
                                  "Not available in the provided document."}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Internal
                              </p>

                              <p className="mt-1 text-sm font-bold text-slate-800">
                                {subject.internalAssessmentMarks ??
                                  "Not available in the provided document."}
                              </p>
                            </div>
                          </div>

                          {/* TOTAL */}
                          <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-indigo-700">
                                Total Marks
                              </span>

                              <span className="text-sm font-bold text-indigo-900">
                                {subject.totalMarks ??
                                  "Not available in the provided document."}
                              </span>
                            </div>
                          </div>

                          {/* VIEW SUBJECT BUTTON */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/courses/${subject.id}`
                              )
                            }
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
                          >
                            View Subject
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SOURCE FOOTER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <FileText
            size={20}
            className="mt-0.5 shrink-0 text-slate-500"
          />

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Source
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              <p className="mt-1 text-sm leading-6 text-slate-500">
  20260721150825-m.sc.hons.two-yearprogrammecomputerscience(4).pdf
</p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;

