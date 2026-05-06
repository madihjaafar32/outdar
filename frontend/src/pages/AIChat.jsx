/**
 * AI Chat Page
 * OUTDAR AI Assistant — powered by Gemini ✨
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { sendMessage } from "../services/ai.service.js";
import EventCard from "../components/events/EventCard.jsx";

import BubblesBg from "../components/common/BubblesBg.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

const SUGGESTED_PROMPTS = [
  { text: "What's happening this weekend in Casablanca?", emoji: "🎉" },
  { text: "Find me free events near me",                  emoji: "🆓" },
  { text: "Any music events coming up?",                  emoji: "🎵" },
  { text: "Help me write a description for my event",     emoji: "✍️" },
  { text: "What sports events are available?",            emoji: "⚽" },
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">

      <BubblesBg variant="warm" subtle />

      {/* ── Frosted Navbar ── */}
      <nav className="relative z-10 flex-shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors text-sm group flex items-center gap-1"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Home
          </Link>
          <div className="w-px h-5 bg-gray-200 dark:bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-lg shadow-red animate-pulse-red">
              🤖
            </div>
            <div>
              <p className="font-display font-bold text-sm text-gray-900 dark:text-white">
                OUTDAR AI
              </p>
              <p className="text-xs text-outdar-green flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-outdar-green rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 font-mono">
            Powered by Gemini ✨
          </span>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Messages ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-6">

        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-5xl shadow-red-lg animate-float">
                🤖
              </div>
              <h2 className="font-display font-extrabold text-3xl text-gray-900 dark:text-white mb-2 tracking-tight">
                Hi{" "}
                <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0]}
                </span>!{" "}
                <span className="inline-block animate-wave origin-bottom-right">👋</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-md mx-auto">
                I'm OUTDAR AI — your personal event discovery assistant. Ask me anything about events in Morocco!
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>💡</span> Try asking:
              </p>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(`${prompt.text} ${prompt.emoji}`)}
                  className="group w-full text-left px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm text-gray-700 dark:text-gray-300 hover:border-outdar-red hover:text-outdar-red hover:-translate-y-0.5 hover:shadow-sm transition-all flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{prompt.emoji}</span>
                  <span className="flex-1">{prompt.text}</span>
                  <span className="text-gray-300 dark:text-gray-600 group-hover:text-outdar-red group-hover:translate-x-0.5 transition-all">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <div className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}>

                {message.role === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-base flex-shrink-0 mt-1 shadow-sm">
                    🤖
                  </div>
                )}

                {message.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-outdar-navy dark:bg-white flex items-center justify-center text-white dark:text-outdar-navy text-sm font-bold flex-shrink-0 mt-1 shadow-sm">
                    {user?.name?.[0]}
                  </div>
                )}

                <div className={`max-w-sm lg:max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-outdar-red text-white rounded-tr-sm shadow-red"
                    : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-tl-sm shadow-sm"
                }`}>
                  {message.content}
                </div>
              </div>

              {/* Suggested event cards */}
              {message.suggestedEvents?.length > 0 && (
                <div className="mt-3 ml-12 space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                    <span>🎟️</span> Events I found for you:
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
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-base flex-shrink-0 shadow-sm">
                🤖
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-outdar-orange rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-outdar-yellow rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="relative z-10 flex-shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-t border-gray-200/50 dark:border-slate-700/50 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-transparent focus-within:border-outdar-red/30 transition-colors">
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
            className="w-12 h-12 bg-gradient-to-br from-outdar-red to-outdar-orange text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-red flex-shrink-0 shadow-sm"
          >
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">
          AI can make mistakes. Verify important details. ✨
        </p>
      </div>

    </div>
  );
}

export default AIChat;