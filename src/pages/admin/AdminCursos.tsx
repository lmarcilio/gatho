import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useCursos } from '@/lib/storage';

export default function AdminCursos() {
  const [cursos, setCursos] = useCursos();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    pageLink: '',
    plans: [{ type: '', url: '' }],
    is18Plus: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenModal = (curso?: any) => {
    if (curso) {
      setFormData({
        title: curso.title || '',
        instructor: curso.instructor || '',
        description: curso.description || '',
        pageLink: curso.pageLink || '',
        plans: curso.plans && curso.plans.length > 0 ? curso.plans : [{ type: '', url: '' }],
        is18Plus: curso.is18Plus || false
      });
      setEditingId(curso.id);
    } else {
      setFormData({ title: '', instructor: '', description: '', pageLink: '', plans: [{ type: '', url: '' }] });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveCurso = () => {
    if (!formData.title) return;
    
    // Clean up empty plans
    const cleanPlans = formData.plans.filter(p => p.type.trim() || p.url.trim());
    const dataToSave = { ...formData, plans: cleanPlans };

    if (editingId) {
      setCursos(prev => prev.map(c => c.id === editingId ? { ...c, ...dataToSave } : c));
    } else {
      const newCurso = {
        id: Math.random().toString(36).substr(2, 9),
        ...dataToSave
      };
      setCursos(prev => [...prev, newCurso]);
    }
    setIsModalOpen(false);
    setFormData({ title: '', instructor: '', description: '', pageLink: '', plans: [{ type: '', url: '' }] });
    setEditingId(null);
  };

  const handleDeleteCurso = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      setCursos(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Cursos</h1>
          <p className="text-gray-400">Adicione cursos parceiros com seus links de afiliados.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input type="text" placeholder="Localizar curso..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-red-500/50 focus:outline-none" />
           </div>
           <button onClick={() => handleOpenModal()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
             <Plus className="w-4 h-4" /> Novo Curso
           </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
         <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-black/40 text-gray-300 uppercase text-xs font-bold tracking-wider">
               <tr>
                  <th className="px-6 py-4 border-b border-white/5">Título do Curso</th>
                  <th className="px-6 py-4 border-b border-white/5">Instrutor</th>
                  <th className="px-6 py-4 border-b border-white/5 text-right">Ações</th>
               </tr>
            </thead>
            <tbody>
               {cursos.map((curso, idx) => (
                  <motion.tr 
                    key={curso.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                     <td className="px-6 py-4 font-bold text-white">{curso.title}</td>
                     <td className="px-6 py-4">{curso.instructor}</td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => handleOpenModal(curso)} className="p-2 bg-white/5 hover:bg-sf-blue/20 hover:text-sf-blue rounded-lg border border-white/10 hover:border-sf-blue/30 transition-all text-gray-400">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteCurso(curso.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 hover:border-red-500/30 transition-all text-gray-400">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                  </motion.tr>
               ))}
            </tbody>
         </table>
         {cursos.length === 0 && (
            <div className="p-12 text-center text-gray-500">
               Nenhum curso cadastrado ainda.
            </div>
         )}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
               <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-xl font-bold text-white">{editingId ? 'Editar Curso' : 'Novo Curso Afiliado'}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">x</button>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Título do Curso</label>
                     <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do Produto</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10 h-20 resize-none" 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link da Página</label>
                     <input 
                        type="text" 
                        value={formData.pageLink}
                        onChange={(e) => setFormData({...formData, pageLink: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 focus:bg-white/10" 
                        placeholder="https://..."
                     />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                     <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Links de Compra (Até 3 opções)</label>
                        {formData.plans.length < 3 && (
                           <button 
                              type="button"
                              onClick={() => setFormData({...formData, plans: [...formData.plans, { type: '', url: '' }]})}
                              className="text-xs text-red-500 hover:text-red-400 font-bold"
                           >
                              + Adicionar Opção
                           </button>
                        )}
                     </div>
                     {formData.plans.map((plan, index) => (
                        <div key={index} className="flex gap-2 items-start">
                           <div className="w-1/3">
                              <input 
                                 type="text" 
                                 value={plan.type}
                                 onChange={(e) => {
                                    const newPlans = [...formData.plans];
                                    newPlans[index].type = e.target.value;
                                    setFormData({...formData, plans: newPlans});
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                                 placeholder="Mensal, Anual..."
                              />
                           </div>
                           <div className="flex-1 flex gap-2">
                              <input 
                                 type="text" 
                                 value={plan.url}
                                 onChange={(e) => {
                                    const newPlans = [...formData.plans];
                                    newPlans[index].url = e.target.value;
                                    setFormData({...formData, plans: newPlans});
                                 }}
                                 className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                                 placeholder="Link de checkout"
                              />
                              {formData.plans.length > 1 && (
                                 <button 
                                    onClick={() => {
                                       const newPlans = formData.plans.filter((_, i) => i !== index);
                                       setFormData({...formData, plans: newPlans});
                                    }}
                                    className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              )}
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
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-white hover:bg-white/10 transition-colors">Cancelar</button>
                  <button onClick={handleSaveCurso} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                     Salvar no Banco
                  </button>
               </div>
            </div>
         </motion.div>
      </div>
      )}
    </div>
  );
}
