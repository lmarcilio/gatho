import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit, Trash2, Loader2, Upload, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Plan {
  label: string;
  url: string;
}

interface Curso {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: string;
  old_price: string;
  image_url: string;
  affiliate_url: string;
  plans: Plan[];
}

export default function AdminCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [urlType, setUrlType] = useState<'link' | 'upload'>('upload');

  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    price: '',
    old_price: '',
    image_url: '',
    affiliate_url: '',
    plans: [] as Plan[]
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setCursos(data || []);
    } catch (err) {
      console.error('Erro ao buscar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleAddPlan = () => {
    setFormData({
      ...formData,
      plans: [...formData.plans, { label: '', url: '' }]
    });
  };

  const handleUpdatePlan = (index: number, field: keyof Plan, value: string) => {
    const newPlans = [...formData.plans];
    newPlans[index][field] = value;
    setFormData({ ...formData, plans: newPlans });
  };

  const handleRemovePlan = (index: number) => {
    setFormData({
      ...formData,
      plans: formData.plans.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `cursos/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('gatho-media').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('gatho-media').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
      setUrlType('link');
    } catch (error: any) {
      alert(`Erro no upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title) return alert('Preencha o título.');
    setLoading(true);
    try {
      if (editingId) {
        const { error } = await supabase.from('courses').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert([formData]);
        if (error) throw error;
      }
      await fetchCursos();
      setView('list');
      setEditingId(null);
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
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
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Cursos</h1>
              <p className="text-gray-400">Atribua múltiplos planos de checkout para seus cursos.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Buscar curso..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none" />
               </div>
               <button onClick={() => { setEditingId(null); setFormData({ title: '', instructor: '', description: '', price: '', old_price: '', image_url: '', affiliate_url: '', plans: [] }); setView('form'); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform active:scale-95">
                 <Plus className="w-4 h-4" /> Novo Curso
               </button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
             <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider text-center">
                   <tr>
                      <th className="px-6 py-4 text-left">Curso</th>
                      <th className="px-6 py-4">Planos</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                   </tr>
                </thead>
                <tbody>
                   {cursos.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map((curso) => (
                      <tr key={curso.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <img src={curso.image_url} className="w-10 h-10 rounded object-cover bg-white/10" />
                               <div>
                                  <p className="font-bold text-white">{curso.title}</p>
                                  <p className="text-[10px] text-gray-500">{curso.instructor}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className="bg-sf-purple/20 text-sf-purple text-[10px] font-bold px-2 py-1 rounded border border-sf-purple/30">
                               {curso.plans?.length || 0} Planos
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                               <button onClick={() => { setEditingId(curso.id); setFormData({ ...curso, plans: curso.plans || [] }); setView('form'); }} className="p-2 hover:bg-sf-blue/20 text-sf-blue transition-all cursor-pointer"><Edit className="w-4 h-4" /></button>
                               <button onClick={async () => { if(confirm('Excluir?')) { await supabase.from('courses').delete().eq('id', curso.id); fetchCursos(); } }} className="p-2 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full overflow-hidden shadow-2xl pb-10">
           <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Curso' : 'Novo Curso'}</h3>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Voltar</button>
           </div>
           
           <div className="p-6 space-y-8">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Título</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-red-500" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Instrutor</label>
                    <input type="text" value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-red-500" />
                 </div>
              </div>

              {/* Imagem (Mantido o upload) */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 uppercase">Imagem de Capa</label>
                 <div className="flex gap-2 mb-2">
                    <button onClick={() => setUrlType('upload')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold border transition-all", urlType === 'upload' ? "bg-red-500 text-white border-red-500" : "bg-white/5 text-gray-500 border-white/10")}>UPLOAD PC</button>
                    <button onClick={() => setUrlType('link')} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold border transition-all", urlType === 'link' ? "bg-red-500 text-white border-red-500" : "bg-white/5 text-gray-500 border-white/10")}>LINK EXTERNO</button>
                 </div>
                 {urlType === 'upload' ? (
                    <label className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden relative">
                       {formData.image_url ? <img src={formData.image_url} className="w-full h-full object-cover opacity-50" /> : <Upload className="text-gray-600" />}
                       <input type="file" className="hidden" onChange={handleFileUpload} />
                       {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-red-500" /></div>}
                    </label>
                 ) : (
                    <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm" />
                 )}
              </div>

              {/* Seção de Planos Dinâmicos */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                       <Plus className="w-4 h-4 text-red-500" /> Planos de Checkout
                    </h4>
                    <button onClick={handleAddPlan} className="text-[10px] font-black bg-red-500 px-3 py-1.5 rounded uppercase hover:bg-red-600 transition-colors">
                       Adicionar Plano
                    </button>
                 </div>

                 <div className="space-y-3">
                    <AnimatePresence>
                       {formData.plans.map((plan, index) => (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={index} className="flex gap-3 items-end bg-[#111] p-4 rounded-xl border border-white/5 relative group">
                             <div className="flex-1 space-y-2">
                                <label className="text-[9px] font-bold text-gray-500 uppercase">Nome do Plano (Ex: Vitalício)</label>
                                <input type="text" value={plan.label} onChange={e => handleUpdatePlan(index, 'label', e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white" />
                             </div>
                             <div className="flex-[2] space-y-2">
                                <label className="text-[9px] font-bold text-gray-500 uppercase">URL de Checkout (Link de Afiliado)</label>
                                <input type="text" value={plan.url} onChange={e => handleUpdatePlan(index, 'url', e.target.value)} className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white font-mono" />
                             </div>
                             <button onClick={() => handleRemovePlan(index)} className="p-2.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all">
                                <X className="w-4 h-4" />
                             </button>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                    {formData.plans.length === 0 && (
                       <p className="text-center text-xs text-gray-600 py-6 border border-dashed border-white/10 rounded-xl">Nenhum plano adicionado. Use o link principal de afiliado abaixo como padrão.</p>
                    )}
                 </div>
              </div>

              {/* Link Principal (Fallback) */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Preço de Destaque (R$)</label>
                       <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" placeholder="Ex: 97,00" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 uppercase">Link de Afiliado Padrão</label>
                       <input type="text" value={formData.affiliate_url} onChange={e => setFormData({...formData, affiliate_url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" placeholder="https://..." />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Descrição Curta</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-20 resize-none" />
                 </div>
              </div>
           </div>
           
           <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
               <button onClick={() => setView('list')} className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
               <button onClick={handleSave} disabled={loading || uploading} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} Salvar Curso
               </button>
           </div>
        </motion.div>
      )}
    </div>
  );
}
