'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { handleRegister } from './actions';
import Navbar from '../../components/Navbar';

export default function RegisterPage() {
  const [, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await handleRegister(formData);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6fedb] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#536a86] mb-6 text-center">Registrarse</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-[#536a86]">
                Nombre
              </Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Tu nombre"
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-[#536a86]">
                Apellido
              </Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Tu apellido"
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-[#536a86]">
                Correo
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo"
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#536a86]">
                Contraseña
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#536a86] hover:bg-[#6d84a0] text-white">
              Registrarse
            </Button>
            <div className="mt-4 text-center">
              <span className="text-[#536a86]">¿Ya tienes cuenta? </span>
              <a
                href="/login"
                className="text-[#536a86] font-semibold hover:underline cursor-pointer"
              >
                Iniciá Sesión
              </a>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
