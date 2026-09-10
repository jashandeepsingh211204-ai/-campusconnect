import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Edit3,
  BookOpen,
  AlertCircle,
  Save,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000";
const NOT_AVAILABLE = "Not available in the provided document.";

function Profile() {
  const [user, setUser] = useState(null);
  const [programme, setProgramme] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("campusconnect_token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, coursesResponse] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!profileResponse.ok) {
        throw new Error("Failed to load profile.");
      }

      const profileData = await profileResponse.json();

      setUser(profileData.user);

      setForm({
        name: profileData.user?.name || "",
        phone: profileData.user?.phone || "",
        location: profileData.user?.location || "",
      });

      if (coursesResponse.ok) {
        const courseData = await coursesResponse.json();
        setProgramme(courseData.programme || null);
      }
    } catch (err) {
      console.error("Profile loading error:", err);
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setUser(data.user);
      setForm({
        name: data.user?.name || "",
        phone: data.user?.phone || "",
        location: data.user?.location || "",
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });

    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-64 mb-6" />
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={22} />
              <p>{error || "Unable to load profile."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const semester = programme?.semesters?.[0];

  const subjects =
    programme?.semesters?.reduce(
      (total, semesterItem) =>
        total + (semesterItem.subjects?.length || 0),
      0
    ) || 0;

  const assignments =
    programme?.semesters?.reduce(
      (total, semesterItem) =>
        total +
        (semesterItem.subjects || []).reduce(
          (subjectTotal, subject) =>
            subjectTotal + (subject.assignments?.length || 0),
          0
        ),
      0
    ) || 0;

  const exams =
    programme?.semesters?.reduce(
      (total, semesterItem) =>
        total +
        (semesterItem.subjects || []).reduce(
          (subjectTotal, subject) =>
            subjectTotal + (subject.exams?.length || 0),
          0
        ),
      0
    ) || 0;

  const profileFields = [
    user.name,
    user.email,
    user.phone,
    user.location,
  ];

  const completedFields = profileFields.filter(
    (field) => field && String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Student Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal and academic information.
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 transition"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-4 text-red-700 dark:text-red-300">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 p-4 text-green-700 dark:text-green-300">
            {success}
          </div>
        )}

        {/* Main profile card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

          {/* Profile banner */}
          <div className="h-28 bg-gradient-to-r from-indigo-600 to-emerald-500" />

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12">

              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-3xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              </div>

              {/* Name */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name || NOT_AVAILABLE}
                </h2>

                <p className="text-slate-500 dark:text-slate-400">
                  Student
                </p>
              </div>
            </div>

            {/* Personal information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="text-indigo-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Email
                  </span>
                </div>

                <p className="font-medium text-slate-900 dark:text-white break-all">
                  {user.email || NOT_AVAILABLE}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={18} className="text-indigo-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Phone
                  </span>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-slate-900 dark:text-white">
                    {user.phone || NOT_AVAILABLE}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin size={18} className="text-indigo-600" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Location
                  </span>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-slate-900 dark:text-white">
                    {user.location || NOT_AVAILABLE}
                  </p>
                )}
              </div>
            </div>

            {/* Name editing */}
            {isEditing && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full md:w-1/2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Academic information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950">
              <GraduationCap
                size={22}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Academic Information
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Information from the official academic source.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <AcademicItem
              label="Programme"
              value={programme?.name}
            />

            <AcademicItem
              label="Degree"
              value={programme?.degree}
            />

            <AcademicItem
              label="Specialization"
              value={programme?.specialization}
            />

            <AcademicItem
              label="Current Semester"
              value={
                semester
                  ? semester.name || `Semester ${semester.number}`
                  : null
              }
            />

            <AcademicItem
              label="Programme Duration"
              value={programme?.duration}
            />

            <AcademicItem
              label="Total Credits"
              value={
                programme?.totalCredits !== undefined &&
                programme?.totalCredits !== null
                  ? programme.totalCredits
                  : null
              }
            />
          </div>
        </div>

        {/* Academic overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <StatCard
            icon={<BookOpen size={22} />}
            label="Subjects"
            value={subjects}
          />

          <StatCard
            icon={<BookOpen size={22} />}
            label="Assignments"
            value={assignments}
          />

          <StatCard
            icon={<GraduationCap size={22} />}
            label="Exams"
            value={exams}
          />
        </div>

        {/* Profile completion */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">

          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Profile Completion
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complete your personal information.
              </p>
            </div>

            <span className="font-bold text-indigo-600">
              {profileCompletion}%
            </span>
          </div>

          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function AcademicItem({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>

      <p className="font-semibold text-slate-900 dark:text-white">
        {value !== undefined && value !== null && value !== ""
          ? value
          : NOT_AVAILABLE}
      </p>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>

        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </span>
      </div>

      <p className="mt-4 text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}

export default Profile;