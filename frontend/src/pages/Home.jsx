import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import EventCard from "../components/events/EventCard.jsx";
import useEvents from "../hooks/useEvents.js";

function Home() {
  const { user, logout } = useAuth();
  const { events, isLoading, error } = useEvents({ limit: 6, sort: "date" });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* Floating bubbles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/10 rounded-full blur-3xl"></div>
        <div className="absolute w-80 h-80 top-1/2 -right-24 bg-outdar-sky/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-outdar-red flex items-center justify-center text-lg">🚪</div>
            <span className="font-display font-extrabold text-lg text-gray-900 dark:text-white">OUTDAR</span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/home" className="text-sm font-medium text-outdar-red border-b-2 border-outdar-red pb-0.5">
              Home
            </Link>
            <Link to="/browse" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors">
              Browse
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors">
                Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
            Hey, <span className="font-semibold text-outdar-red">{user?.name?.split(" ")[0]}</span>!
          </span>
          <Link
            to="/ai"
            className="text-xs px-3 py-1.5 bg-outdar-red/10 border border-outdar-red/20 rounded-lg text-outdar-red font-semibold hover:bg-outdar-red hover:text-white transition-all"
          >
            🤖 AI
          </Link>
          <Link
            to="/browse"
            className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-outdar-red hover:text-outdar-red transition-all"
          >
            Browse
          </Link>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-outdar-red hover:text-outdar-red transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="font-display font-extrabold text-4xl text-gray-900 dark:text-white mb-2">
            Welcome back, <span className="text-outdar-red">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening around you
          </p>

          {/* Quick nav */}
        <div className="flex flex-wrap gap-3 mt-6 mb-8">
          <Link to="/browse"
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-red hover:text-outdar-red transition-all shadow-sm">
            📅 Browse all events
          </Link>
          <Link to="/ai"
            className="flex items-center gap-2 px-4 py-2.5 bg-outdar-red/5 border border-outdar-red/20 rounded-xl text-sm font-medium text-outdar-red hover:bg-outdar-red hover:text-white transition-all shadow-sm">
            🤖 Ask AI for suggestions
          </Link>
          {user?.role === "host" || user?.role === "admin" ? (
            <Link to="/events/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-green hover:text-outdar-green transition-all shadow-sm">
              ➕ Create event
            </Link>
          ) : null}
          {user?.role === "admin" && (
            <Link to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-outdar-sky hover:text-outdar-sky transition-all shadow-sm">
              🛡️ Admin Panel
            </Link>
          )}
        </div>
        
        </div>

        {/* Events section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
            🔥 Upcoming Events
          </h2>
          <Link
            to="/browse"
            className="text-sm text-outdar-red font-medium hover:underline"
          >
            See all →
          </Link>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {!isLoading && `${events.length} events`}
          </span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
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
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-20">
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