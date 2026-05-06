/**
 * Admin Service
 */

import api from "./axios.js";

export const getStats       = () => api.get("/admin/stats").then(r => r.data);
export const getUsers       = (params) => api.get("/admin/users", { params }).then(r => r.data);
export const verifyHost     = (id) => api.patch(`/admin/users/${id}/verify-host`).then(r => r.data);
export const banUser        = (id) => api.patch(`/admin/users/${id}/ban`).then(r => r.data);
export const getPendingHosts = () => api.get("/admin/hosts/pending").then(r => r.data);
export const getAdminEvents = (params) => api.get("/admin/events", { params }).then(r => r.data);
export const forceDeleteEvent = (id) => api.delete(`/admin/events/${id}`).then(r => r.data);
export const getCategories  = () => api.get("/admin/categories").then(r => r.data);