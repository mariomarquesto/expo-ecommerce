import { requireAuth } from "@clerk/express";
import { pool } from "../db/pool.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth?.userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // 🔍 Buscar usuario por Clerk ID (PostgreSQL)
      const { rows } = await pool.query(
        `SELECT * FROM users WHERE clerk_id = $1 LIMIT 1`,
        [clerkId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found in database" });
      }

      req.user = rows[0];

      next();
    } catch (error) {
      console.error("❌ Error in protectRoute middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - missing user" });
  }

  // El admin es simplemente el mail definido en .env
  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - admin access only" });
  }

  next();
};
