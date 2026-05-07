/**
 * Create Event Page
 * Multi-step form for hosts/admins to create new events.
 * Uses POST /api/events
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { useAuth } from "../context/AuthContext.jsx";
import { getCategories, createEvent } from "../services/event.service.js";

import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MOROCCAN_CITIES = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Fes", "Agadir"];

// Click handler for the map
function LocationPicker({ onPick, position }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lng, e.latlng.lat]);
    },
  });

  return position ? <Marker position={[position[1], position[0]]} /> : null;
}

function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Permission gate
  useEffect(() => {
    if (user && user.role !== "host" && user.role !== "admin") {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  // ── State ──
  const [step, setStep] = useState(1); // 1=info, 2=location, 3=review
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    image: "",
    date: "",
    time: "",
    duration: 120, // minutes
    capacity: 20,
    price: 0,
    coordinates: null, // [lng, lat]
    address: "",
    venueName: "",
    city: "Casablanca",
  });

  // Load categories
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // ── Step navigation ──
  const validateStep1 = () => {
    if (!formData.title || formData.title.length < 3) {
      setError("Title must be at least 3 characters");
      return false;
    }
    if (!formData.description || formData.description.length < 10) {
      setError("Description must be at least 10 characters");
      return false;
    }
    if (!formData.categoryId) {
      setError("Please pick a category");
      return false;
    }
    if (!formData.date || !formData.time) {
      setError("Please pick a date and time");
      return false;
    }
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    if (eventDate < new Date()) {
      setError("Event date must be in the future");
      return false;
    }
    if (formData.capacity < 1) {
      setError("Capacity must be at least 1");
      return false;
    }
    if (formData.price < 0) {
      setError("Price cannot be negative");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.coordinates) {
      setError("Please pick a location on the map");
      return false;
    }
    if (!formData.address) {
      setError("Please enter an address");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const eventDate = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        image: formData.image || "",
        date: eventDate.toISOString(),
        duration: parseInt(formData.duration),
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        location: {
          coordinates: formData.coordinates,
          address: formData.address,
          venueName: formData.venueName,
          city: formData.city,
        },
      };

      const res = await createEvent(payload);
      setSuccess(true);

      // Redirect to the new event's detail page after 1.5s
      setTimeout(() => {
        navigate(`/events/${res.data.event._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find((c) => c._id === formData.categoryId);

  // ── Success state ──
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-6 relative overflow-hidden">
        <BubblesBg variant="warm" />
        <div className="relative z-10 text-center animate-slide-up">
          <div className="text-7xl mb-4 animate-pulse-red">🎉</div>
          <h2 className="font-display font-extrabold text-3xl text-gray-900 dark:text-white mb-2">
            Event created!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Redirecting to your event...
          </p>
          <div className="w-12 h-12 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-8 animate-slide-up">
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 dark:bg-outdar-red/20 px-3 py-1.5 rounded-full mb-4 font-medium border border-outdar-red/20">
            ✨ Create new event
          </span>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900 dark:text-white mb-2">
            Bring people{" "}
            <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
              outside.
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Share your event with Morocco's youth.
          </p>
        </div>

        {/* ── Stepper ── */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: "Info"     },
            { num: 2, label: "Location" },
            { num: 3, label: "Review"   },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-2 ${
                  step >= s.num ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.num
                      ? "bg-outdar-green text-white"
                      : step === s.num
                      ? "bg-outdar-red text-white shadow-red"
                      : "bg-gray-200 dark:bg-slate-700 text-gray-500"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${
                  step === s.num ? "text-outdar-red" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-0.5 transition-colors ${
                  step > s.num ? "bg-outdar-green" : "bg-gray-200 dark:bg-slate-700"
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 1: Event Info                              */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                Event title <span className="text-outdar-red">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Sunset Beach Football Match"
                maxLength={80}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formData.title.length}/80 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                Description <span className="text-outdar-red">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="What's the vibe? What should attendees expect? What to bring?"
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 resize-none"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formData.description.length}/1000
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category <span className="text-outdar-red">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => updateField("categoryId", cat._id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      formData.categoryId === cat._id
                        ? "border-outdar-red bg-outdar-red/5 shadow-red"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:-translate-y-0.5"
                    }`}
                    style={
                      formData.categoryId === cat._id
                        ? { borderColor: cat.color, backgroundColor: cat.color + "15" }
                        : {}
                    }
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  📅 Date <span className="text-outdar-red">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  ⏰ Time <span className="text-outdar-red">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 appearance-none cursor-pointer"
              >
                <option value={60}>1 hour</option>
                <option value={90}>1h 30min</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={240}>4 hours</option>
                <option value={360}>6 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>

            {/* Capacity + Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  👥 Capacity <span className="text-outdar-red">*</span>
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => updateField("capacity", e.target.value)}
                  min={1}
                  max={10000}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                  💰 Price (MAD)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  min={0}
                  step={10}
                  placeholder="0 = free"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
            </div>

           {/* Cover image upload */}
<div>
  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
    🖼️ Cover image
  </label>

  {/* Drop zone */}
  <label className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
    formData.image
      ? "border-outdar-red/40 bg-outdar-red/5"
      : "border-gray-300 dark:border-slate-600 hover:border-outdar-red hover:bg-outdar-red/5 dark:hover:bg-outdar-red/5"
  }`}>
    <input
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => updateField("image", ev.target.result);
        reader.readAsDataURL(file);
      }}
    />

    {formData.image ? (
      /* Preview */
      <div className="relative w-full">
        <img
          src={formData.image}
          alt="Cover preview"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-xl">
            🔄 Change photo
          </span>
        </div>
      </div>
    ) : (
      /* Empty state */
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="text-4xl mb-3">📸</div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Click to upload a cover photo
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          JPG, PNG, WEBP — recommended 16:9
        </p>
      </div>
    )}
  </label>

  {formData.image && (
    <button
      type="button"
      onClick={() => updateField("image", "")}
      className="mt-2 text-xs text-red-400 hover:text-outdar-red transition-colors"
    >
      ✕ Remove photo
    </button>
  )}
