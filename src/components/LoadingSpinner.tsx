
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingSpinner({ size = "medium", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full border-t-transparent border-primary animate-spin`}></div>
  );
}
