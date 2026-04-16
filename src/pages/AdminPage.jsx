import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
   ShieldCheck,
   Settings,
   Users,
   Lock,
   Unlock,
   RefreshCw,
   Search,
   MoreVertical,
   Fingerprint,
   Activity,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WelcomeBanner from '@/components/WelcomeBanner';

const PERMISOS_DISPONIBLES = [
   { id: 'notas', label: 'Notas' },
   { id: 'tareas', label: 'Tareas' },
   { id: 'reportes', label: 'Reportes' },
];

export default function AdminPage() {
   const { user } = useAuth();
   const [usuarios, setUsuarios] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filtro, setFiltro] = useState('');

   if (!user?.isAdmin) {
      return <Navigate to="/" replace />;
   }

   const cargarUsuarios = async () => {
      try {
         setLoading(true);
         const res = await api.get('/admin/usuarios');
         setUsuarios(res.data);
      } catch (error) {
         console.error('Error al recuperar usuarios:', error);
         toast.error('Fallo Sincronización: El motor de identidades AD no responde.');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      cargarUsuarios();
   }, []);

   const gestionarPermiso = async (username, permiso, tienePermiso, esAdmin) => {
      if (esAdmin) {
         toast.info('Restricción de Sistema: Privilegios administrativos inmutables.');
         return;
      }
      try {
         if (tienePermiso) {
            await api.delete(`/admin/permisos/${username}/${permiso}`);
            toast.info(`Acceso Revocado: [${permiso}] desactivado para ${username}`);
         } else {
            await api.post(`/admin/permisos/${username}/${permiso}`, { username, permiso });
            toast.success(`Acceso Concedido: [${permiso}] activado para ${username}`);
         }
         cargarUsuarios();
      } catch (error) {
         toast.error('Fallo de Escritura: Error en la base de datos de seguridad.');
      }
   };

   const usuariosFiltrados = usuarios.filter(
      (u) =>
         u.username.toLowerCase().includes(filtro.toLowerCase()) ||
         u.displayName.toLowerCase().includes(filtro.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-6 pb-10">

         <WelcomeBanner />

         {/* Header */}
         <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border/40">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                     <Settings className="size-4 text-primary" />
                  </div>
                  <Badge
                     variant="outline"
                     className="text-[9px] font-black tracking-widest uppercase border-primary/20 text-primary bg-primary/5 px-2 py-0"
                  >
                     CONSOLA DE AUDITORÍA
                  </Badge>
               </div>
               <h2 className="text-2xl font-black tracking-tight text-foreground">Gestión de Identidades</h2>
               <p className="text-muted-foreground text-xs font-medium">
                  Control granular de accesos para usuarios sincronizados vía Active Directory.
               </p>
            </div>

            <div className="flex items-center gap-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                     placeholder="Buscar usuario..."
                     className="pl-9 h-9 w-56 rounded-xl bg-muted/50 border-border/40 text-xs"
                     value={filtro}
                     onChange={(e) => setFiltro(e.target.value)}
                  />
               </div>
               <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl border-border/40"
                  onClick={cargarUsuarios}
               >
                  <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
               </Button>
            </div>
         </section>

         {/* Grid Principal */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Tabla */}
            <div className="lg:col-span-12">
               <Card className="border-border/40 shadow-sm rounded-2xl overflow-hidden">
                  <Table>
                     <TableHeader>
                        <TableRow className="hover:bg-transparent bg-muted/20 border-b border-border/40">
                           <TableHead className="w-[260px] h-11 px-6 font-black uppercase tracking-widest text-[9px] text-muted-foreground">
                              Entidad de Usuario
                           </TableHead>
                           <TableHead className="h-11 font-black uppercase tracking-widest text-[9px] text-muted-foreground">
                              Estado de Rol
                           </TableHead>
                           {PERMISOS_DISPONIBLES.map((p) => (
                              <TableHead
                                 key={p.id}
                                 className="h-11 text-center font-black uppercase tracking-widest text-[9px] text-muted-foreground"
                              >
                                 {p.label}
                              </TableHead>
                           ))}
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {loading && usuarios.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={6} className="h-52 text-center">
                                 <div className="flex flex-col items-center gap-2">
                                    <RefreshCw className="size-6 text-primary animate-spin opacity-20" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                       Sincronizando con AD...
                                    </p>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : usuariosFiltrados.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={6} className="h-52 text-center">
                                 <div className="flex flex-col items-center gap-2">
                                    <Users className="size-6 text-muted-foreground opacity-20" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                       No se encontraron registros
                                    </p>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           usuariosFiltrados.map((u) => (
                              <TableRow
                                 key={u.username}
                                 className="hover:bg-muted/10 transition-colors border-b border-border/40 last:border-0"
                              >
                                 <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <Avatar className="h-8 w-8 border">
                                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                             {u.username.substring(0, 2).toUpperCase()}
                                          </AvatarFallback>
                                       </Avatar>
                                       <div className="flex flex-col">
                                          <span className="text-sm font-black tracking-tight leading-none mb-0.5">
                                             {u.displayName}
                                          </span>
                                          <span className="text-[10px] font-mono text-muted-foreground">
                                             {u.username}@dominio.local
                                          </span>
                                       </div>
                                    </div>
                                 </TableCell>

                                 <TableCell>
                                    {u.isAdmin ? (
                                       <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 font-black text-[9px] uppercase tracking-widest">
                                          <ShieldCheck className="size-2.5 mr-1" /> Admin AD
                                       </Badge>
                                    ) : (
                                       <Badge
                                          variant="outline"
                                          className="text-muted-foreground/60 border-border/40 px-2 py-0.5 font-black text-[9px] uppercase tracking-widest"
                                       >
                                          Estándar
                                       </Badge>
                                    )}
                                 </TableCell>

                                 {PERMISOS_DISPONIBLES.map((p) => {
                                    const tieneAcceso = u.isAdmin || u.permissions?.includes(p.id);
                                    return (
                                       <TableCell key={p.id} className="text-center">
                                          <button
                                             onClick={() => gestionarPermiso(u.username, p.id, tieneAcceso, u.isAdmin)}
                                             disabled={u.isAdmin}
                                             title={
                                                u.isAdmin
                                                   ? 'Acceso Total Inherente'
                                                   : tieneAcceso
                                                      ? 'Revocar Acceso'
                                                      : 'Habilitar Módulo'
                                             }
                                             className={`
                                h-8 w-8 rounded-xl flex items-center justify-center mx-auto transition-all duration-200
                                ${u.isAdmin
                                                   ? 'bg-primary/5 text-primary/30 border border-primary/10 cursor-not-allowed'
                                                   : tieneAcceso
                                                      ? 'bg-primary text-white shadow-sm hover:bg-primary/90'
                                                      : 'bg-muted/50 text-muted-foreground/40 border border-border/40 hover:bg-muted'
                                                }
                              `}
                                          >
                                             {tieneAcceso ? (
                                                <Unlock className="size-3.5" />
                                             ) : (
                                                <Lock className="size-3.5" />
                                             )}
                                          </button>
                                       </TableCell>
                                    );
                                 })}
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </Card>
            </div>

         </div>
      </div>
   );
}