/**
 * ThemeToggle
 * The sun/moon button for switching dark mode.
 * Drop it anywhere in any page.
 */

import { useTheme } from "../../context/ThemeContext.jsx";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={`relative w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-outdar-red dark:hover:border-outdar-red transition-all hover:scale-105 active:scale-95 flex items-center justify-center text-lg overflow-hidden group ${className}`}
    >
      {/* Sun icon (light mode) */}
      <span
        className={`absolute transition-all duration-500 ${
          theme === "light"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        }`}
      >
        ☀️
      </span>

      {/* Moon icon (dark mode) */}
      <span
        className={`absolute transition-all duration-500 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50"
        }`}
      >
        🌙
      </span>
    </button>
  );
}

export default ThemeToggle;