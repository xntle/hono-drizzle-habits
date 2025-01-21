import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// babits table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(), 
  title: text("title").notNull(), 
  description: text("description"), 
  streak: integer("streak").default(0), 
  createdAt: timestamp("created_at").defaultNow(), 
});
