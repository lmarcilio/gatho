import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Prompt {
  id: string;
  title: string;
  ai_type: string;
  category: string;
  subcategory: string;
  difficulty_level: string;
  prompt_text: string;
  is_18_plus: boolean;
}

export default function AdminPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableAIs, setAvailableAIs] = useState<string[]>(['ChatGPT', 'Claude', 'Midjourney', 'Runway', 'Sora', 'Gemini']);

  const [formData, setFormData] = useState({
    title: '',
    ai_type: 'ChatGPT',
    category: 'Copywriting',
    subcategory: '',
    difficulty_level: 'Iniciante',
    prompt_text: '',
    is_18_plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Carregar dados do Supabase
  const fetchData = async () => {
    setLoading(true);
    setErrorStatus(null);
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);

      // Extrair IAs únicas para o datalist
      if (data) {
        const types = new Set(availableAIs);
        data.forEach(p => { if (p.ai_type) types.add(p.ai_type); });
        setAvailableAIs(Array.from(types).sort());
      }
    } catch (err: any) {
      console.error('Erro ao buscar prompts:', err);
      setErrorStatus(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.ai_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (prompt?: Prompt) => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        ai_type: prompt.ai_type,
        category: prompt.category,
        subcategory: prompt.subcategory || '',
        difficulty_level: prompt.difficulty_level,
        prompt_text: prompt.prompt_text,
        is_18_plus: !!prompt.is_18_plus
      });
      setEditingId(prompt.id);
    } else {
      setFormData({
        title: '',
        ai_type: 'ChatGPT',
        category: 'Copywriting',
        subcategory: '',
        difficulty_level: 'Iniciante',
        prompt_text: '',
        is_18_plus: false
      });
      setEditingId(null);
    }
    setView('form');
  };

  const handleSavePrompt = async () => {
    if (!formData.title || !formData.prompt_text) {
      alert('Por favor, preencha o título e o corpo do prompt.');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from('prompts')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('prompts')
          .insert([formData]);
        if (error) throw error;
      }
      
      await fetchData();
      setView('list');
      setEditingId(null);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar no Supabase. Verifique se as colunas da tabela "prompts" estão corretas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('prompts').delete().eq('id', id);
      if (error) throw error;
      setPrompts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'list' && prompts.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {view === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Prompts (Supabase)</h1>
              <p className="text-gray-400">Banco de dados centralizado e sincronizado.</p>
              {errorStatus && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                  <strong>Erro do Banco:</strong> {errorStatus}
                  <br />
                  <small className="opacity-70">Certifique-se de que a tabela 'prompts' foi criada no Supabase.</small>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Localizar no banco..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" />
               </div>
               <button onClick={() => handleOpenForm()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
                 <Plus className="w-4 h-4" /> Adicionar Novo
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
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">Nenhum prompt encontrado no banco.</td></tr>
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
                            <span className="text-white text-[10px] uppercase font-black tracking-wider bg-white/10 px-2 py-1 rounded inline-block mr-2 border border-white/20">
                                {prompt.ai_type}
                            </span>
                            <span className="text-gray-400 text-[10px] uppercase tracking-wider">{prompt.category}{prompt.subcategory ? ` > ${prompt.subcategory}` : ''}</span>
                         </td>
                         <td className="px-6 py-4">{prompt.difficulty_level}</td>
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
                    <input 
                       list="ai-types-list"
                       type="text"
                       value={formData.ai_type}
                       onChange={(e) => setFormData({...formData, ai_type: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 font-bold" 
                       placeholder="Ex: ChatGPT, Gemini..." 
                    />
                    <datalist id="ai-types-list">
                       {availableAIs.map(ai => <option key={ai} value={ai} />)}
                    </datalist>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</label>
                    <select 
                       value={formData.category}
                       onChange={(e) => setFormData({
                         ...formData, 
                         category: e.target.value,
                         subcategory: ''
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
                       type="text" 
                       value={formData.subcategory}
                       onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                       placeholder="Ex: Landing Page" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dificuldade</label>
                    <select 
                       value={formData.difficulty_level}
                       onChange={(e) => setFormData({...formData, difficulty_level: e.target.value})}
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
                    value={formData.prompt_text}
                    onChange={(e) => setFormData({...formData, prompt_text: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-64 resize-none font-mono text-sm" 
                    placeholder="[Insira o texto base da IA aqui...]"
                 />
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
                  <button 
                    onClick={handleSavePrompt} 
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-2"
                  >
                     {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                     Salvar no Supabase
                  </button>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
