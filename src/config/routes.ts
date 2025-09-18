// Route configuration for the educational platform
export interface RouteConfig {
  path: string;
  element: string;
  rolesAllowed: string[];
  label: string;
  icon?: string;
}

export const routes: RouteConfig[] = [
  // Dashboard routes
  {
    path: '/student-dashboard',
    element: 'StudentDashboard',
    rolesAllowed: ['student'],
    label: 'Dashboard',
    icon: 'User'
  },
  {
    path: '/faculty-dashboard',
    element: 'FacultyDashboard',
    rolesAllowed: ['faculty'],
    label: 'Dashboard',
    icon: 'Users'
  },
  {
    path: '/admin-dashboard',
    element: 'AdminDashboard',
    rolesAllowed: ['admin'],
    label: 'Dashboard',
    icon: 'Shield'
  },

  // Academic routes
  {
    path: '/timetable',
    element: 'TimetablePage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Timetable',
    icon: 'Calendar'
  },
  {
    path: '/my-classes',
    element: 'MyClassesPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'My Classes',
    icon: 'BookOpen'
  },
  {
    path: '/live-classes',
    element: 'LiveClassesPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Live Classes',
    icon: 'Video'
  },
  {
    path: '/attendance',
    element: 'AttendancePage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Attendance',
    icon: 'UserCheck'
  },
  {
    path: '/attendance-tracking',
    element: 'AttendanceTrackingPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Live Tracking',
    icon: 'Camera'
  },
  {
    path: '/assignments',
    element: 'AssignmentsPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Assignments',
    icon: 'FileText'
  },
  {
    path: '/resources',
    element: 'ResourcesPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Resources',
    icon: 'FolderOpen'
  },

  // Progress and Analytics
  {
    path: '/progress',
    element: 'ProgressPage',
    rolesAllowed: ['student', 'faculty'],
    label: 'Progress',
    icon: 'TrendingUp'
  },
  {
    path: '/analytics',
    element: 'AnalyticsPage',
    rolesAllowed: ['faculty'],
    label: 'Analytics',
    icon: 'BarChart3'
  },
  {
    path: '/reports',
    element: 'ReportsPage',
    rolesAllowed: ['faculty'],
    label: 'Reports',
    icon: 'FileBarChart'
  },

  // Management routes (Admin/Faculty only)
  {
    path: '/manage-users',
    element: 'ManageUsersPage',
    rolesAllowed: ['admin'],
    label: 'Manage Users',
    icon: 'UserCog'
  },
  {
    path: '/permissions',
    element: 'PermissionsPage',
    rolesAllowed: ['admin'],
    label: 'Permissions',
    icon: 'Lock'
  },
  {
    path: '/system-settings',
    element: 'SystemSettingsPage',
    rolesAllowed: ['admin'],
    label: 'System Settings',
    icon: 'Settings'
  }
];

// Navigation groups for sidebar
export const navigationGroups = [
  {
    title: 'Dashboard',
    items: routes.filter(route => route.path.includes('dashboard'))
  },
  {
    title: 'Academic',
    items: routes.filter(route => 
      ['timetable', 'my-classes', 'live-classes', 'attendance', 'assignments', 'resources'].some(
        keyword => route.path.includes(keyword)
      )
    )
  },
  {
    title: 'Progress & Analytics',
    items: routes.filter(route => 
      ['progress', 'analytics', 'reports'].some(keyword => route.path.includes(keyword))
    )
  },
  {
    title: 'Management',
    items: routes.filter(route => 
      ['manage-users', 'permissions', 'system-settings'].some(
        keyword => route.path.includes(keyword)
      )
    )
  }
];

// Helper function to get routes for a specific role
export const getRoutesForRole = (role: string): RouteConfig[] => {
  return routes.filter(route => route.rolesAllowed.includes(role));
};

// Helper function to check if user can access a route
export const canAccessRoute = (path: string, userRole: string): boolean => {
  const route = routes.find(r => r.path === path);
  return route ? route.rolesAllowed.includes(userRole) : false;
};