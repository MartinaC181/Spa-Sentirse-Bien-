import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
return (
    <footer className="bg-[#bac4e0] text-[#536a86] pt-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Contacto Rápido */}
        <section className="text-center flex-grow">
        <h2 className="text-2xl font-serif mb-2">¿Tenés dudas?</h2>
        <p className="mb-4">Contáctanos en nuestras redes sociales</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <Link
              href="https://wa.me/5493794087797"
              target="_blank"
              className="inline-block bg-white text-[#536a86] px-3 py-2 rounded-full shadow hover:bg-[#f6fedb] transition flex items-center gap-1 text-sm"
          >
              <FaWhatsapp className="text-green-500 text-lg" /> WhatsApp
          </Link>
          <Link
              href="https://www.instagram.com/bigmootoo/"
              target="_blank"
              className="inline-block bg-white text-[#536a86] px-3 py-2 rounded-full shadow hover:bg-[#f6fedb] transition flex items-center gap-1 text-sm"
          >
              <FaInstagram className="text-pink-500 text-lg" /> Instagram
          </Link>
          <Link
              href="https://www.facebook.com/frreutn/"
              target="_blank"
              className="inline-block bg-white text-[#536a86] px-3 py-2 rounded-full shadow hover:bg-[#f6fedb] transition flex items-center gap-1 text-sm"
          >
              <FaFacebook className="text-blue-600 text-lg" /> Facebook
          </Link>
        </div>
        </section>
    </div>

    <div className="text-center text-sm py-4 border-t border-[#536a86] mt-8">
        &copy; {new Date().getFullYear()} Sentirse Bien - Todos los derechos reservados
    </div>
    </footer>
);
}
