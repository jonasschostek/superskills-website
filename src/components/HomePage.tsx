import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { superskills, useReflections } from "../contexts/ReflectionContext";

export function HomePage() {
  const { reflections } = useReflections();

  // Funktion zum Berechnen des Fortschritts für jeden Superskill
  const getProgress = (skillName: string) => {
    const reflection = reflections.find(r => r.superskill === skillName);
    if (!reflection) return 0;

    let filledFields = 0;
    let totalFields = 0;

    // Ausgangslage
    Object.values(reflection.ausgangslage).forEach(value => {
      totalFields++;
      if (value.trim()) filledFields++;
    });

    // Anwendung (ohne Fotos)
    Object.entries(reflection.anwendung).forEach(([key, value]) => {
      if (!key.startsWith('photo')) {
        totalFields++;
        if (value.trim()) filledFields++;
      }
    });

    // Bewertung
    Object.values(reflection.bewertung).forEach(value => {
      totalFields++;
      if (value.trim()) filledFields++;
    });

    // Transfer
    Object.values(reflection.transfer).forEach(value => {
      totalFields++;
      if (value.trim()) filledFields++;
    });

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center">Designer Superskills Reflektion</h1>

      <p className="text-center max-w-2xl mx-auto">
        Reflektiere und dokumentiere deine Erfahrungen zu 10 Superskills für Visual Designer.
        Wähle einen Superskill aus, um deine Reflektion zu beginnen oder fortzusetzen.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {superskills.map((skill) => {
          const progress = getProgress(skill);

          return (
            <Link key={skill} href={`/reflection/${encodeURIComponent(skill)}`}>
              <Card className="h-full cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{skill}</CardTitle>
                  <CardDescription>Reflektiere über diesen Superskill</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span>{progress}% abgeschlossen</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/map">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
            Zur Landkarte
          </button>
        </Link>
      </div>
    </div>
  );
}
