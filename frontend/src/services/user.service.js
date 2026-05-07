/**
 * User Service — calls /api/users
 */

import api from "./axios.js";

export const getMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await api.get(`/users/${userId}`);
  return res.data;
};

export const updateMyProfile = async (updates) => {
  const res = await api.patch("/users/me", updates);
  return res.data;
};

export const getUserActivity = async (userId) => {
  const res = await api.get(`/users/${userId}/activity`);
  return res.data;
};