import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useReflections } from "../contexts/ReflectionContext";
import { useTheme } from "../contexts/ThemeContext";
import { LoadingOverlay } from "./LoadingOverlay";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isLoading, isSaving, lastSaved, resetToDefault, customLink, customLinkTitle } = useReflections();
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleTitleClick = () => {
    resetToDefault();
    setLocation("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {isLoading && <LoadingOverlay />}
      
      {/* ===== HEADER MIT KORREKTER AUSRICHTUNG ===== */}
      <header className="bg-card text-card-foreground border-b">
        <div className="content-container">
          <div className="flex justify-between items-center py-4">
            <h1 className="cursor-pointer text-xl font-bold" onClick={handleTitleClick}>
              Visual Superskills
            </h1>
            <nav className="flex gap-4 items-center">
              {isSaving && (
                <span className="text-xs text-muted-foreground">Speichern...</span>
              )}
              {!isSaving && lastSaved && (
                <span className="text-xs text-muted-foreground hidden md:inline-block">
                  Version {lastSaved.toLocaleDateString('de-DE')} - {lastSaved.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleTheme}
                      className="relative"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </header>
      
      {/* ===== MAIN CONTENT ===== */}
      <main className="content-container flex-1 py-8">
        {children}
      </main>
      
      {/* ===== FOOTER ===== */}
      <footer className="bg-muted dark:bg-[#0c0c16]">
        <div className="content-container py-6 text-center">
          {customLink ? (
            <a 
              href={customLink.startsWith('http') ? customLink : `https://${customLink}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline dark:text-indigo-400"
            >
              {customLinkTitle || "Custom Link"}
            </a>
          ) : (
            <span className="text-muted-foreground dark:text-gray-500">
              Kein benutzerdefinierter Link festgelegt
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}