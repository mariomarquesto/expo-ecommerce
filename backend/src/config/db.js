import pkg from "pg";
import { ENV } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: ENV.DB_URL,
  ssl:
    ENV.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to POSTGRESQL (Render)");
    client.release();
  } catch (error) {
    console.error("💥 PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};
