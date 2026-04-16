import { 
  LayoutDashboard, 
  StickyNote, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Moon,
  Sun
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "@/components/UserMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

/**
 * Componente AppSidebar (Estandarizado Shadcn/Base UI)
 * Versión optimizada: Sin Modo Oscuro y corregido el anidamiento de elementos.
 */
export default function AppSidebar() {
  const location = useLocation();

  const navItems = [
    { 
      title: "Dashboard", 
      url: "/", 
      icon: LayoutDashboard 
    },
    { 
      title: "Gestión Administrativa", 
      icon: Building2,
      items: [
        { title: "Mis Notas", url: "/notas", icon: StickyNote },
        { title: "Tablero de Tareas", url: "/tareas", icon: CheckSquare },
      ]
    },
    { 
      title: "Analítica", 
      url: "/reportes", 
      icon: BarChart3 
    },
    { 
      title: "Administración", 
      url: "/admin", 
      icon: ShieldCheck,
      adminOnly: true 
    }
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2">
              <SidebarMenuButton 
                size="lg" 
                className="flex-1"
                render={
                  <Link to="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-bold tracking-tight text-foreground">Portal AD</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80">Corporativo</span>
                    </div>
                  </Link>
                }
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger 
                        render={
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        }
                      />
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                isActive={location.pathname === subItem.url}
                                render={
                                  <Link to={subItem.url} className="flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                    <span>{subItem.title}</span>
                                  </Link>
                                }
                              />
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      tooltip={item.title}
                      isActive={location.pathname === item.url}
                      render={
                        <Link to={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      }
                    />
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-2">
        <UserMenu showLabels={true} isSidebarFooter={true} />
      </SidebarFooter>
    </Sidebar>
  );
}
