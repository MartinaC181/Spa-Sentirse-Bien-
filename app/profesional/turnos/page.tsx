'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/components/ui/notification';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function VistaTurnosProfesional() {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState<any[]>([]);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const hoy = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        // Si no hay email, no hacemos nada
        if (!user?.email) return;

        // Buscar el profesional por email
        fetch(`${process.env.NEXT_PUBLIC_API_USER}/correo/${user.email}`)
            .then(res => res.json())
            .then(profesionalData => {
                // Suponiendo que la API devuelve un array o un objeto con el _id
                const profesionalId = profesionalData._id || (profesionalData[0] && profesionalData[0]._id);
                if (!profesionalId) {
                    setNotification({ message: 'No se encontró el profesional', type: 'error' });
                    return;
                }

                // Ahora buscar los turnos de ese profesional
                fetch(`https://spa-back-dvdm.onrender.com/api/turno`)
                    .then(res => res.json())
                    .then(data => {
                        const turnosFiltrados = data.filter((t: any) => {
                            return String(t.profesional) === String(profesionalId);
                        });
                        setTurnos(turnosFiltrados);
                    })
                    .catch(() =>
                        setNotification({ message: 'Error al cargar turnos', type: 'error' })
                    );
            })
            .catch(() =>
                setNotification({ message: 'Error al buscar profesional', type: 'error' })
            );
    }, [user?.email]);

    // Función para imprimir turno individual
    const handlePrintIndividual = (turno: any) => {
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
                        .cliente-section {
                            margin-top: 20px;
                            padding: 15px;
                            background-color: #e0e7fa;
                            border-radius: 8px;
                            border-left: 4px solid #536a86;
                        }
                        .cliente-title {
                            font-weight: bold;
                            color: #536a86;
                            margin-bottom: 10px;
                            font-size: 18px;
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
                        <p>Turno Profesional</p>
                        <p>Fecha de impresión: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                    </div>

                    <div class="turno-card">
                        <div class="turno-title">${turno.servicio?.nombre}</div>
                        
                        <div class="turno-details">
                            <div class="detail-row">
                                <span class="label">Profesional:</span>
                                <span class="value">${user?.first_name} ${user?.last_name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Email:</span>
                                <span class="value">${user?.email}</span>
                            </div>
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
                                <span class="value">${turno.estado || 'Pendiente'}</span>
                            </div>
                        </div>

                        <div class="cliente-section">
                            <div class="cliente-title">Cliente Asignado</div>
                            <div class="detail-row">
                                <span class="label">Email:</span>
                                <span class="value">${turno.cliente?.email}</span>
                            </div>
                            ${turno.cliente?.first_name ? `
                            <div class="detail-row">
                                <span class="label">Nombre:</span>
                                <span class="value">${turno.cliente.first_name} ${turno.cliente.last_name}</span>
                            </div>
                            ` : ''}
                        </div>

                        <div class="qr-placeholder">
                            Código QR<br/>del turno
                        </div>
                    </div>

                    <div class="footer">
                        <p>Este documento es para uso interno del profesional</p>
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

    // Separar turnos en dos grupos: hoy y futuro
    const hoyDate = new Date();
    hoyDate.setHours(0, 0, 0, 0);
    const turnosHoy = turnos.filter((turno) => {
        const fechaTurno = new Date(turno.fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        return fechaTurno.getTime() === hoyDate.getTime();
    });
    const turnosFuturos = turnos.filter((turno) => {
        const fechaTurno = new Date(turno.fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        return fechaTurno.getTime() > hoyDate.getTime();
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f6fedb] to-[#e0e7fa]">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-[#536a86] tracking-tight drop-shadow">Turnos del Profesional</h1>
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-[#7a8fa6] mb-4 flex items-center gap-2">
                        <span>📅</span> Turnos de Hoy
                    </h2>
                    {turnosHoy.length === 0 && <p className="text-gray-500 text-center">No hay turnos para hoy.</p>}
                    <div className="grid gap-4">
                        {turnosHoy.map((turno) => (
                            <div key={turno._id} className="border border-[#c3d0e6] p-5 rounded-xl shadow-md bg-white flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
                                <div>
                                    <p className="font-medium text-[#536a86]"><span className="font-semibold">Cliente:</span> {turno.cliente?.email}</p>
                                    <p className="font-medium text-[#536a86]"><span className="font-semibold">Servicio:</span> {turno.servicio?.nombre}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    <span className="inline-flex items-center px-3 py-1 bg-[#e0e7fa] text-[#536a86] rounded-full font-semibold text-sm"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>{turno.hora}</span>
                                    <Button
                                        onClick={() => handlePrintIndividual(turno)}
                                        size="sm"
                                        variant="outline"
                                        className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimir
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-[#7a8fa6] mb-4 flex items-center gap-2">
                        <span>⏳</span> Turnos Futuros
                    </h2>
                    {turnosFuturos.length === 0 && <p className="text-gray-500 text-center">No hay turnos futuros.</p>}
                    <div className="grid gap-4">
                        {turnosFuturos.map((turno) => (
                            <div key={turno._id} className="border border-[#c3d0e6] p-5 rounded-xl shadow-md bg-white flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
                                <div>
                                    <p className="font-medium text-[#536a86]"><span className="font-semibold">Cliente:</span> {turno.cliente?.email}</p>
                                    <p className="font-medium text-[#536a86]"><span className="font-semibold">Servicio:</span> {turno.servicio?.nombre}</p>
                                    <p className="font-medium text-[#536a86]"><span className="font-semibold">Fecha:</span> {format(new Date(turno.fecha), 'dd/MM/yyyy')}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 md:mt-0">
                                    <span className="inline-flex items-center px-3 py-1 bg-[#e0e7fa] text-[#536a86] rounded-full font-semibold text-sm"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>{turno.hora}</span>
                                    <Button
                                        onClick={() => handlePrintIndividual(turno)}
                                        size="sm"
                                        variant="outline"
                                        className="text-[#536a86] border-[#536a86] hover:bg-[#536a86] hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Imprimir
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}
