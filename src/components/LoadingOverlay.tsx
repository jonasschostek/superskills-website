
import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useTheme } from "../contexts/ThemeContext";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Daten werden geladen..." }: LoadingOverlayProps) {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className={`flex flex-col items-center space-y-4 p-6 rounded-lg 
                      ${theme === "dark" 
                        ? "bg-card/80 shadow-lg border border-border" 
                        : "bg-card shadow-lg"}`}>
        <LoadingSpinner size="large" className={theme === "dark" ? "border-primary/70" : ""} />
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
