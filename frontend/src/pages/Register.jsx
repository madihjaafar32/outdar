import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
    role: "user", // "user" (Discoverer) or "host"
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
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-outdar-red/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-60 h-60 bg-outdar-yellow/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-xl bg-outdar-red flex items-center justify-center text-2xl">
            🚪
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            OUTDAR
          </span>
        </div>

        <div className="relative z-10 text-white">
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
        </div>

        <div className="relative z-10 font-mono text-xs text-white/60 tracking-wider">
          — Discover. Connect. Explore. —
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT: Form side                              */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-sm w-full mx-auto py-4">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-outdar-red flex items-center justify-center text-2xl">
              🚪
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              OUTDAR
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl tracking-tight mb-2 text-gray-900 dark:text-white">
            Create your account ✨
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
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2">
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
              className={`p-4 border-2 rounded-2xl text-center transition-all ${
                formData.role === "user"
                  ? "border-outdar-red bg-outdar-red/5 shadow-red"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="text-3xl mb-2">🌍</div>
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
              className={`p-4 border-2 rounded-2xl text-center transition-all ${
                formData.role === "host"
                  ? "border-outdar-red bg-outdar-red/5 shadow-red"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="text-3xl mb-2">🎪</div>
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
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
                <span className="text-outdar-red font-medium">Terms</span> and{" "}
                <span className="text-outdar-red font-medium">
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
        </div>
      </div>
    </div>
  );
}

export default Register;