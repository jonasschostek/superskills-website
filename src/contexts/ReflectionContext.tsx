import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import * as jsonbinService from "../services/jsonbinService";

// Struktur einer einzelnen Reflektion
export interface Reflection {
  id: number;
  superskill: string;
  wallpaperUrl: string; // Feld für individuelle Wallpaper
  imageDescription: string; // Neues Feld für Bildbeschreibung
  imageDescriptionTitle: string; // Neues Feld für editierbaren Titel der Bildbeschreibung
  ausgangslage: {
    verstaendnis: string;
    situationen: string;
    literatur: string;
  };
  anwendung: {
    titel: string;
    photo1: string;
    beschreibung: string;
    erkenntnisse: string;
    photo2: string;
    photo3: string;
    photo4: string;
  };
  bewertung: {
    funktioniert: string;
    uebersehen: string;
    veraenderung: string;
  };
  transfer: {
    zukunft: string;
    tools: string;
    selbstverstaendnis: string;
  };
}

// Leere Vorlage für eine neue Reflektion
const emptyReflection = (id: number, superskill: string): Reflection => ({
  id,
  superskill,
  wallpaperUrl: "",
  imageDescription: "",
  imageDescriptionTitle: "",
  ausgangslage: {
    verstaendnis: "",
    situationen: "",
    literatur: "",
  },
  anwendung: {
    titel: "",
    photo1: "",
    beschreibung: "",
    erkenntnisse: "",
    photo2: "",
    photo3: "",
    photo4: "",
  },
  bewertung: {
    funktioniert: "",
    uebersehen: "",
    veraenderung: "",
  },
  transfer: {
    zukunft: "",
    tools: "",
    selbstverstaendnis: "",
  },
});

// Liste aller Superskills
export const superskills = [
  "Kontextalisierung",
  "Ästhetik",
  "Konsistenz",
  "Inklusion",
  "Kreativität",
  "Emotion",
  "Irrationalität",
  "Bedeutung",
  "Kognition",
  "Dimensionalität",
];

// Kontext-Typ-Definition
interface ReflectionContextType {
  reflections: Reflection[];
  customLink: string;
  customLinkTitle: string;
  wallpaperUrl: string;
  pageTitle: string;
  pageDescription: string;
  selectedReflection: Reflection | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  getReflection: (superskill: string) => Reflection;
  updateReflection: (updatedReflection: Reflection) => void;
  setCustomLink: (link: string) => void;
  setCustomLinkTitle: (title: string) => void;
  setWallpaperUrl: (url: string) => void;
  setPageTitle: (title: string) => void;
  setPageDescription: (description: string) => void;
  setSelectedReflection: (reflection: Reflection | null) => void;
  resetToDefault: () => void;
  saveProgress: () => Promise<boolean>;
  getShareableUrl: () => string;
  enableAutoSave: (enable: boolean) => void;
}

// Erstellen des Kontexts
const ReflectionContext = createContext<ReflectionContextType | undefined>(undefined);

