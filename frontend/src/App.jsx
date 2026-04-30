import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState("light");
  const [apiStatus, setApiStatus] = useState("checking");

  // Toggle theme on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Health check the backend on mount
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setApiStatus("connected");
        else setApiStatus("error");
      })
      .catch(() => setApiStatus("disconnected"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      {/* Floating bubbles bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-5s" }}></div>
        <div className="absolute w-72 h-72 bottom-20 left-10 bg-outdar-yellow/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "-10s" }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-sm font-medium hover:shadow-md transition-all"
        >
          {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </div>

      {/* Hero content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo placeholder (the door icon) */}
        <div className="w-20 h-20 mb-8 rounded-2xl bg-outdar-red flex items-center justify-center shadow-red-lg">
          <span className="text-4xl">🚪</span>
        </div>

        <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-full mb-6 font-medium">
          🚀 Welcome to Slice 1
        </span>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-tight text-gray-900 dark:text-white mb-4">
          OU<span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">TD</span>AR
        </h1>

        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-12">
          — {t("app.tagline", "Discover. Connect. Explore.")} —
        </p>

        {/* Status cards */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl w-full">
          {/* Frontend status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-mono">Frontend</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              <span className="font-medium text-gray-900 dark:text-white">Vite + React</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">localhost:5173</div>
          </div>

          {/* Backend status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-mono">Backend API</div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  apiStatus === "connected"
                    ? "bg-success animate-pulse"
                    : apiStatus === "checking"
                    ? "bg-warning animate-pulse"
                    : "bg-danger"
                }`}
              ></span>
              <span className="font-medium text-gray-900 dark:text-white">
                {apiStatus === "connected" && "Connected"}
                {apiStatus === "checking" && "Checking..."}
                {apiStatus === "disconnected" && "Disconnected"}
                {apiStatus === "error" && "Error"}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">localhost:5000</div>
          </div>

          {/* Database status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-mono">Database</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-outdar-sky animate-pulse"></span>
              <span className="font-medium text-gray-900 dark:text-white">MongoDB Atlas</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cloud · Free tier</div>
          </div>
        </div>

        {/* Progress info */}
        <div className="mt-12 max-w-2xl bg-gradient-to-br from-outdar-red/5 to-outdar-orange/5 border border-outdar-red/20 rounded-2xl p-6">
          <div className="font-mono text-xs uppercase tracking-widest text-outdar-red mb-2 font-semibold">
            ✅ Slice 1 Complete
          </div>
          <div className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
            Project foundation is ready
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Backend boots, frontend renders, design system loaded, i18n ready, and your environment is wired up. <strong className="text-outdar-red">Next up: Slice 2 — Authentication</strong> (User model, register, login, JWT).
          </p>
        </div>

        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 font-mono">
          🇲🇦 Built in Casablanca, with care.
        </div>
      </main>
    </div>
  );
}

export default App;
