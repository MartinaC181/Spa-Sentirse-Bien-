"use client";

import React, { useState } from "react";

interface Message {
    role: "user" | "bot";
    content: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Agregar mensaje del usuario al historial
        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            // Enviar el mensaje al backend (API /app/chatbot)
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Error al obtener la respuesta del chatbot");
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data); // Para depuración

            // Agregar respuesta del bot al historial
            const botMessage: Message = { role: "bot", content: data.reply || "No tengo una respuesta para eso." };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error enviando el mensaje:", error);
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Error al contactar con el servidor del chatbot. Por favor, intente más tarde." },
            ]);
        }

        setInput("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Evita que el formulario envíe una solicitud GET si hay un formulario padre
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Botón flotante para abrir/cerrar el chatbot */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-[#b48eae] text-white rounded-full p-4 shadow-lg hover:bg-[#c7b6c7] focus:outline-none focus:ring-2 focus:ring-[#bac4e0]"
                    aria-label="Abrir chatbot"
                >
                    💬
                </button>
            )}

            {/* Ventana del chatbot */}
            {isOpen && (
                <div className="bg-[#fff8f5] w-96 h-96 rounded-lg shadow-xl flex flex-col border border-[#bac4e0]">
                    {/* Encabezado */}
                    <div className="bg-[#b48eae] text-white p-3 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Asistente Virtual</h2>
                        <button
                            onClick={toggleChat}
                            className="text-white text-lg font-bold hover:bg-[#c7b6c7] rounded-full p-1 focus:outline-none"
                            aria-label="Cerrar chatbot"
                        >
                            ×
                        </button>
                    </div>

                    {/* Historial de mensajes */}
                    <div className="flex-grow p-4 overflow-y-auto bg-[#f6fedb]">
                        {messages.length === 0 && (
                            <p className="text-[#b48eae] text-center italic mb-2">Inicia una conversación...</p>
                        )}

                        {messages.length !== 0 && (
                            <>
                                <div className="flex flex-wrap gap-2 justify-center text-sm">
                                    {[
                                        "¿Qué servicios ofrecen?",
                                        "¿Cuál es el horario de atención?",
                                        "¿Cómo reservo un turno?",
                                        "¿Quiénes son los profesionales?",
                                        "Hola",
                                        "Gracias"
                                    ].map((sugerencia) => (
                                        <button
                                            key={sugerencia}
                                            onClick={() => {
                                                setInput("");
                                                setMessages((prev) => [...prev, { role: "user", content: sugerencia }]);
                                                // Simula envío automático
                                                setTimeout(() => {
                                                    fetch("/api/chatbot", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ message: sugerencia }),
                                                    })
                                                        .then(res => res.json())
                                                        .then(data => {
                                                            setMessages((prev) => [
                                                                ...prev,
                                                                { role: "bot", content: data.reply || "No tengo una respuesta para eso, lo siento." },
                                                            ]);
                                                        })
                                                        .catch(() => {
                                                            setMessages((prev) => [
                                                                ...prev,
                                                                { role: "bot", content: "Error al contactar con el servidor del chatbot." },
                                                            ]);
                                                        });
                                                }, 100);
                                            }}
                                            className="px-3 py-1 bg-[#bac4e0] text-[#536a86] rounded-full hover:bg-[#c9d3e8] transition"
                                        >
                                            {sugerencia}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
                            >
                                <span
                                    className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user"
                                        ? "bg-[#bac4e0] text-[#536a86]"
                                        : "bg-[#fff] text-[#4a5a5a] border border-[#bac4e0]"
                                        }`}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input de texto */}
                    <div className="p-3 border-t bg-[#fff8f5] flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="flex-grow border border-[#bac4e0] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#b48eae] bg-[#f6fedb] text-[#536a86]"
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-[#b48eae] text-white px-4 py-2 rounded-lg hover:bg-[#c7b6c7] focus:outline-none focus:ring-2 focus:ring-[#bac4e0]"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;