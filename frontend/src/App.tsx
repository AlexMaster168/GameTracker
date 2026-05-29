import { Route, Routes } from "react-router-dom";
import { CatalogPage } from "./pages/CatalogPage";
import { GamePage } from "./pages/GamePage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./lib/auth";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-bg flex min-h-screen items-center justify-center text-gold/60">
        Loading…
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/game/:id" element={<GamePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
