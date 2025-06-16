import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { X } from "lucide-react";

interface SimpleLightboxProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailClassName?: string;
}

export function SimpleLightbox({ src, alt, className = "", thumbnailClassName = "" }: SimpleLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Open lightbox
  const openLightbox = () => {
    setIsOpen(true);
    setImageLoaded(false);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setIsOpen(false);
    // document.body.style.overflow = ''; // Wird im useEffect-Cleanup erledigt
  };

  // Handle clicks on overlay (outside image)
  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeLightbox();
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeLightbox();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup-Funktion: wird ausgeführt, wenn die Komponente unmountet oder isOpen sich ändert
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Setzt den Overflow immer zurück
    };
  }, [isOpen]);

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {/* Thumbnail */}
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity hover:opacity-80 ${thumbnailClassName}`}
        onClick={openLightbox}
        loading="lazy"
      />

      {/* Lightbox Overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="lightbox-overlay"
          onClick={handleOverlayClick}
        >
          {/* Loading spinner */}
          {!imageLoaded && (
            <div className="lightbox-spinner">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {/* Main image container */}
          <div className="lightbox-content">
            <img
              src={src}
              alt={alt}
              className={`lightbox-image ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="lightbox-close"
              aria-label="Schliessen"
            >
              <X size={20} />
            </button>
          </div>

          {/* Instructions */}
          <div className="lightbox-instructions">
            ESC oder ausserhalb klicken zum Schliessen
          </div>
        </div>
      )}
    </>
  );
}