</div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 2: Location                                */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">

            <div className="p-4 bg-outdar-sky/5 dark:bg-outdar-sky/10 border border-outdar-sky/20 rounded-xl">
              <p className="text-sm text-outdar-sky font-semibold mb-1">
                📍 Pick a location on the map
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Click anywhere on the map to drop a pin where your event happens.
              </p>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
              <MapContainer
                center={[33.5731, -7.5898]} // Casablanca
                zoom={12}
                style={{ height: "400px", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker
                  onPick={(coords) => updateField("coordinates", coords)}
                  position={formData.coordinates}
                />
              </MapContainer>
            </div>

            {formData.coordinates && (
              <div className="p-3 bg-outdar-green/10 border border-outdar-green/30 rounded-xl text-sm text-outdar-green font-semibold flex items-center gap-2">
                ✅ Location picked: {formData.coordinates[1].toFixed(4)}, {formData.coordinates[0].toFixed(4)}
              </div>
            )}

            {/* Venue name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                🏠 Venue name
              </label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => updateField("venueName", e.target.value)}
                placeholder="e.g. Anfa Place, Boultek, Megarama"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                Full address <span className="text-outdar-red">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="e.g. Boulevard de la Corniche, Casablanca"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                City <span className="text-outdar-red">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 appearance-none cursor-pointer"
              >
                {MOROCCAN_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* STEP 3: Review                                  */}
        {/* ═══════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">

            <div className="p-4 bg-gradient-to-br from-outdar-yellow/10 to-outdar-orange/10 border border-outdar-orange/20 rounded-xl">
              <p className="text-sm text-outdar-orange font-semibold mb-1">
                ✨ Almost done!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Review your event details below. Click "Create" to publish it.
              </p>
            </div>

            {/* Preview card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-md">

              {/* Preview image */}
              {formData.image ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://picsum.photos/800/400"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {selectedCategory && (
                      <span
                        className="px-3 py-1 text-white text-xs font-bold rounded-full backdrop-blur-md"
                        style={{ backgroundColor: selectedCategory.color + "ee" }}
                      >
                        {selectedCategory.icon} {selectedCategory.name}
                      </span>
                    )}
                    <span className={`px-3 py-1 text-white text-xs font-bold rounded-full backdrop-blur-md ${
                      formData.price == 0 ? "bg-outdar-green" : "bg-outdar-navy/80"
                    }`}>
                      {formData.price == 0 ? "FREE" : `${formData.price} MAD`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center">
                  <span className="text-6xl">{selectedCategory?.icon || "🎟️"}</span>
                </div>
              )}

              <div className="p-5 space-y-3">
                <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
                  {formData.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {formData.description}
                </p>

                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-7 h-7 bg-outdar-red/10 rounded-lg flex items-center justify-center">📅</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formData.date && new Date(`${formData.date}T${formData.time}`).toLocaleDateString("en-GB", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric"
                      })}
                      {" · "}
                      {formData.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-7 h-7 bg-outdar-green/10 rounded-lg flex items-center justify-center">📍</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formData.venueName ? `${formData.venueName} · ` : ""}
                      {formData.address}, {formData.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-7 h-7 bg-outdar-sky/10 rounded-lg flex items-center justify-center">👥</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Capacity: <strong>{formData.capacity}</strong> people · Duration: {Math.floor(formData.duration / 60)}h
                      {formData.duration % 60 > 0 ? ` ${formData.duration % 60}min` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm hover:border-outdar-red hover:text-outdar-red hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm shadow-red hover:-translate-y-0.5 hover:shadow-red-lg transition-all"
            >
              Next step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-outdar-red to-outdar-orange text-white rounded-xl font-semibold text-sm shadow-red hover:-translate-y-0.5 hover:shadow-red-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating...
                </>
              ) : (
                <>
                  ✨ Create event
                </>
              )}
            </button>
          )}
        </div>

      </main>
    </div>
  );
}

export default CreateEvent;