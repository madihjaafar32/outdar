/**
 * EventCard
 * The most-used component in OUTDAR.
 * Shows event photo, title, date, location, price, host, RSVP count.
 */

import { Link } from "react-router-dom";

// Helper: format date nicely
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// Helper: format time
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function EventCard({ event }) {
  if (!event) return null;

  const isFree = event.price === 0;
  const isFull = event.attendeeCount >= event.capacity;
  const spotsLeft = event.capacity - event.attendeeCount;
  const isAlmostFull = !isFull && spotsLeft <= 5;

  return (
    <Link
      to={`/events/${event._id}`}
      className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 dark:border-slate-700"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={event.image || `https://picsum.photos/seed/${event._id}/600/400`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Price badge */}
        <div className="absolute top-3 left-3">
          {isFree ? (
            <span className="px-2.5 py-1 bg-outdar-green text-white text-xs font-bold rounded-full shadow">
              FREE
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-outdar-navy/80 backdrop-blur text-white text-xs font-semibold rounded-full shadow">
              {event.price} MAD
            </span>
          )}
        </div>

        {/* Category badge */}
        {event.category && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2.5 py-1 text-white text-xs font-semibold rounded-full shadow backdrop-blur"
              style={{ backgroundColor: event.category.color + "cc" }}
            >
              {event.category.icon} {event.category.name}
            </span>
          </div>
        )}

        {/* Full overlay */}
        {isFull && (
          <div className="absolute inset-0 bg-outdar-navy/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-white/20 backdrop-blur border border-white/40 text-white font-bold rounded-full text-sm">
              FULL — Waitlist
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4">

        {/* Title */}
        <h3 className="font-display font-semibold text-base text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-outdar-red transition-colors">
          {event.title}
        </h3>

        {/* Date + Time */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>📅</span>
          <span>{formatDate(event.date)}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span>⏰</span>
          <span>{formatTime(event.date)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span>📍</span>
          <span className="truncate">
            {event.location?.venueName || event.location?.address}
          </span>
          <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">·</span>
          <span className="flex-shrink-0 font-medium text-outdar-sky">
            {event.location?.city}
          </span>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">

          {/* Host */}
          <div className="flex items-center gap-2">
            {event.host?.avatar ? (
              <img
                src={event.host.avatar}
                alt={event.host.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-white text-xs font-bold">
                {event.host?.name?.[0] || "?"}
              </div>
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-24">
              {event.host?.name}
            </span>
            {event.host?.isVerified && (
              <span className="text-outdar-sky text-xs">✓</span>
            )}
          </div>

          {/* Attendees + status */}
          <div className="flex items-center gap-2">
            {isAlmostFull && (
              <span className="text-xs text-outdar-orange font-medium">
                {spotsLeft} left!
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>👥</span>
              <span>{event.attendeeCount}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

export default EventCard;