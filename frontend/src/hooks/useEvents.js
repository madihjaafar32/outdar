/**
 * useEvents — custom hook
 * Fetches events with loading + error states
 * Reusable across Home, Browse, Profile pages
 */

import { useState, useEffect } from "react";
import { getEvents } from "../services/event.service.js";

function useEvents(params = {}) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Convert params object to a stable string for dependency array
  const paramKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getEvents(JSON.parse(paramKey));
        if (!cancelled) {
          setEvents(response.data.events);
          setTotal(response.data.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load events");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchEvents();

    // Cleanup — prevent state updates on unmounted component
    return () => { cancelled = true; };
  }, [paramKey]);

  return { events, isLoading, error, total };
}

export default useEvents;