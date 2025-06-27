"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2738331709.
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAdmin, user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Mostrar navbar cuando se hace scroll hacia arriba o está en la parte superior
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Ocultar navbar cuando se hace scroll hacia abajo
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <motion.nav 
      className="bg-[#bac4e0] py-4 shadow-md fixed top-0 left-0 right-0 z-50"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-3xl font-serif text-[#536a86] hover:text-[#435c74] transition-colors duration-300"
        >
          SPA: Sentirse Bien
        </Link>

        {/* Menú para pantallas grandes */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            href="/"
            className={`relative text-[#536a86] transition-all duration-300 px-2 py-1 ${pathname === "/" ? "font-semibold" : ""
              } group`}
          >
            Inicio
            <span
              className={`
                absolute left-0 -bottom-1 w-full h-0.5 bg-[#536a86] rounded
                scale-x-0 group-hover:scale-x-100
                transition-transform duration-300
                ${pathname === "/" ? "scale-x-100" : ""}
              `}
            />
          </Link>
          <Link
            href="/services/individual"
            className={`relative text-[#536a86] transition-all duration-300 px-2 py-1 ${pathname === "/services/individual" ? "font-semibold" : ""
              } group`}
          >
            Individuales
            <span
              className={`
                absolute left-0 -bottom-1 w-full h-0.5 bg-[#536a86] rounded
                scale-x-0 group-hover:scale-x-100
                transition-transform duration-300
                ${pathname === "/services/individual" ? "scale-x-100" : ""}
              `}
            />
          </Link>
          <Link
            href="/services/group"
            className={`relative text-[#536a86] transition-all duration-300 px-2 py-1 ${pathname === "/services/group" ? "font-semibold" : ""
              } group`}
          >
            Grupales
            <span
              className={`
                absolute left-0 -bottom-1 w-full h-0.5 bg-[#536a86] rounded
                scale-x-0 group-hover:scale-x-100
                transition-transform duration-300
                ${pathname === "/services/group" ? "scale-x-100" : ""}
              `}
            />
          </Link>
          <Link
            href="/contact"
            className={`relative text-[#536a86] transition-all duration-300 px-2 py-1 ${pathname === "/contact" ? "font-semibold" : ""
              } group`}
          >
            Contacto
            <span
              className={`
                absolute left-0 -bottom-1 w-full h-0.5 bg-[#536a86] rounded
                scale-x-0 group-hover:scale-x-100
                transition-transform duration-300
                ${pathname === "/contact" ? "scale-x-100" : ""}
              `}
            />
          </Link>

          {isAdmin && (
            <Link href="/admin/turnos">
              <Button
                variant="outline"
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300 shadow-none hover:shadow-lg hover:scale-105"
              >
                Turnos
              </Button>
            </Link>
          )}

          {user?.role === "profesional" && (
            <Link href="/profesional/turnos">
              <Button
                variant="outline"
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300 shadow-none hover:shadow-lg hover:scale-105"
              >
                Mis Turnos
              </Button>
            </Link>
          )}

          {user?.role === "cliente" && (
            <Link href="/cliente/turno">
              <Button
                variant="outline"
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300 shadow-none hover:shadow-lg hover:scale-105"
              >
                Mis Turnos
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[#536a86]">
                {user.first_name} {user.last_name}
              </span>
              <Button
                variant="outline"
                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300 shadow-none hover:shadow-lg hover:scale-105"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-[#536a86] text-white hover:bg-[#435c74] transition-all duration-300 shadow-none hover:shadow-lg hover:scale-105">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>

        {/* Icono para menú móvil */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#536a86] transition-transform duration-300 focus:scale-110"
          aria-label="Abrir menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-90" : ""
              }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menú desplegable en móvil con animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#bac4e0] text-center py-4 shadow-lg z-50"
          >
            <Link
              href="/"
              className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/services/individual"
              className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Individuales
            </Link>
            <Link
              href="/services/group"
              className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Grupales
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-[#536a86] hover:bg-[#f6fedb] transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>

            {isAdmin && (
              <Link
                href="/admin/turnos"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="outline"
                  className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full transition-all duration-300"
                >
                  Turnos
                </Button>
              </Link>
            )}
            {user?.role === "profesional" && (
              <Link
                href="/profesional/turnos"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="outline"
                  className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full transition-all duration-300"
                >
                  Mis Turnos
                </Button>
              </Link>
            )}
            {user?.role === "cliente" && (
              <Link
                href="/cliente/turno"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button
                  variant="outline"
                  className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full transition-all duration-300"
                >
                  Mis Turnos
                </Button>
              </Link>
            )}

            {user ? (
              <div className="py-2">
                <span className="block text-[#536a86] mb-2">
                  {user.first_name} {user.last_name}
                </span>
                <Button
                  variant="outline"
                  className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white w-full transition-all duration-300"
                  onClick={logout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button className="bg-[#536a86] text-white hover:bg-[#435c74] w-full transition-all duration-300">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
