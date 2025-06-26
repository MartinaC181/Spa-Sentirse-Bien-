'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Notification } from '@/components/ui/notification';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { motion } from 'framer-motion';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setNotification({
        message: "Por favor, complete todos los campos.",
        type: "error"
      });
      return;
    }

    try {
      await login(email, password);
      setNotification({
        message: "Inicio de sesión exitoso",
        type: "success"
      });

      // Esperar un momento para mostrar el mensaje de éxito antes de redirigir
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setNotification({
        message: "Credenciales inválidas. Por favor, intente nuevamente.",
        type: "error"
      });
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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <Card className="w-full bg-[#bac4e0] border-2 border-[#536a86]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-[#536a86]">
                Iniciar Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#536a86]">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="bg-white border-[#536a86]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#536a86]">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-white border-[#536a86]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#536a86] text-white hover:bg-[#435570] transition-colors"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  type="button"
                  onClick={() => { router.push("https://spa-back-dvdm.onrender.com/auth/login/google"); }}
                  className="w-full bg-white border border-[#536a86] text-[#536a86] hover:bg-[#f0f0f0] flex items-center justify-center gap-2"
                >
                  <Image src="/google-icon.png" alt="Google" width={40} height={40} className="w-10 h-10" />
                  Iniciar Sesión con Google
                </Button>

                <div className="text-center text-[#536a86]">
                  ¿No tienes cuenta?{' '}
                  <Link href="/register" className="text-[#536a86] hover:text-[#435570] font-semibold">
                    Regístrate
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
