/**
 * Categories Seeder
 *
 * Run with: npm run seed:categories
 * Or:       node src/seeders/seedCategories.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Music",
    slug: "music",
    icon: "🎵",
    color: "#E63946",
    description: "Concerts, DJ nights, live music, jazz lounges, festivals",
    order: 1,
  },
  {
    name: "Sports",
    slug: "sports",
    icon: "⚽",
    color: "#7CB342",
    description: "Football, basketball, running clubs, hiking groups",
    order: 2,
  },
  {
    name: "Food",
    slug: "food",
    icon: "🍔",
    color: "#F4A261",
    description: "Food festivals, BBQs, cooking classes, restaurant tastings",
    order: 3,
  },
  {
    name: "Art",
    slug: "art",
    icon: "🎨",
    color: "#FFD93D",
    description: "Gallery openings, exhibitions, art workshops, street art tours",
    order: 4,
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    icon: "🏖️",
    color: "#1D9BD6",
    description: "Beach days, hiking, camping, surfing, picnics",
    order: 5,
  },
  {
    name: "Nightlife",
    slug: "nightlife",
    icon: "🌃",
    color: "#0B1220",
    description: "Bars, clubs, rooftop parties, late-night events",
    order: 6,
  },
  {
    name: "Study",
    slug: "study",
    icon: "📚",
    color: "#7CB342",
    description: "Coding meetups, study groups, language exchanges, workshops",
    order: 7,
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: "🎮",
    color: "#E63946",
    description: "Tournaments, board game nights, esports, LAN parties",
    order: 8,
  },
];

async function seedCategories() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("🧹 Clearing existing categories...");
    await Category.deleteMany({});

    console.log("🌱 Seeding categories...");
    const inserted = await Category.insertMany(categories);
    console.log(`✅ Inserted ${inserted.length} categories`);

    console.log("\n📦 Categories created:");
    inserted.forEach((cat) => {
      console.log(`   ${cat.icon}  ${cat.name.padEnd(12)} ${cat.color}`);
    });

    console.log("\n✨ Done! Run 'npm run seed:events' next.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedCategories();