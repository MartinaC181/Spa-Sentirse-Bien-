'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Notification } from '@/components/ui/notification';
import Link from 'next/link';
import { handleRegister } from './actions';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await handleRegister(formData);
      setNotification({
        message: "Registro exitoso. Redirigiendo al inicio de sesión...",
        type: "success"
      });

      // Esperar un momento para mostrar el mensaje de éxito antes de redirigir
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setNotification({
        message: error.message || "Error al registrar usuario",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6fedb] flex items-center justify-center p-4">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <Card className="w-full max-w-md bg-[#bac4e0] border-2 border-[#536a86]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#536a86]">
              Registrarse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[#536a86]">Nombre</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  className="bg-white border-[#536a86]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[#536a86]">Apellido</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  className="bg-white border-[#536a86]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#536a86]">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="bg-white border-[#536a86]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#536a86]">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white border-[#536a86]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-[#536a86] text-white hover:bg-[#435570] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>

                <Button
                  type="button"
                  onClick={() => { /* Handle Google login */ }}
                  className="w-full bg-white border border-[#536a86] text-[#536a86] hover:bg-[#f0f0f0] flex items-center justify-center gap-2"
                >
                  <img src="/google-icon.png" alt="Google" className="w-10 h-10" />
                  Registrarse con Google
                </Button>
              </div>

              <div className="text-center text-[#536a86]">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-[#536a86] hover:text-[#435570] font-semibold">
                  Iniciar Sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
