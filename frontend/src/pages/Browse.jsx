/**
 * Browse Events Page
 * Search, filter by category, toggle list/map view
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/events/EventCard.jsx";
import { getEvents, getCategories } from "../services/event.service.js";

import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

// Leaflet map (lazy loaded only when map view is active)
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon (known issue with webpack/vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Browse() {
  // ── State ──────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [activeCity, setActiveCity] = useState("");

  // View
  const [view, setView] = useState("list");

  const CITIES = ["", "Casablanca", "Rabat"];

  // ── Fetch categories once ───────────────────────────────
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  // ── Fetch events when filters change ───────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const params = { limit: 30, sort: "date" };
    if (search)         params.search   = search;
    if (activeCategory) params.category = activeCategory;
    if (freeOnly)       params.free     = true;
    if (activeCity)     params.city     = activeCity;

    const timer = setTimeout(() => {
      getEvents(params)
        .then((res) => {
          if (!cancelled) {
            setEvents(res.data.events);
            setTotal(res.data.total);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err.response?.data?.message || "Failed to load events");
            setIsLoading(false);
          }
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, activeCategory, freeOnly, activeCity]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("");
    setFreeOnly(false);
    setActiveCity("");
  };

  const hasFilters = search || activeCategory || freeOnly || activeCity;

  const mapCenter = [33.5731, -7.5898];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">

      <BubblesBg variant="cool" subtle />

      {/* ── Frosted Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <BrandLogo size="sm" to="/home" />

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/home"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all"
            >
              Home
            </Link>
            <span className="text-sm font-semibold text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-lg">
              Browse
            </span>
            <Link
              to="/ai"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all"
            >
              AI Assistant
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-6 animate-slide-up">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-gray-900 dark:text-white mb-1 tracking-tight">
            Discover Events <span className="inline-block">🎟️</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {total > 0 ? (
              <>
                <span className="font-semibold text-outdar-red">{total}</span>
                {" events happening around you"}
              </>
            ) : "Find your next adventure"}
          </p>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-4 group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none transition-colors group-focus-within:text-outdar-red">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, venues, vibes..."
            className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-400 hover:bg-outdar-red hover:text-white flex items-center justify-center text-xs transition-all"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Filter row ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">

          {/* City filter */}
          <div className="flex gap-1.5">
            {CITIES.map((city) => (
              <button
                key={city || "all"}
                onClick={() => setActiveCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCity === city
                    ? "bg-outdar-navy text-white dark:bg-white dark:text-outdar-navy shadow-sm"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-outdar-navy dark:hover:border-white hover:-translate-y-0.5"
                }`}
              >
                {city || "🌍 All cities"}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700"></div>

          {/* Free only toggle */}
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              freeOnly
                ? "bg-outdar-green text-white shadow-sm hover:-translate-y-0.5"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-outdar-green hover:text-outdar-green hover:-translate-y-0.5"
            }`}
          >
            🆓 Free only
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-outdar-red border border-outdar-red/30 hover:bg-outdar-red hover:text-white transition-all"
            >
              ✕ Clear
            </button>
          )}

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "list"
                  ? "bg-outdar-red text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-outdar-red"
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "map"
                  ? "bg-outdar-red text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-outdar-red"
              }`}
            >
              🗺️ Map
            </button>
          </div>
        </div>

        {/* ── Category chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button
            onClick={() => setActiveCategory("")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === ""
                ? "bg-outdar-red text-white shadow-red"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-outdar-red hover:text-outdar-red hover:-translate-y-0.5"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(activeCategory === cat.slug ? "" : cat.slug)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                activeCategory === cat.slug
                  ? "text-white shadow-md"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-gray-400"
              }`}
              style={
                activeCategory === cat.slug
                  ? { backgroundColor: cat.color, boxShadow: `0 4px 12px -2px ${cat.color}66` }
                  : {}
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <>
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                    <div className="aspect-video bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 text-sm text-outdar-red underline"
                >
                  Reset filters
                </button>
              </div>
            )}

            {!isLoading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, i) => (
                  <div
                    key={event._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && events.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                  No events found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try different filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-red transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* ── MAP VIEW ── */}
        {view === "map" && (
          <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: "600px", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {events.map((event) => {
                const coords = event.location?.coordinates;
                if (!coords || coords.length < 2) return null;
                const [lng, lat] = coords;

                return (
                  <Marker key={event._id} position={[lat, lng]}>
                    <Popup>
                      <div className="min-w-48">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <p className="font-bold text-sm text-gray-900 mb-1">{event.title}</p>
                        <p className="text-xs text-gray-500 mb-2">📍 {event.location?.venueName}</p>
                        <p className="text-xs font-semibold text-outdar-red mb-2">
                          {event.price === 0 ? "FREE" : `${event.price} MAD`}
                        </p>
                        <a
                          href={`/events/${event._id}`}
                          className="block text-center text-xs bg-outdar-red text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90"
                        >
                          View Event →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <div className="bg-white dark:bg-slate-800 px-4 py-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                📍 Showing <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span> events on map
              </span>
              <button
                onClick={() => setView("list")}
                className="text-sm text-outdar-red font-semibold hover:underline"
              >
                Switch to list →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Browse;