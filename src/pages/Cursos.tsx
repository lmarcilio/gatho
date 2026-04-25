import { motion } from 'motion/react';
import { BookOpen, ExternalLink, Zap } from 'lucide-react';
import { useCursos, use18PlusMode } from '@/lib/storage';

export default function Cursos() {
  const [cursos] = useCursos();
  const [is18PlusMode] = use18PlusMode();
  const filtered18cursos = is18PlusMode ? cursos : cursos.filter(item => !item.is18Plus);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center max-w-2xl mx-auto">
         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
            <BookOpen className="w-8 h-8 text-white" />
         </div>
         <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Cursos Parceiros</h1>
         <p className="text-sf-text-muted text-lg">
            Aprofunde seus conhecimentos com treinamentos completos recomendados por nós. 
            Membros <span className="text-white font-bold">GATHO</span> têm descontos exclusivos.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {filtered18cursos.map((course, idx) => (
            <motion.div 
               key={course.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * idx }}
               className="glass-card overflow-hidden group flex flex-col md:flex-row hover:border-indigo-500/50 transition-all duration-300"
            >
               {/* Image */}
               <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={"https://images.unsplash.com/photo-1552581234-26160f608093?w=500&q=80"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               
               {/* Content */}
               <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col justify-between relative bg-gradient-to-br from-transparent to-white/[0.02]">
                  <div>
                     <div className="flex gap-2 items-center mb-3">
                        <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                           Curso Oficial
                        </span>
                        <span className="text-xs text-sf-text-muted font-medium">por {course.instructor}</span>
                     </div>
                     
                     <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{course.title}</h3>
                     <p className="text-sm text-sf-text-muted mb-6 whitespace-pre-line">{course.description || "Acesse o conteúdo focado com certificado especial para nossa comunidade."}</p>
                     
                     {course.pageLink && (
                        <a href={course.pageLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold mb-4 uppercase tracking-wider">
                           Ver Detalhes da Página <ExternalLink className="w-3 h-3" />
                        </a>
                     )}
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                     {course.plans && course.plans.length > 0 ? (
                        course.plans.map((plan: any, i: number) => (plan.type || plan.url) && (
                           <a key={i} href={plan.url || "#"} target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/10 hover:bg-white text-white hover:text-black py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-between transition-all w-full group">
                              <span>{plan.type || 'Comprar'}</span>
                              <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-black/50" />
                           </a>
                        ))
                     ) : (
                         <div className="text-sm text-sf-text-muted py-2">Nenhum plano disponível</div>
                     )}
                  </div>
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-indigo-500 shrink-0">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 12.5L10.5 15.5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
