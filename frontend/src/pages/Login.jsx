import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Redirect destination after login (default = /home)
  const from = location.state?.from || "/home";

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepSignedIn: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      // Success! Redirect to where they came from (or /home)
      navigate(from, { replace: true });
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
        {/* Decorative blur */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-outdar-red/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-10 w-60 h-60 bg-outdar-sky/20 rounded-full blur-3xl"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-xl bg-outdar-red flex items-center justify-center text-2xl">
            🚪
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">
            OUTDAR
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 text-white">
          <h2 className="font-display font-extrabold text-4xl leading-tight tracking-tight mb-4">
            Welcome back to the{" "}
            <span className="bg-gradient-to-br from-outdar-yellow to-outdar-orange bg-clip-text text-transparent">
              door of discovery
            </span>
            .
          </h2>
          <p className="text-base opacity-85 leading-relaxed max-w-sm">
            Pick up where you left off — your next event, your next adventure,
            your next memory.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 font-mono text-xs text-white/60 tracking-wider">
          — Discover. Connect. Explore. —
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT: Form side                              */}
      {/* ============================================ */}
      <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile-only logo (hidden on lg+) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-outdar-red flex items-center justify-center text-2xl">
              🚪
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              OUTDAR
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl tracking-tight mb-2 text-gray-900 dark:text-white">
            Welcome back 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-outdar-red font-semibold hover:underline"
            >
              Sign up free
            </Link>
          </p>

          {/* Error banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-outdar-red font-medium hover:underline"
                  onClick={() => alert("Password reset coming in Phase 2!")}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm transition-all focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10"
                />
              </div>
            </div>

            {/* Keep signed in */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="keepSignedIn"
                checked={formData.keepSignedIn}
                onChange={handleChange}
                className="sr-only peer"
              />
              <span className="w-5 h-5 border-2 border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center transition-colors peer-checked:bg-outdar-red peer-checked:border-outdar-red">
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
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Keep me signed in for 30 days
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
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in →</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>
            <span className="text-xs text-gray-400 font-mono tracking-wider">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700"></div>
          </div>

          {/* Social login (placeholder for now) */}
          <button
            type="button"
            onClick={() => alert("Google login coming in Phase 2!")}
            className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-slate-500 hover:-translate-y-0.5 hover:shadow-sm transition-all flex items-center justify-center gap-2.5"
          >
            <span className="font-bold">G</span>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;