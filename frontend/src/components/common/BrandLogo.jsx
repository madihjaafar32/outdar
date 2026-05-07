/**
 * BrandLogo
 * Uses real OUTDAR brand assets.
 * Auto-switches light/dark variant based on theme.
 *
 * Variants:
 *   <BrandLogo />                       Mark only, default size
 *   <BrandLogo size="sm" />             Small (navbar)
 *   <BrandLogo size="lg" />             Large (splash)
 *   <BrandLogo full />                  Full logo (mark + OUTDAR text)
 *   <BrandLogo animated />              Subtle hover animation
 *   <BrandLogo magic />                 BRAND MAGIC — door reveal animation (special moments only)
 */

import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";

function BrandLogo({
  size = "md",
  to = "/",
  full = false,
  animated = true,
  magic = false,
}) {
  const { isDark } = useTheme();

  const sizes = {
    sm: { mark: "w-9 h-9",   full: "h-7"  },
    md: { mark: "w-11 h-11", full: "h-8"  },
    lg: { mark: "w-16 h-16", full: "h-12" },
  };

  const s = sizes[size];

  // Pick correct logo variant based on theme
  // light asset = white/bright (for dark backgrounds)
  // dark asset = navy (for light backgrounds)
  const markSrc = isDark ? "/brand/outdar-mark-dark.png" : "/brand/outdar-mark-light.png";
  const fullSrc = isDark ? "/brand/outdar-full-dark.png" : "/brand/outdar-full-light.png";

  // Build classNames
  const wrapperClass = `flex items-center gap-2 group ${magic ? "outdar-magic-trigger" : ""}`;

  const content = full ? (
    <div className={wrapperClass}>
      <img
        src={fullSrc}
        alt="OUTDAR"
        className={`${s.full} object-contain transition-transform ${
          animated ? "group-hover:scale-105" : ""
        } ${magic ? "outdar-magic-image" : ""}`}
        draggable="false"
      />
    </div>
  ) : (
    <div className={wrapperClass}>
      <img
        src={markSrc}
        alt="OUTDAR"
        className={`${s.mark} object-contain transition-all ${
          animated ? "group-hover:scale-110 group-hover:rotate-3" : ""
        } ${magic ? "outdar-magic-image" : ""}`}
        draggable="false"
      />
    </div>
  );

  if (to) {
    return <Link to={to} aria-label="OUTDAR home">{content}</Link>;
  }
  return content;
}

export default BrandLogo;