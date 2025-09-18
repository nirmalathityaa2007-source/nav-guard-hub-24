import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import RequireAuth from "@/components/RequireAuth";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

// Page imports
import LoginSelector from "@/pages/LoginSelector";
import StudentLogin from "@/pages/StudentLogin";
import TeacherLogin from "@/pages/TeacherLogin";
import AdminLogin from "@/pages/AdminLogin";
import StudentDashboard from "@/pages/StudentDashboard";
import FacultyDashboard from "@/pages/FacultyDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TimetablePage from "@/pages/TimetablePage";
import MyClassesPage from "@/pages/MyClassesPage";
import LiveClassesPage from "@/pages/LiveClassesPage";
import AttendancePage from "@/pages/AttendancePage";
import AttendanceTrackingPage from "@/pages/AttendanceTrackingPage";
import AssignmentsPage from "@/pages/AssignmentsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ProgressPage from "@/pages/ProgressPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ReportsPage from "@/pages/ReportsPage";
import ManageUsersPage from "@/pages/ManageUsersPage";
import PermissionsPage from "@/pages/PermissionsPage";
import SystemSettingsPage from "@/pages/SystemSettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes - Role-specific login pages */}
              <Route path="/" element={<LoginSelector />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/teacher-login" element={<TeacherLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* Legacy login route - redirect to login selector */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected routes with layout */}
              <Route element={<Layout />}>
                {/* Dashboard routes */}
                <Route element={<RequireAuth allowedRoles={['student']} />}>
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={['faculty']} />}>
                  <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={['admin']} />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Academic routes */}
                <Route element={<RequireAuth allowedRoles={['student', 'faculty']} />}>
                  <Route path="/timetable" element={<TimetablePage />} />
                  <Route path="/live-classes" element={<LiveClassesPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/my-classes" element={<MyClassesPage />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={['student', 'faculty']} />}>
                  <Route path="/attendance-tracking" element={<AttendanceTrackingPage />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={['faculty']} />}>
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>

                {/* Management routes */}
                <Route element={<RequireAuth allowedRoles={['admin']} />}>
                  <Route path="/manage-users" element={<ManageUsersPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                  <Route path="/system-settings" element={<SystemSettingsPage />} />
                </Route>
              </Route>

              {/* 404 catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;