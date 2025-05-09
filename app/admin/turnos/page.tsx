"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import AdminRoute from "@/components/AdminRoute";
import Navbar from "@/components/Navbar";
import { ITurno } from "@/models/interfaces";
import useFetch from "@/hooks/useFetchServices";
import { useState } from "react";

export default function AdminTurnosPage() {
  const { data, loading, error, refetch } = useFetch(
    process.env.NEXT_PUBLIC_API_TURNO!
  );
  const turnos: ITurno = data;
  const [processing, setProcessing] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este turno?")) return;

    setProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_TURNO}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el turno");
      }

      alert("Turno eliminado correctamente");
      refetch();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar el turno");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async (id: string) => {
    setProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_TURNO}/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "confirmado" }),
      });

      if (!response.ok) {
        throw new Error("Error al confirmar el turno");
      }

      alert("Turno confirmado correctamente");
      refetch();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al confirmar el turno");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!turnos) return <p>No hay turnos disponibles</p>;

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
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turnos.map((turno: ITurno, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(new Date(turno.fecha), "PPP", { locale: es })}
                      </TableCell>
                      <TableCell>{turno.hora}</TableCell>
                      <TableCell>{turno.cliente?.email}</TableCell>
                      <TableCell>{turno.servicio?.nombre}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            turno.estado === "confirmado"
                              ? "bg-green-100 text-green-800"
                              : turno.estado === "cancelado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {turno.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {turno.estado === "pendiente" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-500 text-white hover:bg-green-600"
                                onClick={() => handleConfirm(turno._id.toString())}
                                disabled={processing}
                              >
                                {processing ? "Procesando..." : "Confirmar"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(turno._id.toString())}
                                disabled={processing}
                              >
                                {processing ? "Procesando..." : "Cancelar"}
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
