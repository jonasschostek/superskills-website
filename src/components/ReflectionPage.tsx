import React from "react";
import { useReflections } from "../contexts/ReflectionContext";
import { ReflectionEditor } from "./ReflectionEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleLightbox } from "./SimpleLightbox";
import { FileText } from "lucide-react";

interface ReflectionPageProps {
  params: { superskill: string };
}

export function ReflectionPage({ params }: ReflectionPageProps) {
  const { getReflection } = useReflections();
  const superskill = decodeURIComponent(params.superskill);
  
  try {
    const reflection = getReflection(superskill);
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1>{superskill}</h1>
          <p className="text-muted-foreground">
            Reflektiere über deine Erfahrungen mit diesem Superskill und dokumentiere deine Erkenntnisse.
          </p>
        </div>

        {/* Bildbeschreibung - nur anzeigen wenn vorhanden */}
        {(reflection.imageDescription || reflection.imageDescriptionTitle) && (
          <Card className="bg-muted/20 border-muted">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">
                    {reflection.imageDescriptionTitle || `${superskill} - Bildbeschreibung`}
                  </h4>
                  {reflection.imageDescription && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {reflection.imageDescription}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tabs für Bearbeitung und Vorschau */}
        <Tabs defaultValue="edit" className="w-full">
          <TabsList>
            <TabsTrigger value="edit">Bearbeiten</TabsTrigger>
            <TabsTrigger value="preview">Vorschau</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="mt-6">
            <ReflectionEditor reflection={reflection} />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6 space-y-6">
            <Tabs defaultValue="ausgangslage" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ausgangslage">Ausgangslage</TabsTrigger>
                <TabsTrigger value="anwendung">Anwendung</TabsTrigger>
                <TabsTrigger value="bewertung">Bewertung</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ausgangslage" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Eigene Ausgangslage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3>Was habe ich bisher unter diesem Superskill verstanden?</h3>
                      <p className="whitespace-pre-wrap">{reflection.ausgangslage.verstaendnis || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>In welchen Situationen habe ich damit gearbeitet?</h3>
                      <p className="whitespace-pre-wrap">{reflection.ausgangslage.situationen || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Literatur und Bemerkenswertes</h3>
                      <p className="whitespace-pre-wrap">{reflection.ausgangslage.literatur || "Keine Angabe"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="anwendung" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Anwendung</CardTitle>
                    {reflection.anwendung.titel && (
                      <CardDescription>{reflection.anwendung.titel}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reflection.anwendung.photo1 && (
                      <div className="max-h-80 overflow-hidden rounded-md bg-background/50">
                        <SimpleLightbox
                          src={reflection.anwendung.photo1}
                          alt="Hauptbild"
                          thumbnailClassName="w-full object-contain"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3>Beschreibung</h3>
                      <p className="whitespace-pre-wrap">{reflection.anwendung.beschreibung || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Erkenntnisse</h3>
                      <p className="whitespace-pre-wrap">{reflection.anwendung.erkenntnisse || "Keine Angabe"}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {["photo2", "photo3", "photo4"].map((photo, idx) => {
                        const url = reflection.anwendung[photo as keyof typeof reflection.anwendung] as string;
                        if (!url) return null;
                        
                        return (
                          <div key={photo} className="border rounded-md overflow-hidden h-40 bg-background/50">
                            <SimpleLightbox
                              src={url}
                              alt={`Bild ${idx + 2}`}
                              thumbnailClassName="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bewertung" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Bewertung & Reflexion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3>Was funktioniert gut?</h3>
                      <p className="whitespace-pre-wrap">{reflection.bewertung.funktioniert || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Was habe ich übersehen oder unterschätzt?</h3>
                      <p className="whitespace-pre-wrap">{reflection.bewertung.uebersehen || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Wie hat sich mein Verständnis verändert?</h3>
                      <p className="whitespace-pre-wrap">{reflection.bewertung.veraenderung || "Keine Angabe"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transfer" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Transfer & Ausblick</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3>Zukünftiger Einsatz</h3>
                      <p className="whitespace-pre-wrap">{reflection.transfer.zukunft || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Tools, Fragen und Methoden</h3>
                      <p className="whitespace-pre-wrap">{reflection.transfer.tools || "Keine Angabe"}</p>
                    </div>
                    
                    <div>
                      <h3>Stärkung des Selbstverständnisses als Designer</h3>
                      <p className="whitespace-pre-wrap">{reflection.transfer.selbstverstaendnis || "Keine Angabe"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-8">
        <h1>Superskill nicht gefunden</h1>
        <p className="text-muted-foreground">
          Der angeforderte Superskill "{superskill}" konnte nicht gefunden werden.
        </p>
      </div>
    );
  }
}