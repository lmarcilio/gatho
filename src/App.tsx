/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Ferramentas from './pages/Ferramentas';
import Prompts from './pages/Prompts';
import Aulas from './pages/Aulas';
import Cursos from './pages/Cursos';
import Bonus from './pages/Bonus';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Landing from './pages/Landing';
import { useAuth } from './lib/auth';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFerramentas from './pages/admin/AdminFerramentas';
import AdminPrompts from './pages/admin/AdminPrompts';
import AdminAulas from './pages/admin/AdminAulas';
import AdminCursos from './pages/admin/AdminCursos';
import AdminBonus from './pages/admin/AdminBonus';
import AdminMembros from './pages/admin/AdminMembros';
import AdminConfiguracoes from './pages/admin/AdminConfig';

const createBrowserRoutes = (isAuthenticated: boolean, isAdmin: boolean) => createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: isAuthenticated ? <Layout /> : <Navigate to="/login" />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'ferramentas', element: <Ferramentas /> },
      { path: 'prompts', element: <Prompts /> },
      { path: 'aulas', element: <Aulas /> },
      { path: 'cursos', element: <Cursos /> },
      { path: 'bonus', element: <Bonus /> },
      { path: 'perfil', element: <Perfil /> },
    ],
  },
  {
    path: '/admin',
    element: (isAuthenticated && isAdmin) ? <AdminLayout /> : <Navigate to="/login" state={{ from: '/admin' }} replace />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'ferramentas', element: <AdminFerramentas /> },
      { path: 'prompts', element: <AdminPrompts /> },
      { path: 'aulas', element: <AdminAulas /> },
      { path: 'cursos', element: <AdminCursos /> },
      { path: 'bonus', element: <AdminBonus /> },
      { path: 'membros', element: <AdminMembros /> },
      { path: 'configuracoes', element: <AdminConfiguracoes /> },
    ]
  }
]);

export default function App() {
  const { user, loading } = useAuth();

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'lucasmarcilo7@gmail.com').toLowerCase();
  const isAdmin = (user?.email || '').toLowerCase() === adminEmail;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sf-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const router = createBrowserRoutes(!!user, isAdmin);

  return <RouterProvider router={router} />;
}
