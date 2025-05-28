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
import { useState, useMemo } from "react";

export default function AdminTurnosPage() {
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroServicio, setFiltroServicio] = useState("");
  const [filtroProfesional, setFiltroProfesional] = useState("");


  const { data, loading, error, refetch } = useFetch(
    process.env.NEXT_PUBLIC_API_TURNO!
  );
  const turnos: ITurno[] = data || [];
  const [processing, setProcessing] = useState(false);

  // Opcional: derivar listas únicas de servicios y profesionales
  const serviciosUnicos = useMemo(() => {
    const servicios = turnos.map(t => t.servicio?.nombre).filter(Boolean);
    return [...new Set(servicios)];
  }, [turnos]);

  const profesionalesUnicos = useMemo(() => {
    const profesionales = turnos.map(t => t.profesional?.first_name).filter(Boolean);
    return [...new Set(profesionales)];
  }, [turnos]);
  
  const turnosFiltrados = useMemo(() => {
    return turnos.filter((t: ITurno) => {
      const fecha: string | Date = t.fecha as string | Date;
      const coincideFecha =
        !filtroFecha ||
        (typeof fecha === "string"
          ? fecha.startsWith(filtroFecha)
          : fecha instanceof Date
            ? fecha.toISOString().startsWith(filtroFecha)
            : false);
      const coincideServicio = !filtroServicio || t.servicio?.nombre === filtroServicio;
      const coincideProfesional = !filtroProfesional || t.profesional?.first_name === filtroProfesional;
      return coincideFecha && coincideServicio && coincideProfesional;
    });
  }, [turnos, filtroFecha, filtroServicio, filtroProfesional]);


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
          { /* Filtros para la tabla de turnos */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Filtrar por Fecha</label>
                <input
                  type="date"
                  className="border px-2 py-1 rounded"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Filtrar por Servicio</label>
                <select
                  className="border px-2 py-1 rounded"
                  value={filtroServicio}
                  onChange={(e) => setFiltroServicio(e.target.value)}
                >
                  <option value="">Todos</option>
                  {serviciosUnicos.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Filtrar por Profesional</label>
                <select
                  className="border px-2 py-1 rounded"
                  value={filtroProfesional}
                  onChange={(e) => setFiltroProfesional(e.target.value)}
                >
                  <option value="">Todos</option>
                  {profesionalesUnicos.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
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
                  {turnosFiltrados.map((turno: ITurno, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {format(new Date(turno.fecha), "PPP", { locale: es })}
                      </TableCell>
                      <TableCell>{turno.hora}</TableCell>
                      <TableCell>{turno.cliente?.email}</TableCell>
                      <TableCell>{turno.servicio?.nombre}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${turno.estado === "confirmado"
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
