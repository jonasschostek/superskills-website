import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useReflections } from "../contexts/ReflectionContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Clipboard, Link, Share2, Info, Save, Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsPage() {
  const { 
    customLink, 
    customLinkTitle,
    wallpaperUrl,
    pageTitle,
    pageDescription,
    setCustomLink,
    setCustomLinkTitle,
    setWallpaperUrl,
    setPageTitle,
    setPageDescription,
    lastSaved, 
    isSaving,
    hasUnsavedChanges,
    saveProgress,
    getShareableUrl,
    enableAutoSave
  } = useReflections();
  
  const [linkInput, setLinkInput] = useState(customLink);
  const [linkTitleInput, setLinkTitleInput] = useState(customLinkTitle);
  const [wallpaperInput, setWallpaperInput] = useState(wallpaperUrl);
  const [pageTitleInput, setPageTitleInput] = useState(pageTitle);
  const [pageDescriptionInput, setPageDescriptionInput] = useState(pageDescription);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [autoSaveActive, setAutoSaveActive] = useState(false);
  const [wallpaperPreview, setWallpaperPreview] = useState<string | null>(null);
  
  // Check localStorage for auto-save preference on mount
  useEffect(() => {
    const savedPref = localStorage.getItem("autoSaveEnabled");
    const initialAutoSave = savedPref ? savedPref === "true" : false;
    setAutoSaveActive(initialAutoSave);
    enableAutoSave(initialAutoSave);
  }, []);

  // Update wallpaper preview when input changes
  useEffect(() => {
    if (wallpaperInput.trim()) {
      setWallpaperPreview(wallpaperInput);
    } else {
      setWallpaperPreview(null);
    }
  }, [wallpaperInput]);
  
  // Benutzerdefinierter Link speichern
  const handleSave = async () => {
    setCustomLink(linkInput);
    setCustomLinkTitle(linkTitleInput);
    setWallpaperUrl(wallpaperInput);
    setPageTitle(pageTitleInput);
    setPageDescription(pageDescriptionInput);
    const success = await saveProgress();
    
    if (success) {
      toast.success("Einstellungen gespeichert!");
    }
  };

  // Teilbaren Link generieren
  const handleShare = () => {
    const url = getShareableUrl();
    setShareUrl(url);
    toast.success("Link generiert! Teilen Sie den Link, um diese Daten auf einem anderen Gerät zu öffnen.");
  };

  // Link in die Zwischenablage kopieren
  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link in die Zwischenablage kopiert!");
    }
  };
  
  // Auto-save toggle handler
  const handleAutoSaveToggle = (checked: boolean) => {
    setAutoSaveActive(checked);
    enableAutoSave(checked);
    localStorage.setItem("autoSaveEnabled", checked.toString());
  };

  // Clear wallpaper input
  const clearWallpaper = () => {
    setWallpaperInput("");
    setWallpaperPreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-center mb-6">Einstellungen</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Allgemein</TabsTrigger>
          <TabsTrigger value="appearance">Erscheinungsbild</TabsTrigger>
          <TabsTrigger value="data">Daten & Teilen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-6">
          {/* Seitentitel und -beschreibung */}
          <Card>
            <CardHeader>
              <CardTitle>Seiteninhalte</CardTitle>
              <CardDescription>
                Passen Sie den Titel und die Beschreibung der Hauptseite an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-title">Seitentitel</Label>
                <Input
                  id="page-title"
                  value={pageTitleInput}
                  onChange={(e) => setPageTitleInput(e.target.value)}
                  placeholder="Visual Superskills"
                />
                <p className="text-sm text-muted-foreground">
                  Dieser Titel wird oben auf der Hauptseite angezeigt.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page-description">Seitenbeschreibung</Label>
                <Input
                  id="page-description"
                  value={pageDescriptionInput}
                  onChange={(e) => setPageDescriptionInput(e.target.value)}
                  placeholder="Hier siehst du eine visuelle Übersicht aller deiner Reflektionen..."
                />
                <p className="text-sm text-muted-foreground">
                  Diese Beschreibung wird unter dem Titel auf der Hauptseite angezeigt.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>

          {/* Speicheroptionen */}
          <Card>
            <CardHeader>
              <CardTitle>Speicheroptionen</CardTitle>
              <CardDescription>
                Konfigurieren Sie, wie Ihre Daten gespeichert werden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-Speichern</Label>
                  <p className="text-sm text-muted-foreground">
                    Änderungen automatisch alle 3 Sekunden speichern
                  </p>
                </div>
                <Switch 
                  id="auto-save" 
                  checked={autoSaveActive}
                  onCheckedChange={handleAutoSaveToggle}
                />
              </div>
              
              <div className="bg-muted/40 p-3 rounded-lg border border-muted flex items-start gap-3">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm">
                  {autoSaveActive 
                    ? "Auto-Speichern ist aktiviert. Änderungen werden automatisch gespeichert."
                    : "Auto-Speichern ist deaktiviert. Nutzen Sie den Speichern-Button, um Änderungen manuell zu speichern."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benutzerdefinierter Link */}
          <Card>
            <CardHeader>
              <CardTitle>Benutzerdefinierter Link</CardTitle>
              <CardDescription>
                Dieser Link wird im Footer der Anwendung angezeigt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-link-title">Link Titel</Label>
                <Input
                  id="custom-link-title"
                  value={linkTitleInput}
                  onChange={(e) => setLinkTitleInput(e.target.value)}
                  placeholder="Meine Website"
                />
                <p className="text-sm text-muted-foreground">
                  Der angezeigte Text für den Link im Footer.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-link">Link URL</Label>
                <Input
                  id="custom-link"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="https://meine-website.de"
                />
                <p className="text-sm text-muted-foreground">
                  Die URL, zu der der Link führen soll.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {lastSaved && (
                  <span className="text-muted-foreground text-sm">
                    Zuletzt gespeichert: {lastSaved.toLocaleString()}
                  </span>
                )}
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4 space-y-6">
          {/* Wallpaper Konfiguration */}
          <Card>
            <CardHeader>
              <CardTitle>Karte Hintergrundbild</CardTitle>
              <CardDescription>
                Fügen Sie ein Hintergrundbild für die Karten-Ansicht hinzu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallpaper-url">Bild URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallpaper-url"
                    value={wallpaperInput}
                    onChange={(e) => setWallpaperInput(e.target.value)}
                    placeholder="https://example.com/wallpaper.jpg"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={clearWallpaper}
                    type="button"
                  >
                    Zurücksetzen
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Geben Sie eine URL zu einem Hintergrundbild ein, das hinter der Karte angezeigt werden soll.
                </p>
              </div>

              {wallpaperPreview && (
                <div className="mt-4">
                  <Label>Vorschau</Label>
                  <div className="mt-2 relative border rounded-lg overflow-hidden" style={{ height: '150px' }}>
                    <img 
                      src={wallpaperPreview} 
                      alt="Wallpaper Vorschau" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        toast.error("Bild konnte nicht geladen werden. Überprüfen Sie die URL.");
                      }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 p-2 rounded text-white text-sm">
                        Hintergrundbild Vorschau
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 bg-muted/40 p-3 rounded-lg border border-muted">
                <Image size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p>Empfehlungen für Hintergrundbilder:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Verwenden Sie Bilder mit niedrigem Kontrast</li>
                    <li>Bilder mit dunklen Farben funktionieren am besten</li>
                    <li>Große Bilder (mind. 1920x1080)</li>
                    <li>Verwenden Sie Bilder mit freier Lizenz</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4 space-y-6">
          {/* Daten teilen */}
          <Card>
            <CardHeader>
              <CardTitle>Daten zwischen Geräten teilen</CardTitle>
              <CardDescription>
                Erstellen Sie einen Link, mit dem Sie Ihre Daten auf einem anderen Gerät oder Browser fortsetzen können.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/40 p-3 rounded-lg border border-muted flex items-start gap-3">
                <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Dieser Link enthält einen Verweis auf die geteilten Daten. Öffnen Sie ihn auf einem anderen Gerät, 
                  um dort mit denselben Daten weiterzuarbeiten. Sie können den Link auch als Lesezeichen speichern.
                </p>
              </div>
              
              <Button 
                onClick={handleShare}
                variant="outline" 
                className="w-full flex gap-2 items-center justify-center"
              >
                <Share2 size={16} />
                Link für Gerätewechsel erstellen
              </Button>
              
              {shareUrl && (
                <div className="pt-2">
                  <Label htmlFor="share-link">Link zum Teilen</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="share-link"
                      value={shareUrl}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button 
                      onClick={handleCopyLink}
                      variant="secondary"
                      className="rounded-l-none flex gap-2"
                    >
                      <Clipboard size={16} />
                      Kopieren
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 mt-3">
                    <Link size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Kopieren Sie diesen Link und öffnen Sie ihn auf dem anderen Gerät, 
                      oder speichern Sie ihn als Lesezeichen für späteren Zugriff.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Speicherstatus */}
      <Card>
        <CardContent className="pt-6">
          <div className="w-full">
            <Separator className="my-2" />
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm flex items-center gap-2">
                {hasUnsavedChanges && (
                  <span className="bg-yellow-500/10 text-yellow-500 dark:text-yellow-400 px-2 py-0.5 rounded text-xs">
                    Ungespeicherte Änderungen
                  </span>
                )}
                {lastSaved ? (
                  <span className="text-muted-foreground">
                    Zuletzt gespeichert: {lastSaved.toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Noch nicht gespeichert</span>
                )}
              </span>
              <Button 
                onClick={saveProgress} 
                disabled={isSaving || !hasUnsavedChanges} 
                variant={hasUnsavedChanges ? "default" : "outline"} 
                size="sm"
                className="gap-2"
              >
                <Save size={16} />
                {isSaving ? "Wird gespeichert..." : "Jetzt speichern"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}