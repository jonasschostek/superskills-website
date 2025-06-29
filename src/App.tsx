import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "sonner";
import { ReflectionProvider } from "./contexts/ReflectionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { MapView } from "./components/MapView";

function AppContent() {
  const [location] = useLocation();
  
  return (
    <Layout>
      <Switch>
        <Route path="/">
          <MapView key={location} />
        </Route>
        <Route path="/map">
          <MapView key={location} />
        </Route>
        {/* Alle anderen Routen führen auch zur MapView */}
        <Route>
          <MapView key={location} />
        </Route>
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReflectionProvider>
        <AppContent />
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: false,
            classNames: {
              toast: "!bg-card !text-card-foreground border shadow-lg",
              title: "text-foreground",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
              success: "border-green-500/30 bg-green-500/10",
              error: "border-red-500/30 bg-red-500/10",
              info: "border-blue-500/30 bg-blue-500/10",
              warning: "border-yellow-500/30 bg-yellow-500/10",
            },
          }}
          closeButton={true}
          richColors={true}
        />
      </ReflectionProvider>
    </ThemeProvider>
  );
}
