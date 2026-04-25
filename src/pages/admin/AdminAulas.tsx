import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useAulas } from '@/lib/storage';

export default function AdminAulas() {
  const [aulas, setAulas] = useAulas();
  const [view, setView] = useState<'list' | 'form'>('list');

  const [formData, setFormData] = useState({
    title: '',
    module: '',
    description: '',
    videoUrl: '',
    imageUrl: '',
    pdfUrl: '',
    is18Plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAulas = aulas.filter(aula => 
    aula.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (aula.module && aula.module.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const availableModules = useMemo(() => {
    const modulesSet = new Set(aulas.map(a => a.module).filter(Boolean));
    return Array.from(modulesSet).sort();
  }, [aulas]);

  const handleOpenForm = (aula?: any) => {
    if (aula) {
      setFormData({
        title: aula.title || '',
        module: aula.module || '',
        description: aula.description || '',
        videoUrl: aula.videoUrl || (aula.type === 'video' ? aula.url : '') || '',
        imageUrl: aula.imageUrl || '',
        pdfUrl: aula.pdfUrl || (aula.type === 'pdf' ? aula.url : '') || '',
        is18Plus: aula.is18Plus || false
      });
      setEditingId(aula.id);
    } else {
      setFormData({ title: '', module: '', description: '', videoUrl: '', imageUrl: '', pdfUrl: '' });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSaveAula = () => {
    if (!formData.title) return;
    if (editingId) {
      setAulas(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a));
    } else {
      const newAula = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setAulas(prev => [...prev, newAula]);
    }
    setView('list');
    setFormData({ title: '', module: '', description: '', videoUrl: '', imageUrl: '', pdfUrl: '' });
    setEditingId(null);
  };

  const handleDeleteAula = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      setAulas(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Aulas</h1>
              <p className="text-gray-400">Adicione novos módulos e vídeos para a área de aprendizado.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Localizar aula..." 
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
                               {(aula.videoUrl || aula.type === 'video') && <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">Vídeo</span>}
                               {aula.imageUrl && <span className="text-[10px] bg-sf-purple/10 border border-sf-purple/20 text-sf-purple px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">Imagem</span>}
                               {(aula.pdfUrl || aula.type === 'pdf') && <span className="text-[10px] bg-sf-blue/10 border border-sf-blue/20 text-sf-blue px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm">PDF</span>}
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
                   Nenhuma aula encontrada para o filtro.
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
                         <option key={mod as string} value={mod as string} />
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
                        <input type="text" value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Youtube / Vimeo / Mp4..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL da Imagem (Opcional)</label>
                        <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://..." />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL do PDF / Material (Opcional)</label>
                        <input type="text" value={formData.pdfUrl} onChange={(e) => setFormData({...formData, pdfUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="https://..." />
                     </div>
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
                  <button onClick={handleSaveAula} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar no Banco
                  </button>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
