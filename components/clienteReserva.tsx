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
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          onCloseService();
        }
      }}>
        <DialogContent className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-2 border-[#536a86] rounded-xl shadow-2xl max-w-md mx-auto">
          <DialogHeader className="text-center pb-3">
            <DialogTitle className="text-xl font-bold text-[#536a86]">Reserva de Servicio</DialogTitle>
            <p className="text-[#6c757d] mt-1 text-sm">Completa los datos para tu cita</p>
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
              <Label htmlFor="fecha" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Fecha</Label>
              <div className="border-2 border-[#536a86] rounded-lg overflow-hidden">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Hora</Label>
              <select
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#536a86] bg-white text-[#536a86] font-medium focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:ring-opacity-50 transition-all duration-200"
                required
              >
                <option value="">Selecciona una hora</option>
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 8; // Empezar desde las 8:00
                  const timeString = hour.toString().padStart(2, '0') + ':00';
                  return (
                    <option key={timeString} value={timeString}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profesional" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Profesional</Label>
              <select
                id="profesional"
                value={profesional}
                onChange={(e) => setProfesional(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#536a86] bg-white text-[#536a86] font-medium focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:ring-opacity-50 transition-all duration-200"
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

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#536a86] to-[#435c74] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#435c74] hover:to-[#536a86] transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}