// Provider-Komponente
export function ReflectionProvider({ children }: { children: ReactNode }) {
  const [reflections, setReflections] = useState<Reflection[]>(
    superskills.map((skill, index) => emptyReflection(index, skill))
  );

  const [customLink, setCustomLink] = useState<string>("");
  const [customLinkTitle, setCustomLinkTitle] = useState<string>("");
  const [wallpaperUrl, setWallpaperUrl] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("Visual Superskills");
  const [pageDescription, setPageDescription] = useState<string>("Hier siehst du eine visuelle Übersicht aller deiner Reflektionen zu den verschiedenen Superskills. Wähle ein Element an, um die Details einzusehen.");
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveTimer, setSaveTimer] = useState<number | null>(null); // KORRIGIERT: NodeJS.Timeout zu number
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [savedState, setSavedState] = useState<{
    reflections: Reflection[];
    customLink: string;
    customLinkTitle: string;
    wallpaperUrl: string;
    pageTitle: string;
    pageDescription: string;
  }>({ reflections: [], customLink: "", customLinkTitle: "", wallpaperUrl: "", pageTitle: "", pageDescription: "" });

  // Daten beim Start laden
  useEffect(() => {
    async function loadReflections() {
      setIsLoading(true);
      try {
        jsonbinService.updateUrlWithBinId();
        toast.info("Daten werden geladen...");
        const data = await jsonbinService.loadData();

        if (data) {
          const loadedReflections = data.reflections || superskills.map((skill, index) => emptyReflection(index, skill));

          const updatedReflections = loadedReflections.map((reflection: Reflection) => {
            const updated = { ...reflection };
            if (!('wallpaperUrl' in reflection)) {
              updated.wallpaperUrl = "";
            }
            if (!('imageDescription' in reflection)) {
              updated.imageDescription = "";
            }
            if (!('imageDescriptionTitle' in reflection)) {
              updated.imageDescriptionTitle = "";
            }
            return updated;
          });

          const loadedCustomLink = data.customLink || "";
          const loadedCustomLinkTitle = data.customLinkTitle || "";
          const loadedWallpaperUrl = data.wallpaperUrl || "";
          const loadedPageTitle = data.pageTitle || "Visual Superskills";
          const loadedPageDescription = data.pageDescription || "Hier siehst du eine visuelle Übersicht aller deiner Reflektionen zu den verschiedenen Superskills. Wähle ein Element an, um die Details einzusehen.";

          setReflections(updatedReflections);
          setCustomLink(loadedCustomLink);
          setCustomLinkTitle(loadedCustomLinkTitle);
          setWallpaperUrl(loadedWallpaperUrl);
          setPageTitle(loadedPageTitle);
          setPageDescription(loadedPageDescription);
          setLastSaved(new Date(data.lastUpdated));

          setSavedState({
            reflections: JSON.parse(JSON.stringify(updatedReflections)),
            customLink: loadedCustomLink,
            customLinkTitle: loadedCustomLinkTitle,
            wallpaperUrl: loadedWallpaperUrl,
            pageTitle: loadedPageTitle,
            pageDescription: loadedPageDescription
          });

          toast.success("Daten erfolgreich geladen!");
        }
      } catch (error) {
        toast.error("Fehler beim Laden der Daten");
        console.error("Fehler beim Laden:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReflections();
  }, []);

  // Check for unsaved changes
  useEffect(() => {
    if (isLoading) return;

    if (savedState.reflections.length === 0) {
      setSavedState({
        reflections: JSON.parse(JSON.stringify(reflections)),
        customLink,
        customLinkTitle,
        wallpaperUrl,
        pageTitle,
        pageDescription
      });
      return;
    }

    const hasChanges =
      JSON.stringify(savedState.reflections) !== JSON.stringify(reflections) ||
      savedState.customLink !== customLink ||
      savedState.customLinkTitle !== customLinkTitle ||
      savedState.wallpaperUrl !== wallpaperUrl ||
      savedState.pageTitle !== pageTitle ||
      savedState.pageDescription !== pageDescription;

    setHasUnsavedChanges(hasChanges);
  }, [reflections, customLink, customLinkTitle, wallpaperUrl, pageTitle, pageDescription, isLoading, savedState]);

  // Automatisches Speichern nach Änderungen (mit Verzögerung) - nur wenn aktiviert
  useEffect(() => {
    if (isLoading || !autoSaveEnabled || !hasUnsavedChanges) return;

    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    const timer = setTimeout(async () => {
      await saveProgress();
    }, 3000);

    setSaveTimer(timer);

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [reflections, customLink, customLinkTitle, wallpaperUrl, pageTitle, pageDescription, autoSaveEnabled, hasUnsavedChanges, isLoading]);

  // Daten speichern
  const saveProgress = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const now = new Date();
      const success = await jsonbinService.saveData({
        reflections,
        customLink,
        customLinkTitle,
        wallpaperUrl,
        pageTitle,
        pageDescription,
        lastUpdated: now.toISOString(),
        version: 1,
      });

      if (success) {
        setLastSaved(now);
        setSavedState({
          reflections: JSON.parse(JSON.stringify(reflections)),
          customLink,
          customLinkTitle,
          wallpaperUrl,
          pageTitle,
          pageDescription
        });
        setHasUnsavedChanges(false);
        toast.success("Änderungen gespeichert");
        return true;
      } else {
        toast.error("Fehler beim Speichern");
        return false;
      }
    } catch (error) {
      toast.error("Fehler beim Speichern der Daten");
      console.error("Fehler beim Speichern:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getReflection = (superskill: string): Reflection => {
    const reflection = reflections.find(r => r.superskill === superskill);
    if (!reflection) {
      throw new Error(`Reflektion für ${superskill} nicht gefunden`);
    }
    return reflection;
  };

  const updateReflection = (updatedReflection: Reflection) => {
    setReflections(reflections.map(reflection =>
      reflection.id === updatedReflection.id ? updatedReflection : reflection
    ));
  };

  const getShareableUrl = (): string => {
    return jsonbinService.getShareableUrl();
  };

  const enableAutoSave = (enable: boolean) => {
    setAutoSaveEnabled(enable);
    if (enable) {
      toast.info("Auto-Speichern aktiviert");
    } else {
      toast.info("Auto-Speichern deaktiviert");
    }
  };

  const resetToDefault = () => {
    setSelectedReflection(null);
  };

  return (
    <ReflectionContext.Provider
      value={{
        reflections,
        customLink,
        customLinkTitle,
        wallpaperUrl,
        pageTitle,
        pageDescription,
        selectedReflection,
        isLoading,
        isSaving,
        lastSaved,
        hasUnsavedChanges,
        getReflection,
        updateReflection,
        setCustomLink,
        setCustomLinkTitle,
        setWallpaperUrl,
        setPageTitle,
        setPageDescription,
        setSelectedReflection,
        resetToDefault,
        saveProgress,
        getShareableUrl,
        enableAutoSave
      }}
    >
      {children}
    </ReflectionContext.Provider>
  );
}

// Hook für den Zugriff auf den Kontext
export function useReflections() {
  const context = useContext(ReflectionContext);
  if (context === undefined) {
    throw new Error("useReflections muss innerhalb eines ReflectionProviders verwendet werden");
  }
  return context;
}
