'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import Image from 'next/image';
import { Button } from "../../../components/ui/button";
import React, { useState, useRef } from "react";
import Navbar from "../../../components/Navbar";
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
import useFetch from "@/hooks/useFetchServices";
import { IService } from "@/models/interfaces";
import { Notification } from "../../../components/ui/notification";
import { useAuth } from '@/contexts/AuthContext';
import { ObjectId } from "mongoose";
import { motion } from "framer-motion";

export default function IndividualServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { data, loading, error, refetch, updateData } = useFetch(process.env.NEXT_PUBLIC_API_SERVICE as string);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los servicios: {error}</p>;
  if (!data || data.length === 0) return <p>No hay servicios disponibles.</p>;

  const handleServiceClick = (serviceId: string) => {
  setSelectedService((prev) => (prev === serviceId ? null : serviceId));
};

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value.trim() || '';
    const description = descRef.current?.value.trim() || '';
    const image = imgRef.current?.value.trim() || '';
    const price = priceRef.current?.value.trim() || '';
    const type = "Individual";

    if (!name || !description || !image || !price) {
      setNotification({
        message: "Todos los campos son obligatorios.",
        type: "error"
      });
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_SERVICE as string + '/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          descripcion: description,
          Image: image,
          precio: price,
          tipo: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el servicio.");
      }

      const newService = await response.json();
      updateData([...data, newService]);
      setNotification({
        message: "Servicio agregado exitosamente.",
        type: "success"
      });
      setModalOpen(false);

      // Reset form fields
      if (nameRef.current) nameRef.current.value = '';
      if (descRef.current) descRef.current.value = '';
      if (imgRef.current) imgRef.current.value = '';
      if (priceRef.current) priceRef.current.value = '';
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Hubo un problema al agregar el servicio.",
        type: "error"
      });
    }
  };

  const handleDeleteService = async (serviceId: ObjectId) => {
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este servicio?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_SERVICE as string + '/delete/' + serviceId , {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el servicio.");
      }

      const updatedData = data.filter((service: IService) => service._id !== serviceId);
      updateData(updatedData);
      setNotification({
        message: "Servicio eliminado exitosamente.",
        type: "success"
      });
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Hubo un problema al eliminar el servicio.",
        type: "error"
      });
    }
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto py-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Servicios Individuales
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-center"
        >
          Disfruta de nuestras experiencias individuales de spa.
        </motion.p>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-end mb-6"
          >
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
          </motion.div>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data
            .filter((service: IService) => service.tipo === "Individual")
            .map((service: IService, index: number) => {
              const isSelected = selectedService === String(service._id);
              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  className={`transition-all duration-300 ${isSelected ? "lg:col-span-3 flex flex-col lg:flex-row gap-6 min-h-[620px]" : ""}`}
                >
                  <Card className="bg-[#bac4e0] hover:shadow-lg transition-shadow duration-300 w-full lg:w-[%60] h-full">
                    <div className={`relative ${isSelected ? "relative w-full h-[250px] lg:h-[600px]" : "h-48"} w-full`}>
                      <Image
                        src={service.Image}
                        alt={service.nombre}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-t-md object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl font-bold text-[#536a86]">{service.nombre}</CardTitle>
                        <span className="block text-lg font-bold text-[#536a86] mt-1">${service.precio}</span>
                      <CardDescription className="mt-2 text-gray-500">{service.descripcion}</CardDescription>
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="w-full text-[#536a86]"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleServiceClick(String(service._id))}
                        >
                          {isSelected ? "Servicio Seleccionado" : "Seleccionar Servicio"}
                        </Button>
                        {isAdmin && (
                          <Button
                            onClick={() => handleDeleteService(service._id)}
                            className="w-full text-red-600 border-red-400"
                            variant="outline"
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {isSelected && (
                    <div className="w-full lg:w-[%40] mt-6 lg:mt-0">
                      <ClienteReserva selectedService={selectedService} onCloseService={() => setSelectedService(null)} />
                    </div>
                  )}
                </motion.li>
              );
            })}
        </ul>
      </motion.div>
    </main>
  );
}
