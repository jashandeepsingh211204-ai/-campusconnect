import {
  CalendarDays,
  FileText,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Exams() {
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
          throw new Error("Failed to load examination information.");
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Exams
          </h1>

          <p className="mt-1 text-slate-500">
            View examination information available in the provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading examination information...
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
            Exams
          </h1>

          <p className="mt-1 text-slate-500">
            View examination information available in the provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="font-semibold text-red-900">
            Unable to load examination information.
          </p>

          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const semesters = courses?.semesters || [];

  const subjects = semesters.flatMap((semester) =>
    (semester.subjects || []).map((subject) => ({
      ...subject,
      semesterNumber: semester.number,
    }))
  );

  const subjectsWithExamInfo = subjects.filter(
    (subject) =>
      subject.universityExamMarks != null ||
      subject.internalAssessmentMarks != null ||
      subject.totalMarks != null ||
      subject.exams?.length
  );

  const totalExamMarks = subjectsWithExamInfo.reduce(
    (total, subject) => total + (subject.universityExamMarks || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Exams
        </h1>

        <p className="mt-1 text-slate-500">
          View examination information available in the provided documents.
        </p>
      </div>

      {/* Important Notice */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <CalendarDays size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-blue-900">
              Examination Information
            </h2>

            <p className="mt-1 text-sm leading-6 text-blue-700">
              Examination schedule details such as date, time and venue are
              shown only when they are available in the provided university
              documents.
            </p>
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Subjects
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {subjects.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            In the programme structure
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Exam Schedule
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            Not available
          </p>

          <p className="mt-1 text-sm text-slate-500">
            In the provided document
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            University Exam Marks
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-900">
            {totalExamMarks}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Across listed subjects
          </p>
        </div>

      </div>

      {/* No schedule notice */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FileText size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Examination Schedule
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Not available in the provided document.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Examination dates, times and examination venues will appear here
            when an official examination schedule or notice is added to
            CampusConnect.
          </p>

        </div>
      </div>

      {/* Subject Examination Information */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Subject Examination Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Examination-related information available from the academic
            programme document.
          </p>
        </div>

        {subjectsWithExamInfo.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Not available in the provided document.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {subjectsWithExamInfo.map((subject) => (

              <div
                key={subject.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                {/* Subject Header */}
                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <BookOpen size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Semester {subject.semesterNumber}
                    </p>

                    <h3 className="mt-1 font-bold text-slate-900">
                      {subject.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {subject.code}
                    </p>
                  </div>

                </div>

                {/* Marks */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      University Exam
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {subject.universityExamMarks != null
                        ? `${subject.universityExamMarks} Marks`
                        : "Not available in the provided document."}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Internal Assessment
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {subject.internalAssessmentMarks != null
                        ? `${subject.internalAssessmentMarks} Marks`
                        : "Not available in the provided document."}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Total
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {subject.totalMarks != null
                        ? `${subject.totalMarks} Marks`
                        : "Not available in the provided document."}
                    </p>
                  </div>

                </div>

                {/* Schedule */}
                <div className="mt-4 border-t border-slate-100 pt-4">

                  <p className="text-sm text-slate-500">
                    Examination Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Not available in the provided document.
                  </p>

                  <p className="mt-4 text-sm text-slate-500">
                    Examination Time
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Not available in the provided document.
                  </p>

                  <p className="mt-4 text-sm text-slate-500">
                    Examination Venue
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    Not available in the provided document.
                  </p>

                </div>

              </div>

            ))}

          </div>
        )}
      </div>

    </div>
  );
}

export default Exams;