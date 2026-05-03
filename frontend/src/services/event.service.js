/**
 * Event Service
 * Wraps all /api/events and /api/categories endpoints
 */

import api from "./axios.js";

// ── Events ──────────────────────────────────────────────

export const getEvents = async (params = {}) => {
  const response = await api.get("/events", { params });
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const getNearbyEvents = async (lng, lat, maxDistance = 15000) => {
  const response = await api.get("/events/nearby", {
    params: { lng, lat, maxDistance },
  });
  return response.data;
};

export const createEvent = async (data) => {
  const response = await api.post("/events", data);
  return response.data;
};

// ── Categories ───────────────────────────────────────────

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};