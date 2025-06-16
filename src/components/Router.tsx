import { Router } from "./components/Router";
import { ReflectionProvider } from "./contexts/ReflectionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

function App() {
  return (
    <ThemeProvider>
      <ReflectionProvider>
        <Router />
      </ReflectionProvider>
    </ThemeProvider>
  );
}

export default App;
