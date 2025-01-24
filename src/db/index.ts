import pkg from "pg";
const { Client } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { habits } from "./schema.js";

// load from env
dotenv.config();

// connect to postgresql database
const client = new Client({
  connectionString: process.env.DATABASE_URL, 
});
client.connect();

// initialize drizzle with the connected client
export const db = drizzle(client);

export { habits };