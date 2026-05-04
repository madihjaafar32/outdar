/**
 * Review Service
 */

import api from "./axios.js";

export const createReview = async (eventId, rating, comment) => {
  const response = await api.post("/reviews", { eventId, rating, comment });
  return response.data;
};

export const getEventReviews = async (eventId) => {
  const response = await api.get(`/reviews/event/${eventId}`);
  return response.data;
};

export const getMyReview = async (eventId) => {
  const response = await api.get(`/reviews/my-review/${eventId}`);
  return response.data;
};


export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};