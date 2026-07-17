import { createContext, useContext, useState, type ReactNode } from "react";
import { authApi, clearToken, setToken } from "../api/client";

interface LoginResponse {
  token: string;
  expiraEm: string;
  nome: string;
  role: string;
}

interface AuthState {
  nome: string;
  role: string;
}

interface AuthContextValue {
  usuario: AuthState | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "scheduler.usuario";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthState) : null;
  });

  async function login(email: string, senha: string) {
    const response = await authApi.post<LoginResponse>("/api/auth/login", { email, senha });
    setToken(response.token);
    const usuarioAtual = { nome: response.nome, role: response.role };
    localStorage.setItem(USER_KEY, JSON.stringify(usuarioAtual));
    setUsuario(usuarioAtual);
  }

  function logout() {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUsuario(null);
  }

  return <AuthContext.Provider value={{ usuario, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
