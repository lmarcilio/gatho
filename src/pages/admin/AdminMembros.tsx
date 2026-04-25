import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, UserX, Shield, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminMembros() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(member => 
    (member.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
     const fetchMembers = async () => {
        // Here we'd fetch members by hitting a secure RPC or profiles table.
        // For security, standard users can't list all other users over auth.users.
        // This is a placeholder logic that loads initial data, and in production
        // reads from public.profiles.
        const { data, error } = await supabase.from('profiles').select('*');
        if (!error && data) {
           setMembers(data);
        }
        setLoading(false);
     };
     fetchMembers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Membros / Assinantes</h1>
          <p className="text-gray-400">Gerencie o acesso e a lista de usuários da plataforma.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Localizar email..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" />
           </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
         <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
               <tr>
                  <th className="px-6 py-4 border-b border-white/5">E-mail do Usuário</th>
                  <th className="px-6 py-4 border-b border-white/5">Nível</th>
                  <th className="px-6 py-4 border-b border-white/5">Data Registro</th>
                  <th className="px-6 py-4 border-b border-white/5">Status Pagamento</th>
                  <th className="px-6 py-4 border-b border-white/5 text-right">Ações Rápidas</th>
               </tr>
            </thead>
            <tbody>
               {filteredMembers.length === 0 && !loading && members.length > 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum membro encontrado com este filtro.</td></tr>
               )}
               {filteredMembers.length === 0 && !loading && members.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum membro encontrado ou permissão negada.</td></tr>
               )}
               {filteredMembers.map((member, idx) => (
                  <motion.tr 
                    key={member.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                     <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" /> {member.email || member.id}
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${member.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/10 text-white border border-white/20'}`}>
                           {member.role || 'Membro'}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-gray-500">{new Date(member.created_at || Date.now()).toLocaleDateString()}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${member.status !== 'inadimplente' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'}`}>
                           {member.status || 'Ativo'}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400" title="Promover a Admin">
                              <Shield className="w-4 h-4" />
                           </button>
                           <button className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400" title="Revogar Acesso">
                              <UserX className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                  </motion.tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
