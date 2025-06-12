"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from './ui/notification';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/useFetchServices';
import { IUser } from '@/models/interfaces';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ClienteReservaProps {
  selectedService: string | null;
  onCloseService: () => void;
}

export default function ClienteReserva({ selectedService, onCloseService }: ClienteReservaProps) {
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState('');
  const [profesional, setProfesional] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const { data } = useFetch(process.env.NEXT_PUBLIC_API_USER!);
  const profesionales = (data || []).filter((item: any) => item.role === 'profesional');

  useEffect(() => {
    if (selectedService) {
      setModalOpen(true);
    }
  }, [selectedService]);


  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_USER!);
        if (!res.ok) throw new Error("No se pudo obtener los usuarios");

        const usuarios = await res.json();
        const usuarioEncontrado = usuarios.find((u: any) => u.email === user.email);
        if (usuarioEncontrado) {
          setUsuarioId(usuarioEncontrado._id);
        }
      } catch (error) {
        console.error("Error al buscar el ID del usuario:", error);
      }
    };

    fetchUserId();
  }, [user?.email]);

  console.log("ID del usuario:", usuarioId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setNotification({
        message: "Debes iniciar sesión para hacer una reserva",
        type: "error"
      });
      return;
    }

    if (!fecha || !hora) {
      setNotification({
        message: "Por favor, selecciona fecha y hora",
        type: "error"
      });
      return;
    }

    try {
      const body = JSON.stringify({
        cliente: usuarioId,
        servicio: selectedService,
        profesional,
        fecha: fecha ? fecha.toISOString().split('T')[0] : '',
        hora,
      });

      const response = await fetch(process.env.NEXT_PUBLIC_API_TURNO! + '/create', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) throw new Error('Error al crear la reserva');

      // Mostrar primero la notificación (no desmontar todavía)
      setNotification({
        message: "Reserva creada exitosamente",
        type: "success"
      });

      // Esperar a que se vea la notificación y luego desmontar
      setTimeout(() => {
        setModalOpen(false);
        onCloseService();
        setFecha(undefined);
        setHora('');
        setProfesional('');
        setNotification(null); // limpiar la notificación después
      }, 2500);
    } catch (error) {
      setNotification({
        message: "Error al crear la reserva",
        type: "error",
      });

      setTimeout(() => {
        setModalOpen(false);
        onCloseService();
        setNotification(null);
      }, 2500);
    }
  }

  if (!user) {
    return (
      <Card className="bg-[#bac4e0] border-2 border-[#536a86]">
        <CardHeader>
          <CardTitle className="text-[#536a86]">Reserva de Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-[#536a86]">Para hacer una reserva, debes iniciar sesión</p>
            <Button
              onClick={() => router.push('/login')}
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
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserva de Servicio</DialogTitle>
          </DialogHeader>
          {notification && (
            <div className="absolute left-0 right-0 top-0 z-50 flex justify-center pointer-events-none">
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-[#536a86]">Fecha</Label>
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={setFecha}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora" className="text-[#536a86]">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="bg-white border-[#536a86]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profesional" className="text-[#536a86]">Profesional</Label>
              <select
                id="profesional"
                value={profesional}
                onChange={(e) => setProfesional(e.target.value)}
                className="w-full p-2 rounded border border-[#536a86] bg-white"
                required
              >
                <option value="">Selecciona un profesional</option>
                {profesionales.map((p: IUser) => (
                  <option key={String(p._id)} value={String(p._id)}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
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


