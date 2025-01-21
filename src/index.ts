import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from "./db/index.js";
import { habits } from "./db/schema.js";
import { eq, sql } from "drizzle-orm";


const app = new Hono()

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
    const { title, description } = await c.req.json();

    // validate
    if (!title || typeof title !== 'string') {
      return c.json({ error: 'Title is required and must be a string.' }, 400);
    }

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
