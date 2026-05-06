/**
 * BrandLogo
 * The OUTDAR logo — door icon + wordmark.
 * Sizes: sm | md | lg
 */

import { Link } from "react-router-dom";

function BrandLogo({ size = "md", to = "/", showText = true, animated = true }) {
  const sizes = {
    sm: { box: "w-8 h-8",   text: "text-base", emoji: "text-lg",  rounded: "rounded-lg"  },
    md: { box: "w-9 h-9",   text: "text-xl",   emoji: "text-xl",  rounded: "rounded-xl"  },
    lg: { box: "w-12 h-12", text: "text-2xl",  emoji: "text-2xl", rounded: "rounded-2xl" },
  };

  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-2 group">
      <div className={`${s.box} ${s.rounded} bg-outdar-red flex items-center justify-center ${s.emoji} shadow-sm transition-all ${animated ? "group-hover:scale-110 group-hover:rotate-12" : ""}`}>
        🚪
      </div>
      {showText && (
        <span className={`font-display font-extrabold ${s.text} text-gray-900 dark:text-white tracking-tight`}>
          OUTDAR
        </span>
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
}

export default BrandLogo;