/**
 * Events Seeder — OUTDAR
 * 30+ realistic events in Casablanca & Rabat
 * Distributed across 5 different hosts
 *
 * Run with: npm run seed:events
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

dotenv.config();

// ✅ All 5 hosts
const HOSTS = {
  jaafar:  "69f40a39b949dc9e8bcb4754",
  sara:    "69f6a5228fe0dfbed858e8b1",
  ahmed:   "69f6a5228fe0dfbed858e8b2",
  fatima:  "69f6a5228fe0dfbed858e8b3",
  yassine: "69f6a5228fe0dfbed858e8b4",
};

// Helper: date from now + N days
const future = (days, hour = 20) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
};

// Helper: Picsum image URL
const img = (seed, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Real coordinates [lng, lat]
const LOCATIONS = {
  uzine:        { coordinates: [-7.6305, 33.5892], address: "Uzine, Quartier des arts, Casablanca", venueName: "Uzine", city: "Casablanca" },
  corniche:     { coordinates: [-7.6731, 33.5969], address: "Boulevard de la Corniche, Casablanca", venueName: "Ain Diab Beach", city: "Casablanca" },
  anfa:         { coordinates: [-7.6614, 33.5888], address: "Anfa Place, Casablanca", venueName: "Anfa Place", city: "Casablanca" },
  maarif:       { coordinates: [-7.6387, 33.5765], address: "Quartier Maarif, Casablanca", venueName: "Maarif Hub", city: "Casablanca" },
  hassan2:      { coordinates: [-7.6326, 33.6084], address: "Avenue Hassan II, Casablanca", venueName: "Hassan II Boulevard", city: "Casablanca" },
  gare:         { coordinates: [-7.5897, 33.5925], address: "Gare Casa-Port, Casablanca", venueName: "Casa-Port Area", city: "Casablanca" },
  boultek:      { coordinates: [-7.6201, 33.5834], address: "Boultek, Casablanca", venueName: "Boultek", city: "Casablanca" },
  twiza:        { coordinates: [-7.5981, 33.5761], address: "Twiza Rooftop, Casablanca", venueName: "Twiza", city: "Casablanca" },
  agdal:        { coordinates: [-6.8590, 33.9999], address: "Agdal, Rabat", venueName: "Agdal Park", city: "Rabat" },
  kasbah:       { coordinates: [-6.8326, 34.0253], address: "Kasbah des Oudaias, Rabat", venueName: "Kasbah des Oudaias", city: "Rabat" },
  medina_rabat: { coordinates: [-6.8354, 34.0181], address: "Medina de Rabat", venueName: "Médina de Rabat", city: "Rabat" },
  ocean:        { coordinates: [-6.8584, 34.0100], address: "Boulevard de l'Ocean, Rabat", venueName: "Plage de Rabat", city: "Rabat" },
};

const getEvents = (cats) => [

  // ─── JAAFAR'S EVENTS — Music 🎵 ──────────────────────────
  {
    host: HOSTS.jaafar,
    title: "Rooftop Jazz Night at Twiza",
    description: "An unforgettable evening of smooth jazz under the Casablanca stars 🌙 Live trio, craft cocktails, and panoramic city views. Dress code: smart casual. Limited to 60 guests.",
    category: cats.music,
    image: img("jazz-rooftop-night"),
    date: future(3, 20), duration: 180, capacity: 60, price: 80,
    location: LOCATIONS.twiza,
  },
  {
    host: HOSTS.jaafar,
    title: "Open Mic Night — Uzine",
    description: "Take the stage or just enjoy! Every Friday, Uzine opens its doors to local artists, poets, and musicians. Free entry, amazing energy. Come early for a good spot.",
    category: cats.music,
    image: img("open-mic-stage"),
    date: future(5, 19), duration: 240, capacity: 120, price: 0,
    location: LOCATIONS.uzine,
  },
  {
    host: HOSTS.jaafar,
    title: "MERN Stack Developers Meetup",
    description: "Monthly meetup for web developers in Casablanca! Share projects, get code reviews, network. Beginners and seniors both welcome. Pizza included 🍕",
    category: cats.study,
    image: img("tech-meetup-developers"),
    date: future(5, 18), duration: 180, capacity: 50, price: 0,
    location: LOCATIONS.boultek,
  },
  {
    host: HOSTS.jaafar,
    title: "Board Game Night — Maarif Café",
    description: "From Catan to Codenames, we've got 50+ board games available. Come solo or in groups. Drinks available. Perfect for meeting new people! 🎲",
    category: cats.gaming,
    image: img("board-game-night-cafe"),
    date: future(1, 18), duration: 240, capacity: 40, price: 20,
    location: LOCATIONS.maarif,
  },

  // ─── SARA'S EVENTS — Music + Nightlife 🎤 ────────────────
  {
    host: HOSTS.sara,
    title: "Gnawa Night — Medina Vibes",
    description: "Experience the hypnotic sounds of Gnawa music in the heart of Rabat's Médina. Traditional instruments, authentic atmosphere, a cultural night you won't forget.",
    category: cats.music,
    image: img("gnawa-music-morocco"),
    date: future(7, 21), duration: 150, capacity: 80, price: 50,
    location: LOCATIONS.medina_rabat,
  },
  {
    host: HOSTS.sara,
    title: "Electronic Sunset — Ain Diab",
    description: "The sun goes down, the music goes up 🎛️ Beachfront electronic music session with local DJs. Sand under your feet, sea breeze, good vibes only.",
    category: cats.music,
    image: img("beach-dj-sunset"),
    date: future(4, 18), duration: 300, capacity: 200, price: 60,
    location: LOCATIONS.corniche,
  },
  {
    host: HOSTS.sara,
    title: "Acoustic Brunch at Anfa",
    description: "Sunday well spent! Live acoustic music during a relaxed brunch session. Great food, chilled atmosphere, perfect for meeting new people. Tables fill fast — RSVP now.",
    category: cats.music,
    image: img("acoustic-brunch"),
    date: future(9, 11), duration: 180, capacity: 50, price: 120,
    location: LOCATIONS.anfa,
  },
  {
    host: HOSTS.sara,
    title: "Rooftop Party — Anfa Place",
    description: "The party of the month is here 🎉 Rooftop venue, DJ from 10PM, cocktail bar, dress to impress. One of Casablanca's most beautiful event spaces.",
    category: cats.nightlife,
    image: img("rooftop-party-night"),
    date: future(2, 22), duration: 300, capacity: 150, price: 100,
    location: LOCATIONS.anfa,
  },
  {
    host: HOSTS.sara,
    title: "Karaoke Night — Maarif",
    description: "No judgment, maximum fun! Monthly karaoke night open to everyone. Arabic, French, English — all songs welcome. Shows start at 9PM. 🎤",
    category: cats.nightlife,
    image: img("karaoke-night-friends"),
    date: future(11, 21), duration: 210, capacity: 60, price: 50,
    location: LOCATIONS.maarif,
  },

  // ─── AHMED'S EVENTS — Sports + Outdoor ⚽ ────────────────
  {
    host: HOSTS.ahmed,
    title: "Pickup Football — Corniche",
    description: "Casual 5v5 football on the beach. No skill level required — just bring your energy and water! Teams picked on arrival. Cleats recommended but not required.",
    category: cats.sports,
    image: img("beach-football-pickup"),
    date: future(2, 9), duration: 120, capacity: 22, price: 0,
    location: LOCATIONS.corniche,
  },
  {
    host: HOSTS.ahmed,
    title: "Morning Run Club — Agdal",
    description: "Every Saturday morning, we run together through Agdal's beautiful streets. 5km easy pace — perfect for beginners and experienced runners alike. Coffee after!",
    category: cats.sports,
    image: img("morning-run-group"),
    date: future(6, 7), duration: 90, capacity: 30, price: 0,
    location: LOCATIONS.agdal,
  },
  {
    host: HOSTS.ahmed,
    title: "Basketball 3v3 Tournament",
    description: "Team up for a fun 3v3 basketball tournament. Register as a team of 3 or come solo and we'll match you up. Prizes for winners. Good sport vibes guaranteed.",
    category: cats.sports,
    image: img("basketball-tournament"),
    date: future(10, 15), duration: 240, capacity: 60, price: 30,
    location: LOCATIONS.maarif,
  },
  {
    host: HOSTS.ahmed,
    title: "Surf & SUP Initiation — Rabat",
    description: "Try surfing or stand-up paddleboarding for the first time! Experienced instructors, equipment provided. Ocean Rabat beach, small groups for maximum attention.",
    category: cats.sports,
    image: img("surf-lesson-morocco"),
    date: future(8, 10), duration: 180, capacity: 15, price: 200,
    location: LOCATIONS.ocean,
  },
  {
    host: HOSTS.ahmed,
    title: "Yoga at Kasbah des Oudaias",
    description: "Start your week with a sunrise yoga session in one of Rabat's most beautiful spots. All levels welcome. Bring your mat and an open mind. 🧘",
    category: cats.sports,
    image: img("yoga-sunrise-ocean"),
    date: future(1, 7), duration: 75, capacity: 25, price: 40,
    location: LOCATIONS.kasbah,
  },
  {
    host: HOSTS.ahmed,
    title: "Sunrise Hike — Ain Diab Cliff",
    description: "Wake up early for a magical coastal hike along Ain Diab's cliffs. Watch the sun rise over the Atlantic. Moderate difficulty. Bring water and good shoes.",
    category: cats.outdoor,
    image: img("sunrise-coastal-hike"),
    date: future(3, 6), duration: 180, capacity: 25, price: 30,
    location: LOCATIONS.corniche,
  },
  {
    host: HOSTS.ahmed,
    title: "Kayak Sunset Tour — Rabat Coast",
    description: "Paddle along the Rabat coast as the sun sets. No experience needed — full safety briefing and equipment provided. Groups of 8 maximum per guide.",
    category: cats.outdoor,
    image: img("kayak-ocean-sunset"),
    date: future(6, 17), duration: 150, capacity: 16, price: 180,
    location: LOCATIONS.ocean,
  },

  // ─── FATIMA'S EVENTS — Art + Study 🎨 ───────────────────
  {
    host: HOSTS.fatima,
    title: "Graffiti Workshop — Boultek",
    description: "Learn spray paint techniques from a local urban artist. Beginners totally welcome! All materials provided. You leave with your own piece to take home. 🎨",
    category: cats.art,
    image: img("graffiti-workshop-urban"),
    date: future(4, 15), duration: 180, capacity: 15, price: 150,
    location: LOCATIONS.boultek,
  },
  {
    host: HOSTS.fatima,
    title: "Photography Walk — Médina Rabat",
    description: "Explore the stunning architecture and light of Rabat's Médina through your lens. Led by a professional photographer. Bring any camera — phone photos welcome!",
    category: cats.art,
    image: img("photography-medina-walk"),
    date: future(11, 9), duration: 180, capacity: 20, price: 100,
    location: LOCATIONS.medina_rabat,
  },
  {
    host: HOSTS.fatima,
    title: "Gallery Opening — Uzine",
    description: "Local artists showcase their work at Uzine's monthly gallery night. Free entry, artist talks at 8PM, drinks available. Support the local art scene!",
    category: cats.art,
    image: img("art-gallery-opening"),
    date: future(7, 18), duration: 240, capacity: 150, price: 0,
    location: LOCATIONS.uzine,
  },
  {
    host: HOSTS.fatima,
    title: "Calligraphy & Arabic Art Workshop",
    description: "Discover the beauty of Arabic calligraphy with a master artist. Traditional tools, patient teaching, and a meditative creative experience. ✍️",
    category: cats.art,
    image: img("arabic-calligraphy-art"),
    date: future(13, 14), duration: 120, capacity: 16, price: 120,
    location: LOCATIONS.kasbah,
  },
  {
    host: HOSTS.fatima,
    title: "French–Arabic Language Exchange",
    description: "Practice your French or Arabic with native speakers! Structured 15-minute conversation rounds so everyone gets to speak. Café setting, relaxed and fun.",
    category: cats.study,
    image: img("language-exchange-cafe"),
    date: future(3, 17), duration: 120, capacity: 30, price: 0,
    location: LOCATIONS.agdal,
  },
  {
    host: HOSTS.fatima,
    title: "Design Thinking Workshop",
    description: "Learn the fundamentals of design thinking and apply them to real problems. Hands-on, collaborative, and energizing. Certificates given on completion.",
    category: cats.study,
    image: img("design-thinking-workshop"),
    date: future(8, 14), duration: 240, capacity: 30, price: 80,
    location: LOCATIONS.uzine,
  },

  // ─── YASSINE'S EVENTS — Food + Gaming + Nightlife 🍔 ────
  {
    host: HOSTS.yassine,
    title: "Street Food Festival — Hassan II",
    description: "30+ vendors, one boulevard. Explore Morocco's best street food alongside international bites. Come hungry! Live music, kids zone, photo spots.",
    category: cats.food,
    image: img("street-food-festival"),
    date: future(12, 12), duration: 480, capacity: 500, price: 0,
    location: LOCATIONS.hassan2,
  },
  {
    host: HOSTS.yassine,
    title: "Moroccan Cooking Masterclass",
    description: "Learn to cook authentic tajine, couscous, and bastilla from a professional Moroccan chef. Small group, hands-on, you eat what you cook at the end! 🍲",
    category: cats.food,
    image: img("moroccan-cooking-class"),
    date: future(6, 15), duration: 180, capacity: 12, price: 250,
    location: LOCATIONS.maarif,
  },
  {
    host: HOSTS.yassine,
    title: "Beach BBQ Sunset Party",
    description: "Bring your friends, we bring the grill 🔥 BYOB optional, meat and veggies provided. Beach games, sunset views, and good company. Don't miss it!",
    category: cats.food,
    image: img("beach-bbq-sunset"),
    date: future(5, 17), duration: 240, capacity: 80, price: 70,
    location: LOCATIONS.corniche,
  },
  {
    host: HOSTS.yassine,
    title: "Brunch & Books — Maarif",
    description: "A cozy Sunday brunch for book lovers. Bring your current read, exchange recommendations, meet like-minded people. Coffee, croissants, conversations.",
    category: cats.food,
    image: img("brunch-cafe-books"),
    date: future(8, 10), duration: 150, capacity: 20, price: 90,
    location: LOCATIONS.maarif,
  },
  {
    host: HOSTS.yassine,
    title: "Wine & Cheese Tasting Night",
    description: "An elegant evening exploring fine wines paired with artisan cheeses from Morocco and Europe. Hosted by a certified sommelier. Limited seats — book fast.",
    category: cats.food,
    image: img("wine-cheese-tasting"),
    date: future(14, 20), duration: 150, capacity: 25, price: 300,
    location: LOCATIONS.anfa,
  },
  {
    host: HOSTS.yassine,
    title: "Beach Cleanup + Bonfire",
    description: "Do good, then celebrate! Morning beach cleanup followed by an evening bonfire, s'mores, and live music. Good for the planet and for your soul. 🌊🔥",
    category: cats.outdoor,
    image: img("beach-cleanup-bonfire"),
    date: future(9, 9), duration: 480, capacity: 50, price: 0,
    location: LOCATIONS.ocean,
  },
  {
    host: HOSTS.yassine,
    title: "FIFA Tournament — Boultek",
    description: "16-player FIFA knockout tournament. Register solo or bring a friend. Prizes: cash + gaming accessories. Brackets announced 2h before start.",
    category: cats.gaming,
    image: img("fifa-gaming-tournament"),
    date: future(4, 16), duration: 300, capacity: 16, price: 40,
    location: LOCATIONS.boultek,
  },
  {
    host: HOSTS.yassine,
    title: "Speakeasy Night — Secret Location",
    description: "1920s-themed speakeasy bar experience. Password revealed 24h before the event to confirmed RSVPs only. Vintage cocktails, jazz, mystery vibes. 🥂🎭",
    category: cats.nightlife,
    image: img("speakeasy-bar-vintage"),
    date: future(15, 21), duration: 240, capacity: 40, price: 150,
    location: LOCATIONS.gare,
  },
];

async function seedEvents() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Verify all hosts exist
    console.log("👥 Verifying hosts...");
    for (const [name, id] of Object.entries(HOSTS)) {
      const user = await User.findById(id);
      if (!user) {
        console.error(`❌ Host "${name}" (${id}) not found! Run seed:users first.`);
        process.exit(1);
      }
      console.log(`   ✅ ${name.padEnd(10)} → ${user.name}`);
    }

    // 2. Load categories
    console.log("\n🏷️  Loading categories...");
    const categoryDocs = await Category.find({ isActive: true });
    if (categoryDocs.length === 0) {
      console.error("❌ No categories found! Run seed:categories first.");
      process.exit(1);
    }

    const cats = {};
    categoryDocs.forEach((cat) => { cats[cat.slug] = cat._id; });
    console.log(`   ✅ ${categoryDocs.length} categories loaded`);

    // 3. Clear existing events
    console.log("\n🧹 Clearing existing events...");
    await Event.deleteMany({});

    // 4. Build + insert events
    const eventData = getEvents(cats).map((ev) => ({
      ...ev,
      host: new mongoose.Types.ObjectId(ev.host),
      location: { type: "Point", ...ev.location },
    }));

    console.log(`\n🌱 Seeding ${eventData.length} events...\n`);
    const inserted = await Event.insertMany(eventData);

    // 5. Display summary grouped by host
    const byHost = {};
    inserted.forEach((ev) => {
      const hostKey = ev.host.toString();
      if (!byHost[hostKey]) byHost[hostKey] = [];
      byHost[hostKey].push(ev.title);
    });

    const hostNames = {
      [HOSTS.jaafar]:  "Jaafar  🎵",
      [HOSTS.sara]:    "Sara    🎤",
      [HOSTS.ahmed]:   "Ahmed   ⚽",
      [HOSTS.fatima]:  "Fatima  🎨",
      [HOSTS.yassine]: "Yassine 🍔",
    };

    Object.entries(byHost).forEach(([hostId, titles]) => {
      console.log(`\n   ${hostNames[hostId] || hostId} (${titles.length} events)`);
      titles.forEach((t) => console.log(`      • ${t}`));
    });

    console.log(`\n\n🎉 Done! ${inserted.length} events across 5 hosts.`);
    console.log(`🌐 Test: http://localhost:5000/api/events`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

seedEvents();