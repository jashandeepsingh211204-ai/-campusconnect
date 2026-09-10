import {
  Search,
  FileText,
  Video,
  BookOpen,
  Download,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

function getIcon(type) {
  const normalizedType = String(type || "").toLowerCase();

  if (normalizedType.includes("video")) {
    return <Video size={22} />;
  }

  if (
    normalizedType.includes("note") ||
    normalizedType.includes("book")
  ) {
    return <BookOpen size={22} />;
  }

  return <FileText size={22} />;
}

function getMaterialType(material) {
  if (material.type) {
    return material.type;
  }

  return "Not available in the provided document.";
}

function StudyMaterials() {
  const [courses, setCourses] = useState(null);
  const [search, setSearch] = useState("");
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
          throw new Error("Failed to load study materials.");
        }

        const data = await response.json();
setCourses(data.programme || null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const materials = useMemo(() => {
    const semesters = courses?.semesters || [];

    return semesters.flatMap((semester) =>
      (semester.subjects || []).flatMap((subject) =>
        (subject.materials || []).map((material) => ({
          ...material,
          subjectName: subject.name,
          subjectCode: subject.code,
          semesterNumber: semester.number,
        }))
      )
    );
  }, [courses]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return materials;
    }

    return materials.filter((material) =>
      [
        material.title,
        material.description,
        material.type,
        material.subjectName,
        material.subjectCode,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [materials, search]);

  const pdfCount = materials.filter((material) =>
    String(material.type || "")
      .toLowerCase()
      .includes("pdf")
  ).length;

  const notesCount = materials.filter((material) =>
    String(material.type || "")
      .toLowerCase()
      .includes("note")
  ).length;

  const videoCount = materials.filter((material) =>
    String(material.type || "")
      .toLowerCase()
      .includes("video")
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Study Materials
          </h1>

          <p className="mt-1 text-slate-500">
            Access study materials uploaded for your subjects.
            provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading study materials...
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
            Study Materials
          </h1>

          <p className="mt-1 text-slate-500">
            Access notes, PDFs and other resources available in the
            provided documents.
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="font-semibold text-red-900">
            Unable to load study materials.
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
          Study Materials
        </h1>

        <p className="mt-1 text-slate-500">
          Access notes, PDFs and other resources available in the
          provided documents.
        </p>
      </div>

      {/* Search */}
      <div className="relative">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search study materials..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Total Materials
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {materials.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            PDFs
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {pdfCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Notes
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {notesCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Videos
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {videoCount}
          </p>
        </div>

      </div>

      {/* Materials */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-6 py-5">

          <h2 className="text-lg font-bold text-slate-900">
            Available Materials
          </h2>

          <p className="mt-1 text-sm text-slate-500">
           Materials uploaded for your subjects.
          </p>

        </div>

        {filteredMaterials.length === 0 ? (

          <div className="px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileText size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No study materials available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "No materials match your search."
                : "Not available in the provided document."}
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {filteredMaterials.map((material) => (

              <div
                key={material.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
              >

                {/* Material Information */}
                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {getIcon(material.type)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {material.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                      <span>
                        {material.subjectName}
                      </span>

                      <span>•</span>

                      <span>
                        {getMaterialType(material)}
                      </span>

                      {material.description && (
                        <>
                          <span>•</span>

                          <span>
                            {material.description}
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                </div>

                {/* Download / Open */}
                {material.url ? (

                  <a
                    href={material.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Download size={17} />
                    Open
                  </a>

                ) : (

                  <span className="text-sm text-slate-500">
                    Not available in the provided document.
                  </span>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default StudyMaterials;