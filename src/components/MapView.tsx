import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useReflections } from "../contexts/ReflectionContext";
import type { Reflection } from "../contexts/ReflectionContext";
import { useTheme } from "../contexts/ThemeContext";
import { SimpleLightbox } from "./SimpleLightbox";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

export function MapView() {
  const { reflections, wallpaperUrl, pageTitle, pageDescription, selectedReflection, setSelectedReflection } = useReflections();
  const { theme } = useTheme();
  const [isStoryOpen, setIsStoryOpen] = useState(true);

  // Berechnung des Fortschritts jeder Reflektion
  const getProgress = (reflection: Reflection) => {
    let filledFields = 0;
    let totalFields = 0;
    Object.values(reflection.ausgangslage).forEach(value => { totalFields++; if (value.trim()) filledFields++; });
    Object.entries(reflection.anwendung).forEach(([key, value]) => { if (!key.startsWith('photo')) { totalFields++; if (value.trim()) filledFields++; } });
    Object.values(reflection.bewertung).forEach(value => { totalFields++; if (value.trim()) filledFields++; });
    Object.values(reflection.transfer).forEach(value => { totalFields++; if (value.trim()) filledFields++; });
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  // Farbskala basierend auf dem Fortschritt und dem Theme
  const getColorClass = (progress: number) => {
    if (theme === "dark") {
      if (progress < 20) return "bg-muted/40 hover:bg-muted/60";
      if (progress < 40) return "bg-indigo-950/30 hover:bg-indigo-950/50";
      if (progress < 60) return "bg-indigo-900/40 hover:bg-indigo-900/60";
      if (progress < 80) return "bg-indigo-800/50 hover:bg-indigo-800/70";
      return "bg-indigo-700/60 hover:bg-indigo-700/80";
    } else {
      if (progress < 20) return "bg-muted/50 hover:bg-muted/70";
      if (progress < 40) return "bg-blue-100/60 hover:bg-blue-200/80";
      if (progress < 60) return "bg-blue-200/60 hover:bg-blue-300/80";
      if (progress < 80) return "bg-blue-300/60 hover:bg-blue-400/80";
      return "bg-blue-400/60 hover:bg-blue-500/80";
    }
  };

  // Berechnung der Größe basierend auf Textlänge
  const getSize = (reflection: Reflection) => {
    let totalLength = 0;
    Object.values(reflection.ausgangslage).forEach(value => { totalLength += value.length; });
    Object.entries(reflection.anwendung).forEach(([key, value]) => { if (!key.startsWith('photo')) totalLength += value.length; });
    Object.values(reflection.bewertung).forEach(value => { totalLength += value.length; });
    Object.values(reflection.transfer).forEach(value => { totalLength += value.length; });
    
    // Skalierung der Größe basierend auf der Textmenge
    if (totalLength < 100) return "h-16 w-16";   // 64px
    if (totalLength < 500) return "h-18 w-18";   // 72px
    if (totalLength < 1000) return "h-20 w-20";  // 80px
    if (totalLength < 2000) return "h-22 w-22";  // 88px
    return "h-24 w-24";                         // 96px
  };

  const getCurrentWallpaper = () => {
    if (selectedReflection && selectedReflection.wallpaperUrl) {
      return selectedReflection.wallpaperUrl;
    }
    return wallpaperUrl;
  };

  const activeWallpaper = getCurrentWallpaper();
  const mapContainerStyles = activeWallpaper ? { backgroundImage: `url(${activeWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {};
  const overlayClass = activeWallpaper ? (theme === "dark" ? "after:absolute after:inset-0 after:bg-black/50" : "after:absolute after:inset-0 after:bg-black/60") : "";

  return (
    <div className="space-y-10">
      <div className="text-center space-y-4">
        <h1>{pageTitle}</h1>

        {/* Story Sektion */}
        {!selectedReflection && pageDescription && (
          <Collapsible open={isStoryOpen} onOpenChange={setIsStoryOpen} className="w-full mx-auto">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors">
                <span>Story</span>
                {isStoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <p className="text-muted-foreground leading-relaxed">
                {pageDescription}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Visuelle Map */}
      <div
        className={`relative min-h-[450px] border rounded-xl p-8 flex items-center justify-center mb-8 bg-card overflow-hidden ${overlayClass}`}
        style={mapContainerStyles}
      >
        <div className="relative w-full max-w-2xl aspect-square z-10">
          <svg className="absolute inset-0 w-full h-full">
            {reflections.map((_reflection1, i) =>
              reflections.map((_reflection2, j) => {
                if (i < j) {
                  const angle1 = (i / reflections.length) * 2 * Math.PI;
                  const angle2 = (j / reflections.length) * 2 * Math.PI;
                  const radius = 38;
                  const x1 = 50 + radius * Math.cos(angle1);
                  const y1 = 50 + radius * Math.sin(angle1);
                  const x2 = 50 + radius * Math.cos(angle2);
                  const y2 = 50 + radius * Math.sin(angle2);
                  const strokeColor = activeWallpaper ? (theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.60)") : (theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)");
                  const strokeWidth = activeWallpaper ? (theme === "dark" ? "1.8" : "2.2") : (theme === "dark" ? "1.2" : "1");
                  return (
                    <line key={`${i}-${j}`} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={strokeColor} strokeWidth={strokeWidth} />
                  );
                }
                return null;
              })
            )}
          </svg>

          {reflections.map((reflection, index) => {
            const progress = getProgress(reflection);
            const colorClass = getColorClass(progress);
            const sizeClass = getSize(reflection);
            const angle = (index / reflections.length) * 2 * Math.PI;
            const radius = 38;
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            const isSelected = selectedReflection?.id === reflection.id;
            return (
              <div
                key={reflection.id}
                className={`absolute rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 ease-in-out backdrop-blur-sm ${colorClass} ${sizeClass} ${isSelected ? 'ring-4 ring-primary' : ''}`}
                style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}
                onClick={() => { if (selectedReflection?.id !== reflection.id) { setSelectedReflection(reflection); } }}
              >
                <div className="text-center p-1">
                  <p className="font-medium text-xs leading-tight">{reflection.superskill}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bildbeschreibung */}
      {selectedReflection && (selectedReflection.imageDescription || selectedReflection.imageDescriptionTitle) && (
        <div>
          <Card className="bg-muted/20 border-muted">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">
                    {selectedReflection.imageDescriptionTitle || `${selectedReflection.superskill} - Bildbeschreibung`}
                  </h4>
                  {selectedReflection.imageDescription && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedReflection.imageDescription}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Details Section */}
      {selectedReflection && (
        <div className="mt-8 border rounded-xl p-6 animate-fadeIn bg-card">
          <div className="mb-6">
            <h2>{selectedReflection.superskill}</h2>
          </div>
          <Tabs defaultValue="ausgangslage" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ausgangslage">Ausgangslage</TabsTrigger>
              <TabsTrigger value="anwendung">Anwendung</TabsTrigger>
              <TabsTrigger value="bewertung">Bewertung</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="ausgangslage" className="space-y-4 pt-4">
              <Card>
                <CardHeader><CardTitle>Eigene Ausgangslage</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><h3>Was habe ich bisher unter diesem Superskill verstanden?</h3><p className="whitespace-pre-wrap">{selectedReflection.ausgangslage.verstaendnis || "Keine Angabe"}</p></div>
                  <div><h3>In welchen Situationen habe ich damit gearbeitet?</h3><p className="whitespace-pre-wrap">{selectedReflection.ausgangslage.situationen || "Keine Angabe"}</p></div>
                  <div><h3>Literatur und Bemerkenswertes</h3><p className="whitespace-pre-wrap">{selectedReflection.ausgangslage.literatur || "Keine Angabe"}</p></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="anwendung" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Anwendung</CardTitle>
                  {selectedReflection.anwendung.titel && (<CardDescription>{selectedReflection.anwendung.titel}</CardDescription>)}
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedReflection.anwendung.photo1 && (<div className="max-h-80 overflow-hidden rounded-md bg-background/50"><SimpleLightbox src={selectedReflection.anwendung.photo1} alt="Hauptbild" thumbnailClassName="w-full object-contain" /></div>)}
                  <div><h3>Beschreibung</h3><p className="whitespace-pre-wrap">{selectedReflection.anwendung.beschreibung || "Keine Angabe"}</p></div>
                  <div><h3>Erkenntnisse</h3><p className="whitespace-pre-wrap">{selectedReflection.anwendung.erkenntnisse || "Keine Angabe"}</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {["photo2", "photo3", "photo4"].map((photo, idx) => {
                      const url = selectedReflection.anwendung[photo as keyof typeof selectedReflection.anwendung] as string;
                      if (!url) return null;
                      return (<div key={photo} className="border rounded-md overflow-hidden h-40 bg-background/50"><SimpleLightbox src={url} alt={`Bild ${idx + 2}`} thumbnailClassName="w-full h-full object-cover" /></div>);
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bewertung" className="space-y-4 pt-4">
              <Card>
                <CardHeader><CardTitle>Bewertung & Reflexion</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><h3>Was funktioniert gut?</h3><p className="whitespace-pre-wrap">{selectedReflection.bewertung.funktioniert || "Keine Angabe"}</p></div>
                  <div><h3>Was habe ich übersehen oder unterschätzt?</h3><p className="whitespace-pre-wrap">{selectedReflection.bewertung.uebersehen || "Keine Angabe"}</p></div>
                  <div><h3>Wie hat sich mein Verständnis verändert?</h3><p className="whitespace-pre-wrap">{selectedReflection.bewertung.veraenderung || "Keine Angabe"}</p></div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transfer" className="space-y-4 pt-4">
              <Card>
                <CardHeader><CardTitle>Transfer & Ausblick</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><h3>Zukünftiger Einsatz</h3><p className="whitespace-pre-wrap">{selectedReflection.transfer.zukunft || "Keine Angabe"}</p></div>
                  <div><h3>Tools, Fragen und Methoden</h3><p className="whitespace-pre-wrap">{selectedReflection.transfer.tools || "Keine Angabe"}</p></div>
                  <div><h3>Stärkung des Selbstverständnisses als Designer</h3><p className="whitespace-pre-wrap">{selectedReflection.transfer.selbstverstaendnis || "Keine Angabe"}</p></div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!selectedReflection && (
        <div className="text-center border border-dashed rounded-xl p-8 bg-card">
          <p className="mb-4">Wähle einen Superskill aus der Karte aus, um die Details anzuzeigen.</p>
        </div>
      )}
    </div>
  );
}