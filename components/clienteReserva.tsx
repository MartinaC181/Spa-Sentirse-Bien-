'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Notification } from './ui/notification';
import { IService, IUser } from '@/models/interfaces';

interface ClienteReservaProps {
  selectedService: string;
}

export default function ClienteReserva({ selectedService }: ClienteReservaProps) {
  const [correo, setCorreo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo) {
      setNotification({
        message: "Por favor, ingresa un correo electrónico",
        type: "error"
      });
      return;
    }

    let fetchedUser: IUser;

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_USER! + '/correo/' + correo, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      fetchedUser = await response.json();

    } catch (error) {
      console.error('Error:', error);
      setNotification({
        message: "Error al obtener el usuario",
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

    let service: IService;

    try {
      if (!process.env.NEXT_PUBLIC_API_SERVICE || !selectedService) {
        setNotification({
          message: "Error: Configuración del servicio no encontrada",
          type: "error"
        });
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVICE}/name/${selectedService}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el servicio');
      }
      service = await response.json();

    } catch (error) {
      console.error('Error:', error);
      setNotification({
        message: "Error al obtener el servicio",
        type: "error"
      });
      return;
    }
    
    try {
      const body = {
        cliente: fetchedUser._id,
        servicio: service._id,
        fecha,
        hora
      };

      const response = await fetch(process.env.NEXT_PUBLIC_API_TURNO! + '/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }

      setNotification({
        message: "Reserva creada exitosamente",
        type: "success"
      });

      setCorreo('');
      setFecha('');
      setHora('');
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        message: "Error al crear la reserva",
        type: "error"
      });
    }
  };

  return (
    <Card className="bg-[#bac4e0] border-2 border-[#536a86]">
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
            <Label htmlFor="correo" className="text-[#536a86]">Correo Electrónico</Label>
            <Input
              id="correo"
              placeholder='Tu correo electrónico'
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="bg-white border-[#536a86]"
              required
            />
          </div>

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
