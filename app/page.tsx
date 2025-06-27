"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Image from "next/image";
import CarouselServices from "../components/carousel";
import Footer from "../components/footer";
import { motion } from "framer-motion";

export default function Home() {
  const profesionales = [
    {
      nombre: "Carolina Paz",
      email: "carolina.paz@sentirsebien.com",
      titulo: "Lic. en Kinesiología y Fisiatría",
      experiencia:
        "10 años en masoterapia y rehabilitación física. Especialista en masajes descontracturantes y piedras calientes.",
    },
    {
      nombre: "Sofía Giménez",
      email: "sofia.gimenez@sentirsebien.com",
      titulo: "Técnica en Estética Corporal y Facial",
      experiencia:
        "7 años en tratamientos de belleza facial y corporal. Experta en criofrecuencia, ultracavitación y lifting de pestañas.",
    },
    {
      nombre: "María Vera",
      email: "maria.vera@sentirsebien.com",
      titulo: "Profesora de Yoga Certificada",
      experiencia:
        "12 años enseñando yoga grupal e individual. Formación en técnicas de relajación y meditación para el bienestar emocional.",
    },
  ];

  return (
    <main className="bg-[#f6fedb] text-[#536a86]">
      <Navbar />

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
      >
        <div style={{ backgroundImage: "url(/logo2.png)" }} className="absolute inset-0 bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#f6fedb]/80 backdrop-blur-sm" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-serif font-semibold text-[#536a86] mb-6 tracking-wide drop-shadow-md">
            Bienvenido a <span className="italic">Sentirse Bien</span>
          </h1>
          <p className="text-xl sm:text-2xl text-[#536a86] font-extralight tracking-wide drop-shadow-sm leading-relaxed">
            Tu bienestar comienza aquí. Regalate un momento de calma, belleza y
            conexión interior.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 bg-[#fff]"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-serif mb-4">Bienvenida al Spa</h2>
          <p className="text-lg">
            En "Sentirse Bien" nos dedicamos a cuidar tu cuerpo y tu mente.
            Combinamos técnicas modernas con un ambiente cálido y natural.
            Nuestra misión es que cada visita sea una experiencia única de paz,
            salud y belleza.
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/interiorspa.jpg"
            alt="Interior del Spa"
            width={600}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 px-6 md:px-20 bg-[#f6fedb] text-center"
      >
        <h2 className="text-3xl font-serif mb-10">¿Qué servicios ofrecemos?</h2>
        <div className="px-6 flex justify-center">
          <CarouselServices />
        </div>
        <div className="flex justify-center gap-6 mt-8">
          <Link href="/services/individual">
            <button className="bg-[#bac4e0] px-6 py-3 rounded-xl text-[#536a86] hover:bg-[#cdd6e9] transition">
              Ver Individuales
            </button>
          </Link>
          <Link href="/services/group">
            <button className="bg-[#bac4e0] px-6 py-3 rounded-xl text-[#536a86] hover:bg-[#cdd6e9] transition">
              Ver Grupales
            </button>
          </Link>
        </div>
      </motion.section>
      {/* Sección de profesionales */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-16 px-6 md:px-20 bg-[#fff]"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-semibold text-center text-[#536a86] mb-10 drop-shadow-sm">
            Conocé a Nuestro Equipo Profesional
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profesionales.map((profe, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: idx * 0.2 }}
                className="bg-white shadow-xl rounded-2xl p-8 border border-[#bac4e0] transition-transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-[#bac4e0] flex items-center justify-center mb-4 shadow-md">
                  <span className="text-3xl font-bold text-[#536a86]">
                    {profe.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#536a86] mb-1">
                  {profe.nombre}
                </h3>
                <p className="text-sm text-[#7a8ca5] italic mb-2">
                  {profe.titulo}
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  {profe.experiencia}
                </p>
                <a
                  href={`mailto:${profe.email}`}
                  className="text-sm text-[#008080] hover:underline hover:text-[#005f5f] transition"
                >
                  {profe.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Footer />
      </motion.section>
    </main>
  );
}
