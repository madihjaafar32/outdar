import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tangier",
  "Fes",
  "Agadir",
  "Meknes",
  "Oujda",
  "Tetouan",
  "Other",
];

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    role: "user",
    name: "",
    email: "",
    password: "",
    city: "",
    agreeTerms: false,
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const setRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms and Privacy Policy");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        role: formData.role,
      });
      navigate("/home", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ============================================ */}
      {/* LEFT: Brand side                              */}
      {/* ============================================ */}
      <div className="relative bg-gradient-to-br from-outdar-navy to-slate-900 p-12 flex flex-col justify-between overflow-hidden hidden lg:flex">

        {/* Animated decorative bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-outdar-red/40 rounded-full animate-float"
            style={{ filter: "blur(120px)" }}
          ></div>
          <div
            className="absolute top-20 -left-10 w-60 h-60 bg-outdar-yellow/30 rounded-full animate-float"
            style={{ filter: "blur(100px)", animationDelay: "-5s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-48 h-48 bg-outdar-orange/20 rounded-full animate-float"
            style={{ filter: "blur(80px)", animationDelay: "-10s" }}
          ></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-white animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-outdar-red flex items-center justify-center text-2xl shadow-red">
            🚪
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            OUTDAR
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 text-white animate-slide-up">
          <h2 className="font-display font-extrabold text-4xl leading-tight tracking-tight mb-4">
            Step{" "}
            <span className="bg-gradient-to-br from-outdar-yellow to-outdar-orange bg-clip-text text-transparent">
              outside
            </span>{" "}
            with us.
          </h2>
          <p className="text-base opacity-85 leading-relaxed max-w-sm">
            Join 142+ young people in Morocco discovering events, making
            friends, and living more.
          </p>

          {/* Stats teaser */}
          <div className="flex gap-6 mt-8">
            <div>
              <p className="font-display font-extrabold text-3xl text-white">30+</p>
              <p className="text-xs text-white/60 mt-0.5">Events live</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-3xl text-white">8</p>
              <p className="text-xs text-white/60 mt-0.5">Categories</p>
            </div>
            <div>
              <p className="font-display font-extrabold text-3xl text-white">5</p>
              <p className="text-xs text-white/60 mt-0.5">Hosts</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 font-mono text-xs text-white/60 tracking-wider">
          — Discover. Connect. Explore. — 🇲🇦
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT: Form side                              */}
      {/* ============================================ */}
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto transition-colors duration-500">

        {/* Subtle bubbles for mobile */}
        <div className="lg:hidden">
          <BubblesBg variant="warm" subtle />
        </div>

        {/* Theme toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 max-w-sm w-full mx-auto py-4 animate-slide-up">

          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8">
            <BrandLogo size="md" to="/" />
          </div>

          <h1 className="font-display font-bold text-3xl tracking-tight mb-2 text-gray-900 dark:text-white">
            Create your account{" "}
            <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
              ✨
            </span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Already have one?{" "}
            <Link
              to="/login"
              className="text-outdar-red font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Role picker */}
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2.5">
            I'm joining as a...
          </label>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`group p-4 border-2 rounded-2xl text-center transition-all ${
                formData.role === "user"
                  ? "border-outdar-red bg-outdar-red/5 shadow-red"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:-translate-y-0.5"
              }`}
            >
              <div className={`text-3xl mb-2 transition-transform ${formData.role === "user" ? "scale-110" : "group-hover:scale-110"}`}>
                🌍
              </div>
              <div className="font-display font-semibold text-sm text-gray-900 dark:text-white">
                Discoverer
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Find & attend events
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("host")}
              className={`group p-4 border-2 rounded-2xl text-center transition-all ${
                formData.role === "host"
                  ? "border-outdar-red bg-outdar-red/5 shadow-red"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:-translate-y-0.5"
              }`}
            >
              <div className={`text-3xl mb-2 transition-transform ${formData.role === "host" ? "scale-110" : "group-hover:scale-110"}`}>
                🎪
              </div>
              <div className="font-display font-semibold text-sm text-gray-900 dark:text-white">
                Host
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Create my events
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                placeholder="Ahmed Benali"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Your city <span className="text-outdar-red">*</span>
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-outdar-red">
                  📍
                </span>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 appearance-none cursor-pointer"
                >
                  <option value="">Select your city...</option>
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▾
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                We'll show you events nearby first
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
              />
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="sr-only peer"
              />
              <span className="w-5 h-5 mt-0.5 border-2 border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center transition-colors peer-checked:bg-outdar-red peer-checked:border-outdar-red flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                I agree to OUTDAR's{" "}
                <span className="text-outdar-red font-medium hover:underline cursor-pointer">Terms</span> and{" "}
                <span className="text-outdar-red font-medium hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-outdar-red text-white rounded-xl font-semibold text-sm shadow-red hover:-translate-y-0.5 hover:shadow-red-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create my account →</span>
              )}
            </button>
          </form>

          {/* Back to home */}
          <p className="text-center mt-6">
            <Link
              to="/"
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-outdar-red transition-colors group inline-flex items-center gap-1"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;