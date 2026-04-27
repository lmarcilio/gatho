import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Aula {
  id: string;
  title: string;
  module: string;
  description: string;
  video_url: string;
  image_url: string;
  pdf_url: string;
  is_18_plus: boolean;
}

export default function AdminAulas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    module: '',
    description: '',
    video_url: '',
    image_url: '',
    pdf_url: '',
    is_18_plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar aulas do Supabase
  const fetchAulas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAulas(data || []);
    } catch (err) {
      console.error('Erro ao buscar aulas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  const filteredAulas = aulas.filter(aula => 
    aula.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (aula.module && aula.module.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const availableModules = useMemo(() => {
    const modulesSet = new Set(aulas.map(a => a.module).filter(Boolean));
    return Array.from(modulesSet).sort();
  }, [aulas]);

  const handleOpenForm = (aula?: Aula) => {
    if (aula) {
      setFormData({
        title: aula.title || '',
        module: aula.module || '',
        description: aula.description || '',
        video_url: aula.video_url || '',
        image_url: aula.image_url || '',
        pdf_url: aula.pdf_url || '',
        is_18_plus: !!aula.is_18_plus
      });
      setEditingId(aula.id);
    } else {
      setFormData({ title: '', module: '', description: '', video_url: '', image_url: '', pdf_url: '', is_18_plus: false });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSaveAula = async () => {
    if (!formData.title) {
      alert('O título é obrigatório.');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('lessons')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lessons')
          .insert([formData]);
        if (error) throw error;
      }
      
      await fetchAulas();
      setView('list');
      setFormData({ title: '', module: '', description: '', video_url: '', image_url: '', pdf_url: '', is_18_plus: false });
      setEditingId(null);
    } catch (err: any) {
      console.error('Erro detalhado:', err);
      alert(`Erro do Supabase: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAula = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      setAulas(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir do banco.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'list' && aulas.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-sf-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Aulas (Supabase)</h1>
              <p className="text-gray-400">Todo conteúdo editado aqui reflete em tempo real para os membros.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Localizar aula no banco..." 
                   className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" 
                 />
               </div>
               <button onClick={() => handleOpenForm()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
                 <Plus className="w-4 h-4" /> Nova Aula
               </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
             <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
                    <tr>
                       <th className="px-6 py-4 border-b border-white/5">Título da Aula</th>
                       <th className="px-6 py-4 border-b border-white/5">Módulo</th>
                       <th className="px-6 py-4 border-b border-white/5">Conteúdo</th>
                       <th className="px-6 py-4 border-b border-white/5 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredAulas.map((aula, idx) => (
                       <motion.tr 
                         key={aula.id} 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.05 }}
                         className="border-b border-white/5 hover:bg-white/5 transition-colors"
                       >
                          <td className="px-6 py-4 font-bold text-white">{aula.title}</td>
                          <td className="px-6 py-4">{aula.module}</td>
                          <td className="px-6 py-4">
                             <div className="flex flex-wrap gap-1">
                                {aula.video_url && <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">Vídeo</span>}
                                {aula.image_url && <span className="text-[10px] bg-sf-purple/10 border border-sf-purple/20 text-sf-purple px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">Imagem</span>}
                                {aula.pdf_url && <span className="text-[10px] bg-sf-blue/10 border border-sf-blue/20 text-sf-blue px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">PDF</span>}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                                <button onClick={() => handleOpenForm(aula)} className="p-2 bg-white/5 hover:bg-sf-blue/20 hover:text-sf-blue rounded-lg border border-white/10 hover:border-sf-blue/30 transition-all text-gray-400">
                                   <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteAula(aula.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400">
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
              {filteredAulas.length === 0 && (
                 <div className="p-12 text-center text-gray-500">
                    Nenhuma aula encontrada no Supabase.
                 </div>
              )}
           </div>
        </motion.div>
      ) : (
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full overflow-hidden shadow-2xl"
        >
           <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Aula' : 'Nova Aula'}</h3>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Voltar</button>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Módulo</label>
                    <input 
                       list="module-list"
                       type="text" 
                       value={formData.module}
                       onChange={(e) => setFormData({...formData, module: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                       placeholder="Ex: Módulo 1: Fundamentos" 
                    />
                    <datalist id="module-list">
                       {availableModules.map((mod) => (
                         <option key={mod} value={mod} />
                       ))}
                    </datalist>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título da Aula</label>
                    <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                       placeholder="Ex: 1. Introdução ao Sistema" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</label>
                 <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-24 resize-none" 
                    placeholder="O que será abordado nesta aula?" 
                 />
              </div>

              <div className="space-y-4 pt-2">
                 <h4 className="text-sm font-bold text-white uppercase tracking-wider">Conteúdo da Aula</h4>
                 <div className="space-y-4 bg-white/5 border border-white/10 p-5 rounded-xl">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL do Vídeo (Opcional)</label>
                        <input type="text" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Youtube / Vimeo / Mp4..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL da Imagem (Opcional)</label>
                        <input type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL do PDF / Material (Opcional)</label>
                        <input type="text" value={formData.pdf_url} onChange={(e) => setFormData({...formData, pdf_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://..." />
                     </div>
                 </div>
              </div>

           </div>
           
           <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
               <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <input 
                     type="checkbox" 
                     checked={formData.is_18_plus}
                     onChange={(e) => setFormData({...formData, is_18_plus: e.target.checked})}
                     className="w-4 h-4 rounded border-white/10 bg-white/5 accent-red-500" 
                  />
                  Conteúdo +18
               </label>
               <div className="flex gap-3">
                  <button onClick={() => setView('list')} className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
                  <button onClick={handleSaveAula} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar no Banco (Supabase)
                  </button>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
