/**
 * Profile Page
 * Handles BOTH:
 *   /profile        → My own profile (editable)
 *   /users/:id      → Another user's public profile (read-only)
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserById,
  updateMyProfile,
  getUserActivity,
} from "../services/user.service.js";
import EventCard from "../components/events/EventCard.jsx";
import StarRating from "../components/common/StarRating.jsx";
import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Tangier", "Fes",
  "Agadir", "Meknes", "Oujda", "Tetouan", "Other",
];

function Profile() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refresh } = useAuth();

  const profileId = paramId || currentUser?._id;
  const isMyProfile = !paramId || paramId === currentUser?._id;

  // ── State ──────────────────────────────────────────────────────────────────
  const [profile, setProfile]       = useState(null);
  const [activity, setActivity]     = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [activeTab, setActiveTab]   = useState("events");

  // Edit mode
  const [isEditing, setIsEditing]             = useState(false);
  const [editData, setEditData]               = useState({});
  const [editError, setEditError]             = useState("");
  const [isSaving, setIsSaving]               = useState(false);
  const [saveMessage, setSaveMessage]         = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Avatar upload
  const [avatarFile, setAvatarFile]       = useState(null);   // File object
  const [avatarPreview, setAvatarPreview] = useState("");     // object URL for preview
  const fileInputRef = useRef(null);

  // ── Load profile + activity ────────────────────────────────────────────────
  useEffect(() => {
    if (!profileId) return;
    setIsLoading(true);
    setError(null);

    Promise.all([getUserById(profileId), getUserActivity(profileId)])
      .then(([profileRes, activityRes]) => {
        setProfile(profileRes.data.user);
        setActivity(activityRes.data);
        setEditData({
          name:            profileRes.data.user.name || "",
          bio:             profileRes.data.user.bio  || "",
          city:            profileRes.data.user.city || "",
          currentPassword: "",
          newPassword:     "",
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Profile not found");
        setIsLoading(false);
      });
  }, [profileId]);

  // Default tab based on role
  useEffect(() => {
    if (profile?.role === "host" || profile?.role === "admin") {
      setActiveTab("events");
    } else {
      setActiveTab("rsvps");
    }
  }, [profile?.role]);

  // Revoke object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // ── Avatar file picker ─────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setEditError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditError("Image must be smaller than 5 MB.");
      return;
    }

    // Revoke previous object URL
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setEditError("");
  };

  const handleRemoveAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setEditError("");
    setSaveMessage("");
    setIsSaving(true);

    try {
      // Use FormData so we can send the file + text fields together
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio",  editData.bio);
      formData.append("city", editData.city);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (showPasswordChange && editData.newPassword) {
        formData.append("currentPassword", editData.currentPassword);
        formData.append("newPassword",     editData.newPassword);
      }

      const res = await updateMyProfile(formData);
      setProfile(res.data.user);
      setSaveMessage(res.message || "Profile updated! ✨");
      setIsEditing(false);
      setShowPasswordChange(false);
      setAvatarFile(null);
      setAvatarPreview("");
      setEditData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));

      if (refresh) refresh();
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin"></div>
          <p className="font-mono text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            User not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/home"
            className="px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-red transition-all"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const stats  = activity?.stats || {};
  const isHost = profile.role === "host" || profile.role === "admin";

  // The avatar shown in the edit preview: new upload > existing profile avatar
  const editAvatarSrc = avatarPreview || profile.avatar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">

      <BubblesBg variant="warm" subtle />

      {/* ── Frosted Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Back
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700"></div>
          <BrandLogo size="sm" to="/home" />
        </div>
        <ThemeToggle />
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">

        {/* ── Cover Banner ── */}
        <div className="relative h-40 md:h-56 rounded-3xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow overflow-hidden mb-0 shadow-md">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
        </div>

        {/* ── Profile Header Card ── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm -mt-12 relative z-10 mb-6">
          <div className="px-6 md:px-8 pb-6 pt-2">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">

              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-white text-4xl font-display font-extrabold border-4 border-white dark:border-slate-800 shadow-md">
                    {profile.name?.[0]}
                  </div>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 mt-2 md:mt-12">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white tracking-tight">
                    {profile.name}
                  </h1>
                  {profile.isVerified && (
                    <span className="px-2 py-0.5 bg-outdar-sky/10 text-outdar-sky text-xs font-bold rounded-full">
                      ✓ Verified
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize ${
                    profile.role === "admin" ? "bg-outdar-red/10 text-outdar-red" :
                    profile.role === "host"  ? "bg-outdar-orange/10 text-outdar-orange" :
                    "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {profile.role === "host" ? "🎤 Host" : profile.role === "admin" ? "🛡️ Admin" : "🌍 Discoverer"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>📍 {profile.city}</span>
                  <span>·</span>
                  <span>
                    Joined{" "}
                    {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                      month: "short", year: "numeric",
                    })}
                  </span>
                </div>
                {profile.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Edit button */}
              {isMyProfile && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="md:mt-12 px-5 py-2.5 bg-outdar-red text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all whitespace-nowrap"
                >
                  ✏️ Edit profile
                </button>
              )}
            </div>

            {saveMessage && (
              <div className="mt-4 p-3 bg-outdar-green/10 border border-outdar-green/30 text-outdar-green rounded-xl text-sm font-medium animate-fade-in">
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        {/* ── EDIT MODE ─────────────────────────────────────────────────────── */}
        {isMyProfile && isEditing && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 mb-6 animate-slide-up">
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
              ✏️ Edit your profile
            </h2>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2">
                <span>⚠️</span>
                <span>{editError}</span>
              </div>
            )}

            <div className="space-y-4">

              {/* ── Avatar upload ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Profile photo
                </label>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {editAvatarSrc ? (
                      <img
                        src={editAvatarSrc}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200 dark:border-slate-600 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-white text-2xl font-display font-extrabold border-2 border-gray-200 dark:border-slate-600">
                        {profile.name?.[0]}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2">
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-outdar-red text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all"
                    >
                      📷 {editAvatarSrc ? "Change photo" : "Upload photo"}
                    </button>

                    {avatarFile && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold hover:border-red-300 hover:text-outdar-red transition-all"
                      >
                        ✕ Remove
                      </button>
                    )}

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      JPG, PNG, WebP · max 5 MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  maxLength={50}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 transition-all"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  maxLength={200}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{editData.bio?.length || 0}/200</p>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">City</label>
                <select
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 transition-all appearance-none cursor-pointer"
                >
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Password change toggle */}
              <div>
                {!showPasswordChange ? (
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(true)}
                    className="text-sm text-outdar-red font-semibold hover:underline"
                  >
                    🔐 Change password
                  </button>
                ) : (
                  <div className="p-4 bg-outdar-red/5 border border-outdar-red/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        🔐 Change password
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordChange(false);
                          setEditData((p) => ({ ...p, currentPassword: "", newPassword: "" }));
                        }}
                        className="text-xs text-gray-400 hover:text-outdar-red"
                      >
                        Cancel
                      </button>
                    </div>
                    <input
                      type="password"
                      value={editData.currentPassword}
                      onChange={(e) => setEditData({ ...editData, currentPassword: e.target.value })}
                      placeholder="Current password"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-outdar-red"
                    />
                    <input
                      type="password"
                      value={editData.newPassword}
                      onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })}
                      placeholder="New password (min 8 chars)"
                      minLength={8}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-outdar-red"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-red transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    "✨ Save changes"
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowPasswordChange(false);
                    setEditError("");
                    handleRemoveAvatar();
                  }}
                  disabled={isSaving}
                  className="px-5 py-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:border-outdar-red hover:text-outdar-red transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {isHost && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 transition-all">
              <p className="text-2xl">🎤</p>
              <p className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mt-1">{stats.totalHosted || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Events hosted</p>
            </div>
          )}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 transition-all">
            <p className="text-2xl">🎟️</p>
            <p className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mt-1">{stats.totalUpcoming || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming RSVPs</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 transition-all">
            <p className="text-2xl">📅</p>
            <p className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mt-1">{stats.totalPast || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Past attended</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 hover:-translate-y-0.5 transition-all">
            <p className="text-2xl">⭐</p>
            <p className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mt-1">{stats.totalReviews || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reviews written</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mb-5 border-b border-gray-200 dark:border-slate-700">
          {isHost && (
            <button
              onClick={() => setActiveTab("events")}
              className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
                activeTab === "events"
                  ? "border-outdar-red text-outdar-red"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-outdar-red"
              }`}
            >
              🎤 Hosted Events ({stats.totalHosted || 0})
            </button>
          )}
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "rsvps"
                ? "border-outdar-red text-outdar-red"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-outdar-red"
            }`}
          >
            🎟️ RSVPs ({stats.totalUpcoming || 0})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === "reviews"
                ? "border-outdar-red text-outdar-red"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-outdar-red"
            }`}
          >
            ⭐ Reviews ({stats.totalReviews || 0})
          </button>
        </div>

        {/* ── Tab content ── */}
        <div className="animate-fade-in">

          {/* HOSTED EVENTS */}
          {activeTab === "events" && (
            <>
              {activity?.hostedEvents?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activity.hostedEvents.map((event, i) => (
                    <div key={event._id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <div className="text-5xl mb-3">🎤</div>
                  <p className="font-display font-bold text-gray-900 dark:text-white mb-1">No events yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {isMyProfile ? "Create your first event to bring people together!" : "This host hasn't created events yet."}
                  </p>
                  {isMyProfile && (
                    <Link to="/events/create" className="inline-block px-5 py-2.5 bg-outdar-red text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all">
                      ✨ Create event
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          {/* UPCOMING RSVPS */}
          {activeTab === "rsvps" && (
            <>
              {activity?.upcomingRsvps?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activity.upcomingRsvps.map((event, i) => (
                    <div key={event._id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <div className="text-5xl mb-3">🎟️</div>
                  <p className="font-display font-bold text-gray-900 dark:text-white mb-1">No upcoming events</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {isMyProfile ? "Browse events to find your next adventure!" : "Nothing on the horizon yet."}
                  </p>
                  {isMyProfile && (
                    <Link to="/browse" className="inline-block px-5 py-2.5 bg-outdar-red text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all">
                      🔍 Browse events
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          {/* REVIEWS */}
          {activeTab === "reviews" && (
            <>
              {activity?.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {activity.reviews.map((review, i) => (
                    <div
                      key={review._id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 hover:shadow-sm hover:-translate-y-0.5 transition-all animate-fade-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        {review.event?.image ? (
                          <Link to={`/events/${review.event._id}`}>
                            <img src={review.event.image} alt={review.event.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 hover:scale-105 transition-transform" />
                          </Link>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-2xl flex-shrink-0">🎟️</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <Link to={`/events/${review.event?._id}`} className="font-semibold text-gray-900 dark:text-white hover:text-outdar-red transition-colors truncate">
                              {review.event?.title || "Event removed"}
                            </Link>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">"{review.comment}"</p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <div className="text-5xl mb-3">⭐</div>
                  <p className="font-display font-bold text-gray-900 dark:text-white mb-1">No reviews yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isMyProfile ? "Attend events and share your experience!" : "Hasn't reviewed any events yet."}
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default Profile;