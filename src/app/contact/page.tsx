"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(
      name.trim() !== "" && email.trim() !== "" && message.trim() !== ""
    );
  }, [name, email, message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📨 Formulario enviado:", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#f6fedb] text-[#536a86] flex flex-col">
      <Navbar />

      <div className="flex flex-col lg:flex-row items-center justify-center flex-grow p-8 gap-16 max-w-7xl mx-auto">
        {/* FORMULARIO DE CONTACTO */}
        <div className="w-full lg:w-[60%] flex flex-col items-center">
          
          <h1 className="text-4xl font-bold mb-8 text-center text-[#536a86]">
            Contáctanos
          </h1>

          <div className="w-full">
            <Card className="shadow-2xl rounded-2xl text-[#536a86] text-base">
              <CardHeader>
                <CardTitle className="text-xl">
                  Formulario de Contacto
                </CardTitle>
                <CardDescription>
                  Envíanos un mensaje y te responderemos pronto.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className={`w-full transition-colors ${
                      isComplete
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-200 text-blue-400 cursor-not-allowed"
                    }`}
                    disabled={!isComplete}
                  >
                    Enviar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-[60%] order-1 lg:order-2 flex justify-center items-center">
          <img
            src="/logooo.webp"
            alt="Spa"
            className="rounded-full shadow-xl object-cover w-64 h-64 sm:w-72 sm:h-72 lg:w-[400px] lg:h-[400px]"
          />
        </div>

      </div>
    </main>
  );
}
