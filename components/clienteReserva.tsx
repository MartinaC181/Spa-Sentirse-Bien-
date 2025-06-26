"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from './ui/notification';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/useFetchServices';
import { IUser } from '@/models/interfaces';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import jsPDF from 'jspdf';

interface ClienteReservaProps {
  selectedService: string | null;
  onCloseService: () => void;
}

export default function ClienteReserva({ selectedService, onCloseService }: ClienteReservaProps) {
  const [fecha, setFecha] = useState<Date | undefined>(undefined);
  const [hora, setHora] = useState('');
  const [profesional, setProfesional] = useState('');
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const { data } = useFetch(process.env.NEXT_PUBLIC_API_USER!);
  const { data: servicios } = useFetch(process.env.NEXT_PUBLIC_API_SERVICE!);
  const profesionales = (data || []).filter((item: any) => item.role === 'profesional');

  // Obtener el servicio seleccionado
  const servicioSeleccionado = servicios?.find((s: any) => String(s._id) === selectedService);
  const precioLista = servicioSeleccionado ? Number(servicioSeleccionado.precio) : 0;

  // Calcular si aplica descuento
  let descuento = 0;
  let precioFinal = precioLista;
  if (fecha) {
    const ahora = new Date();
    const diff = (fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60); // horas
    if (diff > 48) {
      descuento = 0.15;
      precioFinal = Math.round(precioLista * (1 - descuento));
    }
  }

  // Estado para modal de pago y datos de tarjeta
  const [pagoOpen, setPagoOpen] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [pagoValido, setPagoValido] = useState(false);

  // Validación simple de tarjeta (solo formato, no real)
  useEffect(() => {
    const valid =
      cardName.trim().length > 3 &&
      /^\d{16}$/.test(cardNumber) &&
      /^\d{2}\/\d{2}$/.test(cardExpiry) &&
      /^\d{3}$/.test(cardCvv);
    setPagoValido(valid);
  }, [cardName, cardNumber, cardExpiry, cardCvv]);

  useEffect(() => {
    if (selectedService) {
      setModalOpen(true);
    }
  }, [selectedService]);


  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_USER!);
        if (!res.ok) throw new Error("No se pudo obtener los usuarios");

        const usuarios = await res.json();
        const usuarioEncontrado = usuarios.find((u: any) => u.email === user.email);
        if (usuarioEncontrado) {
          setUsuarioId(usuarioEncontrado._id);
        }
      } catch (error) {
        console.error("Error al buscar el ID del usuario:", error);
      }
    };

    fetchUserId();
  }, [user?.email]);

  console.log("ID del usuario:", usuarioId);

  // Estado para modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [datosComprobante, setDatosComprobante] = useState<any>(null);

  // Cambiar el onChange del input de vencimiento para formatear MM/AA automáticamente
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value.slice(0, 5));
  };

  // Modificar handleSubmit para mostrar modal de confirmación y guardar datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoValido) {
      setNotification({ message: 'Completa los datos de la tarjeta de débito.', type: 'error' });
      return;
    }
    if (!user) {
      setNotification({ message: 'Debes iniciar sesión para hacer una reserva', type: 'error' });
      return;
    }
    if (!fecha || !hora) {
      setNotification({ message: 'Por favor, selecciona fecha y hora', type: 'error' });
      return;
    }
    try {
      const body = JSON.stringify({
        cliente: usuarioId,
        servicio: selectedService,
        profesional,
        fecha: fecha ? fecha.toISOString().split('T')[0] : '',
        hora,
      });
      const response = await fetch(process.env.NEXT_PUBLIC_API_TURNO! + '/create', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!response.ok) throw new Error('Error al crear la reserva');
      // Guardar datos para comprobante
      setDatosComprobante({
        cliente: user,
        servicio: servicioSeleccionado,
        profesional: profesionales.find((p: any) => String(p._id) === profesional),
        fecha,
        hora,
        precioLista,
        descuento,
        precioFinal,
      });
      setPagoOpen(false);
      setConfirmOpen(true);
      setModalOpen(false);
      setFecha(undefined);
      setHora('');
      setProfesional('');
      setNotification(null);
      setCardName('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
    } catch (error) {
      setNotification({ message: 'Error al crear la reserva', type: 'error' });
      setTimeout(() => {
        setPagoOpen(false);
        setModalOpen(false);
        setConfirmOpen(false);
        onCloseService();
        setNotification(null);
      }, 2500);
    }
  };

  // Función para descargar PDF
  const handleDescargarPDF = () => {
    if (!datosComprobante) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Comprobante de Reserva', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Spa Sentirse Bien', 105, 30, { align: 'center' });
    doc.setDrawColor(83, 106, 134);
    doc.line(20, 35, 190, 35);
    let y = 45;
    doc.setFontSize(12);
    doc.text(`Cliente: ${datosComprobante.cliente.first_name} ${datosComprobante.cliente.last_name}`, 20, y);
    y += 8;
    doc.text(`Email: ${datosComprobante.cliente.email}`, 20, y);
    y += 8;
    doc.text(`Servicio: ${datosComprobante.servicio?.nombre || ''}`, 20, y);
    y += 8;
    doc.text(`Profesional: ${datosComprobante.profesional ? datosComprobante.profesional.first_name + ' ' + datosComprobante.profesional.last_name : ''}`, 20, y);
    y += 8;
    doc.text(`Fecha: ${datosComprobante.fecha ? datosComprobante.fecha.toLocaleDateString() : ''}`, 20, y);
    y += 8;
    doc.text(`Hora: ${datosComprobante.hora}`, 20, y);
    y += 8;
    if (datosComprobante.descuento > 0) {
      doc.setTextColor(0, 128, 0);
      doc.text(`Precio con descuento: $${datosComprobante.precioFinal} (15% OFF)`, 20, y);
      doc.setTextColor(0, 0, 0);
      y += 8;
      doc.text(`Precio de lista: $${datosComprobante.precioLista}`, 20, y);
    } else {
      doc.text(`Precio: $${datosComprobante.precioLista}`, 20, y);
    }
    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(122, 143, 166);
    doc.text('Gracias por confiar en Spa Sentirse Bien', 105, y, { align: 'center' });
    doc.save('comprobante_reserva.pdf');
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
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          onCloseService();
        }
      }}>
        <DialogContent className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] border-2 border-[#536a86] rounded-xl shadow-2xl max-w-md mx-auto">
          <DialogHeader className="text-center pb-3">
            <DialogTitle className="text-xl font-bold text-[#536a86]">Reserva de Servicio</DialogTitle>
            <p className="text-[#6c757d] mt-1 text-sm">Completa los datos para tu cita</p>
          </DialogHeader>
          {notification && (
            <div className="absolute left-0 right-0 top-0 z-50 flex justify-center pointer-events-none">
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            </div>
          )}
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); setPagoOpen(true); }}>
            <div className="space-y-2">
              <Label htmlFor="fecha" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Fecha</Label>
              <div className="border-2 border-[#536a86] rounded-lg overflow-hidden">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  className="bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Hora</Label>
              <select
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#536a86] bg-white text-[#536a86] font-medium focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:ring-opacity-50 transition-all duration-200"
                required
              >
                <option value="">Selecciona una hora</option>
                {Array.from({ length: 13 }, (_, i) => {
                  const hour = i + 8;
                  const timeString = hour.toString().padStart(2, '0') + ':00';
                  return (
                    <option key={timeString} value={timeString}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profesional" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Profesional</Label>
              <select
                id="profesional"
                value={profesional}
                onChange={(e) => setProfesional(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#536a86] bg-white text-[#536a86] font-medium focus:outline-none focus:ring-2 focus:ring-[#536a86] focus:ring-opacity-50 transition-all duration-200"
                required
              >
                <option value="">Selecciona un profesional</option>
                {profesionales.map((p: IUser) => (
                  <option key={String(p._id)} value={String(p._id)}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
              </select>
            </div>
            {servicioSeleccionado && (
              <div className="text-center mt-4">
                <span className="block text-lg font-semibold text-[#536a86]">Precio: ${precioLista}</span>
                {descuento > 0 && fecha && (
                  <span className="block text-green-600 font-bold mt-1">Descuento 15% por pago anticipado: <span className="line-through text-[#536a86]">${precioLista}</span> ${precioFinal}</span>
                )}
                {descuento === 0 && fecha && (
                  <span className="block text-[#536a86] mt-1">Precio de lista: ${precioLista}</span>
                )}
                <span className="block text-xs text-[#536a86] mt-1">Solo se acepta tarjeta de débito</span>
              </div>
            )}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#536a86] to-[#435c74] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#435c74] hover:to-[#536a86] transform hover:scale-105 transition-all duration-200 shadow-lg"
                disabled={!fecha || !hora || !profesional}
              >
                Proceder al Pago
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal de pago */}
      <Dialog open={pagoOpen} onOpenChange={setPagoOpen}>
        <DialogContent className="bg-white border-2 border-[#536a86] rounded-xl shadow-2xl max-w-md mx-auto">
          <DialogHeader className="text-center pb-3">
            <DialogTitle className="text-xl font-bold text-[#536a86]">Pago con Tarjeta de Débito</DialogTitle>
            <p className="text-[#6c757d] mt-1 text-sm">Completa los datos de tu tarjeta de débito</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Nombre en la tarjeta</Label>
              <Input id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Número de tarjeta</Label>
              <Input id="cardNumber" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} maxLength={16} required />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="cardExpiry" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">Vencimiento (MM/AA)</Label>
                <Input id="cardExpiry" value={cardExpiry} onChange={handleExpiryChange} maxLength={5} required />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="cardCvv" className="text-[#536a86] font-semibold text-xs uppercase tracking-wide">CVV</Label>
                <Input id="cardCvv" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} maxLength={3} required />
              </div>
            </div>
            <div className="text-center mt-4">
              {descuento > 0 ? (
                <>
                  <span className="block text-lg font-semibold text-[#536a86]">Precio con descuento: <span className="line-through text-[#7a8fa6]">${precioLista}</span> <span className="text-green-600 font-bold">${precioFinal}</span></span>
                  <span className="block text-green-600 text-sm">¡Aprovechaste el 15% de descuento por pago anticipado!</span>
                </>
              ) : (
                <span className="block text-lg font-semibold text-[#536a86]">Precio final: ${precioLista}</span>
              )}
              <span className="block text-xs text-[#536a86] mt-1">Solo se acepta tarjeta de débito</span>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#536a86] to-[#435c74] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#435c74] hover:to-[#536a86] transform hover:scale-105 transition-all duration-200 shadow-lg"
                disabled={!pagoValido}
              >
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal de confirmación de reserva */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white border-2 border-[#536a86] rounded-xl shadow-2xl max-w-md mx-auto text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#536a86]">¡Reserva confirmada!</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <p className="text-[#536a86] text-lg mb-2">Tu reserva ha sido registrada exitosamente.</p>
            <Button
              onClick={handleDescargarPDF}
              className="w-full bg-gradient-to-r from-[#536a86] to-[#435c74] text-white font-semibold py-2 px-4 rounded-lg hover:from-[#435c74] hover:to-[#536a86] transform hover:scale-105 transition-all duration-200 shadow-lg mb-2"
            >
              Descargar comprobante PDF
            </Button>
            <Button
              onClick={() => { setConfirmOpen(false); onCloseService(); }}
              className="w-full bg-white border border-[#536a86] text-[#536a86] hover:bg-[#f6fedb] font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


