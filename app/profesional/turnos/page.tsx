'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/components/ui/notification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';

export default function VistaTurnosProfesional() {
    const { user } = useAuth();
    const [turnos, setTurnos] = useState<any[]>([]);
    const [historiales, setHistoriales] = useState<{ [key: string]: string }>({});
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const hoy = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        if (!user?._id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_TURNO}`)
            .then(res => res.json())
            .then(data => {
                const hoy = format(new Date(), 'yyyy-MM-dd');
                const turnosFiltrados = data.filter((t: any) => {
                    const fechaTurno = new Date(t.fecha).toISOString().split('T')[0];
                    return (
                        String(t.profesional?._id) === String(user._id) &&
                        t.estado === "confirmado" &&
                        fechaTurno === hoy
                    );
                });

                setTurnos(turnosFiltrados);
            })
            .catch(() =>
                setNotification({ message: 'Error al cargar turnos', type: 'error' })
            );
    }, [user?._id]);

    const handleGuardarHistorial = async (turnoId: string, clienteId: string, servicioId: string) => {
        try {
            const detalle = historiales[turnoId];
            const body = JSON.stringify({ clienteId, profesionalId: user?._id, servicioId, detalle });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_HISTORIAL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
            });

            if (!res.ok) throw new Error();
            setNotification({ message: 'Historial guardado', type: 'success' });
        } catch {
            setNotification({ message: 'Error al guardar historial', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-[#f6fedb]">
            <Navbar />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Turnos del Día</h1>

                {turnos.length === 0 && <p>No hay turnos para hoy.</p>}

                {turnos.map((turno) => (
                    <div key={turno._id} className="border p-4 mb-4 rounded shadow bg-white">
                        <p><strong>Cliente:</strong> {turno.cliente?.email}</p>
                        <p><strong>Servicio:</strong> {turno.servicio?.nombre}</p>
                        <p><strong>Hora:</strong> {turno.hora}</p>

                        <Textarea
                            placeholder="¿Qué se le hizo al cliente?"
                            value={historiales[turno._id] || ''}
                            onChange={(e) => setHistoriales({ ...historiales, [turno._id]: e.target.value })}
                            className="mt-2 mb-2"
                        />

                        <Button
                            onClick={() =>
                                handleGuardarHistorial(turno._id, turno.cliente._id, turno.servicio._id)
                            }
                            className="bg-[#536a86] text-white"
                        >
                            Guardar en historial
                        </Button>
                    </div>
                ))}

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
