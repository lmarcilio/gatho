import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useTools } from '@/lib/storage';

export default function AdminFerramentas() {
  const [tools, setTools] = useTools();
  const [view, setView] = useState<'list' | 'form'>('list');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Imagem',
    desc: '',
    url: '',
    img: '',
    is_popular: false,
    videos: [{ title: '', url: '' }],
    is18Plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (tool.category && tool.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenForm = (tool?: any) => {
    if (tool) {
      setFormData({
        name: tool.name,
        category: tool.category,
        desc: tool.desc || '',
        url: tool.url || '',
        img: tool.img || '',
        is_popular: tool.is_popular,
        videos: tool.videos && tool.videos.length > 0 ? tool.videos : [{ title: '', url: '' }],
        is18Plus: tool.is18Plus || false
      });
      setEditingId(tool.id);
    } else {
      setFormData({ name: '', category: 'Imagem', desc: '', url: '', img: '', is_popular: false, videos: [{ title: '', url: '' }], is18Plus: false });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSaveTool = () => {
    if (!formData.name) return; // Simple validation
    
    // Clean up empty videos
    const cleanVideos = formData.videos.filter((v: any) => v.url.trim());
    const dataToSave = { ...formData, videos: cleanVideos };
    
    if (editingId) {
      setTools((prev) => prev.map(t => t.id === editingId ? { ...t, ...dataToSave } : t));
    } else {
      const newTool = {
        id: Math.random().toString(36).substr(2, 9),
        ...dataToSave
      };
      setTools((prev) => [...prev, newTool]);
    }
    
    setView('list');
    setFormData({ name: '', category: 'Imagem', desc: '', url: '', img: '', is_popular: false, videos: [{ title: '', url: '' }] }); // Reset form
    setEditingId(null);
  };

  const handleDeleteTool = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      setTools((prev) => prev.filter(t => t.id !== id));
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
                   Nenhuma ferramenta cadastrada ainda.
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
                    value={formData.desc}
                    onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-24 resize-none" 
                    placeholder="O que esta ferramenta faz?"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><LinkIcon className="w-3 h-3"/> URL de Acesso</label>
                    <input value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"><ImageIcon className="w-3 h-3"/> URL da Imagem (Capa)</label>
                    <input value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://" />
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
                 {formData.videos.map((video: any, index: number) => (
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
