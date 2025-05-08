'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import Image from 'next/image';
import { Button } from "../../../components/ui/button";
import React, { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
import { individualservices } from "../../../components/individualservices";
import ClienteReserva from "../../../components/clienteReserva"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '../../../components/ui/dialog';

export default function IndividualServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState(individualservices);
  const [modalOpen, setModalOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleServiceClick = (serviceName: string) => { 
    if (selectedService === serviceName) {
      setSelectedService(null);
    } else {
      setSelectedService(serviceName);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() || '';
    const description = descRef.current?.value.trim() || '';
    const image = imgRef.current?.value.trim() || '';
    const price = priceRef.current?.value.trim() || '';
    if (!name || !description || !image || !price) return;
    setServices([
      ...services,
      { name, description, image, price },
    ]);
    setModalOpen(false);
    if (nameRef.current) nameRef.current.value = '';
    if (descRef.current) descRef.current.value = '';
    if (imgRef.current) imgRef.current.value = '';
    if (priceRef.current) priceRef.current.value = '';
  };

  const handleDeleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      if (imgRef.current) imgRef.current.value = url;
    }
  };

  return (
    <main className="min-h-screen bg-[#f6fedb] text-[#536a86]">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Servicios Individuales</h1>
        <p className="mb-6 text-center">Disfruta de nuestras experiencias individuales de spa.</p>

        <div className="flex justify-end mb-6">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#536a86] text-white">Crear nuevo servicio</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo servicio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddService} className="space-y-4">
                <input ref={nameRef} required placeholder="Nombre" className="w-full border rounded px-3 py-2" />
                <input ref={descRef} required placeholder="Descripción" className="w-full border rounded px-3 py-2" />
                <input
                  ref={imgRef}
                  required
                  placeholder="URL de la imagen"
                  className="w-full border rounded px-3 py-2 mb-2"
                  style={{ display: 'none' }}
                />
                <label className="block w-full border-2 border-dashed border-gray-300 rounded px-3 py-6 text-center cursor-pointer hover:bg-gray-50">
                  <span className="block mb-2">Arrastra o haz clic para subir una imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img src={imagePreview} alt="Vista previa" className="mx-auto mt-2 max-h-32 rounded" />
                  )}
                </label>
                <input ref={priceRef} required placeholder="Precio" className="w-full border rounded px-3 py-2" />
                <DialogFooter>
                  <Button type="submit" className="bg-[#536a86] text-white">Agregar</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {services.map((service, index) => {
    const isSelected = selectedService === service.name;
    
    return (
      <li
        key={index}
        className={`transition-all duration-300 ${isSelected ? "lg:col-span-3 flex flex-col lg:flex-row gap-6 min-h-[620px]" : ""}`}
        >
        {/* Servicio */}
        <Card className="bg-[#bac4e0] hover:shadow-lg transition-shadow duration-300 w-full lg:w-[%60] h-full">
          <div className={`relative ${isSelected ? "relative w-full h-[250px] lg:h-[600px]" : "h-48"} w-full`}>
            <Image
              src={service.image}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-t-md object-cover"
            />
          </div>
          <CardContent className="p-6">
            <CardTitle className="text-xl font-bold text-[#536a86]">{service.name}</CardTitle>
            <span className="block text-lg font-bold text-[#536a86] mt-1">{service.price}</span>
            <CardDescription className="mt-2 text-gray-500">{service.description}</CardDescription>
            <div className="flex gap-2 mt-4">
              <Button
                className="w-full text-[#536a86]"
                variant={isSelected ? "default" : "outline"}
                onClick={() => handleServiceClick(service.name)}
              >
                {isSelected ? "Servicio Seleccionado" : "Seleccionar Servicio"}
              </Button>
              <Button
                className="w-full text-red-600 border-red-400"
                variant="outline"
                onClick={() => handleDeleteService(index)}
              >
                Eliminar
              </Button>
            </div>
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
