/**
 * BubblesBg
 * Floating animated background bubbles in OUTDAR brand colors.
 * Reusable across all pages — just drop <BubblesBg /> at the top.
 *
 * Variants:
 *   <BubblesBg />              Default (red + sky + yellow)
 *   <BubblesBg variant="warm"> Red + orange + yellow
 *   <BubblesBg variant="cool"> Sky + green + navy
 *   <BubblesBg subtle>         Lower opacity for content-heavy pages
 */

function BubblesBg({ variant = "default", subtle = false }) {
  // Stronger opacity (40) for visibility, lighter (25) for subtle pages
  // Blur-[120px] makes them feel like glowing light, not circles
  const VARIANTS = {
    default: subtle
      ? [
          "absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/25 rounded-full animate-float",
          "absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/25 rounded-full animate-float",
          "absolute w-72 h-72 bottom-20 left-10 bg-outdar-yellow/25 rounded-full animate-float",
        ]
      : [
          "absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/40 rounded-full animate-float",
          "absolute w-80 h-80 top-1/3 -right-24 bg-outdar-sky/40 rounded-full animate-float",
          "absolute w-72 h-72 bottom-20 left-10 bg-outdar-yellow/40 rounded-full animate-float",
        ],
    warm: subtle
      ? [
          "absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/25 rounded-full animate-float",
          "absolute w-80 h-80 top-1/2 -right-24 bg-outdar-orange/25 rounded-full animate-float",
          "absolute w-72 h-72 bottom-10 left-1/3 bg-outdar-yellow/25 rounded-full animate-float",
        ]
      : [
          "absolute w-96 h-96 -top-24 -left-24 bg-outdar-red/40 rounded-full animate-float",
          "absolute w-80 h-80 top-1/2 -right-24 bg-outdar-orange/40 rounded-full animate-float",
          "absolute w-72 h-72 bottom-10 left-1/3 bg-outdar-yellow/40 rounded-full animate-float",
        ],
    cool: subtle
      ? [
          "absolute w-96 h-96 -top-24 -right-24 bg-outdar-sky/25 rounded-full animate-float",
          "absolute w-80 h-80 top-1/2 -left-24 bg-outdar-green/25 rounded-full animate-float",
          "absolute w-72 h-72 bottom-20 right-10 bg-outdar-navy/25 rounded-full animate-float",
        ]
      : [
          "absolute w-96 h-96 -top-24 -right-24 bg-outdar-sky/40 rounded-full animate-float",
          "absolute w-80 h-80 top-1/2 -left-24 bg-outdar-green/40 rounded-full animate-float",
          "absolute w-72 h-72 bottom-20 right-10 bg-outdar-navy/40 rounded-full animate-float",
        ],
  };

  const bubbleClasses = VARIANTS[variant] || VARIANTS.default;
  const delays = ["0s", "-5s", "-10s"];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-70">
      {bubbleClasses.map((classes, i) => (
        <div
          key={i}
          className={classes}
          style={{
            animationDelay: delays[i],
            filter: "blur(120px)", // 🌟 Glow effect, not circle
          }}
        ></div>
      ))}
    </div>
  );
}

export default BubblesBg;