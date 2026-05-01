/**
 * JWT Utilities
 * Sign tokens (on login/register) and verify them (in middleware).
 */

import jwt from "jsonwebtoken";

/**
 * Sign a JWT token for a user
 * @param {Object} payload - Data to embed in the token (typically { userId, role })
 * @returns {String} Signed JWT token
 */
export const signToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify a JWT token and return its decoded payload
 * @param {String} token - The JWT token to verify
 * @returns {Object} Decoded payload (e.g. { userId, role, iat, exp })
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};