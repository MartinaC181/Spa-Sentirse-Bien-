import Link from "next/link";
import Image from "next/image";

export default function Footer() {
return (
    <footer className="bg-[#bac4e0] text-[#536a86] pt-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Contacto Rápido */}
        <section className="text-center flex-grow">
        <h2 className="text-2xl font-serif mb-2">¿Tenés dudas?</h2>
        <p className="mb-4">Escribinos directamente por WhatsApp y te respondemos al instante.</p>
        <Link
            href="https://wa.me/5493794087797"
            target="_blank"
            className="inline-block bg-white text-[#536a86] px-6 py-3 rounded-full shadow hover:bg-[#f6fedb] transition"
        >
            📱 Enviar WhatsApp
        </Link>
        </section>
    </div>

    <div className="text-center text-sm py-4 border-t border-[#536a86] mt-8">
        &copy; {new Date().getFullYear()} Sentirse Bien - Todos los derechos reservados
    </div>
    </footer>
);
}
