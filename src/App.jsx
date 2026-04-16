import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import NotasPage from '@/pages/NotasPage';
import TareasPage from '@/pages/TareasPage';
import ReportesPage from '@/pages/ReportesPage';
import AdminPage from '@/pages/AdminPage';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="redes-ui-theme">
      <TooltipProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/notas" element={<NotasPage />} />
                <Route path="/tareas" element={<TareasPage />} />
                <Route path="/reportes" element={<ReportesPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-right" closeButton />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
