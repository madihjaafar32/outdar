/**
 * Event Detail Page
 * Full event info, host card, RSVP placeholder, mini map
 */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getEvent } from "../services/event.service.js";
import { useAuth } from "../context/AuthContext.jsx";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null); // null | "going" | "interested"

  // Fetch event
  useEffect(() => {
    setIsLoading(true);
    getEvent(id)
      .then((res) => {
        setEvent(res.data.event);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Event not found");
        setIsLoading(false);
      });
  }, [id]);

  // RSVP handler (placeholder — real logic in Slice 4)
  const handleRSVP = (status) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setRsvpStatus(rsvpStatus === status ? null : status);
  };

  const isFree = event?.price === 0;
  const isFull = event?.attendeeCount >= event?.capacity;
  const spotsLeft = event ? event.capacity - event.attendeeCount : 0;
  const coords = event?.location?.coordinates;

  // ── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin"></div>
          <p className="font-mono text-sm text-gray-500 dark:text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🚪</div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Event not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/browse"
            className="px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
          >
            ← Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-outdar-red flex items-center justify-center text-base">🚪</div>
          <span className="font-display font-extrabold text-base text-gray-900 dark:text-white">OUTDAR</span>
        </div>
      </nav>

      {/* ── Hero Image ── */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={event.image || `https://picsum.photos/seed/${event._id}/1200/600`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Category + Price badges on image */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {event.category && (
            <span
              className="px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur"
              style={{ backgroundColor: event.category.color + "dd" }}
            >
              {event.category.icon} {event.category.name}
            </span>
          )}
          <span className={`px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg ${
            isFree ? "bg-outdar-green" : "bg-outdar-navy/80 backdrop-blur"
          }`}>
            {isFree ? "FREE" : `${event.price} MAD`}
          </span>
          {isFull && (
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              FULL
            </span>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Event Info ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title + meta */}
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-gray-900 dark:text-white leading-tight mb-4">
                {event.title}
              </h1>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-8 bg-outdar-red/10 dark:bg-outdar-red/20 rounded-lg flex items-center justify-center text-base flex-shrink-0">📅</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-8 bg-outdar-sky/10 dark:bg-outdar-sky/20 rounded-lg flex items-center justify-center text-base flex-shrink-0">⏰</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatTime(event.date)}
                    {event.duration && (
                      <span className="text-gray-500 dark:text-gray-400 font-normal">
                        {" "}· {Math.floor(event.duration / 60)}h{event.duration % 60 > 0 ? ` ${event.duration % 60}min` : ""}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-8 h-8 bg-outdar-green/10 dark:bg-outdar-green/20 rounded-lg flex items-center justify-center text-base flex-shrink-0">📍</span>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {event.location?.venueName || event.location?.address}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {" · "}{event.location?.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-3">
                About this event
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {event.description}
              </p>
            </div>

            {/* Host card */}
            {event.host && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Hosted by
                </h2>
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {event.host.avatar ? (
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {event.host.name?.[0]}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-gray-900 dark:text-white">
                        {event.host.name}
                      </span>
                      {event.host.isVerified && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-outdar-sky/10 text-outdar-sky text-xs font-semibold rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>📍 {event.host.city}</span>
                      <span>·</span>
                      <span className="capitalize">{event.host.role}</span>
                    </div>
                    {event.host.bio && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
                        {event.host.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mini Map */}
            {coords && coords.length === 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="px-6 pt-6 pb-3">
                  <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-1">
                    Location
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.location?.address}
                  </p>
                </div>
                <MapContainer
                  center={[coords[1], coords[0]]}
                  zoom={15}
                  style={{ height: "220px", width: "100%" }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  className="z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[coords[1], coords[0]]}>
                    <Popup>{event.title}</Popup>
                  </Marker>
                </MapContainer>
                <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-700">
                  
                    <a
                    href={`https://www.openstreetmap.org/?mlat=${coords[1]}&mlon=${coords[0]}&zoom=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-outdar-sky hover:underline font-medium"
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT: RSVP Card (sticky) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* RSVP Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                      {isFree ? "Free" : `${event.price} MAD`}
                    </span>
                    {!isFree && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">per person</span>
                    )}
                  </div>
                  {event.category && (
                    <span className="text-2xl">{event.category.icon}</span>
                  )}
                </div>

                {/* Capacity bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>👥 {event.attendeeCount} going</span>
                    <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (event.attendeeCount / event.capacity) * 100)}%`,
                        backgroundColor: isFull ? "#EF4444" : spotsLeft <= 5 ? "#F4A261" : "#7CB342",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {event.capacity} total capacity
                  </p>
                </div>

                {/* RSVP Buttons */}
                {!isFull ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleRSVP("going")}
                      className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                        rsvpStatus === "going"
                          ? "bg-outdar-green text-white shadow-sm"
                          : "bg-outdar-red text-white hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                      }`}
                    >
                      {rsvpStatus === "going" ? "✓ You're going! 🎉" : "Going →"}
                    </button>
                    <button
                      onClick={() => handleRSVP("interested")}
                      className={`w-full py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                        rsvpStatus === "interested"
                          ? "border-outdar-sky bg-outdar-sky/10 text-outdar-sky"
                          : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-outdar-sky hover:text-outdar-sky"
                      }`}
                    >
                      {rsvpStatus === "interested" ? "★ Interested!" : "☆ Interested"}
                    </button>
                  </div>
                ) : (
                  <button className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                    Event is Full — Waitlist coming soon
                  </button>
                )}

                {/* Coming soon note */}
                {rsvpStatus && (
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                    💡 Full RSVP system coming in Slice 4!
                  </p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-slate-700 mt-4 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>📅 {formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>⏰ {formatTime(event.date)}</span>
                    <span>
                      {event.duration && `${Math.floor(event.duration / 60)}h duration`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share + Report */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied! 🔗");
                  }}
                  className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-all"
                >
                  🔗 Share
                </button>
                <button className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-400 transition-all">
                  🚩 Report
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventDetail;