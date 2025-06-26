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

  const { data: usuariosData, loading: loadingUsuarios } = useFetch(
    process.env.NEXT_PUBLIC_API_USER!
  );

  const profesionalesDesdeBD = useMemo(() => {
    return (usuariosData || []).filter((u: any) => u.role === "profesional");
  }, [usuariosData]);

  const profesionalesPorId = useMemo(() => {
    const map: Record<string, { first_name: string; last_name: string }> = {};
    profesionalesDesdeBD.forEach((p: any) => {
      map[p._id] = {
        first_name: p.first_name,
        last_name: p.last_name,
      };
    });
    return map;
  }, [profesionalesDesdeBD]);

  const serviciosUnicos = useMemo(() => {
    const servicios = turnos.map((t) => t.servicio?.nombre).filter(Boolean);
    return [...new Set(servicios)];
  }, [turnos]);

  const turnosFiltrados = useMemo(() => {
    return turnos.filter((t: ITurno) => {
      const fechaTurno = t.fecha ? format(new Date(t.fecha), "yyyy-MM-dd") : "";
      const coincideFecha =
        !filtroFecha || fechaTurno === filtroFecha;
      const coincideServicio =
        !filtroServicio || t.servicio?.nombre === filtroServicio;
      const coincideProfesional =
        !filtroProfesional ||
        (typeof t.profesional === "string"
          ? t.profesional === filtroProfesional
          : t.profesional?._id?.toString() === filtroProfesional);
      return coincideFecha && coincideServicio && coincideProfesional;
    });
  }, [turnos, filtroFecha, filtroServicio, filtroProfesional]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este turno?")) return;

    setProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_TURNO}/delete/${id}`,
        {
          method: "DELETE",
        }
      );

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_TURNO}/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: "Confirmado" }),
        }
      );

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

  // Función para imprimir turno individual
  const handlePrintIndividual = (turno: ITurno) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Turno - ${turno.servicio?.nombre}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #536a86;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #536a86;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #7a8fa6;
              margin: 5px 0;
            }
            .turno-card {
              border: 2px solid #536a86;
              border-radius: 12px;
              padding: 25px;
              background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
              box-shadow: 0 4px 15px rgba(83, 106, 134, 0.1);
            }
            .turno-title {
              font-size: 24px;
              font-weight: bold;
              color: #536a86;
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #c3d0e6;
              padding-bottom: 10px;
            }
            .turno-details {
              display: grid;
              grid-template-columns: 1fr;
              gap: 15px;
              font-size: 16px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 10px 0;
              border-bottom: 1px solid #e0e7fa;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #536a86;
              min-width: 120px;
            }
            .value {
              color: #333;
              text-align: right;
              flex: 1;
            }
            .participantes-section {
              margin-top: 20px;
              padding: 15px;
              background-color: #e0e7fa;
              border-radius: 8px;
              border-left: 4px solid #536a86;
            }
            .participantes-title {
              font-weight: bold;
              color: #536a86;
              margin-bottom: 10px;
              font-size: 18px;
            }
            .estado-badge {
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .estado-pendiente {
              background-color: #fff3cd;
              color: #856404;
            }
            .estado-confirmado {
              background-color: #d4edda;
              color: #155724;
            }
            .estado-cancelado {
              background-color: #f8d7da;
              color: #721c24;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #7a8fa6;
              font-size: 12px;
              border-top: 1px solid #c3d0e6;
              padding-top: 20px;
            }
            .qr-placeholder {
              width: 100px;
              height: 100px;
              border: 2px dashed #c3d0e6;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 20px auto;
              color: #7a8fa6;
              font-size: 12px;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Spa Sentirse Bien</h1>
            <p>Detalle de Turno</p>
            <p>Fecha de impresión: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>

          <div class="turno-card">
            <div class="turno-title">${turno.servicio?.nombre}</div>
            
            <div class="turno-details">
              <div class="detail-row">
                <span class="label">Fecha:</span>
                <span class="value">${format(new Date(turno.fecha), 'dd/MM/yyyy')}</span>
              </div>
              <div class="detail-row">
                <span class="label">Hora:</span>
                <span class="value">${turno.hora}</span>
              </div>
              <div class="detail-row">
                <span class="label">Estado:</span>
                <span class="value">
                  <span class="estado-badge estado-${turno.estado}">${turno.estado}</span>
                </span>
              </div>
            </div>

            <div class="participantes-section">
              <div class="participantes-title">Participantes</div>
              <div class="detail-row">
                <span class="label">Cliente:</span>
                <span class="value">${turno.cliente?.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Profesional:</span>
                <span class="value">
                  ${typeof turno.profesional === "string" && profesionalesPorId[turno.profesional]
                    ? `${profesionalesPorId[turno.profesional].first_name} ${profesionalesPorId[turno.profesional].last_name}`
                    : "No asignado"}
                </span>
              </div>
            </div>

            <div class="qr-placeholder">
              Código QR<br/>del turno
            </div>
          </div>

          <div class="footer">
            <p>Este documento es para uso administrativo</p>
            <p>Spa Sentirse Bien - Sistema de Gestión de Turnos</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (loading || loadingUsuarios) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!turnos) return <p>No hay turnos disponibles</p>;

  return (
    <AdminRoute>
      <main className="min-h-screen bg-gradient-to-br from-[#f6fedb] to-[#e0e7fa]">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#536a86] tracking-tight drop-shadow mb-2">
              Administración de Turnos
            </h1>
            <p className="text-[#7a8fa6] text-lg">
              Gestiona y administra todos los turnos del spa
            </p>
          </div>

          {/* Filtros */}
          <Card className="mb-6 shadow-lg border-[#c3d0e6] bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#536a86] text-xl font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-[#536a86] text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="w-full border border-[#c3d0e6] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:border-transparent transition-all duration-300 bg-white/50"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-[#536a86] text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Servicio
                  </label>
                  <select
                    className="w-full border border-[#c3d0e6] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:border-transparent transition-all duration-300 bg-white/50"
                    value={filtroServicio}
                    onChange={(e) => setFiltroServicio(e.target.value)}
                  >
                    <option value="">Todos los servicios</option>
                    {serviciosUnicos.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-[#536a86] text-sm">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Profesional
                  </label>
                  <select
                    className="w-full border border-[#c3d0e6] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:border-transparent transition-all duration-300 bg-white/50"
                    value={filtroProfesional}
                    onChange={(e) => setFiltroProfesional(e.target.value)}
                  >
                    <option value="">Todos los profesionales</option>
                    {profesionalesDesdeBD.map((p : any) => (
                      <option key={p._id} value={p._id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de Turnos */}
          <Card className="shadow-lg border-[#c3d0e6] bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#536a86] text-xl font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lista de Turnos
                </CardTitle>
                <div className="text-sm text-[#7a8fa6] bg-[#e0e7fa] px-3 py-1 rounded-full">
                  {turnosFiltrados.length} turno{turnosFiltrados.length !== 1 ? 's' : ''} encontrado{turnosFiltrados.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#536a86] hover:bg-[#435c74] transition-colors duration-300">
                      <TableHead className="text-white font-semibold">Fecha</TableHead>
                      <TableHead className="text-white font-semibold">Hora</TableHead>
                      <TableHead className="text-white font-semibold">Cliente</TableHead>
                      <TableHead className="text-white font-semibold">Servicio</TableHead>
                      <TableHead className="text-white font-semibold">Profesional</TableHead>
                      <TableHead className="text-white font-semibold">Estado</TableHead>
                      <TableHead className="text-white font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {turnosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-[#7a8fa6]">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg font-medium">No se encontraron turnos</p>
                            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      turnosFiltrados.map((turno: ITurno, index: number) => (
                        <TableRow 
                          key={index} 
                          className="hover:bg-[#f9f9f9] transition-colors duration-300 border-b border-[#e0e7fa]"
                        >
                          <TableCell className="font-medium text-[#536a86]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {format(new Date(turno.fecha), "PPP", { locale: es })}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#536a86]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                              </svg>
                              {turno.hora}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#536a86]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {turno.cliente?.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#536a86]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {turno.servicio?.nombre}
                            </div>
                          </TableCell>
                          <TableCell className="text-[#536a86]">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {typeof turno.profesional === "string" && profesionalesPorId[turno.profesional]
                                ? `${profesionalesPorId[turno.profesional].first_name} ${profesionalesPorId[turno.profesional].last_name}`
                                : "No asignado"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                turno.estado === "confirmado"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : turno.estado === "cancelado"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              }`}
                            >
                              {turno.estado}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {turno.estado === "pendiente" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500 text-white hover:bg-green-600 border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                                  onClick={() => handleConfirm(turno._id.toString())}
                                  disabled={processing}
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                  {processing ? "Procesando..." : "Confirmar"}
                                </Button>
                              )}
                              {(turno.estado === "pendiente" || turno.estado === "confirmado") && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="transition-all duration-300 shadow-sm hover:shadow-md"
                                  onClick={() => handleDelete(turno._id.toString())}
                                  disabled={processing}
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  {processing ? "Procesando..." : "Cancelar"}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                                onClick={() => handlePrintIndividual(turno)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminRoute>
  );
}