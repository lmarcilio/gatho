import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Terminal, 
  GraduationCap, 
  BookOpen, 
  Bookmark, 
  Settings, 
  Search, 
  Bell,
  Menu,
  X,
  Cat,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useConfig, use18PlusMode } from '../lib/storage';
import { useAuth } from '../lib/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Início', path: '/dashboard' },
  { icon: Wrench, label: 'Ferramentas', path: '/dashboard/ferramentas' },
  { icon: Terminal, label: 'Prompts', path: '/dashboard/prompts' },
  { icon: GraduationCap, label: 'Aulas', path: '/dashboard/aulas' },
  { icon: BookOpen, label: 'Cursos', path: '/dashboard/cursos' },
  { icon: Bookmark, label: 'Bônus', path: '/dashboard/bonus' },
  { icon: Settings, label: 'Perfil', path: '/dashboard/perfil' },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const [config] = useConfig();
  const [is18PlusMode, setIs18PlusMode] = use18PlusMode();
  const { user } = useAuth();
  const [profileName, setProfileName] = useState('Membro');
  const [profileAvatar, setProfileAvatar] = useState('');

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { supabase } = await import('../lib/supabase');
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      setProfileName((data?.full_name || user.user_metadata?.full_name || 'Membro').toString());
      setProfileAvatar((data?.avatar_url || user.user_metadata?.avatar_url || '').toString());
    };
    loadProfile();
  }, [user]);

  const currentLogoUrl = is18PlusMode && config.logo18Url ? config.logo18Url : config.logoUrl;

  return (
    <div className="flex bg-sf-bg min-h-screen text-sf-text overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-sf-bg flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-1">
            {currentLogoUrl ? (
              <img src={currentLogoUrl} alt={config.title} className="object-contain" style={{ height: `${config.logoHeight || 32}px` }} />
            ) : (
              <>
                <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">GATH</span>
                <Cat className="w-7 h-7 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              </>
            )}
          </div>
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive
                    ? "text-white bg-white/5 border border-white/10 backdrop-blur-sm"
                    : "text-gray-400 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={cn(
                      "w-5 h-5 transition-colors", 
                      isActive ? "text-sf-purple" : "text-gray-400 group-hover:text-white"
                    )} 
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-sf-purple/20 to-transparent border border-sf-purple/30">
            <p className="text-xs text-sf-purple font-bold mb-1 uppercase">Plano Vitalicio</p>
            <p className="text-[10px] text-gray-400 leading-tight mb-3">Acesso ilimitado a tudo.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sf-purple/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sf-blue/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

        {/* Topbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-transparent backdrop-blur-md z-20 shrink-0">
          {/* Mobile Menu Button  */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="max-w-md w-full ml-2 md:ml-0 group relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-sf-purple transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar ferramentas, prompts, aulas..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-sf-purple/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

           {/* Right Side */}
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIs18PlusMode(!is18PlusMode)}
               className={cn(
                 "flex items-center justify-center px-3 py-1.5 rounded-lg border font-bold text-sm transition-all",
                 is18PlusMode 
                   ? "bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                   : "bg-white/5 border-white/10 text-white/50 hover:text-white"
               )}
             >
               +18
             </button>
             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-sf-orange rounded-full shadow-[0_0_5px_#FF6700]" />
             </button>
             
             {/* Profile Dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setProfileOpen(!profileOpen)}
                 title="Perfil"
                 className="w-10 h-10 rounded-full border-2 border-sf-purple/50 overflow-hidden cursor-pointer hover:border-sf-purple transition-colors group relative"
               >
                  <img src={profileAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=C026D3'} alt="Profile" className="w-full h-full object-cover group-hover:opacity-70 transition-opacity" />
                </button>
               
               {/* Dropdown Menu */}
               {profileOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="absolute right-0 mt-2 w-48 bg-sf-bg border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                 >
                   <div className="p-4 border-b border-white/5">
                     <p className="text-xs text-sf-text-muted font-semibold uppercase tracking-wider">Meu Perfil</p>
                      <p className="text-sm text-white font-semibold mt-1">{profileName}</p>
                      <p className="text-xs text-sf-text-muted mt-1">{user?.email}</p>
                    </div>
                   
                   <NavLink
                     to="/dashboard/perfil"
                     onClick={() => setProfileOpen(false)}
                     className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/5 transition-colors text-sm font-medium border-b border-white/5"
                   >
                     <Settings className="w-4 h-4" />
                     Configurações
                   </NavLink>
                   
                   <button
                     onClick={() => {
                       import('../lib/supabase').then(({ supabase }) => {
                         supabase.auth.signOut().then(() => {
                           window.location.href = '/login';
                         });
                       });
                     }}
                     className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-sm font-medium"
                   >
                     <LogOut className="w-4 h-4" />
                     Sair da Conta
                   </button>
                 </motion.div>
               )}
             </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto z-10 relative scroll-smooth focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
