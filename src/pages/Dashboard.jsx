
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  ArrowUpRight,
  Layers,
  Award,
  FileText,
  ClipboardList,
  CheckCircle2,
  Clock3,
  FolderOpen,
  BarChart3,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const NOT_AVAILABLE =
  "Not available in the provided document.";

function InfoCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-600" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
    
  

  const [programme, setProgramme] = useState(null);
  const [progress, setProgress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        setError(
          "Please login to view your academic dashboard."
        );
        setLoading(false);
        setProgressLoading(false);
        return;
      }

      // ============================================
      // FETCH ACADEMIC PROGRAMME
      // ============================================

      try {
        const response = await fetch(
          `${API_URL}/api/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load academic data."
          );
        }

        const data = await response.json();

        setProgramme(data.programme || null);
      } catch (err) {
        console.error("Dashboard academic error:", err);

        setError(
          "Unable to load academic information."
        );
      } finally {
        setLoading(false);
      }

      // ============================================
      // FETCH STUDENT PROGRESS
      // ============================================

      try {
        const response = await fetch(
          `${API_URL}/api/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load student progress."
          );
        }

        const data = await response.json();

        setProgress(data);
      } catch (err) {
        console.error("Dashboard progress error:", err);

        setProgressError(
          "Student progress information is currently unavailable."
        );
      } finally {
        setProgressLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading academic information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">
          {NOT_AVAILABLE}
        </p>
      </div>
    );
  }

  const semesters = programme.semesters || [];

  const totalSubjects = semesters.reduce(
    (total, semester) =>
      total + (semester.subjects?.length || 0),
    0
  );

  const assignmentStats = progress?.assignments || {};

  const projectStats = progress?.projects || {};

  const marksStats = progress?.marks || {};

  return (
    <div className="space-y-6">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <div className="mb-3 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600">
                  Academic Dashboard
                </p>

                <p className="text-xs text-slate-500">
                  Official programme information
                </p>
              </div>

            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {programme.name}
            </h1>

            {programme.specialization && (
              <p className="mt-2 text-base font-medium text-slate-600">
                Specialization in{" "}
                {programme.specialization}
              </p>
            )}

            <p className="mt-2 text-sm text-slate-500">
              {programme.university?.name ||
                NOT_AVAILABLE}
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Browse Courses

            <ArrowUpRight className="h-4 w-4" />
          </button>

        </div>
      </section>

      {/* ========================================== */}
      {/* PROGRAMME INFORMATION */}
      {/* ========================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <InfoCard
          title="Programme Duration"
          value={
            programme.duration || NOT_AVAILABLE
          }
          subtitle="Official programme structure"
          icon={CalendarDays}
        />

        <InfoCard
          title="Semesters"
          value={
            programme.semesters
              ? semesters.length
              : NOT_AVAILABLE
          }
          subtitle="Programme semesters"
          icon={Layers}
        />

        <InfoCard
          title="Total Credits"
          value={
            programme.totalCredits ?? NOT_AVAILABLE
          }
          subtitle="Programme credits"
          icon={Award}
        />

        <InfoCard
          title="Subjects"
          value={totalSubjects}
          subtitle="Available in academic database"
          icon={BookOpen}
        />

      </section>

      {/* ========================================== */}
      {/* STUDENT PROGRESS */}
      {/* ========================================== */}

      <section>

        <div className="mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />

            <h2 className="text-xl font-bold text-slate-900">
              Student Progress
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Your activity based on assignments and
            project submissions.
          </p>
        </div>

        {progressLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading student progress...
            </p>
          </div>
        ) : progressError ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              {progressError}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ActivityCard
                title="Assignments"
                value={
                  assignmentStats.total ?? 0
                }
                subtitle="Student assignment records"
                icon={ClipboardList}
              />

              <ActivityCard
                title="Submitted"
                value={
                  assignmentStats.submitted ?? 0
                }
                subtitle="Submitted assignments"
                icon={CheckCircle2}
              />

              <ActivityCard
                title="Pending"
                value={
                  assignmentStats.pending ?? 0
                }
                subtitle="Pending assignments"
                icon={Clock3}
              />

              <ActivityCard
                title="Project Uploads"
                value={
                  projectStats.totalUploads ?? 0
                }
                subtitle="Your uploaded projects"
                icon={FolderOpen}
              />

            </div>

            {/* Marks information */}

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0">

                  <h3 className="font-semibold text-slate-900">
                    Assignment Marks
                  </h3>

                  {marksStats.totalMarkedAssignments >
                  0 ? (
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs text-slate-500">
                          Marked Assignments
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {
                            marksStats.totalMarkedAssignments
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Total Marks Obtained
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {
                            marksStats.totalMarksObtained
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Average Marks
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {Number(
                            marksStats.averageMarks
                          ).toFixed(2)}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No assignment marks are available
                      yet.
                    </p>
                  )}

                </div>

              </div>

            </div>
          </>
        )}

      </section>

      {/* ========================================== */}
      {/* ACADEMIC SOURCE */}
      {/* ========================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <FileText className="h-5 w-5 text-slate-600" />
          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Academic Information
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              This dashboard displays academic
              information available in the provided
              university programme document.
              Information not available in the provided
              document will not be invented.
            </p>

          </div>

        </div>

      </section>

      {/* ========================================== */}
      {/* RECENT ACTIVITY */}
      {/* ========================================== */}

      {!progressLoading &&
        !progressError &&
        progress && (
          <section className="grid gap-6 lg:grid-cols-2">

            {/* Recent Assignments */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Assignments
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest assignment activity
                  </p>
                </div>

                <ClipboardList className="h-5 w-5 text-blue-600" />

              </div>

              <div className="space-y-3">

                {progress.recentSubmissions?.length ? (
                  progress.recentSubmissions.map(
                    (submission) => (
                      <div
                        key={submission.id}
                        className="rounded-xl border border-slate-100 p-4"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-slate-800">
                              {
                                submission.assignment
                                  ?.title ||
                                NOT_AVAILABLE
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                submission.assignment
                                  ?.subject?.code ||
                                NOT_AVAILABLE
                              }
                            </p>

                          </div>

                          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {submission.status}
                          </span>

                        </div>

                        {submission.marks !== null &&
                          submission.marks !== undefined && (
                            <p className="mt-2 text-xs text-slate-500">
                              Marks:{" "}
                              <span className="font-semibold text-slate-700">
                                {submission.marks}
                              </span>
                            </p>
                          )}

                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    No assignment activity available.
                  </div>
                )}

              </div>
            </div>

            {/* Recent Projects */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Project Uploads
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your latest project submissions
                  </p>
                </div>

                <FolderOpen className="h-5 w-5 text-blue-600" />

              </div>

              <div className="space-y-3">

                {progress.recentProjects?.length ? (
                  progress.recentProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="rounded-xl border border-slate-100 p-4"
                      >

                        <p className="text-sm font-semibold text-slate-800">
                          {project.fileName ||
                            project.projectLink ||
                            NOT_AVAILABLE}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {project.subject?.code ||
                            NOT_AVAILABLE}
                        </p>

                        {project.fileType && (
                          <p className="mt-2 text-xs text-slate-500">
                            Type: {project.fileType}
                          </p>
                        )}

                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    No project uploads available.
                  </div>
                )}

              </div>
            </div>

          </section>
        )}

      {/* ========================================== */}
      {/* SEMESTER OVERVIEW */}
      {/* ========================================== */}

      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold text-slate-900">
            Semester Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Official subjects available for each semester
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {semesters.map((semester) => (
            <div
              key={semester.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              {/* Semester Header */}

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-blue-600">
                    Semester {semester.number}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {semester.name}
                  </h3>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>

              </div>

              {/* Subjects */}

              <div className="space-y-3">

                {semester.subjects?.length ? (
                  semester.subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() =>
                        navigate(
                          `/courses/${subject.id}`
                        )
                      }
                      className="group flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                    >

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                            {subject.code}
                          </span>

                          {subject.category && (
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                              {subject.category}
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {subject.name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

                          {subject.credits != null && (
                            <span>
                              Credits:{" "}
                              {subject.credits}
                            </span>
                          )}

                          {subject.totalMarks != null && (
                            <span>
                              Total Marks:{" "}
                              {subject.totalMarks}
                            </span>
                          )}

                        </div>

                      </div>

                      <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-blue-600" />

                    </button>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    {NOT_AVAILABLE}
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default Dashboard;