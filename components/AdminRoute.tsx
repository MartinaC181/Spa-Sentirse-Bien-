import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/'); // Redirige a la página principal si no es admin
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null; // No muestra nada mientras redirige
  }

  return <>{children}</>;
} 