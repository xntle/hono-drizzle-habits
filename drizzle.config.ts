import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

export default defineConfig({
  out: "./drizzle", 
  schema: "./src/db/schema.ts", 
  dialect: "postgresql", 
  dbCredentials: {
    host: "localhost",
    port: 3000, 
    user: process.env.DB_USER || "user", 
    password: process.env.DB_PASSWORD || "password", 
    database: process.env.DB_NAME || "streak_tracker", 
    ssl: false, // disable SSL for local connections
  },
});
