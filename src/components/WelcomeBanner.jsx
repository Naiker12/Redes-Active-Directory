import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, User as UserIcon } from 'lucide-react';

/**
 * Componente WelcomeBanner: Una cabecera premium con diseño "blando" (soft UI).
 * Inspirado en la estética corporativa moderna con bordes redondeados y sombras suaves.
 */
export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden rounded-xl border border-border/40 bg-card p-4 md:p-6 shadow-sm transition-all duration-300">
      {/* Efecto de brillo sutil en el fondo */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Bienvenido, {user?.displayName?.split(' ')[0] || user?.username || 'Admin'}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Su sesión corporativa está protegida. Acceda a sus herramientas de administración AD y gestión de activos.
            </p>
          </div>
        </div>
        
        {/* Tarjeta de Estado: Más densa y delgada */}
        <div className="shrink-0 group">
          <div className="bg-background border border-border/40 rounded-lg p-3.5 shadow-sm transition-all duration-300 min-w-[220px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Rol de Dominio</p>
                <p className="text-xs font-semibold text-foreground">
                  {user?.isAdmin ? 'Administrador AD' : 'Usuario Red I'}
                </p>
              </div>
            </div>
            
            <Separator className="mb-3 opacity-40" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground/80 uppercase tracking-widest">Servidor</span>
                <span className="bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/30 shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  ONLINE
                </span>
              </div>
              
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground/80 uppercase tracking-widest">Última IP</span>
                <span className="font-mono text-foreground bg-muted/30 px-2 py-0.5 rounded-md tracking-tight">192.168.1.104</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
