import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/login-form';
import { toast } from 'sonner';

/**
 * Página Principal de Inicio de Sesión
 * Incorpora un fondo de malla (mesh gradient) y sirve de contenedor
 * para el bloque login-04 personalizado.
 */
export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función controladora para procesar el login
  const handleLogin = async (username, password) => {
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      // Notificación de éxito y redirección
      toast.success('Autenticación Institucional Sincronizada: Acceso concedido al portal corporativo.');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const mensaje = err.response?.data?.message || 'Fallo de Autenticación: Credenciales no reconocidas o servidor AD inaccesible.';
      setError(mensaje);
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
      {/* Elementos decorativos del fondo (Mesh Gradient Blobs) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" />
        <div className="absolute top-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-slate-800/40 blur-[100px]" />
      </div>

      {/* Contenedor del Formulario (Z-10 para estar sobre el fondo) */}
      <div className="relative z-10 w-full max-w-5xl animate-in fade-in zoom-in duration-700">
        <LoginForm 
          onSubmit={handleLogin} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
}
