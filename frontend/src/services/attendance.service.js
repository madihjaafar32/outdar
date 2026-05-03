/**
 * Attendance Service
 * Wraps /api/attendances endpoints
 */

import api from "./axios.js";

export const rsvp = async (eventId, status) => {
  const response = await api.post("/attendances", { eventId, status });
  return response.data;
};

export const getMyStatus = async (eventId) => {
  const response = await api.get(`/attendances/my-status/${eventId}`);
  return response.data;
};

export const getEventAttendees = async (eventId) => {
  const response = await api.get(`/attendances/event/${eventId}`);
  return response.data;
};

export const getMyEvents = async () => {
  const response = await api.get("/attendances/my-events");
  return response.data;
};