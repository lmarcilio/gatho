import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Terminal, 
  Video, 
  BookOpen, 
  Users, 
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Cat
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useConfig } from '../lib/storage';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/admin' },
  { icon: Wrench, label: 'Gerenciar Ferramentas', path: '/admin/ferramentas' },
  { icon: Terminal, label: 'Gerenciar Prompts', path: '/admin/prompts' },
  { icon: Video, label: 'Gerenciar Aulas', path: '/admin/aulas' },
  { icon: BookOpen, label: 'Gerenciar Cursos', path: '/admin/cursos' },
  { icon: Settings, label: 'Gerenciar Bônus', path: '/admin/bonus' },
  { icon: Users, label: 'Membros / Assinantes', path: '/admin/membros' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [config] = useConfig();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex bg-[#0A0A0A] min-h-screen text-white font-sans overflow-hidden">
      {/* Sidebar - Admin Edition */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-red-500/20 bg-[#0A0A0A] flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt={config.title} className="object-contain" style={{ height: `${config.logoHeight || 32}px` }} />
              ) : (
                <>
                  <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">GATH</span>
                  <Cat className="w-7 h-7 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                </>
              )}
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">ADMIN</span>
            </div>
          </div>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Gestão de Plataforma</p>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive
                    ? "text-red-500 bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors", 
                      isActive ? "text-red-500" : "text-gray-400 group-hover:text-white"
                    )} 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
          <NavLink to="/dashboard" className="flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">
             Voltar ao App
          </NavLink>
          <button 
             onClick={handleLogout} 
             className="flex items-center justify-center gap-2 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-colors text-sm font-bold"
          >
             <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Darker/Reddish Abstract background elements for admin vibe */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 blur-[150px] pointer-events-none -z-10 rounded-full" />
        
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-transparent backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
               <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white hidden md:block">Centro de Comando</h1>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-bold text-red-500 tracking-wider">MODO ADMINISTRADOR</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 scroll-smooth">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
