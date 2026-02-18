"use strict";

// USERS MODULE REMOVED
// Controller stubs kept to avoid breaking accidental imports elsewhere.

export const createUser = async (_req, res) => {
  return res.status(410).json({ success: false, message: "Users module removed" });
};

export const getUsers = async (_req, res) => {
  return res.status(410).json({ success: false, message: "Users module removed" });
};
