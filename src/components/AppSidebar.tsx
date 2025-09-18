import {
  Calendar,
  BookOpen,
  Video,
  FileText,
  FolderOpen,
  TrendingUp,
  BarChart3,
  FileBarChart,
  User,
  Users,
  Shield,
  UserCog,
  Lock,
  Settings,
  GraduationCap,
  UserCheck,
  Camera,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { navigationGroups } from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';

const iconMap: Record<string, any> = {
  User,
  Users,
  Shield,
  Calendar,
  BookOpen,
  Video,
  UserCheck,
  Camera,
  FileText,
  FolderOpen,
  TrendingUp,
  BarChart3,
  FileBarChart,
  UserCog,
  Lock,
  Settings,
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const userRole = user?.role || 'student';

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (path: string) => {
    const isCurrentlyActive = isActive(path);
    return isCurrentlyActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-accent hover:text-accent-foreground";
  };

  const canAccessRoute = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo/Brand */}
        <SidebarGroup>
          <div className="flex items-center gap-2 px-4 py-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            {state === "expanded" && (
              <span className="font-bold text-lg">EduPortal</span>
            )}
          </div>
        </SidebarGroup>

        {navigationGroups.map((group) => {
          const visibleItems = group.items.filter(item => 
            canAccessRoute(item.rolesAllowed)
          );

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const IconComponent = iconMap[item.icon || 'FileText'];
                    
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.path} 
                            className={getNavClassName(item.path)}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}