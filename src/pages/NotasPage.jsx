import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
   Plus,
   Trash2,
   Edit2,
   Clock,
   Search,
   Copy,
   MoreVertical,
   Calendar,
   StickyNote,
} from 'lucide-react';

export default function NotasPage() {
   const [notas, setNotas] = useState([]);
   const [terminoBusqueda, setTerminoBusqueda] = useState('');
   const [titulo, setTitulo] = useState('');
   const [contenido, setContenido] = useState('');
   const [idEdicion, setIdEdicion] = useState(null);
   const [estaAbiertoDialogo, setEstaAbiertoDialogo] = useState(false);
   const [estaCargando, setEstaCargando] = useState(true);

   const cargarNotas = async () => {
      try {
         setEstaCargando(true);
         const res = await api.get('/notas');
         setNotas(res.data);
      } catch (error) {
         console.error('Fallo al cargar notas:', error);
         toast.error('Fallo de Sincronización: El repositorio central de notas no responde.');
      } finally {
         setEstaCargando(false);
      }
   };

   useEffect(() => {
      cargarNotas();
   }, []);

   const abrirDialogoNuevo = () => {
      setIdEdicion(null);
      setTitulo('');
      setContenido('');
      setEstaAbiertoDialogo(true);
   };

   const abrirDialogoEdicion = (nota) => {
      setIdEdicion(nota.id);
      setTitulo(nota.titulo);
      setContenido(nota.contenido);
      setEstaAbiertoDialogo(true);
   };

   const manejarGuardado = async (e) => {
      e.preventDefault();
      if (!titulo.trim()) {
         toast.error('Validación Fallida: Se requiere un título para identificar la entrada.');
         return;
      }
      try {
         if (idEdicion) {
            await api.put(`/notas/${idEdicion}`, { titulo, contenido });
            toast.success('Actualización Exitosa: Información consolidada en el servidor.');
         } else {
            await api.post('/notas', { titulo, contenido });
            toast.success('Entrada Registrada: Nota vinculada al perfil corporativo.');
         }
         setEstaAbiertoDialogo(false);
         cargarNotas();
      } catch (error) {
         toast.error('Fallo de Conexión: Error al intentar persistir los datos en el backend.');
      }
   };

   const manejarEliminacion = async (id) => {
      try {
         await api.delete(`/notas/${id}`);
         toast.success('Baja Tramitada: El registro ha sido purgado satisfactoriamente.');
         cargarNotas();
      } catch (error) {
         toast.error('Error Operacional: Denegada la solicitud de eliminación.');
      }
   };

   const copiarAlPortapapeles = (texto) => {
      navigator.clipboard.writeText(texto);
      toast.success('Portapapeles: Contenido copiado para uso externo.');
   };

   const notasFiltradas = notas.filter(
      (n) =>
         n.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
         n.contenido?.toLowerCase().includes(terminoBusqueda.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-5 pb-10">

         {/* Cabecera */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-border/40 pb-5">
            <div className="space-y-0.5">
               <div className="flex items-center gap-2">
                  <div className="p-1 bg-primary/10 rounded-md">
                     <StickyNote className="size-3.5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-primary/20 text-primary bg-primary/5 px-2 py-0">
                     DOCUMENTACIÓN TÉCNICA
                  </Badge>
               </div>
               <h2 className="text-xl font-black tracking-tight text-foreground">Repositorio de Notas</h2>
               <p className="text-muted-foreground text-xs">Gestión centralizada de observaciones y procedimientos administrativos.</p>
            </div>

            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                  <Input
                     placeholder="Filtrar bóveda..."
                     className="pl-8 h-8 w-44 lg:w-56 rounded-lg bg-muted/30 border-border/40 text-xs"
                     value={terminoBusqueda}
                     onChange={(e) => setTerminoBusqueda(e.target.value)}
                  />
               </div>

               <Dialog open={estaAbiertoDialogo} onOpenChange={setEstaAbiertoDialogo}>
                  <DialogTrigger asChild>
                     <Button onClick={abrirDialogoNuevo} size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
                        <Plus className="mr-1 size-3.5" /> Nueva Entrada
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl border-border/40">
                     <form onSubmit={manejarGuardado}>
                        <div className="bg-primary px-6 py-5 text-white">
                           <DialogHeader>
                              <DialogTitle className="text-lg font-black text-white">
                                 {idEdicion ? 'Editar Registro' : 'Nueva Nota Técnica'}
                              </DialogTitle>
                              <DialogDescription className="text-primary-foreground/70 text-xs">
                                 Registre información relevante para el flujo operativo.
                              </DialogDescription>
                           </DialogHeader>
                        </div>
                        <div className="px-6 py-5 space-y-4 bg-card">
                           <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                 Título del Identificador
                              </Label>
                              <Input
                                 value={titulo}
                                 onChange={(e) => setTitulo(e.target.value)}
                                 placeholder="Ej: Backup Configuración VLAN 10"
                                 className="h-9 rounded-lg border-border/40 bg-muted/20 text-sm"
                                 autoFocus
                              />
                           </div>
                           <div className="space-y-1.5">
                              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                 Contenido Documental
                              </Label>
                              <Textarea
                                 value={contenido}
                                 onChange={(e) => setContenido(e.target.value)}
                                 placeholder="Documente los detalles aquí..."
                                 className="min-h-[130px] rounded-lg border-border/40 bg-muted/20 resize-none text-sm"
                              />
                           </div>
                        </div>
                        <div className="px-6 pb-5 flex justify-end gap-2 bg-card">
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEstaAbiertoDialogo(false)}
                              className="rounded-lg h-8 text-xs font-bold"
                           >
                              Cancelar
                           </Button>
                           <Button type="submit" size="sm" className="rounded-lg h-8 text-xs font-bold px-5">
                              {idEdicion ? 'Actualizar' : 'Guardar Registro'}
                           </Button>
                        </div>
                     </form>
                  </DialogContent>
               </Dialog>
            </div>
         </div>

         {/* Grid de Notas */}
         {estaCargando ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
               {[...Array(8)].map((_, i) => (
                  <Card key={i} className="h-40 bg-muted/20 animate-pulse rounded-xl border-dashed" />
               ))}
            </div>
         ) : notasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/20 bg-muted/5 rounded-2xl">
               <div className="p-4 bg-background rounded-xl shadow-sm border mb-3 opacity-30">
                  <StickyNote className="size-6 text-muted-foreground" />
               </div>
               <h3 className="text-base font-black">Bóveda Vacía</h3>
               <p className="text-muted-foreground text-xs max-w-xs mt-1">
                  No se han detectado registros. Inicie el proceso de documentación.
               </p>
               <Button
                  onClick={abrirDialogoNuevo}
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-lg border-primary/20 text-primary font-bold text-xs h-8 px-4"
               >
                  Inicializar Nota
               </Button>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
               {notasFiltradas.map((nota) => (
                  <div
                     key={nota.id}
                     className="group border border-border/40 bg-card rounded-lg p-3 flex flex-col transition-colors hover:border-primary/20 shadow-sm"
                  >
                     {/* Header de la card */}
                     <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1.5">
                           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                           <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50">
                              Ficha ID: {nota.id.toString().padStart(3, '0')}
                           </span>
                        </div>

                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-5 w-5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <MoreVertical className="size-3" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-32 rounded-lg p-1">
                              <DropdownMenuItem
                                 className="rounded-md text-[11px] cursor-pointer py-1"
                                 onClick={() => abrirDialogoEdicion(nota)}
                              >
                                 <Edit2 className="size-3 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 className="rounded-md text-[11px] cursor-pointer py-1"
                                 onClick={() => copiarAlPortapapeles(nota.contenido)}
                              >
                                 <Copy className="size-3 mr-2" /> Copiar
                              </DropdownMenuItem>
                              <div className="h-px bg-muted my-1" />
                              <DropdownMenuItem
                                 className="rounded-md text-[11px] text-rose-500 cursor-pointer py-1 focus:text-rose-500 focus:bg-rose-500/10"
                                 onClick={() => manejarEliminacion(nota.id)}
                              >
                                 <Trash2 className="size-3 mr-2" /> Eliminar
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>

                     {/* Título */}
                     <h3 className="text-sm font-semibold mb-1 tracking-tight line-clamp-1">
                        {nota.titulo}
                     </h3>

                     {/* Contenido */}
                     <div className="flex-1 min-h-[36px]">
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 whitespace-pre-wrap">
                           {nota.contenido || 'Sin descripción disponible.'}
                        </p>
                     </div>

                     {/* Footer */}
                     <div className="pt-2 mt-2 border-t border-border/20 flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        <div className="flex items-center gap-1">
                           <Calendar className="size-2.5" />
                           {new Date(nota.createdAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit',
                           })}
                        </div>
                        <div className="flex items-center gap-1">
                           <Clock className="size-2.5" />
                           {new Date(nota.createdAt).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                           })}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}