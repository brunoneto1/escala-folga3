import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Users, Briefcase } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";

const itens = [
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/funcionarios", label: "Funcionários", icon: Users },
  { to: "/cargos", label: "Cargos", icon: Briefcase },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-4 py-5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary font-extrabold text-sidebar-primary-foreground">F</div>
            <span className="truncate text-base font-bold group-data-[collapsible=icon]:hidden">Escala de Folgas</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {itens.map((i) => (
                  <SidebarMenuItem key={i.to}>
                    <SidebarMenuButton asChild tooltip={i.label}>
                      <Link to={i.to} activeProps={{ "data-active": true }}>
                        <i.icon />
                        <span>{i.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center border-b bg-card px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
