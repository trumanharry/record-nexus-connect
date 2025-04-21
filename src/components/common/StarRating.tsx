
import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  editable?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  editable = false,
  size = "md",
  onChange
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const handleClick = (selectedRating: number) => {
    if (editable && onChange) {
      onChange(selectedRating);
    }
  };
  
  return (
    <div className="flex">
      {stars.map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            "cursor-pointer transition-all",
            star <= (hoverRating || rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            editable ? "cursor-pointer" : "cursor-default"
          )}
          onMouseEnter={() => editable && setHoverRating(star)}
          onMouseLeave={() => editable && setHoverRating(0)}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
