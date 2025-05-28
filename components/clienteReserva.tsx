"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "./ui/notification";
import { useRouter } from "next/navigation";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"; // Asegúrate de que la ruta sea correcta

interface ClienteReservaProps {
  selectedService: string[];
}

export default function ClienteReserva({
  selectedService,
}: ClienteReservaProps) {
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState("");
  const [detalles, setDetalles] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const horasDisponibles = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  // Abre el modal automáticamente cuando se selecciona un servicio
  useEffect(() => {
    if (selectedService) {
      setModalOpen(true);
    }
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setNotification({
        message: "Debes iniciar sesión para hacer una reserva",
        type: "error",
      });
      return;
    }

    if (!fecha || !hora) {
      setNotification({
        message: "Por favor, selecciona fecha y hora",
        type: "error",
      });
      return;
    }

    if (!selectedService.length) {
      setNotification({
        message: "Selecciona al menos un servicio",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/turnos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: `${user.nombre} ${user.apellido}`,
          email: user.email,
          servicios: selectedService,
          fecha: fecha.toISOString().split("T")[0],
          hora,
          detalles,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la reserva");
      }

      setNotification({
        message: "Reserva creada exitosamente",
        type: "success",
      });

      setFecha(undefined);
      setHora("");
      setDetalles("");
      setModalOpen(false);
    } catch (error) {
      setNotification({
        message: "Error al crear la reserva",
        type: "error",
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-[#bac4e0] border-2 border-[#536a86]">
        <CardHeader>
          <CardTitle className="text-[#536a86]">Reserva de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-[#536a86]">
              Para hacer una reserva, debes iniciar sesión
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-[#536a86] text-white hover:bg-[#435c74]"
            >
              Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {/* Elimina el DialogTrigger, ya no es necesario */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserva de Servicio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-[#536a86]">
                Fecha
              </Label>
              <Calendar mode="single" selected={fecha} onSelect={setFecha} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora" className="text-[#536a86]">
                Hora
              </Label>
              <select
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="bg-white border border-[#536a86] w-full rounded px-3 py-2"
                required
              >
                <option value="">Selecciona una hora</option>
                {horasDisponibles.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalles" className="text-[#536a86]">
                Detalles adicionales
              </Label>
              <Input
                id="detalles"
                type="text"
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
                placeholder="Especificaciones o preferencias"
                className="bg-white border-[#536a86]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#536a86] text-white hover:bg-[#435c74]"
            >
              Reservar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
