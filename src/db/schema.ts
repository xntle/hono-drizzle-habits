import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Habits Table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(), // Unique ID for each habit
  title: text("title").notNull(), // Title of the habit
  description: text("description"), // Description of the habit
  streak: integer("streak").default(0), // Current streak count (default 0)
  createdAt: timestamp("created_at").defaultNow(), // Timestamp when the habit was created
});
