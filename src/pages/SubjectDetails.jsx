
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Calendar,
 Download,
Trash2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projectFile, setProjectFile] = useState(null);
  const [projectLink, setProjectLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [projectUploads, setProjectUploads] = useState([]);
  const [projectUploadsLoading, setProjectUploadsLoading] = useState(false);
  const [projectUploadsError, setProjectUploadsError] = useState("");
  const [deletingUploadId, setDeletingUploadId] =
  useState(null);

  /*
   * These are the project subjects defined by the official
   * academic structure imported into CampusConnect.
   */
  const projectSubjects = [
  "MDS-2605",
  "MDS-2610",
  "MDS-2615",
  "MDS-2616",
];



  const isProjectSubject =
  Boolean(subject?.projects?.length);

  // ---------------------------------------------------------
  // Fetch subject details
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("campusconnect_token");

        const response = await fetch(`${API_URL}/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load subject");
        }

        setSubject(data.subject);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  // ---------------------------------------------------------
  // Fetch student's previous project uploads
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchProjectUploads = async () => {
      if (!subject || !projectSubjects.includes(subject.code)) {
        return;
      }

      try {
        setProjectUploadsLoading(true);
        setProjectUploadsError("");

        const token = localStorage.getItem("campusconnect_token");

        const response = await fetch(
          `${API_URL}/api/project-uploads?subjectId=${subject.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load project submissions."
          );
        }

        setProjectUploads(data.projectUploads || []);
      } catch (err) {
        console.error(err);
        setProjectUploadsError(
          err.message || "Failed to load project submissions."
        );
      } finally {
        setProjectUploadsLoading(false);
      }
    };

    fetchProjectUploads();
  }, [subject]);

  // ---------------------------------------------------------
  // Upload project
  // ---------------------------------------------------------
  const handleProjectUpload = async (event) => {
    event.preventDefault();

    setUploadMessage("");
    setUploadError("");

    if (!projectFile && !projectLink.trim()) {
      setUploadError(
        "Please upload a project file or provide a project link."
      );
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("campusconnect_token");

      const formData = new FormData();

      formData.append("subjectId", subject.id);

      if (projectFile) {
        formData.append("projectFile", projectFile);
      }

      if (projectLink.trim()) {
        formData.append("projectLink", projectLink.trim());
      }

      const response = await fetch(`${API_URL}/api/project-uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadMessage("Project uploaded successfully.");
      setProjectFile(null);
      setProjectLink("");

      const fileInput = document.getElementById("project-file");

      if (fileInput) {
        fileInput.value = "";
      }

      // Add the newly created upload immediately to the list
      if (data.projectUpload) {
        setProjectUploads((previous) => [
          data.projectUpload,
          ...previous,
        ]);
      }
    } catch (err) {
      console.error(err);
      setUploadError(err.message || "Failed to upload project.");
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------
  // Delete project upload
  // ---------------------------------------------------------
  const handleDeleteProjectUpload = async (uploadId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project submission?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUploadId(uploadId);
      setProjectUploadsError("");

      const token = localStorage.getItem(
        "campusconnect_token"
      );

      const response = await fetch(
        `${API_URL}/api/project-uploads/${uploadId}`,
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
            "Failed to delete project submission."
        );
      }

      // Remove the deleted upload from the screen
      setProjectUploads((previous) =>
        previous.filter(
          (item) => item.id !== uploadId
        )
      );
    } catch (err) {
      console.error("Delete project upload error:", err);

      setProjectUploadsError(
        err.message ||
          "Failed to delete project submission."
      );
    } finally {
      setDeletingUploadId(null);
    }
  };

  // ---------------------------------------------------------
  // Format date
  // ---------------------------------------------------------
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not available in the provided document.";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available in the provided document.";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------------------------
  // Format file size
  // ---------------------------------------------------------
  const formatFileSize = (bytes) => {
    if (!bytes) {
      return null;
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-600">
            CampusConnect
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Loading subject...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle size={22} />
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        Subject not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate("/courses")}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
      >
        <ArrowLeft size={18} />
        Back to Courses
      </button>

      {/* Subject Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <BookOpen size={14} />
              {subject.code}
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              {subject.name}
            </h1>

            <p className="mt-2 text-sm text-indigo-100">
              Semester{" "}
{subject.semester?.number ??
  "Not available in the provided document."}
            </p>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
            <div>
              <span className="text-indigo-200">Category:</span>{" "}
              {subject.category ||
                "Not available in the provided document."}
            </div>

            <div className="mt-1">
              <span className="text-indigo-200">Credits:</span>{" "}
              {subject.credits ??
                "Not available in the provided document."}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* PROJECT SUBJECT PAGE                                  */}
      {/* ===================================================== */}

      {isProjectSubject ? (
        <div className="space-y-6">
          {/* Project information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <FileText size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {subject.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Project information and your project submissions.
                </p>
              </div>
            </div>

            {/* Academic information */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                label="University Exam"
                value={
                  subject.universityExamMarks ??
                  "Not available in the provided document."
                }
              />

              <InfoCard
                label="Internal Assessment"
                value={
                  subject.internalAssessmentMarks ??
                  "Not available in the provided document."
                }
              />

              <InfoCard
                label="Total Marks"
                value={
                  subject.totalMarks ??
                  "Not available in the provided document."
                }
              />

              <InfoCard
                label="Credits"
                value={
                  subject.credits ??
                  "Not available in the provided document."
                }
              />
            </div>
          </div>

          {/* Official project information from database */}
          {subject.projects?.length > 0 && (
            <ContentCard title="Project Information">
              <div className="space-y-4">
                {subject.projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                        <FileText size={20} />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">
                          {project.title}
                        </h3>

                        {project.type && (
                          <p className="mt-1 text-sm text-slate-500">
                            Type: {project.type}
                          </p>
                        )}

                        {project.description && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Description
                            </p>

                            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                              {project.description}
                            </p>
                          </div>
                        )}

                        {project.requirements && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Requirements
                            </p>

                            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                              {project.requirements}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
          )}

          {/* Upload section */}
          <form
            onSubmit={handleProjectUpload}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Submit Your Project
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload your project document or project archive, or provide
                a project link.
              </p>
            </div>

            {/* File upload */}
            <label
              htmlFor="project-file"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              <div className="mb-3 rounded-full bg-indigo-100 p-4 text-indigo-600">
                <Upload size={28} />
              </div>

              <p className="font-semibold text-slate-800">
                {projectFile
                  ? projectFile.name
                  : "Choose your project file"}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                PDF, DOC, DOCX, PPT, PPTX or ZIP — maximum 20 MB
              </p>

              <input
                id="project-file"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                onChange={(event) => {
                  setProjectFile(event.target.files?.[0] || null);
                }}
              />
            </label>

            {/* Project link */}
            <div className="mt-6">
              <label
                htmlFor="project-link"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
              >
                <LinkIcon size={17} />
                Project Link
              </label>

              <input
                id="project-link"
                type="url"
                value={projectLink}
                onChange={(event) => setProjectLink(event.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can provide a GitHub, Google Drive, website or other
                project URL.
              </p>
            </div>

            {/* Messages */}
            {uploadMessage && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle size={18} />
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <AlertCircle size={18} />
                {uploadError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={uploading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload size={18} />

              {uploading
                ? "Uploading..."
                : "Upload / Save Project"}
            </button>
          </form>

          {/* ================================================= */}
          {/* PREVIOUS PROJECT SUBMISSIONS                      */}
          {/* ================================================= */}

          <ContentCard title="Your Project Submissions">
            {projectUploadsLoading ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  Loading your project submissions...
                </p>
              </div>
            ) : projectUploadsError ? (
              <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={18} />
                {projectUploadsError}
              </div>
            ) : projectUploads.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <FileText
                  size={30}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-3 font-semibold text-slate-700">
                  No project submission yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Upload your project above to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectUploads.map((uploadItem) => (
                  <div
                    key={uploadItem.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                          <CheckCircle size={20} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {uploadItem.fileName ||
                              "Project link submission"}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} />
                              Uploaded{" "}
                              {formatDate(uploadItem.createdAt)}
                            </span>

                            {uploadItem.fileSize && (
                              <span>
                                {formatFileSize(uploadItem.fileSize)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">

  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
    Submitted
  </span>

  <button
    type="button"
    onClick={() =>
      handleDeleteProjectUpload(uploadItem.id)
    }
    disabled={deletingUploadId === uploadItem.id}
    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <Trash2 size={14} />

    {deletingUploadId === uploadItem.id
      ? "Deleting..."
      : "Delete"}
  </button>

</div>
                    </div>

                    {/* Uploaded file */}
                    {uploadItem.fileUrl && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <FileText size={17} />
                            <span>
                              {uploadItem.fileName ||
                                "Uploaded project file"}
                            </span>
                          </div>

                          <a
                            href={`${API_URL}${uploadItem.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                          >
                            <Download size={15} />
                            Open File
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Project link */}
                    {uploadItem.projectLink && (
                      <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Project Link
                        </p>

                        <a
                          href={uploadItem.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-2 break-all text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink
                            size={16}
                            className="shrink-0"
                          />
                          {uploadItem.projectLink}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ContentCard>
        </div>
      ) : (
        /* ===================================================== */
        /* NORMAL SUBJECT PAGE                                   */
        /* ===================================================== */

        <div className="space-y-6">
          {/* Academic information */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              label="University Exam"
              value={
                subject.universityExamMarks ??
                "Not available in the provided document."
              }
            />

            <InfoCard
              label="Internal Assessment"
              value={
                subject.internalAssessmentMarks ??
                "Not available in the provided document."
              }
            />

            <InfoCard
              label="Total Marks"
              value={
                subject.totalMarks ??
                "Not available in the provided document."
              }
            />

            <InfoCard
              label="Credits"
              value={
                subject.credits ??
                "Not available in the provided document."
              }
            />
          </div>

          {/* Objectives */}
          <ContentCard title="Objectives">
            {subject.objectives ? (
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {subject.objectives}
              </p>
            ) : (
              <EmptyText />
            )}
          </ContentCard>

          {/* Outcomes */}
          <ContentCard title="Outcomes">
            {subject.outcomes ? (
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {subject.outcomes}
              </p>
            ) : (
              <EmptyText />
            )}
          </ContentCard>

          {/* Syllabus */}
          <ContentCard title="Syllabus">
            {subject.syllabusUnits?.length ? (
              <div className="space-y-5">
                {subject.syllabusUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <h3 className="font-bold text-slate-900">
                      Unit {unit.unitNumber}: {unit.title}
                    </h3>

                    {unit.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {unit.description}
                      </p>
                    )}

                    {unit.topics?.length > 0 && (
                      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {unit.topics.map((topic) => (
                          <li key={topic.id}>{topic.topic}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyText />
            )}
          </ContentCard>

          {/* Exam Details */}
          <ContentCard title="Exam Details">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  label="University Exam"
                  value={
                    subject.universityExamMarks != null
                      ? `${subject.universityExamMarks} Marks`
                      : "Not available in the provided document."
                  }
                />

                <InfoCard
                  label="Internal Assessment"
                  value={
                    subject.internalAssessmentMarks != null
                      ? `${subject.internalAssessmentMarks} Marks`
                      : "Not available in the provided document."
                  }
                />

                <InfoCard
                  label="Total Marks"
                  value={
                    subject.totalMarks != null
                      ? `${subject.totalMarks} Marks`
                      : "Not available in the provided document."
                  }
                />

                <InfoCard
                  label="Duration"
                  value="Not available in the provided document."
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900">
                  Examination Information
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Exam Date:
                    </span>{" "}
                    Not available in the provided document.
                  </p>

                  <p>
                    <span className="font-semibold text-slate-800">
                      Exam Time:
                    </span>{" "}
                    Not available in the provided document.
                  </p>

                  {subject.exams?.length > 0 ? (
                    subject.exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="border-t pt-3"
                      >
                        {exam.examType && (
                          <p>
                            <span className="font-semibold text-slate-800">
                              Exam Type:
                            </span>{" "}
                            {exam.examType}
                          </p>
                        )}

                        {exam.duration && (
                          <p>
                            <span className="font-semibold text-slate-800">
                              Duration:
                            </span>{" "}
                            {exam.duration}
                          </p>
                        )}

                        {exam.instructions && (
                          <p className="whitespace-pre-line">
                            <span className="font-semibold text-slate-800">
                              Instructions:
                            </span>{" "}
                            {exam.instructions}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>
                      <span className="font-semibold text-slate-800">
                        Additional Examination Details:
                      </span>{" "}
                      Not available in the provided document.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ContentCard>

          {/* Books */}
          <ContentCard title="Recommended Books">
            {subject.books?.length ? (
              <div className="space-y-3">
                {subject.books.map((book) => (
                  <div
                    key={book.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {book.title}
                    </p>

                    {book.author && (
                      <p className="mt-1 text-sm text-slate-600">
                        {book.author}
                      </p>
                    )}

                    {book.edition && (
                      <p className="text-sm text-slate-500">
                        Edition: {book.edition}
                      </p>
                    )}

                    {book.publisher && (
                      <p className="text-sm text-slate-500">
                        Publisher: {book.publisher}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyText />
            )}
          </ContentCard>

          {/* Source */}
          <ContentCard title="Source Document">
            {subject.sources?.length ? (
              <div className="space-y-3">
                {subject.sources.map((source) => (
                  <div
                    key={source.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {source.name}
                    </p>

                    {source.description && (
                      <p className="mt-1 text-sm text-slate-600">
                        {source.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyText />
            )}
          </ContentCard>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ContentCard({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      {children}
    </section>
  );
}

function EmptyText() {
  return (
    <p className="text-sm text-slate-500">
      Not available in the provided document.
    </p>
  );
}

export default SubjectDetails;

