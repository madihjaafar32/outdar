/**
 * AI Controller
 * Gemini-powered event assistant (FREE!)
 */

import AISession from "../models/AISession.js";
import Event from "../models/Event.js";
import Category from "../models/Category.js";


export const chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // 🔍 DEBUG — remove after fixing
    console.log("1️⃣ Message received:", message);
    console.log("2️⃣ User:", req.user?.name);
    console.log("3️⃣ API Key:", !!GEMINI_API_KEY);
    console.log("4️⃣ Key value:", GEMINI_API_KEY?.substring(0, 10));

    
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY not found in .env",
      });
    }

    // 1. Fetch upcoming events
    const upcomingEvents = await Event.find({
      isDeleted: { $ne: true },
      isCancelled: { $ne: true },
      date: { $gte: new Date() },
    })
      .populate("category", "name icon")
      .populate("host", "name")
      .sort({ date: 1 })
      .limit(20)
      .lean();

    // 2. Fetch categories
    const categories = await Category.find({ isActive: true })
      .select("name icon")
      .lean();

    // 3. Format events as text
    const eventsContext = upcomingEvents.length > 0
      ? upcomingEvents.map((ev) => {
          const date = new Date(ev.date).toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short",
          });
          const price = ev.price === 0 ? "Free" : `${ev.price} MAD`;
          return `- "${ev.title}" | ${ev.category?.icon} ${ev.category?.name} | ${date} | ${ev.location?.city} | ${price} | ${ev.attendeeCount}/${ev.capacity} going`;
        }).join("\n")
      : "No upcoming events right now.";

    // 4. Build full prompt (Gemini uses single prompt, not system/user split)
    const fullPrompt = `You are OUTDAR AI, the friendly assistant for OUTDAR — a social event discovery platform for young people in Morocco.

Your personality:
- Warm, friendly, energetic like a well-connected friend
- Concise — short questions get short answers
- Locally aware — you know Casablanca, Rabat, Moroccan culture
- Use emojis sparingly (1-2 max)

Your jobs:
1. Help users discover events on OUTDAR
2. Help hosts write better event descriptions
3. Answer questions about OUTDAR platform
4. Provide social tips

Rules:
- NEVER make up events — only use the real events listed below
- Keep responses under 4 sentences unless detailed help is needed
- Only discuss OUTDAR-related topics

Current user: ${req.user.name} from ${req.user.city}
Available categories: ${categories.map(c => `${c.icon} ${c.name}`).join(", ")}

REAL UPCOMING EVENTS ON OUTDAR:
${eventsContext}

Now answer this user message: ${message.trim()}`;

    // 5. Get or create session
    let session;
    if (sessionId) {
      session = await AISession.findOne({
        _id: sessionId,
        user: req.user._id,
      });
    }

    if (!session) {
      session = await AISession.create({
        user: req.user._id,
        messages: [],
      });
    }

    // 6. Call Gemini API (simple single-turn for reliability)
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("❌ Gemini error:", JSON.stringify(geminiData));
      return res.status(500).json({
        success: false,
        message: `Gemini error: ${geminiData?.error?.message || "Unknown error"}`,
      });
    }

    const aiReply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try again!";

    // 7. Save to session
    session.messages.push(
      { role: "user", content: message.trim() },
      { role: "assistant", content: aiReply }
    );
    session.lastMessageAt = new Date();

    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50);
    }

    await session.save();

    // 8. Find mentioned events for cards
    const mentionedEvents = upcomingEvents.filter((ev) =>
      aiReply.toLowerCase().includes(
        ev.title.toLowerCase().substring(0, 15)
      )
    );

    res.json({
      success: true,
      data: {
        reply: aiReply,
        sessionId: session._id,
        suggestedEvents: mentionedEvents.slice(0, 3),
      },
    });

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await AISession.find({ user: req.user._id })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .select("_id lastMessageAt messages");

    res.json({ success: true, data: { sessions } });
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await AISession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
};