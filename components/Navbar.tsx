'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2738331709.
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, user, logout } = useAuth();

  // Función para alternar el estado del menú en dispositivos móviles
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#bac4e0] py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        <Link href="/" className="text-3xl font-serif text-[#536a86] hover:text-[#435c74]">
          SPA: Sentirse Bien
        </Link>

        {/* Menú para pantallas grandes */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className={`text-[#536a86] ${pathname === '/' ? 'font-semibold' : 'hover:text-[#536a86] transition'}`}>
            Inicio
          </Link>

          {/* Menú de Servicios: siempre visible */}
          <Link href="/services/individual" className={`text-[#536a86] ${pathname === '/services/individual' ? 'font-semibold' : 'hover:text-[#536a86] transition'}`}>
            Individuales
          </Link>
          <Link href="/services/group" className={`text-[#536a86] ${pathname === '/services/group' ? 'font-semibold' : 'hover:text-[#536a86] transition'}`}>
            Grupales
          </Link>

          <Link href="/contact" className={`text-[#536a86] ${pathname === '/contact' ? 'font-semibold' : 'hover:text-[#536a86] transition'}`}>
            Contacto
          </Link>

          {/* Mostrar botón de Turnos solo si es admin */}
          {isAdmin && (
            <Link href="/admin/turnos">
              <Button variant="outline" className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white">
                Turnos
              </Button>
            </Link>
          )}

          {/* Mostrar nombre de usuario y botón de cerrar sesión si está autenticado */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[#536a86]">
                {user.nombre} {user.apellido}
              </span>
              <Button 
                variant="outline" 
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            /* Mostrar botón de iniciar sesión si no está autenticado */
            <Link href="/login">
              <Button className="bg-[#536a86] text-white hover:bg-[#435c74]">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>

        {/* Icono para menú móvil */}
        <button onClick={toggleMenu} className="md:hidden text-[#536a86]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menú desplegable en móvil */}
      {isOpen && (
        <div className="md:hidden bg-[#bac4e0] text-center py-4">
          <Link href="/" className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition">
            Inicio
          </Link>
          <Link href="/services/individual" className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition">
            Individuales
          </Link>
          <Link href="/services/group" className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition">
            Grupales
          </Link>
          <Link href="/contact" className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition">
            Contacto
          </Link>

          {/* Mostrar botón de Turnos solo si es admin (en móvil) */}
          {isAdmin && (
            <Link href="/admin/turnos" className="block py-2">
              <Button variant="outline" className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full">
                Turnos
              </Button>
            </Link>
          )}

          {/* Mostrar nombre de usuario y botón de cerrar sesión si está autenticado (en móvil) */}
          {user ? (
            <div className="py-2">
              <span className="block text-[#536a86] mb-2">
                {user.nombre} {user.apellido}
              </span>
              <Button 
                variant="outline" 
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            /* Mostrar botón de iniciar sesión si no está autenticado (en móvil) */
            <Link href="/login" className="block py-2">
              <Button className="bg-[#536a86] text-white hover:bg-[#435c74] w-full">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
