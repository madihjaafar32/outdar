/**
 * Browse Events Page
 * Search, filter by category, toggle list/map view
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/events/EventCard.jsx";
import { getEvents, getCategories } from "../services/event.service.js";

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
  const [activeCategory, setActiveCategory] = useState(""); // slug
  const [freeOnly, setFreeOnly] = useState(false);
  const [activeCity, setActiveCity] = useState("");

  // View
  const [view, setView] = useState("list"); // "list" | "map"

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

    // Debounce search by 400ms
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

  // ── Clear all filters ───────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setActiveCategory("");
    setFreeOnly(false);
    setActiveCity("");
  };

  const hasFilters = search || activeCategory || freeOnly || activeCity;

  // ── Casablanca center as default map position ───────────
  const mapCenter = [33.5731, -7.5898];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* Bubbles bg */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute w-96 h-96 -top-24 -right-24 bg-outdar-sky/10 rounded-full blur-3xl"></div>
        <div className="absolute w-80 h-80 bottom-20 -left-20 bg-outdar-red/10 rounded-full blur-3xl"></div>
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-outdar-red flex items-center justify-center text-lg">🚪</div>
          <span className="font-display font-extrabold text-lg text-gray-900 dark:text-white">OUTDAR</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/home" className="text-sm text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors">
            Home
          </Link>
          <span className="text-sm font-semibold text-outdar-red border-b-2 border-outdar-red pb-0.5">
            Browse
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-3xl text-gray-900 dark:text-white mb-1">
            Discover Events 🎟️
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total > 0 ? `${total} events happening around you` : "Find your next adventure"}
          </p>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, venues, vibes..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-outdar-red focus:ring-4 focus:ring-outdar-red/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                    ? "bg-outdar-navy text-white dark:bg-white dark:text-outdar-navy"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-gray-400"
                }`}
              >
                {city || "🌍 All cities"}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700"></div>

          {/* Free only toggle */}
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              freeOnly
                ? "bg-outdar-green text-white"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-gray-400"
            }`}
          >
            🆓 Free only
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-outdar-red border border-outdar-red/30 hover:bg-outdar-red/5 transition-all"
            >
              ✕ Clear
            </button>
          )}

          {/* View toggle — pushed to right */}
          <div className="ml-auto flex items-center gap-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "list"
                  ? "bg-outdar-red text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === "map"
                  ? "bg-outdar-red text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              }`}
            >
              🗺️ Map
            </button>
          </div>
        </div>

        {/* ── Category chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === ""
                ? "bg-outdar-red text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-outdar-red hover:text-outdar-red"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(
                activeCategory === cat.slug ? "" : cat.slug
              )}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.slug
                  ? "text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:border-gray-400"
              }`}
              style={
                activeCategory === cat.slug
                  ? { backgroundColor: cat.color }
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
            {/* Loading skeletons */}
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

            {/* Error */}
            {error && (
              <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-2xl text-center">
                <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 text-sm text-outdar-red underline"
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Events grid */}
            {!isLoading && !error && events.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && events.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                  No events found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try different filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}

        {/* ── MAP VIEW ── */}
        {view === "map" && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
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
                        <p className="font-bold text-sm text-gray-900 mb-1">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          📍 {event.location?.venueName}
                        </p>
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

            {/* Events count on map */}
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