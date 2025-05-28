'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_admin: boolean;
  role: 'admin' | 'cliente';
}

interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
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
      const requestBody = {
        email,
        password,
      };
      console.log('URL de la API:', process.env.NEXT_PUBLIC_API_USER);
      console.log('Datos enviados al servidor:', requestBody);
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_USER + "/login"!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Status de la respuesta:', response.status);
      console.log('Headers de la respuesta:', Object.fromEntries(response.headers.entries()));
      const responseText = await response.text();
      console.log('Respuesta en texto:', responseText);
      
      if (!response.ok) {
        if (response.status === 500) {
          console.error('Error del servidor:', responseText);
          throw new Error('Error interno del servidor. Por favor, contacta al administrador.');
        }
        throw new Error(responseText || 'Credenciales inválidas');
      }

      let responseData: LoginResponse;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error al parsear la respuesta como JSON:', e);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }

      // Asegurarnos de que el usuario tenga todos los campos necesarios
      const user: User = {
        email: responseData.user.email,
        first_name: responseData.user.first_name,
        last_name: responseData.user.last_name,
        password: '', // No guardamos la contraseña en el frontend
        is_admin: responseData.user.is_admin,
        role: responseData.user.role || 'cliente',
      };

      console.log('Usuario procesado:', user);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', responseData.token);
    } catch (error: any) {
      console.error('Error detallado al iniciar sesión:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = user?.is_admin || user?.role === 'admin';

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