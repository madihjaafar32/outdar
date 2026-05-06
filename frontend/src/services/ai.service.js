/**
 * AI Service
 */

import api from "./axios.js";

export const sendMessage = async (message, sessionId = null) => {
  const response = await api.post("/ai/chat", { message, sessionId });
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get("/ai/sessions");
  return response.data;
};