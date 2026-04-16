import { Outlet, useLocation, Link } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import { 
  SidebarInset, 
  SidebarTrigger, 
  useSidebar 
} from '@/components/ui/sidebar';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Search, Bell, Command as CommandIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Layout Principal Premium (AppLayout)
 * Utiliza el nuevo sistema de Sidebar de Shadcn para una experiencia de alta fidelidad.
 */
export default function AppLayout() {
  const location = useLocation();
  const { isMobile } = useSidebar();

  // Mapeo de títulos y breadcrumbs
  const pathMap = {
    '/': 'Dashboard',
    '/notas': 'Mis Notas',
    '/tareas': 'Tablero Kanban',
    '/reportes': 'Analítica',
    '/admin': 'Seguridad y Permisos'
  };

  const currentTitle = pathMap[location.pathname] || 'Portal';

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        {/* Header Superior con Breadcrumbs y Herramientas */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/60 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink render={<Link to="/" />}>
                    Corporativo
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {currentTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Acciones del Header */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Barra de Búsqueda Ficticia (Estilo Command Palette) */}
            <div className="hidden items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer lg:flex w-64 mr-2">
              <Search className="size-4" />
              <span>Buscar recursos...</span>
              <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>


          </div>
        </header>

        {/* Área de Contenido con Fondo Estético */}
        <main className="flex-1 overflow-y-auto bg-slate-50/20 dark:bg-zinc-950/20">
          <div className="flex flex-col gap-4 p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
