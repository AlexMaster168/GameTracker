import { useNavigate } from "react-router-dom";
import { Login } from "../components/Login";
import { useAuth } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Если уже залогинен — нет смысла показывать форму.
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  return <Login onClose={() => navigate("/")} />;
}
