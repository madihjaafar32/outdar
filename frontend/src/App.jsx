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
import BubblesBg from "./components/common/BubblesBg.jsx";
import BrandLogo from "./components/common/BrandLogo.jsx";
import ThemeToggle from "./components/common/ThemeToggle.jsx";

/**
 * Splash / Landing Page
 */
function Splash() {
  const { isAuth } = useAuth();

  if (isAuth) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">
      <BubblesBg />

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <BrandLogo size="md" to="/" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            to="/login"
            className="hidden sm:inline-block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-outdar-red transition-colors px-3 py-2"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="text-sm px-5 py-2.5 bg-outdar-red text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all shadow-sm"
          >
            Get started →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">

          <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 dark:bg-outdar-red/20 px-3 py-1.5 rounded-full mb-6 font-medium border border-outdar-red/20">
            🇲🇦 Made for Morocco's youth
          </span>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-[1.05] text-gray-900 dark:text-white mb-6">
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
              className="px-8 py-4 bg-outdar-red text-white rounded-2xl font-bold text-base shadow-red hover:-translate-y-1 hover:shadow-red-lg transition-all"
            >
              Start exploring free →
            </Link>

            <Link
              to="/login"
              className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl font-bold text-base text-gray-900 dark:text-white hover:-translate-y-1 hover:shadow-md hover:border-outdar-red dark:hover:border-outdar-red transition-all"
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
              color: "outdar-red",
            },
            {
              icon: "👥",
              title: "Connect",
              desc: "See who's going, join the event chat, and meet people before the event.",
              color: "outdar-sky",
            },
            {
              icon: "🎉",
              title: "Explore",
              desc: "RSVP in one tap, get reminders, and build your social life in Morocco.",
              color: "outdar-yellow",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md hover:border-outdar-red/30 transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
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
        <div className="bg-outdar-navy dark:bg-slate-800 rounded-3xl p-8 flex flex-wrap justify-around gap-6 shadow-lg relative overflow-hidden">

          {/* Decorative accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-outdar-red/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-outdar-sky/20 rounded-full blur-2xl"></div>

          {[
            { value: "30+", label: "Events live", icon: "🎟️" },
            { value: "8",   label: "Categories",  icon: "🏷️" },
            { value: "5",   label: "Hosts",       icon: "🎤" },
            { value: "2",   label: "Cities",      icon: "🌍" },
          ].map((s) => (
            <div key={s.label} className="text-center relative z-10">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-display font-extrabold text-3xl text-white mb-1">
                {s.value}
              </p>
              <p className="text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
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