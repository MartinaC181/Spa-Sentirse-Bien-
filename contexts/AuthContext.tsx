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

// Credenciales predefinidas
const CREDENTIALS = {
  admin: {
    email: 'Admin@gmail.com',
    password: '123',
    nombre: 'Admin',
    apellido: 'Admin',
    role: 'admin' as const
  },
  cliente: {
    email: 'cliente@gmail.com',
    password: '456',
    nombre: 'Cliente',
    apellido: 'Cliente',
    role: 'user' as const
  }
};

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
      // Verificar credenciales del admin
      if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
        const userData: User = {
          id: '1',
          email: CREDENTIALS.admin.email,
          nombre: CREDENTIALS.admin.nombre,
          apellido: CREDENTIALS.admin.apellido,
          role: CREDENTIALS.admin.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }

      // Verificar credenciales del cliente
      if (email === CREDENTIALS.cliente.email && password === CREDENTIALS.cliente.password) {
        const userData: User = {
          id: '2',
          email: CREDENTIALS.cliente.email,
          nombre: CREDENTIALS.cliente.nombre,
          apellido: CREDENTIALS.cliente.apellido,
          role: CREDENTIALS.cliente.role
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }

      // Si las credenciales no coinciden con ninguna cuenta predefinida
      throw new Error('Credenciales inválidas');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw new Error('Credenciales inválidas');
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