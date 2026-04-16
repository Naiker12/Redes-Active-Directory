import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Componente de Ruta Protegida
 * Asegura que solo los usuarios autenticados puedan acceder a las rutas internas.
 * Si no hay sesión, redirige automáticamente al portal de acceso (Login).
 */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Mientras se verifica el estado de la sesión (ej. chequeo de cookies)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 h-10 w-10 animate-ping opacity-20 bg-primary rounded-full"></div>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
            Sincronizando Acceso...
          </p>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado muestra el contenido de la ruta, si no, redirige al login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
