import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  ListTodo, 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  Layers, 
  MoreHorizontal,
  Calendar,
  Flag,
  User as UserIcon
} from 'lucide-react';

// Configuración de las columnas del tablero Kanban
const COLUMNAS = [
  { id: 'Pendiente', label: 'Pendiente', color: 'border-amber-500/30', bg: 'bg-amber-500/5', icon: Clock, accent: 'text-amber-500' },
  { id: 'En Progreso', label: 'En Progreso', color: 'border-blue-500/30', bg: 'bg-blue-500/5', icon: PlayCircle, accent: 'text-blue-500' },
  { id: 'Completado', label: 'Finalizado', color: 'border-emerald-500/30', bg: 'bg-emerald-500/5', icon: CheckCircle2, accent: 'text-emerald-500' }
];

/**
 * Página de Tareas Premium (Kanban Fidelidad SaaS)
 */
export default function TareasPage() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [estaCargando, setEstaCargando] = useState(true);
  const [elementoArrastrado, setElementoArrastrado] = useState(null);

  const cargarTareas = async () => {
    try {
      setEstaCargando(true);
      const res = await api.get('/tareas');
      setTareas(res.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      toast.error('Fallo de Sincronización: No se pudo conectar con el repositorio de actividades.');
    } finally {
      setEstaCargando(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const manejarCreacion = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    
    try {
      await api.post('/tareas', { titulo: nuevaTarea, estado: 'Pendiente' });
      toast.success('Registro Exitoso: Actividad vinculada al flujo de trabajo corporativo.');
      setNuevaTarea('');
      cargarTareas();
    } catch (error) {
      toast.error('Error de Transacción: No se pudo persistir la nueva actividad.');
    }
  };

  const cambiarEstadoTarea = async (id, nuevoEstado) => {
    const tareaOriginal = tareas.find(t => t.id === id);
    if (!tareaOriginal || tareaOriginal.estado === nuevoEstado) return;

    try {
      setTareas(prev => prev.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t));
      await api.put(`/tareas/${id}`, { ...tareaOriginal, estado: nuevoEstado });
      toast.success(`Integridad de Datos: Tarea transicionada a '${nuevoEstado}' exitosamente.`);
    } catch (error) {
      toast.error('Conflicto de Concurrencia: No se pudo actualizar el estado en el nodo central.');
      cargarTareas();
    }
  };

  const manejarEliminacion = async (id) => {
    try {
      await api.delete(`/tareas/${id}`);
      setTareas(prev => prev.filter(t => t.id !== id));
      toast.success('Baja Confirmada: Registro purgado del tablero de actividades.');
    } catch (error) {
      toast.error('Fallo Operacional: Denegada la eliminación de la actividad seleccionada.');
    }
  };

  // --- Helpers de Diseño de Tarjeta ---
  const getPrioridad = (id) => {
    const p = (id % 3);
    if (p === 0) return { label: 'Alta', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: Flag };
    if (p === 1) return { label: 'Media', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Flag };
    return { label: 'Baja', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: Flag };
  };

  // --- Lógica de Arrastrar y Soltar ---
  const alIniciarArrastre = (e, tarea) => {
    setElementoArrastrado(tarea);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.classList.add('opacity-40', 'scale-95'); }, 0);
  };

  const alFinalizarArrastre = (e) => {
    e.target.classList.remove('opacity-40', 'scale-95');
    setElementoArrastrado(null);
  };

  const permitirSoltar = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const alSoltar = (e, estadoDestino) => {
    e.preventDefault();
    if (elementoArrastrado && elementoArrastrado.estado !== estadoDestino) {
      cambiarEstadoTarea(elementoArrastrado.id, estadoDestino);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Cabecera del Tablero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">

          <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Layers className="h-8 w-8 text-primary" />
             Tablero Corporativo
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Gestión de flujo de activos y mantenimiento de red.</p>
        </div>

        <Card className="p-1 px-2 border-border/40 bg-muted/30 rounded-2xl flex items-center gap-2">
           <form onSubmit={manejarCreacion} className="flex gap-2">
              <Input
                value={nuevaTarea}
                onChange={e => setNuevaTarea(e.target.value)}
                placeholder="Añadir nueva actividad..."
                className="h-10 border-none bg-transparent focus-visible:ring-0 w-48 lg:w-64"
              />
              <Button type="submit" size="sm" className="rounded-xl h-10 px-4" disabled={!nuevaTarea.trim()}>
                <Plus className="size-4 mr-1.5" /> Crear
              </Button>
           </form>
        </Card>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[600px]">
        {COLUMNAS.map(columna => (
          <div 
            key={columna.id} 
            className={`flex flex-col rounded-2xl border ${columna.color} ${columna.bg} p-2 transition-all duration-500`}
            onDragOver={permitirSoltar}
            onDrop={(e) => alSoltar(e, columna.id)}
          >
            {/* Cabecera de Columna Premium */}
            <div className="flex items-center justify-between px-3 py-3 mb-1">
              <div className="flex items-center gap-2.5">
                 <div className={`h-7 w-7 rounded-lg bg-white dark:bg-zinc-900 shadow-sm border flex items-center justify-center ${columna.accent}`}>
                    <columna.icon className="h-3.5 w-3.5" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80">{columna.label}</h3>
                 </div>
              </div>
              <Badge variant="secondary" className="bg-white/50 dark:bg-zinc-900 border-none h-5 min-w-[20px] rounded-md text-[10px] font-bold flex justify-center">
                {tareas.filter(t => t.estado === columna.id).length}
              </Badge>
            </div>

            {/* Contenedor de Tarjetas */}
            <div className="flex-1 space-y-2.5 p-1 overflow-y-auto max-h-[70vh] custom-scrollbar">
              {estaCargando ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-28 bg-white/40 dark:bg-zinc-900/40 rounded-xl animate-pulse border border-dashed border-border/20" />
                  ))}
                </div>
              ) : tareas.filter(t => t.estado === columna.id).map(tarea => {
                const prioridad = getPrioridad(tarea.id);
                return (
                  <Card 
                    key={tarea.id} 
                    draggable
                    onDragStart={(e) => alIniciarArrastre(e, tarea)}
                    onDragEnd={alFinalizarArrastre}
                    className="group relative cursor-grab active:cursor-grabbing border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/90 backdrop-blur-sm rounded-xl overflow-hidden"
                  >
                    <CardHeader className="p-4 pb-1">
                       <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={`px-1.5 py-0 h-4 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border-none ${prioridad.color}`}>
                             <prioridad.icon className="size-2.5" />
                             {prioridad.label}
                          </Badge>
                          <DropdownMenu>
                             <DropdownMenuTrigger
                                render={
                                   <Button variant="ghost" size="icon" className="h-5 w-5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="size-3.5" />
                                   </Button>
                                }
                             />
                             <DropdownMenuContent align="end" className="w-36 rounded-xl">
                                <DropdownMenuItem className="text-destructive font-medium cursor-pointer" onClick={() => manejarEliminacion(tarea.id)}>
                                   <Trash2 className="mr-2 h-3.5 w-3.5" /> Eliminar
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>
                       <p className={`text-sm font-semibold leading-tight ${tarea.estado === 'Completado' ? 'line-through text-muted-foreground/50' : 'text-foreground/90'}`}>
                          {tarea.titulo}
                       </p>
                    </CardHeader>
                    
                    <CardContent className="px-4 pb-3">
                       <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-muted text-muted-foreground hover:bg-muted text-[9px] font-medium px-1.5 py-0 h-4 border-none">
                             Proyecto AD
                          </Badge>
                       </div>
                    </CardContent>

                    <CardFooter className="px-4 py-2 border-t border-border/30 bg-muted/10 flex justify-between items-center">
                       <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground/70">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(tarea.createdAt || Date.now()).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                       </div>
                       <Avatar className="h-5 w-5 border border-background shadow-xs">
                          <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-bold">
                             {tarea.id % 2 === 0 ? 'JD' : 'AM'}
                          </AvatarFallback>
                       </Avatar>
                    </CardFooter>
                  </Card>
                );
              })}

              {/* Empty State */}
              {!estaCargando && tareas.filter(t => t.estado === columna.id).length === 0 && (
                <div className="h-32 border-2 border-dashed border-border/20 rounded-xl flex flex-col items-center justify-center text-muted-foreground/30 gap-2 grayscale opacity-40">
                  <div className="p-2 bg-muted/50 rounded-full">
                     <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Depositar Tarea</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
