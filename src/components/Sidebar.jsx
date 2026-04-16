import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PermissionGate from '@/components/PermissionGate';
import { Separator } from '@/components/ui/separator';
import UserMenu from '@/components/UserMenu';
import {
  LayoutDashboard,
  StickyNote,
  ListTodo,
  BarChart3,
  Settings,
  Shield,
  ChevronRight,
} from 'lucide-react';

// Elementos de navegación principales
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, permission: null },
  { path: '/notas', label: 'Notas', icon: StickyNote, permission: 'notas' },
  { path: '/tareas', label: 'Tareas', icon: ListTodo, permission: 'tareas' },
  { path: '/reportes', label: 'Reportes', icon: BarChart3, permission: 'reportes' },
];

/**
 * Componente Sidebar
 * Proporciona la navegación lateral principal y el acceso al menú de usuario.
 * 
 * @param {Object} props - Propiedades: onNavItemClick (función para cerrar sidebar en móvil).
 */
export default function Sidebar({ onNavItemClick }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Sección del Logo Institucional */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-sidebar-foreground">Portal Corp</span>
          <span className="text-[10px] uppercase font-medium text-muted-foreground tracking-widest">Active Directory</span>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Módulos
        </p>
        
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const navLinkJSX = (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavItemClick}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? '' : 'text-muted-foreground group-hover:text-sidebar-foreground'}`} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70 animate-in slide-in-from-left-1" />}
            </Link>
          );

          // Si el ítem requiere permiso, se envuelve en PermissionGate
          if (item.permission) {
            return (
              <PermissionGate key={item.path} permission={item.permission}>
                {navLinkJSX}
              </PermissionGate>
            );
          }
          return navLinkJSX;
        })}

        {/* Sección administrativa exclusiva para Admins */}
        {user?.isAdmin && (
          <div className="pt-4 mt-4 border-t border-sidebar-border/50">
            <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Gestión AD
            </p>
            <Link
              to="/admin"
              onClick={onNavItemClick}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                location.pathname === '/admin'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Settings className={`h-4 w-4 shrink-0 ${location.pathname === '/admin' ? '' : 'text-muted-foreground group-hover:text-sidebar-foreground'}`} />
              <span className="flex-1">Permisos</span>
              {location.pathname === '/admin' && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          </div>
        )}
      </nav>

      {/* Menú de Usuario en la base de la barra lateral */}
      <div className="border-t border-sidebar-border/50 p-4">
        <UserMenu />
      </div>
    </div>
  );
}
