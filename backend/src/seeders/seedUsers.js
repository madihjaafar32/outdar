/**
 * Users Seeder — OUTDAR
 * Creates realistic Moroccan users (hosts + regular users)
 * Run with: npm run seed:users
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Your real account ID — we NEVER delete this one
const YOUR_ID = "69f40a39b949dc9e8bcb4754";

const fakeUsers = [
  {
    name: "Sara Idrissi",
    email: "sara@outdar.test",
    password: "test1234",
    role: "host",
    city: "Casablanca",
    bio: "Music lover & rooftop party organizer 🎵 Casablanca born and raised.",
    isVerified: true,
    avatar: "https://picsum.photos/seed/sara-avatar/200/200",
  },
  {
    name: "Ahmed Benali",
    email: "ahmed@outdar.test",
    password: "test1234",
    role: "host",
    city: "Casablanca",
    bio: "Sports & outdoor events. Football, hiking, anything active ⚽🏃",
    isVerified: true,
    avatar: "https://picsum.photos/seed/ahmed-avatar/200/200",
  },
  {
    name: "Fatima Zahra",
    email: "fatima@outdar.test",
    password: "test1234",
    role: "host",
    city: "Rabat",
    bio: "Art curator & cultural events organizer in Rabat 🎨",
    isVerified: true,
    avatar: "https://picsum.photos/seed/fatima-avatar/200/200",
  },
  {
    name: "Yassine Chraibi",
    email: "yassine@outdar.test",
    password: "test1234",
    role: "host",
    city: "Casablanca",
    bio: "Nightlife & food festival organizer. If you see my name, it's gonna be good 🔥",
    isVerified: false,
    avatar: "https://picsum.photos/seed/yassine-avatar/200/200",
  },
  {
    name: "Nadia El Fassi",
    email: "nadia@outdar.test",
    password: "test1234",
    role: "user",
    city: "Casablanca",
    bio: "Always looking for the next adventure 🌍",
    avatar: "https://picsum.photos/seed/nadia-avatar/200/200",
  },
  {
    name: "Karim Tazi",
    email: "karim@outdar.test",
    password: "test1234",
    role: "user",
    city: "Rabat",
    bio: "Rabat based, music and food events mostly 🎶🍔",
    avatar: "https://picsum.photos/seed/karim-avatar/200/200",
  },
  {
    name: "Leila Amrani",
    email: "leila@outdar.test",
    password: "test1234",
    role: "user",
    city: "Casablanca",
    bio: "Tech girl, board game enthusiast, coffee addict ☕",
    avatar: "https://picsum.photos/seed/leila-avatar/200/200",
  },
];

async function seedUsers() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Delete ONLY fake users — keep YOUR real account safe!
    console.log("🧹 Removing old fake users (keeping your account)...");
    await User.deleteMany({
      _id: { $ne: new mongoose.Types.ObjectId(YOUR_ID) },
      email: { $ne: "jaafar@outdar.test" },
    });

    console.log("🌱 Creating fake users...");
    const inserted = await User.insertMany(fakeUsers);

    console.log("\n✅ Users created:\n");
    inserted.forEach((u) => {
      const badge = u.isVerified ? "✓ Verified" : "  Pending";
      console.log(
        `   ${u.role === "host" ? "🎤 HOST" : "👤 USER"} [${badge}]  ${u.name.padEnd(18)} ${u.city.padEnd(12)} ${u.email}`
      );
    });

    console.log("\n📋 All passwords: test1234");
    console.log("✨ Done! Run 'npm run seed:events' next to redistribute events.\n");

    // Return IDs for use in event seeder
    const hostIds = {};
    inserted.forEach((u) => {
      if (u.role === "host") {
        hostIds[u.name.split(" ")[0].toLowerCase()] = u._id.toString();
      }
    });
    console.log("📦 Host IDs (for seedEvents.js):");
    Object.entries(hostIds).forEach(([name, id]) => {
      console.log(`   ${name}: "${id}"`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedUsers();