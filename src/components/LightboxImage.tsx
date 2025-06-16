import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LightboxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export function LightboxImage({ src, alt, className, containerClassName }: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { theme } = useTheme();

  const openLightbox = () => {
    setIsOpen(true);
    setImageLoaded(false);
  };
  
  const closeLightbox = () => {
    setIsOpen(false);
    setImageLoaded(false);
  };
  
  // Close lightbox when pressing ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeLightbox();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  
  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className={`cursor-zoom-in ${containerClassName || ""}`}>
        <img
          src={src}
          alt={alt}
          className={className || ""}
          onClick={openLightbox}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>

      {isOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="lightbox-loading">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Image container */}
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              className="lightbox-image"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => (e.currentTarget.style.display = "none")}
              draggable="false"
            />
            
            {/* Close button - positioned at top right corner of image */}
            <button 
              onClick={closeLightbox}
              className={`lightbox-close ${
                theme === "dark" 
                  ? "bg-black/80 text-white hover:bg-black/90 border border-white/20" 
                  : "bg-white/90 text-black hover:bg-white border border-black/10"
              }`}
              aria-label="Lightbox schließen"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Instructions at bottom */}
          <div className="lightbox-instructions">
            <div className={`px-3 py-1 rounded-full text-sm ${
              theme === "dark" 
                ? "bg-black/60 text-white/70" 
                : "bg-white/80 text-black/70"
            }`}>
              ESC oder Klick außerhalb zum Schließen
            </div>
          </div>
        </div>
      )}
    </>
  );
}