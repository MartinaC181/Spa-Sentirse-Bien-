"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from './ui/notification';
import { useRouter } from 'next/navigation';

interface ClienteReservaProps {
  selectedService: string | null;
}

export default function ClienteReserva({ selectedService }: ClienteReservaProps) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [detalles, setDetalles] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo) {
      setNotification({
        message: "Debes iniciar sesión para hacer una reserva",
        type: "error"
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
      const response = await fetch('/api/turnos/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: `${user.nombre} ${user.apellido}`,
          email: user.email,
          servicio: selectedService,
          fecha,
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

      // Limpiar el formulario
      setFecha('');
      setHora('');
      setDetalles('');
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <CardHeader>
        <CardTitle className="text-[#536a86]">Reserva de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fecha" className="text-[#536a86]">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-white border-[#536a86]"
              required
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
            <Label htmlFor="detalles" className="text-[#536a86]">Detalles adicionales</Label>
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
      </CardContent>
    </Card>
  );
}
