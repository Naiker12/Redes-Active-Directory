import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, ChevronsUpDown, User, Shield } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * Componente UserMenu
 * Gestiona el perfil del usuario y el logout, adaptable al Sidebar o Header.
 */
export default function UserMenu({ showLabels = true, isSidebarFooter = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const obtenerIniciales = (nombre) => {
    if (!nombre) return '?';
    return nombre.split(' ').map(palabra => palabra[0]).join('').slice(0, 2).toUpperCase();
  };

  const manejarLogout = async () => {
    await logout();
    navigate('/login');
  };

  const content = (
    <div className={`flex flex-1 items-center justify-between w-full ${!showLabels ? 'justify-center' : ''}`}>
      <div className="flex items-center gap-2 min-w-0">
         <Avatar className="h-7 w-7 rounded-md shrink-0">
           <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold rounded-md">
             {obtenerIniciales(user?.displayName || user?.username)}
           </AvatarFallback>
         </Avatar>
         {showLabels && (
           <div className="flex flex-col text-left overflow-hidden min-w-0">
             <p className="truncate font-semibold text-foreground text-xs">
               {user?.displayName || user?.username}
             </p>
             <p className="truncate text-[10px] text-muted-foreground">
               {user?.isAdmin ? 'Administrador' : 'Usuario Estándar'}
             </p>
           </div>
         )}
      </div>
      {isSidebarFooter && showLabels && (
         <ChevronsUpDown className="size-3.5 text-muted-foreground/50 shrink-0 ml-2" />
      )}
    </div>
  );

  return (
    <div className={cn("flex items-center", isSidebarFooter ? "w-full" : "")}>
      <DropdownMenu>
        {isSidebarFooter ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="default"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-md transition-all duration-300 w-full"
                  >
                    {content}
                  </SidebarMenuButton>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <DropdownMenuTrigger
             render={
               <button className="flex items-center justify-center p-1.5 rounded-md hover:bg-muted/50 transition-colors w-full">
                 {content}
               </button>
             }
          />
        )}
        <DropdownMenuContent
          side={isSidebarFooter ? "top" : "bottom"}
          align={isSidebarFooter ? "start" : "end"}
          className="w-56"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user?.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.username}@dominio.local
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
               <User className="mr-2 h-4 w-4" />
               <span>Perfil de Usuario</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
               <Shield className="mr-2 h-4 w-4" />
               <span>Seguridad AD</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium" 
            onClick={manejarLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Finalizar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
