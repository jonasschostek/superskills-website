// Service für die Interaktion mit JSONBin.io API

// API Keys für JSONBin.io
const MASTER_KEY = "$2a$10$0l10GUPkJSQqrWJbMStH0ujpyia7XARFBSn181hd1aX6y7PLMh0d6";
const ACCESS_KEY = "$2a$10$VZOB.8euyAZp.kTe9k5C3OekOVsaC.bPA1ct3zvs6t5BolUypEUMy";
const API_URL = "https://api.jsonbin.io/v3/b";

// Default bin ID - immer diese Bin-ID verwenden
const DEFAULT_BIN_ID = "683428ea8561e97a501b9c77";

// URL-Parameter für Bin-ID (nur für Abwärtskompatibilität)
const URL_PARAM_BIN_ID = "bin";

// Daten-Struktur für die Speicherung
export interface StoredData {
  reflections: any[];
  customLink: string;
  customLinkTitle?: string;
  wallpaperUrl?: string; // Neue Eigenschaft für Wallpaper
  pageTitle?: string; // Neue Eigenschaft für Seitentitel
  pageDescription?: string; // Neue Eigenschaft für Seitenbeschreibung
  lastUpdated: string;
  version: number; // Versionshinweis für zukünftige Datenmigrationen
}

/**
 * Überprüft, ob eine Bin-ID als URL-Parameter vorhanden ist
 * (Wird nur noch für Abwärtskompatibilität beibehalten)
 */
export function checkForBinInUrl(): string | null {
  // Wir nutzen immer die DEFAULT_BIN_ID, ignorieren URL-Parameter
  return DEFAULT_BIN_ID;
}

/**
 * Aktualisiert die URL mit der Standard-Bin-ID
 */
export function updateUrlWithBinId(): void {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM_BIN_ID, DEFAULT_BIN_ID);
    
    // Aktualisieren der URL ohne Neuladen der Seite
    window.history.replaceState({}, '', url.toString());
  }
}

/**
 * Lädt Daten aus der Standard-Bin
 */
export async function loadData(): Promise<StoredData | null> {
  try {
    const response = await fetch(`${API_URL}/${DEFAULT_BIN_ID}/latest`, {
      method: "GET",
      headers: {
        "X-Access-Key": ACCESS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const data = await response.json();
    return data.record as StoredData;
  } catch (error) {
    console.error("Error loading data:", error);
    return null;
  }
}

/**
 * Speichert Daten in der Standard-Bin
 */
export async function saveData(data: StoredData): Promise<boolean> {
  try {
    // Versionsinfo hinzufügen oder aktualisieren
    const dataToSave = {
      ...data,
      version: data.version || 1, // Aktuelle Datenversion beibehalten oder auf 1 setzen
    };

    // Bin aktualisieren
    const response = await fetch(`${API_URL}/${DEFAULT_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY,
      },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error saving data:", error);
    return false;
  }
}

/**
 * Generiert eine Freigabe-URL für die Standard-Bin
 */
export function getShareableUrl(): string {
  // Generiere eine URL mit dem Standard-Bin-Parameter
  const url = new URL(window.location.origin);
  url.searchParams.set(URL_PARAM_BIN_ID, DEFAULT_BIN_ID);
  
  return url.toString();
}

/**
 * Prüft, ob die Bin ID vorhanden ist (immer true)
 */
export function hasBinId(): boolean {
  return true;
}

/**
 * Diese Funktion ist deaktiviert, da wir immer die Standard-Bin verwenden
 */
export function createNewSession(): void {
  // Diese Funktion tut nichts mehr, da wir immer die Standard-Bin verwenden
  // Stattdessen laden wir die Daten neu vom Server
  loadData();
}
