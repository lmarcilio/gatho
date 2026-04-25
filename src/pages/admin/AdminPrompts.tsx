import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { usePrompts } from '@/lib/storage';

export default function AdminPrompts() {
  const [prompts, setPrompts] = usePrompts();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({
    title: '',
    type: 'ChatGPT',
    category: 'Copywriting',
    subcategory: '',
    level: 'Iniciante',
    copy: '',
    is18Plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const subcategories = Array.from(
    new Set(
      prompts
        .filter((p) => p.category === formData.category && p.subcategory)
        .map((p) => p.subcategory)
    )
  );

  const handleOpenForm = (prompt?: any) => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        type: prompt.type,
        category: prompt.category,
        subcategory: prompt.subcategory || '',
        level: prompt.level,
        copy: prompt.copy || '',
        is18Plus: prompt.is18Plus || false
      });
      setEditingId(prompt.id);
    } else {
      setFormData({ title: '', type: 'ChatGPT', category: 'Copywriting', subcategory: '', level: 'Iniciante', copy: '' });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSavePrompt = () => {
    if (!formData.title) return;
    
    if (editingId) {
      setPrompts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } : p));
    } else {
      const newPrompt = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setPrompts(prev => [...prev, newPrompt]);
    }
    
    setView('list');
    setFormData({ title: '', type: 'ChatGPT', category: 'Copywriting', subcategory: '', level: 'Iniciante', copy: '' });
    setEditingId(null);
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este prompt?')) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Prompts</h1>
              <p className="text-gray-400">Adicione e gerencie a biblioteca de prompts da plataforma.</p>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Localizar prompt..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" />
               </div>
               <button onClick={() => handleOpenForm()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
                 <Plus className="w-4 h-4" /> Adicionar
               </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
             <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
                   <tr>
                      <th className="px-6 py-4 border-b border-white/5">Título</th>
                      <th className="px-6 py-4 border-b border-white/5">IA / Categoria</th>
                      <th className="px-6 py-4 border-b border-white/5">Nível</th>
                      <th className="px-6 py-4 border-b border-white/5 text-right">Ações</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredPrompts.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhum prompt encontrado.</td></tr>
                   )}
                   {filteredPrompts.map((prompt, idx) => (
                      <motion.tr 
                        key={prompt.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                         <td className="px-6 py-4 font-bold text-white">{prompt.title}</td>
                         <td className="px-6 py-4">
                            <span className="text-white text-[10px] uppercase tracking-wider bg-white/10 px-2 py-1 rounded inline-block mr-2 border border-white/20">{prompt.type}</span>
                            <span className="text-gray-400 text-[10px] uppercase tracking-wider">{prompt.category}{prompt.subcategory ? ` > ${prompt.subcategory}` : ''}</span>
                         </td>
                         <td className="px-6 py-4">{prompt.level}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => handleOpenForm(prompt)} className="p-2 bg-white/5 hover:bg-sf-blue/20 hover:text-sf-blue rounded-lg border border-white/10 hover:border-sf-blue/30 transition-all text-gray-400">
                                  <Edit className="w-4 h-4" />
                               </button>
                               <button onClick={() => handleDeletePrompt(prompt.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </motion.tr>
                   ))}
                </tbody>
             </table>
          </div>
        </motion.div>
      ) : (
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full overflow-hidden shadow-2xl"
        >
           <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Prompt' : 'Novo Prompt'}</h3>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Voltar</button>
           </div>
           
           <div className="p-6 space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título do Prompt</label>
                 <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                    placeholder="Ex: Copy de Vendas Focado" 
                 />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">IA Alvo</label>
                    <select 
                       value={formData.type}
                       onChange={(e) => setFormData({...formData, type: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 [&>option]:bg-[#0A0A0A]"
                    >
                       <option>ChatGPT</option>
                       <option>Claude</option>
                       <option>Midjourney</option>
                       <option>Runway</option>
                       <option>Sora</option>
                       <option>Outro</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                    <select 
                       value={formData.category}
                       onChange={(e) => setFormData({
                         ...formData, 
                         category: e.target.value,
                         subcategory: '' // Reset subcategory when category changes
                       })}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 [&>option]:bg-[#0A0A0A]"
                    >
                       <option>Copywriting</option>
                       <option>Imagens</option>
                       <option>Vídeos</option>
                       <option>Pesquisa e Análise</option>
                       <option>Código</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subcategoria (Opcional)</label>
                    <input 
                       list="subcategories-list"
                       type="text" 
                       value={formData.subcategory}
                       onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                       placeholder="Ex: Landing Page" 
                    />
                    <datalist id="subcategories-list">
                       {subcategories.map(sub => (
                         <option key={sub} value={sub} />
                       ))}
                    </datalist>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dificuldade</label>
                    <select 
                       value={formData.level}
                       onChange={(e) => setFormData({...formData, level: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 [&>option]:bg-[#0A0A0A]"
                    >
                       <option>Iniciante</option>
                       <option>Intermediário</option>
                       <option>Avançado</option>
                    </select>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Corpo do Prompt (Template)</label>
                 <textarea 
                    value={formData.copy}
                    onChange={(e) => setFormData({...formData, copy: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-64 resize-none font-mono text-sm" 
                    placeholder="[Insira o texto base da IA aqui...]"
                 />
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
                  <button onClick={handleSavePrompt} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar no Banco
                  </button>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
