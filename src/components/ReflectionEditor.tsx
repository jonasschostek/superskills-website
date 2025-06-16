import React, { useState } from "react";
import { Reflection, useReflections } from "../contexts/ReflectionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleLightbox } from "./SimpleLightbox";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Image, X, FileText, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface ReflectionEditorProps {
  reflection: Reflection;
}

export function ReflectionEditor({ reflection }: ReflectionEditorProps) {
  const { updateReflection } = useReflections();
  const { theme } = useTheme();
  const [wallpaperPreview, setWallpaperPreview] = useState<string | null>(reflection.wallpaperUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const [localReflection, setLocalReflection] = useState<Reflection>(reflection);

  const handleChange = (
    section: keyof Reflection,
    field: string,
    value: string
  ) => {
    const updatedReflection = { ...localReflection };
    
    // Special case for direct properties like wallpaperUrl and imageDescription
    if (field === section) {
      (updatedReflection as any)[field] = value;
    } else {
      // Type assertion to make TypeScript happy with dynamic property access
      (updatedReflection[section] as any)[field] = value;
    }
    
    setLocalReflection(updatedReflection);
    
    // Update preview when wallpaperUrl changes
    if (section === "wallpaperUrl" && field === section) {
      setWallpaperPreview(value || null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await updateReflection(localReflection);
      toast.success("Reflektion erfolgreich gespeichert!", {
        description: `Änderungen für "${localReflection.superskill}" wurden gespeichert.`,
        icon: <Check size={16} />,
      });
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Fehler beim Speichern", {
        description: "Die Reflektion konnte nicht gespeichert werden. Bitte versuche es erneut.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearWallpaper = () => {
    const updatedReflection = { ...localReflection, wallpaperUrl: "" };
    setLocalReflection(updatedReflection);
    setWallpaperPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Sticky Save Button */}
      <div className="sticky top-4 z-20 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="shadow-lg"
          size="lg"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Speichert...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Speichern
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="ausgangslage" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ausgangslage">Ausgangslage</TabsTrigger>
          <TabsTrigger value="anwendung">Anwendung</TabsTrigger>
          <TabsTrigger value="bewertung">Bewertung</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="visualisierung">Visualisierung</TabsTrigger>
        </TabsList>
        
        {/* Ausgangslage */}
        <TabsContent value="ausgangslage" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Eigene Ausgangslage</CardTitle>
              <CardDescription>
                Reflektiere über dein bisheriges Verständnis und deine Erfahrungen mit diesem Superskill.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verstaendnis">
                  Was habe ich bisher unter diesem Superskill verstanden?
                </Label>
                <Textarea
                  id="verstaendnis"
                  value={localReflection.ausgangslage.verstaendnis}
                  onChange={(e) => handleChange("ausgangslage", "verstaendnis", e.target.value)}
                  rows={4}
                  placeholder="Beschreibe dein bisheriges Verständnis..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="situationen">
                  In welchen Situationen habe ich intuitiv oder bewusst damit gearbeitet?
                </Label>
                <Textarea
                  id="situationen"
                  value={localReflection.ausgangslage.situationen}
                  onChange={(e) => handleChange("ausgangslage", "situationen", e.target.value)}
                  rows={4}
                  placeholder="Beschreibe relevante Situationen..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="literatur">
                  Welche spannende Literatur oder Bemerkenswertes gibt es zu diesem Superskill?
                </Label>
                <Textarea
                  id="literatur"
                  value={localReflection.ausgangslage.literatur}
                  onChange={(e) => handleChange("ausgangslage", "literatur", e.target.value)}
                  rows={4}
                  placeholder="Füge Literaturhinweise oder Bemerkenswertes hinzu..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Anwendung */}
        <TabsContent value="anwendung" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Anwendung</CardTitle>
              <CardDescription>
                Dokumentiere deine praktische Anwendung dieses Superskills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="anwendung-titel">Titel</Label>
                <Input
                  id="anwendung-titel"
                  value={localReflection.anwendung.titel}
                  onChange={(e) => handleChange("anwendung", "titel", e.target.value)}
                  placeholder="Gib deiner Anwendung einen Titel..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo1">Photo 1 (S3 URL)</Label>
                <Input
                  id="photo1"
                  value={localReflection.anwendung.photo1}
                  onChange={(e) => handleChange("anwendung", "photo1", e.target.value)}
                  placeholder="Füge einen direkten S3-Link ein..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
                {localReflection.anwendung.photo1 && (
                  <div className={`mt-2 border rounded-md p-2 ${theme === "dark" ? "border-muted bg-background/25" : ""}`}>
                    <SimpleLightbox 
                      src={localReflection.anwendung.photo1} 
                      alt="Photo 1" 
                      thumbnailClassName="max-h-64 mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="beschreibung">Beschreibung</Label>
                <Textarea
                  id="beschreibung"
                  value={localReflection.anwendung.beschreibung}
                  onChange={(e) => handleChange("anwendung", "beschreibung", e.target.value)}
                  rows={4}
                  placeholder="Beschreibe deine Anwendung..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="erkenntnisse">Erkenntnisse</Label>
                <Textarea
                  id="erkenntnisse"
                  value={localReflection.anwendung.erkenntnisse}
                  onChange={(e) => handleChange("anwendung", "erkenntnisse", e.target.value)}
                  rows={4}
                  placeholder="Welche Erkenntnisse hast du gewonnen?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["photo2", "photo3", "photo4"].map((photo, index) => (
                  <div key={photo} className="space-y-2">
                    <Label htmlFor={photo}>Photo {index + 2} (S3 URL)</Label>
                    <Input
                      id={photo}
                      value={localReflection.anwendung[photo as keyof typeof localReflection.anwendung] as string}
                      onChange={(e) => handleChange("anwendung", photo, e.target.value)}
                      placeholder="Füge einen direkten S3-Link ein..."
                      className={theme === "dark" ? "bg-card border-muted" : ""}
                    />
                    {localReflection.anwendung[photo as keyof typeof localReflection.anwendung] && (
                      <div className={`mt-2 border rounded-md p-2 h-32 ${theme === "dark" ? "border-muted bg-background/25" : ""}`}>
                        <SimpleLightbox 
                          src={localReflection.anwendung[photo as keyof typeof localReflection.anwendung] as string} 
                          alt={`Photo ${index + 2}`} 
                          thumbnailClassName="max-h-full mx-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bewertung */}
        <TabsContent value="bewertung" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bewertung & Reflexion</CardTitle>
              <CardDescription>
                Bewerte deine Erfahrungen mit diesem Superskill.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="funktioniert">Was funktioniert gut?</Label>
                <Textarea
                  id="funktioniert"
                  value={localReflection.bewertung.funktioniert}
                  onChange={(e) => handleChange("bewertung", "funktioniert", e.target.value)}
                  rows={4}
                  placeholder="Was funktioniert besonders gut?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uebersehen">Was habe ich übersehen oder unterschätzt?</Label>
                <Textarea
                  id="uebersehen"
                  value={localReflection.bewertung.uebersehen}
                  onChange={(e) => handleChange("bewertung", "uebersehen", e.target.value)}
                  rows={4}
                  placeholder="Was hättest du anders machen können?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="veraenderung">Wie hat sich mein Verständnis im Verlauf der Zeit verändert?</Label>
                <Textarea
                  id="veraenderung"
                  value={localReflection.bewertung.veraenderung}
                  onChange={(e) => handleChange("bewertung", "veraenderung", e.target.value)}
                  rows={4}
                  placeholder="Beschreibe die Veränderung deines Verständnisses..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transfer */}
        <TabsContent value="transfer" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transfer & Ausblick</CardTitle>
              <CardDescription>
                Reflektiere über zukünftige Anwendungen dieses Superskills.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="zukunft">Wie kann ich diesen Superskill zukünftig gezielter einsetzen?</Label>
                <Textarea
                  id="zukunft"
                  value={localReflection.transfer.zukunft}
                  onChange={(e) => handleChange("transfer", "zukunft", e.target.value)}
                  rows={4}
                  placeholder="Wie möchtest du diesen Skill in Zukunft einsetzen?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tools">Welche Tools, Fragen oder Methoden nehme ich mit?</Label>
                <Textarea
                  id="tools"
                  value={localReflection.transfer.tools}
                  onChange={(e) => handleChange("transfer", "tools", e.target.value)}
                  rows={4}
                  placeholder="Welche praktischen Tools und Methoden nimmst du mit?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="selbstverstaendnis">
                  Wie stärkt dieser Superskill mein Selbstverständnis als Designer?
                </Label>
                <Textarea
                  id="selbstverstaendnis"
                  value={localReflection.transfer.selbstverstaendnis}
                  onChange={(e) => handleChange("transfer", "selbstverstaendnis", e.target.value)}
                  rows={4}
                  placeholder="Wie verändert dieser Skill dein Selbstverständnis als Designer?"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualisierung - Erweitert mit Bildbeschreibung */}
        <TabsContent value="visualisierung" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualisierung</CardTitle>
              <CardDescription>
                Gestalte das visuelle Erscheinungsbild dieses Superskills auf der Karte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wallpaperUrl">Hintergrundbild für diesen Superskill (URL)</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallpaperUrl"
                    value={localReflection.wallpaperUrl}
                    onChange={(e) => handleChange("wallpaperUrl", "wallpaperUrl", e.target.value)}
                    placeholder="URL des Hintergrundbilds eingeben..."
                    className={`flex-1 ${theme === "dark" ? "bg-card border-muted" : ""}`}
                  />
                  {localReflection.wallpaperUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={clearWallpaper}
                      className="flex-shrink-0"
                      aria-label="Hintergrundbild entfernen"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Dieses Bild wird als Hintergrund angezeigt, wenn dieser Superskill auf der Karte ausgewählt wird.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageDescriptionTitle">Titel der Bildbeschreibung</Label>
                <Input
                  id="imageDescriptionTitle"
                  value={localReflection.imageDescriptionTitle}
                  onChange={(e) => handleChange("imageDescriptionTitle", "imageDescriptionTitle", e.target.value)}
                  placeholder="z.B. 'Inspiration für Kreativität' oder 'Ästhetische Prinzipien'"
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
                <p className="text-sm text-muted-foreground">
                  Dieser Titel wird als Überschrift der Bildbeschreibung angezeigt.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageDescription">Bildbeschreibung</Label>
                <Textarea
                  id="imageDescription"
                  value={localReflection.imageDescription}
                  onChange={(e) => handleChange("imageDescription", "imageDescription", e.target.value)}
                  rows={3}
                  placeholder="Beschreibe das Hintergrundbild und seine Bedeutung für diesen Superskill..."
                  className={theme === "dark" ? "bg-card border-muted" : ""}
                />
                <p className="text-sm text-muted-foreground">
                  Diese Beschreibung wird unter der Karte angezeigt, wenn dieser Superskill ausgewählt ist.
                </p>
              </div>
              
              {wallpaperPreview && (
                <div className={`mt-4 border rounded-md overflow-hidden ${theme === "dark" ? "border-muted" : ""}`}>
                  <div className="relative">
                    <img
                      src={wallpaperPreview}
                      alt="Wallpaper Vorschau"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        setWallpaperPreview(null);
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white text-sm font-medium">Vorschau des Hintergrundbilds</span>
                    </div>
                  </div>
                  {(localReflection.imageDescription || localReflection.imageDescriptionTitle) && (
                    <div className="p-3 bg-muted/20">
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          {localReflection.imageDescriptionTitle && (
                            <h4 className="font-medium mb-1">
                              {localReflection.imageDescriptionTitle}
                            </h4>
                          )}
                          {localReflection.imageDescription && (
                            <p className="text-sm text-muted-foreground">
                              {localReflection.imageDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-3 bg-muted/40 p-4 rounded-lg border border-muted mt-4">
                <Image size={24} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-2">Empfehlungen für Hintergrundbilder:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Verwenden Sie Bilder, die zum Thema des Superskills passen</li>
                    <li>Bilder mit niedrigem Kontrast funktionieren am besten</li>
                    <li>Wählen Sie Bilder mit ausreichender Größe (mind. 1920x1080px)</li>
                    <li>Achten Sie auf Bilder mit freier Lizenz oder Nutzungsrechten</li>
                    <li>Bilder mit dunklerem Hintergrund eignen sich besonders gut</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Save Button für zusätzliche Zugänglichkeit */}
      <div className="flex justify-center pt-6 border-t">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="min-w-32"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Speichert...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Änderungen speichern
            </>
          )}
        </Button>
      </div>
    </div>
  );
}