'use client';

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { handleLogin } from "./actions";
import Navbar from '../../components/Navbar';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Depurar los valores de FormData
    console.log("FormData entries:", Array.from(formData.entries()));

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!email || !password) {
      setErrorMessage("Ambos campos son obligatorioooos.");
      return;
    }

    try {
      await handleLogin(formData);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error al iniciar sesión.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6fedb] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[#536a86] mb-6 text-center">Iniciar Sesión</h1>
          <form onSubmit={onSubmit} method="post" className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#536a86]">
                Correo
              </Label>
              <Input
                type="email"
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
                name="password"
                placeholder="Contraseña"
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1"
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full bg-[#536a86] hover:bg-[#6d84a0] text-white">
              Iniciar Sesión
            </Button>
            <div className="mt-4 text-center">
              <span className="text-[#536a86]">¿No tienes cuenta? </span>
              <a
                href="/register"
                className="text-[#536a86] font-semibold hover:underline cursor-pointer"
              >
                Regístrate
              </a>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}