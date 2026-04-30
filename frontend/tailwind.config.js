/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        outdar: {
          red: "#E63946",
          "red-dark": "#c82d3a",
          navy: "#0B1220",
          sky: "#1D9BD6",
          green: "#7CB342",
          yellow: "#FFD93D",
          orange: "#F4A261",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        // Custom scale matching OUTDAR design system
        "display-xl": ["68px", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["56px", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-md": ["44px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["32px", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      spacing: {
        // 4px grid base — Tailwind defaults are already 4px-based
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        red: "0 8px 20px -4px rgba(230, 57, 70, 0.4)",
        "red-lg": "0 12px 28px -6px rgba(230, 57, 70, 0.5)",
        soft: "0 1px 2px 0 rgba(0,0,0,0.05)",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 350ms cubic-bezier(0.34, 1.2, 0.64, 1)",
        "wave": "wave 1s ease-in-out",
        "pulse-red": "pulseRed 2s ease-in-out infinite",
        "float": "float 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(20deg)" },
          "75%": { transform: "rotate(-20deg)" },
        },
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 0 4px rgba(230,57,70,0.2)" },
          "50%": { boxShadow: "0 0 0 8px rgba(230,57,70,0.1)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -40px) scale(1.05)" },
          "50%": { transform: "translate(-20px, 30px) scale(0.95)" },
          "75%": { transform: "translate(-40px, -20px) scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};
