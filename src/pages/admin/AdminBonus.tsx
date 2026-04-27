import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminBonus() {
  const [bonus, setBonus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    pageLink: '',
    videos: [{ title: '', url: '' }],
    is18Plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBonus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bonus')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBonus(data || []);
    } catch (err) {
      console.error('Erro ao buscar bônus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonus();
  }, []);

  const filteredBonus = bonus.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const availableCategories = useMemo(() => {
    const categoriesSet = new Set(bonus.map(b => b.category).filter(Boolean));
    return Array.from(categoriesSet).sort();
  }, [bonus]);

  const handleOpenForm = (item?: any) => {
    if (item) {
      setFormData({
        title: item.title || '',
        category: item.category || '',
        description: item.description || '',
        pageLink: item.pageLink || '',
        videos: item.videos && item.videos.length > 0 ? item.videos : [{ title: '', url: '' }],
        is18Plus: item.is18Plus || false
      });
      setEditingId(item.id);
    } else {
      setFormData({ title: '', category: '', description: '', pageLink: '', videos: [{ title: '', url: '' }], is18Plus: false });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSaveBonus = async () => {
    if (!formData.title) return;
    
    setLoading(true);
    const cleanVideos = formData.videos.filter(v => v.url.trim());
    const dataToSave = { ...formData, videos: cleanVideos };
    
    try {
      if (editingId) {
        const { error } = await supabase.from('bonus').update(dataToSave).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bonus').insert([dataToSave]);
        if (error) throw error;
      }
      await fetchBonus();
      setView('list');
      setEditingId(null);
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBonus = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este bônus?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('bonus').delete().eq('id', id);
      if (error) throw error;
      setBonus(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Bônus</h1>
              <p className="text-gray-400">Adicione materiais extras, páginas exclusivas e vídeos.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Localizar bônus..." 
                   className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" 
                 />
               </div>
               <button onClick={() => handleOpenForm()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
                 <Plus className="w-4 h-4" /> Novo Bônus
               </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
             {loading && view === 'list' && bonus.length === 0 ? (
               <div className="flex h-64 items-center justify-center">
                 <Loader2 className="w-8 h-8 text-sf-purple animate-spin" />
               </div>
             ) : (
               <>
                 <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
                       <tr>
                          <th className="px-6 py-4 border-b border-white/5">Título</th>
                          <th className="px-6 py-4 border-b border-white/5">Categoria</th>
                          <th className="px-6 py-4 border-b border-white/5 text-right">Ações</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredBonus.map((item, idx) => (
                          <motion.tr 
                            key={item.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                             <td className="px-6 py-4 font-bold text-white">{item.title}</td>
                             <td className="px-6 py-4">{item.category}</td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <button onClick={() => handleOpenForm(item)} className="p-2 bg-white/5 hover:bg-sf-blue/20 hover:text-sf-blue rounded-lg border border-white/10 hover:border-sf-blue/30 transition-all text-gray-400">
                                      <Edit className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDeleteBonus(item.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </tbody>
                 </table>
                 {filteredBonus.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                       Nenhum bônus encontrado no banco.
                    </div>
                 )}
               </>
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
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Bônus' : 'Novo Bônus'}</h3>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Voltar</button>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título</label>
                    <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                    <input 
                       list="bonus-categories"
                       type="text" 
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                    />
                    <datalist id="bonus-categories">
                       {availableCategories.map(cat => (
                         <option key={cat as string} value={cat as string} />
                       ))}
                    </datalist>
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</label>
                 <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-24 resize-none" 
                 />
              </div>

              <div className="space-y-4 pt-2">
                 <h4 className="text-sm font-bold text-white uppercase tracking-wider">Links do Bônus</h4>
                 <div className="space-y-4 bg-white/5 border border-white/10 p-5 rounded-xl">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link da Página Principal</label>
                        <input type="text" value={formData.pageLink} onChange={(e) => setFormData({...formData, pageLink: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://..." />
                     </div>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-white/10">
                     <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vídeos (Até 3 opções)</label>
                        {formData.videos.length < 3 && (
                           <button 
                              type="button"
                              onClick={() => setFormData({...formData, videos: [...formData.videos, { title: '', url: '' }]})}
                              className="text-xs text-red-500 hover:text-red-400 font-bold"
                           >
                              + Adicionar Vídeo
                           </button>
                        )}
                     </div>
                     {formData.videos.map((video, index) => (
                        <div key={index} className="flex gap-2 items-start">
                           <div className="w-1/3">
                              <input 
                                 type="text" 
                                 value={video.title}
                                 onChange={(e) => {
                                    const newVideos = [...formData.videos];
                                    newVideos[index].title = e.target.value;
                                    setFormData({...formData, videos: newVideos});
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                                 placeholder="Título do Vídeo..."
                              />
                           </div>
                           <div className="flex-1 flex gap-2">
                              <input 
                                 type="text" 
                                 value={video.url}
                                 onChange={(e) => {
                                    const newVideos = [...formData.videos];
                                    newVideos[index].url = e.target.value;
                                    setFormData({...formData, videos: newVideos});
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                                 placeholder="Youtube / Vimeo..."
                              />
                              <button 
                                 onClick={() => {
                                    let newVideos = formData.videos.filter((_, i) => i !== index);
                                    if (newVideos.length === 0) newVideos = [{ title: '', url: '' }];
                                    setFormData({...formData, videos: newVideos});
                                 }}
                                 className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                     ))}
                 </div>
              </div>

           </div>
           
           <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
               <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <input 
                     type="checkbox" 
                     checked={!!formData.is18Plus}
                     onChange={(e) => setFormData({...formData, is18Plus: e.target.checked})}
                     className="w-4 h-4 rounded border-white/10 bg-white/5 accent-red-500" 
                  />
                  Conteúdo +18
               </label>
               <div className="flex gap-3">
                  <button onClick={() => setView('list')} className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
                  <button onClick={handleSaveBonus} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar Bônus
                  </button>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
