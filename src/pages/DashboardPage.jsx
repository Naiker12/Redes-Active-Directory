import { useAuth } from '@/context/AuthContext';
import { Card, CardDescription, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PermissionGate from '@/components/PermissionGate';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { MagicCard } from '@/components/magicui/MagicCard';
import { 
  StickyNote, 
  ListTodo, 
  BarChart3, 
  ArrowRight, 
  History,
  Activity 
} from 'lucide-react';
import WelcomeBanner from '@/components/WelcomeBanner';

/**
 * Página de Dashboard Premium (Estandarizada Light)
 * Diseño limpio, blanco y corporativo alineado con Shadcn/UI.
 */
export default function DashboardPage() {
  const { user } = useAuth();

  const modulos = [
    {
      titulo: 'Gestión de Notas',
      descripcion: 'Capture y organice apuntes administrativos con alta seguridad.',
      icon: StickyNote,
      path: '/notas',
      permission: 'notas',
      color: 'bg-blue-500/10 text-blue-500',
      gradient: '#3b82f6',
      action: 'Crear ahora'
    },
    {
      titulo: 'Flujo Kanban',
      descripcion: 'Administración ágil de tareas y procesos institucionales.',
      icon: ListTodo,
      path: '/tareas',
      permission: 'tareas',
      color: 'bg-indigo-500/10 text-indigo-500',
      gradient: '#6366f1',
      action: 'Gestionar tablero'
    },
    {
      titulo: 'Analítica Avanzada',
      descripcion: 'Métricas de rendimiento y auditoría de productividad.',
      icon: BarChart3,
      path: '/reportes',
      permission: 'reportes',
      color: 'bg-emerald-500/10 text-emerald-500',
      gradient: '#10b981',
      action: 'Ver informes'
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Sección Hero: Bienvenida Premium (Versión Soft UI Pulida) */}
      <WelcomeBanner />

      {/* Grilla de Herramientas (Ecosistema) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Ecosistema de Gestión</h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recursos Asignados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulos.map((modulo) => (
            <PermissionGate key={modulo.path} permission={modulo.permission}>
              <Link to={modulo.path} className="group">
                <MagicCard 
                  className="p-6 h-full flex flex-col border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-xl rounded-[1.25rem]"
                  gradientColor={modulo.gradient + '10'}
                >
                  <div className={`p-3 rounded-2xl w-fit mb-6 transition-transform duration-500 group-hover:scale-110 ${modulo.color}`}>
                    <modulo.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{modulo.titulo}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                    {modulo.descripcion}
                  </p>
                  <div className="flex items-center text-primary font-bold text-sm">
                    {modulo.action}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </MagicCard>
              </Link>
            </PermissionGate>
          ))}
        </div>
      </div>

      {/* Footer / Resumen Operativo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-[1.25rem] border-border/50 shadow-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
            <div className="space-y-0.5">
              <CardTitle className="text-lg">Eventos Recientes</CardTitle>
              <CardDescription>Registro histórico de sus acciones en el portal.</CardDescription>
            </div>
            <History className="h-5 w-5 text-muted-foreground group-hover:rotate-12 transition-transform" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/20 rounded-2xl bg-muted/5">
              <History className="size-8 text-muted-foreground/20 mb-3" />
              <p className="text-sm font-bold text-muted-foreground/60">No se registran eventos recientes</p>
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-1">Sincronizado con el registro central</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem] border-border/50 shadow-sm group">
          <CardHeader className="pb-3">
             <CardTitle className="text-lg">Ficha Operativa</CardTitle>
             <CardDescription>Estado de sus activos y cuotas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Almacenamiento Notas</span>
                <span>0%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[0%]" />
              </div>
            </div>
            
            <Separator className="opacity-50" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center hover:bg-muted transition-colors">
                <p className="text-2xl font-black text-primary">00</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Tareas Pendientes</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-center hover:bg-muted transition-colors">
                <p className="text-2xl font-black text-emerald-500">00</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Notas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
