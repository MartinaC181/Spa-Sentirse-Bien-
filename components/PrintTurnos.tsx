'use client';

import { useRef } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ITurno } from '@/models/interfaces';


interface PrintTurnosProps {
    turnos: ITurno[];
    title: string;
    userType: 'cliente' | 'profesional';
    profesionales?: { [key: string]: any };
}

export default function PrintTurnos({ turnos, title, userType, profesionales = {} }: PrintTurnosProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (printRef.current) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${title}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                                color: #333;
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
                                font-size: 24px;
                            }
                            .header p {
                                color: #7a8fa6;
                                margin: 5px 0;
                            }
                            .section {
                                margin-bottom: 30px;
                            }
                            .section h2 {
                                color: #536a86;
                                border-bottom: 1px solid #c3d0e6;
                                padding-bottom: 10px;
                                margin-bottom: 20px;
                            }
                            .turno {
                                border: 1px solid #c3d0e6;
                                padding: 15px;
                                margin-bottom: 15px;
                                border-radius: 8px;
                                background-color: #f9f9f9;
                            }
                            .turno-header {
                                font-weight: bold;
                                color: #536a86;
                                margin-bottom: 10px;
                                font-size: 16px;
                            }
                            .turno-details {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 10px;
                                font-size: 14px;
                            }
                            .turno-details p {
                                margin: 5px 0;
                            }
                            .label {
                                font-weight: bold;
                                color: #536a86;
                            }
                            .value {
                                color: #333;
                            }
                            .no-turnos {
                                text-align: center;
                                color: #7a8fa6;
                                font-style: italic;
                                padding: 20px;
                            }
                            .footer {
                                margin-top: 30px;
                                text-align: center;
                                color: #7a8fa6;
                                font-size: 12px;
                                border-top: 1px solid #c3d0e6;
                                padding-top: 20px;
                            }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${printRef.current.innerHTML}
                        <div class="footer">
                            <p>Documento generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
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
        }
    };

    // Separar turnos en hoy y futuros
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
        <div>
            <div className="no-print mb-6">
                <Button
                    onClick={handlePrint}
                    className="bg-[#536a86] text-white hover:bg-[#435c74] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir Turnos
                </Button>
            </div>

            <div ref={printRef} className="print-content">
                <div className="header">
                    <h1>{title}</h1>
                    <p>Fecha de impresión: {format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                    <p>Total de turnos: {turnos.length}</p>
                </div>

                <div className="section">
                    <h2>📅 Turnos de Hoy ({turnosHoy.length})</h2>
                    {turnosHoy.length === 0 ? (
                        <div className="no-turnos">No hay turnos para hoy</div>
                    ) : (
                        turnosHoy.map((turno) => {
                            const profesionalId = turno.profesional?._id || turno.profesional;
                            const profesional = profesionales[profesionalId as unknown as string];
                            
                            return (
                                <div key={turno._id?.toString()} className="turno">
                                    <div className="turno-header">{turno.servicio?.nombre}</div>
                                    <div className="turno-details">
                                        <p><span className="label">Fecha:</span> <span className="value">{format(new Date(turno.fecha), 'dd/MM/yyyy')}</span></p>
                                        <p><span className="label">Hora:</span> <span className="value">{turno.hora}</span></p>
                                        {userType === 'cliente' ? (
                                            <>
                                                <p><span className="label">Profesional:</span> <span className="value">
                                                    {profesional ? `${profesional.first_name} ${profesional.last_name}` : 'No asignado'}
                                                </span></p>
                                                {profesional?.especialidad && (
                                                    <p><span className="label">Especialidad:</span> <span className="value">{profesional.especialidad}</span></p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p><span className="label">Cliente:</span> <span className="value">{turno.cliente?.email}</span></p>
                                                {turno.cliente?.first_name && (
                                                    <p><span className="label">Nombre:</span> <span className="value">{turno.cliente.first_name} {turno.cliente.last_name}</span></p>
                                                )}
                                            </>
                                        )}
                                        {turno.estado && (
                                            <p><span className="label">Estado:</span> <span className="value">{turno.estado}</span></p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="section">
                    <h2>⏳ Turnos Futuros ({turnosFuturos.length})</h2>
                    {turnosFuturos.length === 0 ? (
                        <div className="no-turnos">No hay turnos futuros</div>
                    ) : (
                        turnosFuturos.map((turno) => {
                            const profesionalId = turno.profesional?._id || turno.profesional;
                            const profesional = profesionales[profesionalId as unknown as string];
                            
                            return (
                                <div key={turno._id?.toString()} className="turno">
                                    <div className="turno-header">{turno.servicio?.nombre}</div>
                                    <div className="turno-details">
                                        <p><span className="label">Fecha:</span> <span className="value">{format(new Date(turno.fecha), 'dd/MM/yyyy')}</span></p>
                                        <p><span className="label">Hora:</span> <span className="value">{turno.hora}</span></p>
                                        {userType === 'cliente' ? (
                                            <>
                                                <p><span className="label">Profesional:</span> <span className="value">
                                                    {profesional ? `${profesional.first_name} ${profesional.last_name}` : 'No asignado'}
                                                </span></p>
                                                {profesional?.especialidad && (
                                                    <p><span className="label">Especialidad:</span> <span className="value">{profesional.especialidad}</span></p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p><span className="label">Cliente:</span> <span className="value">{turno.cliente?.email}</span></p>
                                                {turno.cliente?.first_name && (
                                                    <p><span className="label">Nombre:</span> <span className="value">{turno.cliente.first_name} {turno.cliente.last_name}</span></p>
                                                )}
                                            </>
                                        )}
                                        {turno.estado && (
                                            <p><span className="label">Estado:</span> <span className="value">{turno.estado}</span></p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
} 