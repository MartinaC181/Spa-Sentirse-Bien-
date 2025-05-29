"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IUser } from "@/models/interfaces";

interface LoginResponse {
  user: {
    email: string;
    first_name?: string;
    last_name?: string;
    is_admin?: boolean;
    role?: "admin" | "cliente" | "profesional";
  };
  token: string;
}

interface AuthContextType {
  user: IUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const usuario: IUser = {
          email: parsed.email,
          first_name: parsed.first_name || "",
          last_name: parsed.last_name || "",
          password: "",
          is_admin: parsed.is_admin || false,
          role: parsed.role || "cliente",
        };
        setUser(usuario);
      } catch (e) {
        console.error("Error al parsear usuario del localStorage", e);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_USER}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const responseText = await response.text();
      if (!response.ok) throw new Error(responseText || "Credenciales inválidas");

      const responseData: LoginResponse = JSON.parse(responseText);

      const user: IUser = {
        email: responseData.user.email,
        first_name: responseData.user.first_name || "",
        last_name: responseData.user.last_name || "",
        password: "",
        is_admin: responseData.user.is_admin || false,
        role: responseData.user.role || "cliente",
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", responseData.token);
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === "profesional" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
