import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Users, Wrench, Terminal, Video, ArrowUpRight, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: "Membros Ativos", value: "0", trend: "+0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Ferramentas", value: "0", trend: "+0", icon: Wrench, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Prompts Catalogados", value: "0", trend: "+0", icon: Terminal, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Aulas Disponíveis", value: "0", trend: "+0", icon: Video, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ]);

  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Contar membros
      const { count: membersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Contar ferramentas
      const { count: toolsCount } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true });

      // Contar prompts
      const { count: promptsCount } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true });

      // Contar aulas
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      // Carregar últimos usuários
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      setStats([
        { title: "Membros Ativos", value: (membersCount || 0).toString(), trend: `+${membersCount || 0}`, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { title: "Ferramentas", value: (toolsCount || 0).toString(), trend: `+${toolsCount || 0}`, icon: Wrench, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { title: "Prompts Catalogados", value: (promptsCount || 0).toString(), trend: `+${promptsCount || 0}`, icon: Terminal, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { title: "Aulas Disponíveis", value: (lessonsCount || 0).toString(), trend: `+${lessonsCount || 0}`, icon: Video, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
      ]);

      if (users) {
        const formattedUsers = users.map((user: any) => ({
          email: user.email,
          plan: "Plano",
          date: `Há ${calculateTimeAgo(user.created_at)}`,
          status: "Ativo"
        }));
        setRecentUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const calculateTimeAgo = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
        <p className="text-gray-400">Resumo de métricas e acessos rápidos para gestão da plataforma GATHO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl bg-white/5 border ${stat.border} backdrop-blur-md relative overflow-hidden group`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.trend}
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-6">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
               <NavLink to="/admin/ferramentas" className="p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-sf-purple/50 transition-all flex flex-col items-center justify-center text-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-sf-purple/20 flex items-center justify-center text-sf-purple group-hover:scale-110 transition-transform">
                     <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white">Nova Ferramenta</span>
               </NavLink>
               <NavLink to="/admin/prompts" className="p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 hover:border-sf-blue/50 transition-all flex flex-col items-center justify-center text-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-sf-blue/20 flex items-center justify-center text-sf-blue group-hover:scale-110 transition-transform">
                     <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white">Novo Prompt</span>
               </NavLink>
            </div>
         </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
             <h2 className="text-lg font-bold text-white mb-6">Últimos Assinantes</h2>
             <div className="space-y-4">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white/50 border border-white/10">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.plan} • {user.date}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border backdrop-blur-sm ${user.status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {user.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhum assinante encontrado</p>
                )}
             </div>
          </div>
      </div>
    </div>
  );
}
