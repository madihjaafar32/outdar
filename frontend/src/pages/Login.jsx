import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from || "/home";

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
    setError("");
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

        {/* Animated decorative bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-outdar-red/40 rounded-full animate-float"
            style={{ filter: "blur(120px)" }}
          ></div>
          <div
            className="absolute top-20 -left-10 w-60 h-60 bg-outdar-sky/30 rounded-full animate-float"
            style={{ filter: "blur(100px)", animationDelay: "-5s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-48 h-48 bg-outdar-yellow/20 rounded-full animate-float"
            style={{ filter: "blur(80px)", animationDelay: "-10s" }}
          ></div>
        </div>

        {/* Logo — centered, large brand moment */}
        <div className="relative z-10 flex justify-center animate-fade-in">
          <img
            src="/brand/outdar-full-dark.png"
            alt="OUTDAR"
            className="h-24 object-contain hover:scale-105 transition-transform"
            draggable="false"
          />
        </div>

        {/* Quote */}
        <div className="relative z-10 text-white animate-slide-up">
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
      <div className="relative bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 p-8 lg:p-12 flex flex-col justify-center transition-colors duration-500 overflow-hidden">

        {/* Subtle bubbles for mobile (when left side is hidden) */}
        <div className="lg:hidden">
          <BubblesBg variant="warm" subtle />
        </div>

        {/* Theme toggle (top-right) */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <div className="relative z-10 max-w-sm w-full mx-auto animate-slide-up">

          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8">
            <BrandLogo size="md" to="/" />
          </div>

          <h1 className="font-display font-bold text-3xl tracking-tight mb-2 text-gray-900 dark:text-white">
            Welcome back{" "}
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
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
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
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
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-outdar-red">
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
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-outdar-red">
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

          {/* Social login */}
          <button
            type="button"
            onClick={() => alert("Google login coming in Phase 2!")}
            className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-xl font-medium text-sm text-gray-900 dark:text-white hover:border-outdar-red dark:hover:border-outdar-red hover:-translate-y-0.5 hover:shadow-sm transition-all flex items-center justify-center gap-2.5"
          >
            <span className="font-bold text-base">G</span>
            <span>Continue with Google</span>
          </button>

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

export default Login;