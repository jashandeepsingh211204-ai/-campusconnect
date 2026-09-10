import {
  ClipboardList,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

function Assignments() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("campusconnect_token");

        const response = await fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load assignments.");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const assignments = useMemo(() => {
    const semesters = courses?.semesters || [];

    return semesters.flatMap((semester) =>
      (semester.subjects || []).flatMap((subject) =>
        (subject.assignments || []).map((assignment) => ({
          ...assignment,
          subjectName: subject.name,
          subjectCode: subject.code,
          semesterNumber: semester.number,
        }))
      )
    );
  }, [courses]);

  const pendingCount = assignments.filter(
    (assignment) =>
      String(assignment.submissionStatus || assignment.status || "")
        .toUpperCase() === "PENDING"
  ).length;

  const submittedCount = assignments.filter(
    (assignment) =>
      String(assignment.submissionStatus || assignment.status || "")
        .toUpperCase() === "SUBMITTED"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assignments
          </h1>

          <p className="mt-1 text-slate-500">
            Track assignments and submission information available in
            the provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading assignments...
          </p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assignments
          </h1>

          <p className="mt-1 text-slate-500">
            Track assignments and submission information available in
            the provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="font-semibold text-red-900">
            Unable to load assignments.
          </p>

          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Assignments
        </h1>

        <p className="mt-1 text-slate-500">
          Track assignments and submission information available in
          the provided documents.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ClipboardList size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Assignments
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {assignments.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Clock size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {pendingCount}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Submitted
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {submittedCount}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Assignment List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">
            All Assignments
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assignments available from official academic documents.
          </p>

        </div>

        {assignments.length === 0 ? (

          <div className="px-6 py-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FileText size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No assignments available
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Not available in the provided document.
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Official assignments will appear here when assignment
              information is added to CampusConnect.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {assignments.map((assignment) => {

              const status = String(
                assignment.submissionStatus ||
                assignment.status ||
                "PENDING"
              ).toUpperCase();

              const isSubmitted = status === "SUBMITTED";

              return (
                <div
                  key={assignment.id}
                  className="px-6 py-5 transition hover:bg-slate-50"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    {/* Assignment Info */}
                    <div className="flex items-start gap-4">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isSubmitted
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {isSubmitted ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <AlertCircle size={22} />
                        )}
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {assignment.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {assignment.subjectName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {assignment.subjectCode}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                          {assignment.dueDate ? (
                            <span className="flex items-center gap-1">
                              <CalendarDays size={14} />

                              {new Date(
                                assignment.dueDate
                              ).toLocaleDateString()}
                            </span>
                          ) : (
                            <span>
                              Deadline: Not available in the provided document.
                            </span>
                          )}

                          {assignment.maxMarks != null && (
                            <span>
                              {assignment.maxMarks} Marks
                            </span>
                          )}

                        </div>

                        {assignment.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            {assignment.description}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isSubmitted
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Assignments;