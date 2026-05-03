/**
 * Makes one event "past" so we can test reviews
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const event = await Event.findOne({ title: /Jazz/i });
  if (!event) {
    console.log("❌ Jazz event not found!");
    process.exit(1);
  }
  
  event.date = new Date("2026-04-01T20:00:00Z");
  await event.save();
  
  console.log(`✅ Done! "${event.title}" moved to past`);
  console.log(`📅 New date: ${event.date}`);
  process.exit(0);
}

run().catch(console.error);