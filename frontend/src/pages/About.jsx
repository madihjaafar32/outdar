/**
 * About OUTDAR
 * The story, mission, journey, and the maker.
 */

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BubblesBg from "../components/common/BubblesBg.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";

function About() {
  const { isAuth } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30 dark:from-outdar-navy dark:via-slate-900 dark:to-slate-800 transition-colors duration-500 relative overflow-hidden">

      <BubblesBg variant="warm" subtle />

      {/* ── Frosted Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <BrandLogo size="sm" to={isAuth ? "/home" : "/"} />

          <div className="hidden md:flex items-center gap-1">
            {isAuth ? (
              <>
                <Link to="/home" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all">
                  Home
                </Link>
                <Link to="/browse" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all">
                  Browse
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-outdar-red hover:bg-outdar-red/5 px-3 py-1.5 rounded-lg transition-all">
                  Home
                </Link>
              </>
            )}
            <span className="text-sm font-semibold text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-lg">
              About
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isAuth && (
            <Link
              to="/register"
              className="text-sm px-4 py-2 bg-outdar-red text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-red transition-all"
            >
              Join free →
            </Link>
          )}
        </div>
      </nav>

      <main className="relative z-10">

        {/* ═══════════════════════════════════════════════ */}
        {/* HERO: Casablanca Skyline                       */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="relative">
          <div className="relative w-full h-[400px] md:h-[520px] overflow-hidden">
            <img
              src="/brand/casablanca-skyline.png"
              alt="Casablanca skyline at sunrise"
              className="w-full h-full object-cover"
              draggable="false"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent dark:from-outdar-navy/40"></div>
          </div>

          {/* Hero text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6 max-w-3xl animate-slide-up">
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 font-medium border border-white/20">
                🇲🇦 The story behind OUTDAR
              </span>
              <h1 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[1.05] text-white mb-4 drop-shadow-lg">
                Built where the sun rises
                <br />
                <span className="bg-gradient-to-br from-outdar-yellow via-outdar-orange to-outdar-red bg-clip-text text-transparent">
                  over the Atlantic.
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto drop-shadow">
                OUTDAR was made for Morocco's youth — to step outside, find each
                other, and live more.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* MISSION                                          */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 dark:bg-outdar-red/20 px-3 py-1.5 rounded-full mb-5 font-medium border border-outdar-red/20">
            🎯 Our mission
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight text-gray-900 dark:text-white mb-6">
            Make stepping outside{" "}
            <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
              irresistible.
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Too many young people in Morocco scroll alone wondering "what's
            happening?" while real moments pass them by. OUTDAR opens the door —
            literally and metaphorically — to events, friends, and memories
            waiting just outside.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* VALUES                                           */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🚪",
                title: "Open by design",
                desc: "Free to use, free to host. The door stays open for everyone.",
                color: "outdar-red",
              },
              {
                icon: "💙",
                title: "Real connections",
                desc: "Real names, real RSVPs, real conversations. No performative scrolling.",
                color: "outdar-sky",
              },
              {
                icon: "🌅",
                title: "Local-first",
                desc: "Casablanca, Rabat, and beyond — designed for Moroccan youth, not copy-pasted.",
                color: "outdar-orange",
              },
              {
                icon: "🇲🇦",
                title: "Made in Morocco",
                desc: "Built by us, for us. Our culture, our cities, our energy.",
                color: "outdar-green",
              },
            ].map((v, i) => (
              <div
                key={v.title}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{v.icon}</div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* THE JOURNEY                                      */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="bg-white dark:bg-slate-800/50 border-y border-gray-100 dark:border-slate-700/50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-orange bg-outdar-orange/10 px-3 py-1.5 rounded-full mb-5 font-medium border border-outdar-orange/20">
                🗺️ The journey
              </span>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-tight text-gray-900 dark:text-white mb-4">
                From your door to the{" "}
                <span className="bg-gradient-to-br from-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
                  horizon.
                </span>
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Every great experience starts with one step. Here's the path
                OUTDAR walks with you.
              </p>
            </div>

            {/* Journey illustration */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 mb-10">
              <img
                src="/brand/outdar-journey.png"
                alt="The OUTDAR journey — from beginning to brighter future"
                className="w-full h-auto object-cover"
                draggable="false"
              />
            </div>

            {/* Journey steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  title: "Stepping out",
                  desc: "Open the door, browse what's happening near you.",
                  color: "#E63946",
                },
                {
                  step: "02",
                  title: "Finding your path",
                  desc: "Filter by vibe, category, city. Find your people.",
                  color: "#F4A261",
                },
                {
                  step: "03",
                  title: "Reaching summits",
                  desc: "RSVP, show up, meet new friends, make memories.",
                  color: "#FFD93D",
                },
                {
                  step: "04",
                  title: "A brighter future",
                  desc: "More events. More connections. A fuller life.",
                  color: "#7CB342",
                },
              ].map((step, i) => (
                <div
                  key={step.step}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className="font-mono text-3xl font-extrabold mb-2"
                    style={{ color: step.color }}
                  >
                    {step.step}
                  </div>
                  <h4 className="font-display font-bold text-base text-gray-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* BY THE NUMBERS                                   */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-sky bg-outdar-sky/10 px-3 py-1.5 rounded-full mb-5 font-medium border border-outdar-sky/20">
              📊 By the numbers
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900 dark:text-white">
              A platform that's{" "}
              <span className="bg-gradient-to-br from-outdar-sky to-outdar-green bg-clip-text text-transparent">
                already alive.
              </span>
            </h2>
          </div>

          <div className="bg-gradient-to-br from-outdar-navy to-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Decorative bubbles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-outdar-red/30 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-outdar-sky/30 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-outdar-yellow/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "30+", label: "Live events",  icon: "🎟️" },
                { value: "8",   label: "Categories",   icon: "🏷️" },
                { value: "5",   label: "Verified hosts", icon: "🎤" },
                { value: "2",   label: "Cities",       icon: "🌍" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="font-display font-extrabold text-4xl md:text-5xl text-white mb-1">
                    {s.value}
                  </p>
                  <p className="text-sm text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* MEET THE MAKER                                   */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">

              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow flex items-center justify-center text-white text-5xl font-display font-extrabold shadow-red-lg ring-4 ring-outdar-red/10">
                  J
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="inline-block font-mono text-xs uppercase tracking-widest text-outdar-red bg-outdar-red/10 px-3 py-1.5 rounded-full mb-3 font-medium border border-outdar-red/20">
                  👨‍💻 The builder
                </span>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900 dark:text-white mb-3">
                  Made by{" "}
                  <span className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow bg-clip-text text-transparent">
                    Jaafar
                  </span>
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                  OUTDAR is my MERN graduation project — built from scratch in
                  Casablanca with React, Node, MongoDB, Socket.io, and Gemini AI.
                  Every line of code, every pixel, every event seeded — made
                  with{" "}
                  <span className="text-outdar-red font-semibold">love</span>{" "}
                  for Moroccan youth.
                </p>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <a
                    href="https://github.com/madihjaafar32/outdar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-outdar-navy dark:bg-white text-white dark:text-outdar-navy rounded-xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-outdar-red/10 border border-outdar-red/20 text-outdar-red rounded-xl text-sm font-semibold">
                    📍 Casablanca, Morocco
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold">
                    🎓 Final-year project · 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* CTA                                              */}
        {/* ═══════════════════════════════════════════════ */}
        {!isAuth && (
          <section className="max-w-4xl mx-auto px-6 pb-20">
            <div className="bg-gradient-to-br from-outdar-red via-outdar-orange to-outdar-yellow rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden shadow-red-lg">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4 drop-shadow">
                  Ready to step outside?
                </h2>
                <p className="text-base md:text-lg text-white/90 mb-8 max-w-md mx-auto">
                  Join the door of discovery. Free, forever.
                </p>
                <Link
                  to="/register"
                  className="inline-block px-8 py-4 bg-white text-outdar-red rounded-2xl font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  Start exploring free →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* Footer                                           */}
        {/* ═══════════════════════════════════════════════ */}
        <footer className="border-t border-gray-200 dark:border-slate-700 py-10 text-center">
          <p className="font-mono text-sm text-gray-400 dark:text-gray-500 mb-2">
            — Discover. Connect. Explore. —
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Built with 💙 in Casablanca · OUTDAR © 2026
          </p>
        </footer>

      </main>
    </div>
  );
}

export default About;