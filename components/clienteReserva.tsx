import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import handleBooking from "../components/handleBooking";
import { individualservices } from "../components/individualservices";
import { groupservices } from "./groupservices";

export default function ClienteReserva({
  selectedService,
}: {
  selectedService: string | null;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const timeOptions = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const isComplete =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    selectedDate !== undefined &&
    selectedTime !== undefined &&
    selectedTime !== "";

  const services = [...individualservices, ...groupservices];

  const handleBooking = async (
    selectedDate: Date | undefined,
    selectedTime: string | undefined,
    name: string,
    email: string,
    phone: string,
    details: string,
    selectedService: string | null,
    setConfirmation: (confirmation: any) => void,
    setOpen: (open: boolean) => void
  ) => {
    if (!selectedDate || !selectedTime || !selectedService) return;

    try {
      const response = await fetch('/api/turnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          email: email,
          telefono: phone,
          servicio: selectedService,
          fecha: selectedDate,
          hora: selectedTime,
          detalles: details,
          estado: 'pendiente'
        }),
      });

      if (response.ok) {
        setConfirmation({
          success: true,
          message: 'Turno reservado exitosamente'
        });
        setOpen(true);
      } else {
        setConfirmation({
          success: false,
          message: 'Error al reservar el turno'
        });
        setOpen(true);
      }
    } catch (error) {
      console.error('Error al reservar:', error);
      setConfirmation({
        success: false,
        message: 'Error al reservar el turno'
      });
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center gap-6">
      {selectedService && (
        <>
          <div className="mt-10 w-full flex flex-col items-center bg-[#bac4e0] px-10 py-10 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Reserva tu{" "}
              {services.find((s) => s.name === selectedService)?.name}
            </h2>

            {/* CONTENEDOR DE FORMULARIOS */}
            <div className="flex flex-col lg:flex-row gap-4 justify-center">
              {/* Calendario + Hora */}
              <Card className="w-full lg:w-[400px] space-y-4">
                <CardHeader>
                  <CardTitle>Seleccione Fecha y Hora</CardTitle>
                  <CardDescription>
                    Por favor, seleccione la fecha y hora deseada para su cita.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  {selectedDate && (
                    <p>
                      Fecha seleccionada:{" "}
                      {selectedDate.toLocaleDateString("es-ES")}
                    </p>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="time">Hora</Label>
                    <Select
                      onValueChange={setSelectedTime}
                      defaultValue={selectedTime}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Formulario Contacto */}
              <Card className="w-full lg:w-[400px] space-y-4">
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>
                    Por favor, ingrese su información de contacto para la
                    reserva.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="details">Detalles Adicionales</Label>
                    <Textarea
                      id="details"
                      placeholder="Información adicional (opcional)"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() =>
                      handleBooking(
                        selectedDate,
                        selectedTime,
                        name,
                        email,
                        phone,
                        details,
                        selectedService,
                        setConfirmation,
                        setOpen
                      )
                    }
                    className={`w-full transition-colors duration-300 ${
                      isComplete
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-200 text-blue-400 cursor-not-allowed"
                    }`}
                    disabled={!isComplete}
                  >
                    Reservar Cita
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmación de Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Su cita ha sido reservada exitosamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
