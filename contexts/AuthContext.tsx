'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  nombre: string;
  apellido: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_USER!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Credenciales inválidas');
      }

      const userData = await response.json();
      
      // Asegurarnos de que el usuario tenga todos los campos necesarios
      const user: User = {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        role: userData.role || 'user', // Si no viene el rol, asumimos que es usuario normal
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 