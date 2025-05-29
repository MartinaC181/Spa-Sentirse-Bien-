"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IUser } from "@/models/interfaces";
import { ObjectId } from "mongoose";

interface LoginResponse {
  user: {
    _id: ObjectId;
    email: string;
    first_name?: string;
    last_name?: string;
    is_admin?: boolean;
    role?: 'admin' | 'cliente' | 'profesional';
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
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      // Validar o completar campos faltantes
      console.log("Usuario recuperado del localStorage:", parsed);
      const usuario: IUser = {
        _id: parsed.id,
        email: parsed.email,
        first_name: parsed.first_name || "",
        last_name: parsed.last_name || "",
        password: "", // nunca debe persistirse
        is_admin: parsed.is_admin || false,
        role: parsed.role || "cliente",
      };
      setUser(usuario);
    } catch (e) {
      console.error("Error al parsear usuario del localStorage", e);
    }
  }
}, []);

useEffect(() => {
  const fetchUserId = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER}`);
      if (!res.ok) throw new Error("No se pudieron obtener los usuarios");

      const usuarios = await res.json();
      const usuarioEncontrado = usuarios.find((u: any) => u.email === user.email);
      if (usuarioEncontrado) {
        setUsuarioId(usuarioEncontrado._id);
      }
    } catch (error) {
      console.error("Error al buscar el ID del usuario:", error);
    }
  };

  fetchUserId();
}, [user?.email]);

console.log("ID del usuario:", usuarioId);

  const login = async (email: string, password: string) => {
    try {
      const requestBody = {
        email,
        password,
      };
      console.log("URL de la API:", process.env.NEXT_PUBLIC_API_USER);
      console.log("Datos enviados al servidor:", requestBody);

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_USER + "/login"!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Status de la respuesta:", response.status);
      console.log(
        "Headers de la respuesta:",
        Object.fromEntries(response.headers.entries())
      );
      const responseText = await response.text();
      console.log("Respuesta en texto:", responseText);

      if (!response.ok) {
        if (response.status === 500) {
          console.error("Error del servidor:", responseText);
          throw new Error(
            "Error interno del servidor. Por favor, contacta al administrador."
          );
        }
        throw new Error(responseText || "Credenciales inválidas");
      }

      let responseData: LoginResponse;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Error al parsear la respuesta como JSON:", e);
        throw new Error("La respuesta del servidor no es un JSON válido");
      }
      console.log("Datos de la respuesta:", responseData);

      // Asegurarnos de que el usuario tenga todos los campos necesarios
      const user: IUser = {
        _id: usuarioId as unknown as IUser["_id"],
        email: responseData.user.email,
        first_name: responseData.user.first_name || "",
        last_name: responseData.user.last_name || "",
        password: "", // No guardamos la contraseña
        is_admin: responseData.user.is_admin || false,
        role: responseData.user.role || "cliente",
      };
      

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", responseData.token);
    } catch (error: any) {
      console.error("Error detallado al iniciar sesión:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    }
  };

  console.log("Usuario actual:", user);

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
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
