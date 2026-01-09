import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@objectql/ui"
import { Database, Settings, FileText } from "lucide-react"
import { useRouter } from "../hooks/useRouter"

export function AppSidebar({ objects, ...props }: React.ComponentProps<typeof Sidebar> & { objects: Record<string, any> }) {
  const { path, navigate } = useRouter()
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => navigate('/')}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Database className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ObjectQL</span>
                <span className="truncate text-xs">Data Browser</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
             <SidebarMenu>
               {Object.entries(objects).map(([name, schema]) => (
                 <SidebarMenuItem key={name}>
                   <SidebarMenuButton 
                     isActive={path.startsWith(`/object/${name}`)}
                     onClick={() => navigate(`/object/${name}`)}
                    >
                     <FileText />
                     <span>{schema.label || schema.title || name}</span>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={path === '/settings'}
                  onClick={() => navigate('/settings')}
                >
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
