import { motion } from 'motion/react';
import { BookOpen, GraduationCap, ArrowRight, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  plans?: Plan[];
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error('Erro ao buscar cursos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-12 h-12 text-sf-purple animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="text-sf-purple w-8 h-8" />
          Cursos Parceiros
        </h1>
        <p className="text-sf-text-muted max-w-xl">
          Evolua suas habilidades com os melhores treinamentos de Inteligência Artificial do mercado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursos.length === 0 ? (
          <div className="col-span-full py-20 text-center text-sf-text-muted border border-dashed border-white/10 rounded-2xl">
             <GraduationCap className="w-12 h-12 mx-auto mb-4 text-white/20" />
             <p>Nenhum curso disponível no momento.</p>
          </div>
        ) : (
          cursos.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card flex flex-col group overflow-hidden border border-white/5 hover:border-sf-purple/40 transition-all bg-white/5 rounded-2xl shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden bg-black/40">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/10" />
                   </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] font-bold text-sf-purple uppercase tracking-widest">Recomendado</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sf-text-muted text-sm line-clamp-3 mb-6 flex-1">
                  {course.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {course.old_price && <p className="text-xs text-gray-500 line-through">De R$ {course.old_price}</p>}
                      <p className="text-2xl font-black text-white">R$ {course.price}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Produtor</p>
                       <p className="text-sm font-bold text-white">{course.instructor}</p>
                    </div>
                  </div>

                  {/* Renderização dos botões de planos (Links de Afiliado) */}
                  <div className="flex flex-col gap-2">
                     {course.plans && course.plans.length > 0 ? (
                        course.plans.map((plan, pIdx) => (
                           <a 
                              key={pIdx}
                              href={plan.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full bg-white hover:bg-sf-purple transition-all duration-300 text-black hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 group/btn border border-transparent"
                           >
                              {plan.label || "Quero me Inscrever"}
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                           </a>
                        ))
                     ) : (
                        // Fallback para o link principal se não houver planos
                        <a 
                           href={course.affiliate_url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="w-full bg-white hover:bg-sf-purple transition-all duration-300 text-black hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 group/btn border border-transparent"
                        >
                           Quero me Inscrever
                           <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                     )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
