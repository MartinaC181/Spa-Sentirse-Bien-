'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2738331709.
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el estado del menú en dispositivos móviles
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#bac4e0] py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        <Link href="/" className="text-3xl font-serif text-[#536a86] hover:text-[#435c74]">
          SPA: Sentirse Bien
        </Link>

        {/* Menú para pantallas grandes */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className={pathname === '/' ? 'text-[#536a86] font-semibold' : 'hover:text-[#536a86] transition'}>
            Inicio
          </Link>

          {/* Menú de Servicios: siempre visible */}
          <Link href="/services/individual" className={pathname === '/services/individual' ? 'text-[#536a86] font-semibold' : 'hover:text-[#536a86] transition'}>
            Individuales
          </Link>
          <Link href="/services/group" className={pathname === '/services/group' ? 'text-[#536a86] font-semibold' : 'hover:text-[#536a86] transition'}>
            Grupales
          </Link>

          <Link href="/contact" className={pathname === '/contact' ? 'text-[#536a86] font-semibold' : 'hover:text-[#536a86] transition'}>
            Contacto
          </Link>
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
        </div>
      )}
    </nav>
  );
}
