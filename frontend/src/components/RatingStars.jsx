import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = rating >= starValue;
        const isHalf = rating > index && rating < starValue;

        return (
          <button
            key={index}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${currentSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-300/50 text-amber-400'
                  : 'fill-neutral-200 text-neutral-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
