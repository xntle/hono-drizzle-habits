import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from "./db/index.js";
import { habits } from "./db/schema.js";
import { eq, sql } from "drizzle-orm";

import {z} from "zod"


const app = new Hono()

const habitSchema = z.object({
  title: z.string(),
  description: z.string(),
});

//testing zod
// const habitSuccess = {
//   title: "Book Reading",
//   description: "read 10 pages of books",
// };


// const habitFails = {
//   title: 123,
//   description: 456,
// };


// console.log(habitSchema.safeParse(habitSuccess));
// console.log(habitSchema.safeParse(habitFails));


//retrieve all habits
app.get('/', async (c) => {
  try {
    // fetch all items
    const allItems = await db.select().from(habits); 
    return c.json(allItems);
  } catch (error) {
    //debug
    console.error("Error fetching items:", error);
    return c.json({ error: "Internal server error." }, 500);
  }
});

// create a habit
app.post('/habits', async (c) => {
  try {

    //validate
    const body = await c.req.json();
    const parsed = habitSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400);
    }

    const { title, description } = parsed.data;

    // insert
    const newHabit = await db.insert(habits).values({ title, description }).returning();

    return c.json(newHabit, 201);
  } catch (error) {
    //debug
    console.error('Error creating habit:', error);
    return c.json({ error: 'Internal server error.' }, 500);
  }
});


//delete a habit
app.delete('/habits/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid habit ID.' }, 400);
    }

    await db.delete(habits).where(eq(habits.id, id));
    return c.json({ message: `Habit with ID ${id} has been deleted.` }, 200);
  } catch (error) {
    console.error('Error deleting habit:', error);
    return c.json({ error: 'Internal server error.' }, 500);
  }
});

//increment streak
app.put('/habits/:id/increment-streak', async (c) => {
  try {
    const id = Number(c.req.param('id'));

    // validate ID
    if (isNaN(id)) {
      return c.json({ error: 'Invalid habit ID.' }, 400);
    }

    // increment streak by 1
    const updatedHabit = await db
      .update(habits)
      .set({ streak: sql`${habits.streak} + 1` })
      .where(eq(habits.id, id))
      .returning();

    return c.json(updatedHabit, 200);
  } catch (error) {
    //debug
    console.error('Error updating streak:', error);
    return c.json({ error: 'Internal server error.' }, 500);
  }
});


const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
