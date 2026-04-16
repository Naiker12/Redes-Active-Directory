import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
   BarChart3,
   CheckCircle2,
   Clock,
   ListTodo,
   FileText,
   Activity,
   TrendingUp,
   ShieldCheck,
   Zap,
   ChevronRight,
   PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ReportesPage() {
   const [estadisticas, setEstadisticas] = useState(null);
   const [estaCargando, setEstaCargando] = useState(true);

   useEffect(() => {
      const cargarEstadisticas = async () => {
         try {
            setEstaCargando(true);
            const res = await api.get('/reportes');
            setEstadisticas(res.data);
         } catch (error) {
            console.error('Error al cargar métricas:', error);
            toast.error('Auditoría Fallida: No se pudo establecer conexión con el motor de analítica.');
         } finally {
            setEstaCargando(false);
         }
      };
      cargarEstadisticas();
   }, []);

   if (estaCargando || !estadisticas) {
      return (
         <div className="flex flex-col gap-6 animate-pulse pb-10">
            <div className="h-16 w-full bg-muted/20 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-muted/20 rounded-xl" />
               ))}
            </div>
            <div className="h-80 w-full bg-muted/20 rounded-2xl" />
         </div>
      );
   }

   const calcularPorcentaje = (valor, total) =>
      total === 0 ? 0 : Math.round((valor / total) * 100);

   const kpis = [
      {
         label: 'Repositorio de Notas',
         icon: FileText,
         color: 'text-blue-500',
         bgColor: 'bg-blue-500/10',
         valor: estadisticas.totalNotas || 0,
         desc: 'Entradas documentadas',
      },
      {
         label: 'Activos en Tablero',
         icon: ListTodo,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         valor: estadisticas.totalTareas || 0,
         desc: 'Tareas totales',
      },
      {
         label: 'Índice de Cierre',
         icon: CheckCircle2,
         color: 'text-emerald-500',
         bgColor: 'bg-emerald-500/10',
         valor: `${calcularPorcentaje(estadisticas.tareasCompletadas, estadisticas.totalTareas)}%`,
         desc: 'Eficiencia operativa',
      },
      {
         label: 'Carga Pendiente',
         icon: Clock,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         valor: (estadisticas.tareasPendientes + estadisticas.tareasEnProgreso) || 0,
         desc: 'Nodos en espera',
      },
   ];

   return (
      <div className="flex flex-col gap-6 pb-10">

         {/* Cabecera */}
         <section className="relative overflow-hidden rounded-xl border bg-card px-4 md:px-5 py-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
               <div>

                  <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                     <BarChart3 className="size-5 text-primary" />
                     Performance Hub
                  </h2>
                  <p className="text-muted-foreground text-xs font-medium mt-0.5">
                     Consola de auditoría de productividad y flujo de activos institucionales.
                  </p>
               </div>

               <div className="flex items-center gap-3 bg-muted/30 px-4 py-3 rounded-xl border border-border/40">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <ShieldCheck className="size-4 text-primary" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-0.5">
                        Capa de Seguridad
                     </p>
                     <p className="text-xs font-bold">Verificación AD Exitosa</p>
                  </div>
               </div>
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-5 pointer-events-none">
               <PieChart className="size-48" />
            </div>
         </section>

         {/* KPIs */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((kpi, i) => (
               <div key={i} className="border border-border/40 rounded-lg shadow-sm bg-card transition-all hover:border-primary/20 hover:shadow-md">
                  <div className="p-3.5">
                     <div className="flex items-center justify-between mb-3">
                        <div className={`p-1.5 rounded-md ${kpi.bgColor} ${kpi.color}`}>
                           <kpi.icon className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 px-1.5 py-0">
                           KPI-{(i + 1).toString().padStart(2, '0')}
                        </Badge>
                     </div>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                        {kpi.label}
                     </p>
                     <h4 className="text-lg font-bold tracking-tight">{kpi.valor}</h4>
                     <div className="flex items-center gap-1 mt-1.5 text-[9px] font-bold text-muted-foreground/50">
                        <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
                        <span>{kpi.desc}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Detalle */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Progreso */}
            <div className="lg:col-span-12 border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden">
               <div className="px-4 py-3 pb-2 border-b border-border/20">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <h3 className="text-sm font-semibold tracking-tight">Estatus de Producción</h3>
                        <p className="text-[10px] text-muted-foreground">Distribución analítica de las actividades Kanban.</p>
                     </div>
                     <div className="h-7 w-7 rounded-md bg-primary/5 flex items-center justify-center border border-border/40">
                        <Activity className="size-3.5 text-primary" />
                     </div>
                  </div>
               </div>
               <div className="px-4 py-4 space-y-4">

                  {/* Completadas */}
                  <div>
                     <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                           <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80">Nivel de Finalización</span>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[9px] px-1.5 py-0">
                           {calcularPorcentaje(estadisticas.tareasCompletadas, estadisticas.totalTareas)}%
                        </Badge>
                     </div>
                     <Progress
                        value={calcularPorcentaje(estadisticas.tareasCompletadas, estadisticas.totalTareas)}
                        className="h-1.5 bg-muted rounded-full"
                     />
                     <p className="text-[9px] text-muted-foreground mt-1.5 font-bold uppercase tracking-tight">
                        {estadisticas.tareasCompletadas} de {estadisticas.totalTareas} consolidadas
                     </p>
                  </div>

                  {/* En Progreso */}
                  <div>
                     <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                           <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                           <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80">Ejecución Activa</span>
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-600 border-none font-bold text-[9px] px-1.5 py-0">
                           {calcularPorcentaje(estadisticas.tareasEnProgreso, estadisticas.totalTareas)}%
                        </Badge>
                     </div>
                     <Progress
                        value={calcularPorcentaje(estadisticas.tareasEnProgreso, estadisticas.totalTareas)}
                        className="h-1.5 bg-muted rounded-full"
                     />
                  </div>

                  {/* Pendientes */}
                  <div>
                     <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                           <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                           <span className="text-[9px] font-bold uppercase tracking-widest text-foreground/80">Cola de Espera</span>
                        </div>
                        <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[9px] px-1.5 py-0">
                           {calcularPorcentaje(estadisticas.tareasPendientes, estadisticas.totalTareas)}%
                        </Badge>
                     </div>
                     <Progress
                        value={calcularPorcentaje(estadisticas.tareasPendientes, estadisticas.totalTareas)}
                        className="h-1.5 bg-muted rounded-full"
                     />
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}