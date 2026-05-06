import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import EventChat from "./pages/EventChat.jsx";
import AIChat from "./pages/AIChat.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";


import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

/**
 * Splash / Landing Page
 */
function Splash() {
  const { isAuth } = useAuth();

  if (isAuth) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">

      {/* Floating bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/15 rounded-full blur-3xl animate-float"></div>

        <div
          className="absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-5s" }}
        ></div>

        <div
          className="absolute w-72 h-72 bottom-20 left-10 bg-outdar-yellow/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-10s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-outdar-red flex items-center justify-center text-xl shadow-sm">
            🚪
          </div>

          <span className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
            OUTDAR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-outdar-red transition-colors"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="text-sm px-4 py-2 bg-outdar-red text-white rounded-xl font-semibold hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">

          <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-full mb-6 font-medium">
            🇲🇦 Made for Morocco's youth
          </span>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-tight text-gray-900 dark:text-white mb-6">
            Step outside.
            <br />

            <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
              Discover more.
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Find events around you, meet new people, and never miss a great
            moment — all in one place.
          </p>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-outdar-red text-white rounded-2xl font-bold text-base shadow-sm hover:-translate-y-1 hover:shadow-md transition-all"
            >
              Start exploring free →
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-base text-gray-900 dark:text-white hover:-translate-y-1 hover:shadow-md transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: "🔍",
              title: "Discover",
              desc: "Browse events by category, city, or vibe. Music, sports, food, art — it's all here.",
            },
            {
              icon: "👥",
              title: "Connect",
              desc: "See who's going, join the event chat, and meet people before the event.",
            },
            {
              icon: "🎉",
              title: "Explore",
              desc: "RSVP in one tap, get reminders, and build your social life in Morocco.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>

              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">
                {f.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-outdar-navy dark:bg-slate-800 rounded-2xl p-6 flex flex-wrap justify-around gap-6">
          {[
            { value: "30+", label: "Events live" },
            { value: "8", label: "Categories" },
            { value: "5", label: "Host organizers" },
            { value: "2", label: "Cities" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-extrabold text-3xl text-white mb-1">
                {s.value}
              </p>

              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="font-mono text-sm text-gray-400 dark:text-gray-500">
            — Discover. Connect. Explore. —
          </p>

          <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
            Built with 💙 in Casablanca · OUTDAR © 2026
          </p>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:id/chat"
        element={
          <ProtectedRoute>
            <EventChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIChat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;