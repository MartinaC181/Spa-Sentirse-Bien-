import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("📩 Llegó un mensaje al backend del chatbot");

  try {
    const { message } = await req.json();
    console.log("📨 Contenido del mensaje:", message);

    const lowerMessage = message.toLowerCase();

    let reply = "Lo siento, no entendí tu mensaje. ¿Podés repetirlo?";

    // Saludos
    if (lowerMessage.includes("hola")) {
      reply = "¡Hola! Bienvenido al Spa Sentirse Bien 🌸 ¿En qué puedo ayudarte?";
    }

    // Gracias
    else if (lowerMessage.includes("gracias") || lowerMessage.includes("gracias!")) {
      reply = "¡De nada! Si tenés más preguntas, no dudes en preguntar.";
    }

    // Despedida
    else if (lowerMessage.includes("chau") || lowerMessage.includes("adiós")) {
      reply = "¡Hasta luego! Esperamos verte pronto 💆‍♀️";
    }

    // Horarios
    else if (lowerMessage.includes("horario") || lowerMessage.includes("atención")) {
      reply = "Nuestro horario es de lunes a sábado de 9:00 a 20:00 hs.";
    }

    // Turnos
    else if (lowerMessage.includes("turno") || lowerMessage.includes("reserva")) {
      reply = "Podés reservar tu turno desde la sección 'Servicios' en nuestra página.";
    }

    // Servicios disponibles (desde API)
    else if (lowerMessage.includes("servicio") || lowerMessage.includes("masaje")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVICE}`);
      if (!res.ok) throw new Error("No se pudieron cargar los servicios");
      const servicios = await res.json();

      if (Array.isArray(servicios) && servicios.length > 0) {
        const nombres = servicios.map((s: any) => s.nombre).join(", ");
        reply = `Actualmente ofrecemos: ${nombres}. Podés consultarlos desde la sección 'Servicios'.`;
      } else {
        reply = "En este momento no hay servicios disponibles para mostrar.";
      }
    }

    // Profesionales del spa (desde API)
    else if (
      lowerMessage.includes("profesional") ||
      lowerMessage.includes("terapeuta") ||
      lowerMessage.includes("trabajan") ||
      lowerMessage.includes("empleado") ||
      lowerMessage.includes("masajista")
    ) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_USER}`);
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
      const usuarios = await res.json();

      const profesionales = usuarios.filter((u: any) => u.role === "profesional");

      if (profesionales.length > 0) {
        const nombres = profesionales
          .map((p: any) => `${p.first_name} ${p.last_name}`)
          .join(", ");
        reply = `Nuestros profesionales son: ${nombres}. Podés elegirlos al reservar un servicio.`;
      } else {
        reply = "No hay profesionales registrados actualmente.";
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en chatbot:", error);
    return NextResponse.json({ reply: "Hubo un error al procesar tu mensaje." }, { status: 500 });
  }
}
