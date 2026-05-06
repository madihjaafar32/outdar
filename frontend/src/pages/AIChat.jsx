/**
 * AI Chat Page
 * OUTDAR AI Assistant — powered by Gemini ✨
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { sendMessage } from "../services/ai.service.js";
import EventCard from "../components/events/EventCard.jsx";

const SUGGESTED_PROMPTS = [
  "What's happening this weekend in Casablanca? 🎉",
  "Find me free events near me 🆓",
  "Any music events coming up? 🎵",
  "Help me write a description for my event ✍️",
  "What sports events are available? ⚽",
];

function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
      },
    ]);

    setIsLoading(true);

    try {
      const res = await sendMessage(userMessage, sessionId);

      setSessionId(res.data.sessionId);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: res.data.reply,
          suggestedEvents: res.data.suggestedEvents || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Sorry, I'm having trouble right now. Please try again! 🙏",
          suggestedEvents: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">

      {/* ── Navbar ── */}
      <nav className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/home" className="text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors text-sm">
            ← Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <p className="font-display font-bold text-sm text-gray-900 dark:text-white">
                OUTDAR AI
              </p>
              <p className="text-xs text-outdar-green">● Online</p>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          Powered by Gemini ✨
        </span>
      </nav>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-4xl shadow-lg">
                🤖
              </div>
              <h2 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white mb-2">
                Hi {user?.name?.split(" ")[0]}! 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                I'm OUTDAR AI — your personal event discovery assistant.
                Ask me anything about events in Morocco!
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Try asking:
              </p>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-700 dark:text-gray-300 hover:border-outdar-red hover:text-outdar-red transition-all hover:-translate-y-0.5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}>

                {/* Avatar */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-base flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-outdar-navy dark:bg-white flex items-center justify-center text-white dark:text-outdar-navy text-sm font-bold flex-shrink-0 mt-1">
                    {user?.name?.[0]}
                  </div>
                )}

                {/* Bubble */}
                <div className={`max-w-sm lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-outdar-red text-white rounded-tr-sm"
                    : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-tl-sm"
                }`}>
                  {message.content}
                </div>
              </div>

              {/* Suggested event cards */}
              {message.suggestedEvents?.length > 0 && (
                <div className="mt-3 ml-11 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    🎟️ Events I found for you:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {message.suggestedEvents.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-base flex-shrink-0">
                🤖
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about events in Morocco..."
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-outdar-red text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-outdar-red/90 flex-shrink-0 shadow-sm"
          >
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          AI can make mistakes. Verify important details.
        </p>
      </div>

    </div>
  );
}

export default AIChat;