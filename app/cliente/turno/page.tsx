'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/components/ui/notification';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function VistaTurnosCliente() {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState<any[]>([]);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [profesionales, setProfesionales] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        if (!user?.email) return;

        // Buscar todos los turnos
        fetch(`${process.env.NEXT_PUBLIC_API_TURNO}`)
            .then(res => res.json())
            .then(async data => {
                // Filtrar turnos del cliente logueado
                const turnosFiltrados = data.filter((t: any) => {
                    return (
                        t.cliente?.email === user.email ||
                        t.cliente === user.email // por si acaso el campo es string
                    );
                });
                setTurnos(turnosFiltrados);

                // Obtener IDs únicos de profesionales (soporta string o {_id})
                const profesionalIds = Array.from(
                    new Set(turnosFiltrados.map((t: any) => t.profesional?._id || t.profesional))
                );
                // Fetch de todos los profesionales
                const results = await Promise.all(
                    profesionalIds.map(id =>
                        fetch(`${process.env.NEXT_PUBLIC_API_USER}/${id}`)
                            .then(res => res.json())
                            .then(data => ({ id, data }))
                            .catch(() => ({ id, data: null }))
                    )
                );
                const profObj: { [key: string]: any } = {};
                results.forEach(({ id, data }) => {
                    if (data) {
                        profObj[id as string] = data;
                    }
                });
                setProfesionales(profObj);
            });
    }, [user?.email]);

    // Función para imprimir turno individual
    const handlePrintIndividual = (turno: any) => {
        const profesionalId = turno.profesional?._id || turno.profesional;
        const profesional = profesionales[profesionalId];
        
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
                        .profesional-section {
                            margin-top: 20px;
                            padding: 15px;
                            background-color: #e0e7fa;
                            border-radius: 8px;
                            border-left: 4px solid #536a86;
                        }
                        .profesional-title {
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
                        <p>Comprobante de Turno</p>
                        <p>Fecha de impresión: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                    </div>

                    <div class="turno-card">
                        <div class="turno-title">${turno.servicio?.nombre}</div>
                        
                        <div class="turno-details">
                            <div class="detail-row">
                                <span class="label">Cliente:</span>
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

                        ${profesional ? `
                        <div class="profesional-section">
                            <div class="profesional-title">Profesional Asignado</div>
                            <div class="detail-row">
                                <span class="label">Nombre:</span>
                                <span class="value">${profesional.first_name} ${profesional.last_name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Email:</span>
                                <span class="value">${profesional.email}</span>
                            </div>
                            ${profesional.phone ? `
                            <div class="detail-row">
                                <span class="label">Teléfono:</span>
                                <span class="value">${profesional.phone}</span>
                            </div>
                            ` : ''}
                            ${profesional.especialidad ? `
                            <div class="detail-row">
                                <span class="label">Especialidad:</span>
                                <span class="value">${profesional.especialidad}</span>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}

                        <div class="qr-placeholder">
                            Código QR<br/>del turno
                        </div>
                    </div>

                    <div class="footer">
                        <p>Este comprobante debe ser presentado al momento del servicio</p>
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
                    <h1 className="text-3xl font-extrabold text-[#536a86] tracking-tight drop-shadow">Mis Turnos</h1>
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-[#7a8fa6] mb-4 flex items-center gap-2">
                        <span>📅</span> Turnos de Hoy
                    </h2>
                    {turnosHoy.length === 0 && <p className="text-gray-500 text-center">No tenés turnos para hoy.</p>}
                    <div className="grid gap-4">
                        {turnosHoy.map((turno) => {
                            const profesionalId = turno.profesional?._id || turno.profesional;
                            const profesional = profesionales[profesionalId];
                            return (
                                <div key={turno._id} className="border border-[#c3d0e6] p-5 rounded-xl shadow-md bg-white flex flex-col gap-2 md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-5 h-5 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="font-semibold text-[#536a86] text-lg">{turno.servicio?.nombre}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#536a86] text-sm">
                                            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {turno.fecha ? format(new Date(turno.fecha), 'dd/MM/yyyy') : 'Sin fecha'}</span>
                                            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg> {turno.hora}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3 bg-[#e0e7fa] rounded-lg px-4 py-3 shadow-sm mt-3 md:mt-0">
                                        <svg className="w-8 h-8 text-[#536a86]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <div>
                                            <p className="text-[#536a86] font-semibold text-base">
                                                {profesional ? `${profesional.first_name} ${profesional.last_name}` : "Cargando..."}
                                            </p>
                                            {profesional && (
                                                <>
                                                    <p className="text-[#7a8fa6] text-sm">{profesional.email}</p>
                                                    {profesional.phone && <p className="text-[#7a8fa6] text-sm">Tel: {profesional.phone}</p>}
                                                    {profesional.especialidad && <p className="text-[#7a8fa6] text-sm">Especialidad: {profesional.especialidad}</p>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-3 md:mt-0">
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
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-[#7a8fa6] mb-4 flex items-center gap-2">
                        <span>⏳</span> Turnos Futuros
                    </h2>
                    {turnosFuturos.length === 0 && <p className="text-gray-500 text-center">No tenés turnos futuros.</p>}
                    <div className="grid gap-4">
                        {turnosFuturos.map((turno) => {
                            const profesionalId = turno.profesional?._id || turno.profesional;
                            const profesional = profesionales[profesionalId];
                            return (
                                <div key={turno._id} className="border border-[#c3d0e6] p-5 rounded-xl shadow-md bg-white flex flex-col gap-2 md:flex-row md:items-center md:justify-between transition hover:shadow-lg">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="w-5 h-5 text-[#7a8fa6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6m9 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="font-semibold text-[#536a86] text-lg">{turno.servicio?.nombre}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#536a86] text-sm">
                                            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {turno.fecha ? format(new Date(turno.fecha), 'dd/MM/yyyy') : 'Sin fecha'}</span>
                                            <span className="inline-flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg> {turno.hora}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center gap-3 bg-[#e0e7fa] rounded-lg px-4 py-3 shadow-sm mt-3 md:mt-0">
                                        <svg className="w-8 h-8 text-[#536a86]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <div>
                                            <p className="text-[#536a86] font-semibold text-base">
                                                {profesional ? `${profesional.first_name} ${profesional.last_name}` : "Cargando..."}
                                            </p>
                                            {profesional && (
                                                <>
                                                    <p className="text-[#7a8fa6] text-sm">{profesional.email}</p>
                                                    {profesional.phone && <p className="text-[#7a8fa6] text-sm">Tel: {profesional.phone}</p>}
                                                    {profesional.especialidad && <p className="text-[#7a8fa6] text-sm">Especialidad: {profesional.especialidad}</p>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-3 md:mt-0">
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
                            );
                        })}
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
