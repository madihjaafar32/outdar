/**
 * Event Chat Page
 * Real-time chat room for event attendees
 */

import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import { getEvent } from "../services/event.service.js";
import api from "../services/axios.js";

import ThemeToggle from "../components/common/ThemeToggle.jsx";

function EventChat() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    Promise.all([
      getEvent(id),
      api.get(`/messages/${id}`),
    ])
      .then(([eventRes, messagesRes]) => {
        setEvent(eventRes.data.event);
        setMessages(messagesRes.data.data.messages);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load chat");
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!socket || !id || isLoading || error) return;

    socket.emit("join_chat", { eventId: id });

    socket.on("joined_chat", () => {
      setIsJoined(true);
    });

    socket.on("message_received", (message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on("user_joined_chat", ({ user: joinedUser }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          type: "system",
          content: `${joinedUser.name} joined the chat 👋`,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user_left_chat", ({ user: leftUser }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          type: "system",
          content: `${leftUser.name} left the chat`,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user_typing", ({ user: typingUser }) => {
      setTypingUsers((prev) => {
        if (prev.find((u) => u._id === typingUser._id)) return prev;
        return [...prev, typingUser];
      });
    });

    socket.on("user_stopped_typing", ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    return () => {
      socket.emit("leave_chat", { eventId: id });
      socket.off("joined_chat");
      socket.off("message_received");
      socket.off("user_joined_chat");
      socket.off("user_left_chat");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
      socket.off("error");
    };
  }, [socket, id, isLoading, error]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit("send_message", { eventId: id, content: input.trim() });
    setInput("");
    socket.emit("typing_stop", { eventId: id });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!socket) return;

    socket.emit("typing_start", { eventId: id });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { eventId: id });
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-outdar-red/20 border-t-outdar-red rounded-full animate-spin"></div>
          <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
            Joining chat...
          </p>
        </div>
      </div>
    );
  }

  // ── Error (not RSVP'd) ────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Chat not available
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to={`/events/${id}`}
            className="px-6 py-3 bg-outdar-red text-white rounded-xl font-semibold text-sm hover:-translate-y-0.5 hover:shadow-red transition-all"
          >
            ← Back to Event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-500">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="text-gray-500 dark:text-gray-400 hover:text-outdar-red transition-colors text-lg group"
        >
          <span className="inline-block group-hover:-translate-x-0.5 transition-transform">←</span>
        </button>

        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-outdar-red/10">
          <img
            src={event?.image}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-sm text-gray-900 dark:text-white truncate">
            {event?.title}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isJoined ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-outdar-green rounded-full inline-block animate-pulse"></span>
                Live chat
              </span>
            ) : (
              "Connecting..."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/events/${id}`}
            className="text-xs text-outdar-sky hover:underline font-medium"
          >
            View event
          </Link>
          <ThemeToggle className="!w-9 !h-9" />
        </div>
      </div>

      {/* ── Pinned event info ── */}
      <div className="flex-shrink-0 bg-gradient-to-r from-outdar-red/5 to-outdar-orange/5 dark:from-outdar-red/10 dark:to-outdar-orange/10 border-b border-outdar-red/20 px-4 py-2 flex items-center gap-2">
        <span className="text-sm">📅</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {event && new Date(event.date).toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short",
          })}
          {" · "}
          {event && new Date(event.date).toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit",
          })}
          {" · "}
          {event?.location?.venueName}
        </span>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-5xl mb-3">💬</div>
            <p className="font-display font-semibold text-gray-900 dark:text-white mb-1">
              Be the first to say hi!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start the conversation with fellow attendees
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isOwn = message.sender?._id === user?._id ||
                        message.sender === user?._id;
          const isSystem = message.type === "system";

          if (isSystem) {
            return (
              <div key={message._id} className="flex justify-center animate-fade-in">
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {message.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={message._id}
              className={`flex items-end gap-2 animate-fade-in ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isOwn && (
                <div className="flex-shrink-0 mb-1">
                  {message.sender?.avatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-outdar-red to-outdar-orange flex items-center justify-center text-white text-xs font-bold">
                      {message.sender?.name?.[0]}
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-xs lg:max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                {!isOwn && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1 font-medium">
                    {message.sender?.name}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isOwn
                      ? "bg-outdar-red text-white rounded-br-sm"
                      : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-bl-sm"
                  }`}
                >
                  {message.content}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 mx-1 font-mono">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-outdar-red to-outdar-orange opacity-50"></div>
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-outdar-red rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 mb-1 italic">
              {typingUsers.map(u => u.name.split(" ")[0]).join(", ")} typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-3 border border-transparent focus-within:border-outdar-red/30 transition-colors">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (Enter to send)"
              rows={1}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none"
              style={{ maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-11 h-11 bg-outdar-red text-white rounded-2xl flex items-center justify-center hover:bg-outdar-red-dark hover:-translate-y-0.5 hover:shadow-red transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
          >
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default EventChat;