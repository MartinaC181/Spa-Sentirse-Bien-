import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "../components/ui/carousel";
import React, { useRef, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function CarouselServices() {
const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
);
const services = [
    { nombre: "Masajes", imagen: "/masaje-relajante.jpg" },
    { nombre: "Belleza", imagen: "/microexfoliacion.png" },
    { nombre: "Corporal", imagen: "/velaslimcuadrado.png" },
    { nombre: "Grupales", imagen: "/yogacuadrado.png" },
];

    useEffect(() => {
        if (!plugin.current) {
            plugin.current = Autoplay({ delay: 2000, stopOnInteraction: true });
        }
    }, []);
return (
    <Carousel
    orientation="horizontal"
    plugins={plugin.current ? [plugin.current] : []}
    className="w-full md:w-3/4 px-10"
    onMouseEnter={plugin.current?.stop}
    onMouseLeave={plugin.current?.reset}
    >
    <CarouselContent>
        {services.map((servicio) => (
        <CarouselItem key={servicio.nombre}>
            <div className="flex flex-col items-center">
                <Image src={servicio.imagen} alt={servicio.nombre} width={500} height={300} className="rounded-md mb-3"/>
                <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
            </div>
        </CarouselItem>
        ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
    </Carousel>
);
}
