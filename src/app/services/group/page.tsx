'use client';

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { groupservices } from "@/components/groupservices";
import ClienteReserva from "@/components/clienteReserva";

export default function GroupServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceClick = (serviceTitle: string) => {
    setSelectedService(prev => (prev === serviceTitle ? null : serviceTitle));
  };

  const services = groupservices;

  return (
    <main className="min-h-screen bg-[#f6fedb] text-[#536a86]">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Servicios Grupales</h1>
        <p className="mb-6 text-center">Disfruta de nuestras experiencias de spa en conjunto con otras personas.</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isSelected = selectedService === service.name;

          return (
            <li
              key={index}
              className={`transition-all duration-300 ${isSelected ? "lg:col-span-3 flex flex-col lg:flex-row gap-6 min-h-[620px]" : ""}`}
            >
              {/* Servicio */}
              <Card className={`bg-[#bac4e0] hover:shadow-lg transition-shadow duration-300 ${isSelected ? "lg:w-[60%]" : "w-full"} h-full`}>
                <div className={`relative ${isSelected ? "relative w-full h-[250px] lg:h-[600px]" : "h-48"} w-full`}>
                  <Image
                    src={service.image}
                    alt={service.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-md"
                  />
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
                  <CardDescription className="mt-2 text-gray-500">{service.description}</CardDescription>
                  <Button
                    className="mt-4 w-full"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleServiceClick(service.name)}
                    >
                      {isSelected ? "Servicio Seleccionado" : "Seleccionar Servicio"}
                    </Button>
                  </CardContent>
                </Card>

                {/* ClienteReserva solo si está seleccionado */}
                {isSelected && (
                  <div className="w-full lg:w-[%40] mt-6 lg:mt-0">
                    <ClienteReserva selectedService={selectedService} /> {/* Use service.title here? */}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}