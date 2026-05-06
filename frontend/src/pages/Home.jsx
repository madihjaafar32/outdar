import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import EventCard from "../components/events/EventCard.jsx";
import useEvents from "../hooks/useEvents.js";
import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

function Home() {
  const { user, logout } = useAuth();
  const { events, isLoading, error } = useEvents({ limit: 6, sort: "date" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">

      <BubblesBg subtle />

      {/* Frosted Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3 flex items-center justify-between">

        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          <BrandLogo size="sm" to="/home" />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/home"
              className="text-sm font-semibold text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all"
            >
              Browse
            </Link>
            <Link
              to="/ai"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all"
            >
              AI Assistant
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all"
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right: User + actions */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block mr-2">
            Hey, <span className="font-semibold text-outdar-red">{user?.name?.split(" ")[0]}</span>!
          </span>

          <ThemeToggle />

          <button
            onClick={logout}
            className="text-xs px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-outdar-red hover:text-outdar-red transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10 animate-slide-up">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-gray-900 dark:text-white mb-2 leading-tight">
            Welcome back,{" "}
            <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>{" "}
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Here's what's happening around you
          </p>

          {/* Quick nav */}
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              to="/browse"
              className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-red hover:text-outdar-red hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <span className="group-hover:scale-110 transition-transform">📅</span>
              Browse all events
            </Link>

            <Link
              to="/ai"
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-outdar-red/10 to-outdar-orange/10 border border-outdar-red/20 rounded-xl text-sm font-semibold text-outdar-red hover:from-outdar-red hover:to-outdar-orange hover:text-white hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <span className="group-hover:scale-110 transition-transform">🤖</span>
              Ask AI for suggestions
            </Link>

            {(user?.role === "host" || user?.role === "admin") && (
              <Link
                to="/events/create"
                className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-green hover:text-outdar-green hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <span className="group-hover:scale-110 transition-transform">➕</span>
                Create event
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="group flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-sky hover:text-outdar-sky hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <span className="group-hover:scale-110 transition-transform">🛡️</span>
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Events section */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
              🔥 Upcoming Events
            </h2>
            {!isLoading && (
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                {events.length} events
              </span>
            )}
          </div>

          <Link
            to="/browse"
            className="text-sm text-outdar-red font-semibold hover:underline flex items-center gap-1 group"
          >
            See all
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700"
              >
                <div className="aspect-video bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-center">
            <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
          </div>
        )}

        {/* Events grid */}
        {!isLoading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div
                key={event._id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
              No events yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Run the seed script to populate events!
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;