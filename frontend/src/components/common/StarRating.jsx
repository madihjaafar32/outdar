/**
 * StarRating
 * Interactive (for writing reviews) + Display (for showing ratings)
 */

function StarRating({ rating, onRate, size = "md", showNumber = false }) {
  const sizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate && onRate(star)}
          className={`${sizes[size]} transition-transform ${
            onRate ? "hover:scale-125 cursor-pointer" : "cursor-default"
          } ${star <= rating ? "opacity-100" : "opacity-30"}`}
        >
          ⭐
        </button>
      ))}
      {showNumber && rating > 0 && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}


export default StarRating;