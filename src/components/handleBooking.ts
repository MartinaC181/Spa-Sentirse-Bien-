const handleBooking = (
    selectedDate: Date | undefined,
    selectedTime: string | undefined,
    name: string,
    email: string,
    phone: string,
    details: string,
    selectedService: string | null,
    setConfirmation: React.Dispatch<React.SetStateAction<any>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (selectedDate && selectedTime && name && email && phone) {
        const data = {
            date: selectedDate.toLocaleDateString("es-ES"),
            time: selectedTime,
            name,
            email,
            phone,
            details,
            service: selectedService,
        };

        console.log("📥 Reserva recibida:", data);

        setConfirmation(data);
        setOpen(true);
    }
};

export default handleBooking;