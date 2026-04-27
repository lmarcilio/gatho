import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminFerramentas() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Imagem',
    description: '',
    tool_url: '',
    image_url: '',
    is_popular: false,
    youtube_refs: [{ title: '', url: '' }]
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTools = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      console.error('Erro ao buscar ferramentas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (tool.category && tool.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenForm = (tool?: any) => {
    if (tool) {
      setFormData({
        name: tool.name,
        category: tool.category,
        description: tool.description || '',
        tool_url: tool.tool_url || '',
        image_url: tool.image_url || '',
        is_popular: tool.is_popular,
        youtube_refs: tool.youtube_refs && tool.youtube_refs.length > 0 ? tool.youtube_refs : [{ title: '', url: '' }]
      });
      setEditingId(tool.id);
    } else {
      setFormData({ name: '', category: 'Imagem', description: '', tool_url: '', image_url: '', is_popular: false, youtube_refs: [{ title: '', url: '' }] });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSaveTool = async () => {
    if (!formData.name) return;
    
    setLoading(true);
    const cleanVideos = formData.youtube_refs.filter((v: any) => v.url.trim());
    const dataToSave = { ...formData, youtube_refs: cleanVideos };
    
    try {
      if (editingId) {
        const { error } = await supabase.from('tools').update(dataToSave).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tools').insert([dataToSave]);
        if (error) throw error;
      }
      await fetchTools();
      setView('list');
      setEditingId(null);
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta ferramenta?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
      setTools(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Ferramentas</h1>
              <p className="text-gray-400">Adicione, edite ou remova ferramentas da vitrine da plataforma.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Localizar ferramenta..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" />
               </div>
               <button 
                 onClick={() => handleOpenForm()}
                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
               >
                 <Plus className="w-4 h-4" /> Adicionar
               </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
             {loading && view === 'list' && tools.length === 0 ? (
               <div className="flex h-64 items-center justify-center">
                 <Loader2 className="w-8 h-8 text-sf-purple animate-spin" />
               </div>
             ) : (
               <>
                 <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
                       <tr>
                          <th className="px-6 py-4 border-b border-white/5">Ferramenta</th>
                          <th className="px-6 py-4 border-b border-white/5">Categoria</th>
                          <th className="px-6 py-4 border-b border-white/5">Status</th>
                          <th className="px-6 py-4 border-b border-white/5 text-right">Ações</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredTools.length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhuma ferramenta encontrada.</td></tr>
                       )}
                       {filteredTools.map((tool, idx) => (
                          <motion.tr 
                            key={tool.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                             <td className="px-6 py-4 font-bold text-white">{tool.name}</td>
                             <td className="px-6 py-4">
                                <span className="bg-white/10 border border-white/20 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">
                                   {tool.category}
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                {tool.is_popular ? (
                                   <span className="text-sf-purple bg-sf-purple/10 border border-sf-purple/20 px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider">Destaque</span>
                                ) : (
                                   <span className="text-gray-400">Normal</span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                   <button onClick={() => handleOpenForm(tool)} className="p-2 bg-white/5 hover:bg-sf-blue/20 hover:text-sf-blue rounded-lg border border-white/10 hover:border-sf-blue/30 transition-all text-gray-400">
                                      <Edit className="w-4 h-4" />
                                   </button>
                                   <button onClick={() => handleDeleteTool(tool.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </tbody>
                 </table>
                 {tools.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                       Nenhuma ferramenta cadastrada ainda no banco.
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
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Ferramenta' : 'Nova Ferramenta'}</h3>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Voltar</button>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome da IA</label>
                    <input 
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                       placeholder="Ex: Midjourney" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                    <select 
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 [&>option]:bg-[#0A0A0A]"
                    >
                       <option>Imagem</option>
                       <option>Texto/Código</option>
                       <option>Vídeo</option>
                       <option>Automação</option>
                    </select>
                 </div>
              </div>
              
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição Curta</label>
                  <textarea 
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-24 resize-none" 
                     placeholder="O que esta ferramenta faz?"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><LinkIcon className="w-3 h-3"/> URL de Acesso</label>
                     <input value={formData.tool_url} onChange={(e) => setFormData({...formData, tool_url: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><ImageIcon className="w-3 h-3"/> URL da Imagem (Capa)</label>
                     <input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://" />
                  </div>
               </div>

              <div className="flex items-center gap-6 pt-2">
                 <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-white">
                    <input 
                       type="checkbox" 
                       checked={formData.is_popular}
                       onChange={(e) => setFormData({...formData, is_popular: e.target.checked})}
                       className="w-4 h-4 rounded border-white/10 bg-white/5 text-red-500 focus:ring-red-500" 
                    />
                    Destacar como Popular
                 </label>
              </div>

               <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vídeos (Até 3 opções)</label>
                     {formData.youtube_refs.length < 3 && (
                        <button 
                           type="button"
                           onClick={() => setFormData({...formData, youtube_refs: [...formData.youtube_refs, { title: '', url: '' }]})}
                           className="text-xs text-red-500 hover:text-red-400 font-bold"
                        >
                           + Adicionar Vídeo
                        </button>
                     )}
                  </div>
                  {formData.youtube_refs.map((video: any, index: number) => (
                     <div key={index} className="flex gap-2 items-start">
                        <div className="w-1/3">
                           <input 
                              type="text" 
                              value={video.title}
                              onChange={(e) => {
                                 const newVideos = [...formData.youtube_refs];
                                 newVideos[index].title = e.target.value;
                                 setFormData({...formData, youtube_refs: newVideos});
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
                                 const newVideos = [...formData.youtube_refs];
                                 newVideos[index].url = e.target.value;
                                 setFormData({...formData, youtube_refs: newVideos});
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                              placeholder="Youtube / Vimeo..."
                           />
                           <button 
                              onClick={() => {
                                 let newVideos = formData.youtube_refs.filter((_, i) => i !== index);
                                 if (newVideos.length === 0) newVideos = [{ title: '', url: '' }];
                                 setFormData({...formData, youtube_refs: newVideos});
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
            
            <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-end gap-3">
               <div className="flex gap-3">
                  <button onClick={() => setView('list')} className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
                  <button onClick={handleSaveTool} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar no Banco
                  </button>
               </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}
