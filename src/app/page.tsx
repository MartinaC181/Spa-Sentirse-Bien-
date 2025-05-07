"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Image from "next/image";
import CarouselServices from "@/components/carousel";
import Footer from "@/components/footer";

export default function Home() {

  return (
    <main className="bg-[#f6fedb] text-[#536a86]">
      <Navbar />

      <section
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url(/logo2.png)" }}
      >

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
      </section>

      <section className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 bg-[#fff]">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-serif mb-4">Bienvenida al Spa</h2>
          <p className="text-lg">
            En “Sentirse Bien” nos dedicamos a cuidar tu cuerpo y tu mente.
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
      </section>


      <section className="py-16 px-6 md:px-20 bg-[#f6fedb] text-center">
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
      </section>

      <section>
        <Footer />
      </section>
    </main>
  );
}
