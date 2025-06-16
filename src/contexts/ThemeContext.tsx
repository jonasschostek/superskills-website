
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Default to dark theme
  const [mounted, setMounted] = useState(false);

  // Only update theme after component has mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    setTheme(savedTheme || "dark");
  }, []);

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove the previous theme class
    root.classList.remove("light", "dark");
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Apply background color directly to improve transitions
    root.style.backgroundColor = theme === "dark" ? "var(--background)" : "var(--background)";
    body.style.backgroundColor = theme === "dark" ? "var(--background)" : "var(--background)";
    
    // Store theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Avoid rendering content until after client-side hydration
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}
