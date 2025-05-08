'use client';

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';

interface Turno {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  detalles?: string;
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

const turnos: Turno[] = [
  {
    _id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '123456789',
    servicio: 'Masaje relajante',
    fecha: '2024-06-10T00:00:00.000Z',
    hora: '10:00',
    estado: 'pendiente',
  },
  {
    _id: '2',
    nombre: 'Ana López',
    email: 'ana@example.com',
    telefono: '987654321',
    servicio: 'Facial',
    fecha: '2024-06-11T00:00:00.000Z',
    hora: '12:00',
    estado: 'confirmado',
  },
];

export default function AdminTurnosPage() {
  return (
    <AdminRoute>
      <main className="min-h-screen bg-[#f6fedb]">
        <Navbar />
        <div className="container mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle>Administración de Turnos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turnos.map((turno) => (
                    <TableRow key={turno._id}>
                      <TableCell>
                        {format(new Date(turno.fecha), 'PPP', { locale: es })}
                      </TableCell>
                      <TableCell>{turno.hora}</TableCell>
                      <TableCell>{turno.nombre}</TableCell>
                      <TableCell>{turno.servicio}</TableCell>
                      <TableCell>
                        <div>
                          <p>{turno.email}</p>
                          <p>{turno.telefono}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          turno.estado === 'confirmado' 
                            ? 'bg-green-100 text-green-800'
                            : turno.estado === 'cancelado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {turno.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {turno.estado === 'pendiente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-500 text-white hover:bg-green-600"
                              >
                                Confirmar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminRoute>
  );
} 