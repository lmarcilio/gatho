import { motion } from 'motion/react';
import { GraduationCap, PlayCircle, Download, CheckCircle2, Circle, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn, getEmbedUrl } from '@/lib/utils';
import { use18PlusMode } from '@/lib/storage';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface Aula {
  id: string;
  title: string;
  description: string;
  module: string;
  video_url?: string;
  videoUrl?: string; // Compatibilidade
  image_url?: string;
  imageUrl?: string; // Compatibilidade
  pdf_url?: string;
  pdfUrl?: string; // Compatibilidade
  is_18_plus?: boolean;
  is18Plus?: boolean; // Compatibilidade
}

export default function Aulas() {
  const { user } = useAuth();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [is18PlusMode] = use18PlusMode();
  const [activeAulaId, setActiveAulaId] = useState<string | null>(null);

  // Carregar aulas e progresso do banco
  useEffect(() => {
    const fetchAulasAndProgress = async () => {
      setLoading(true);
      try {
        // 1. Buscar Aulas
        const { data: aulasData, error: aulasError } = await supabase
          .from('lessons')
          .select('*')
          .order('created_at', { ascending: true });

        if (aulasError) throw aulasError;
        setAulas(aulasData || []);

        // 2. Buscar Progresso do Usuário
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('lesson_completions')
            .select('lesson_id')
            .eq('user_id', user.id);

          if (progressError) throw progressError;
          const completed = new Set(progressData.map(p => p.lesson_id));
          setCompletedIds(completed);
        }
      } catch (err) {
        console.error('Erro ao carregar aulas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAulasAndProgress();
  }, [user]);

  const filtered18aulas = useMemo(() => {
    return is18PlusMode ? aulas : aulas.filter(item => !(item.is_18_plus || item.is18Plus));
  }, [aulas, is18PlusMode]);

  useEffect(() => {
    if (filtered18aulas.length > 0 && !activeAulaId) {
      setActiveAulaId(filtered18aulas[0].id);
    }
  }, [filtered18aulas, activeAulaId]);

  const activeAula = useMemo(() => 
    filtered18aulas.find(a => a.id === activeAulaId) || filtered18aulas[0], 
    [filtered18aulas, activeAulaId]
  );

  const toggleCompletion = async (lessonId: string) => {
    if (!user || actionLoading) return;
    setActionLoading(true);

    const isCompleted = completedIds.has(lessonId);

    try {
      if (isCompleted) {
        // Remover conclusão
        const { error } = await supabase
          .from('lesson_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);
        if (error) throw error;
        
        const newSet = new Set(completedIds);
        newSet.delete(lessonId);
        setCompletedIds(newSet);
      } else {
        // Marcar conclusão
        const { error } = await supabase
          .from('lesson_completions')
          .insert([{ user_id: user.id, lesson_id: lessonId }]);
        if (error) throw error;

        const newSet = new Set(completedIds);
        newSet.add(lessonId);
        setCompletedIds(newSet);
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const progressPercentage = useMemo(() => {
    if (filtered18aulas.length === 0) return 0;
    const completedCountInTrilha = filtered18aulas.filter(a => completedIds.has(a.id)).length;
    return Math.round((completedCountInTrilha / filtered18aulas.length) * 100);
  }, [filtered18aulas, completedIds]);

  const aulasByModule = useMemo(() => {
    const grouped: Record<string, Aula[]> = {};
    const unmapped: Aula[] = [];
    filtered18aulas.forEach(aula => {
      const moduleName = aula.module;
      if (moduleName) {
        if (!grouped[moduleName]) grouped[moduleName] = [];
        grouped[moduleName].push(aula);
      } else {
        unmapped.push(aula);
      }
    });
    return { grouped, unmapped };
  }, [filtered18aulas]);

  const videoUrl = activeAula?.video_url || activeAula?.videoUrl || '';
  const imageUrl = activeAula?.image_url || activeAula?.imageUrl || '';
  const pdfUrl = activeAula?.pdf_url || activeAula?.pdfUrl || '';

  const getIcon = (aulaId: string, isActive: boolean) => {
    const lesson = aulas.find(a => a.id === aulaId);
    if (!lesson) return null;
    
    if (completedIds.has(aulaId)) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }

    const isVideo = !!lesson.video_url || !!lesson.videoUrl;
    if (isVideo) return isActive ? <PlayCircle className="w-5 h-5 text-sf-orange animate-pulse" /> : <PlayCircle className="w-5 h-5 text-sf-orange/50 group-hover:text-sf-orange" />;
    
    return isActive ? <Circle className="w-5 h-5 text-white/80 animate-pulse" /> : <Circle className="w-5 h-5 text-white/20 group-hover:text-white/40" />;
  };

  if (loading && aulas.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-12 h-12 text-sf-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
               <GraduationCap className="text-sf-orange w-8 h-8" />
               <h1 className="text-3xl font-bold text-white tracking-tight">Sala de Aula</h1>
            </div>
            
            {activeAula && (
              <button
                onClick={() => toggleCompletion(activeAula.id)}
                disabled={actionLoading}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                  completedIds.has(activeAula.id)
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-white text-black hover:bg-gray-200"
                )}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {completedIds.has(activeAula.id) ? "Concluída" : "Marcar como Concluída"}
              </button>
            )}
         </div>

         {/* Content Wrapper */}
         <div className="aspect-video w-full bg-[#050505] rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative group bg-black flex items-center justify-center">
            {videoUrl ? (
               <iframe 
                  src={getEmbedUrl(videoUrl)} 
                  className="w-full h-full border-none z-0 relative"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
               />
            ) : imageUrl ? (
               <img src={imageUrl} alt={activeAula?.title} className="w-full h-full object-contain" />
            ) : pdfUrl ? (
               <iframe src={pdfUrl} className="w-full h-full border-none z-0 relative bg-white/5" />
            ) : (
               <div className="text-white/40 flex flex-col items-center gap-4 z-0 relative">
                  <Circle className="w-12 h-12 opacity-30" />
                  Nenhum conteúdo principal cadastrado.
               </div>
            )}
            
            {(videoUrl || imageUrl) && (
               <>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-4 left-6 z-20 pointer-events-none">
                     {activeAula?.module && (
                        <span className="bg-sf-orange/20 border border-sf-orange/50 text-sf-orange text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2 block w-max backdrop-blur-sm">
                           {activeAula.module}
                        </span>
                     )}
                     <h2 className="text-2xl font-bold text-white filter drop-shadow-md">{activeAula?.title}</h2>
                  </div>
               </>
            )}
         </div>

         {/* Resources */}
         {pdfUrl && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="glass-card p-4 hover:border-sf-blue/40 transition-colors flex items-center justify-between group"
               >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-sf-blue/10 rounded-lg text-sf-blue">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-white">Material de Apoio (PDF)</h4>
                        <p className="text-xs text-sf-text-muted">Clique para acessar</p>
                     </div>
                  </div>
                  <Download className="w-4 h-4 text-white/20" />
               </a>
            </div>
         )}

         {/* Description */}
         <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Sobre esta aula</h3>
            <p className="text-sf-text-muted leading-relaxed whitespace-pre-line">
               {activeAula?.description || "Nenhuma descrição disponível para esta aula."}
            </p>
         </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col pt-14">
         <div className="glass-card overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-6">
            <div className="p-4 border-b border-white/5 bg-white/5">
               <div className="flex justify-between items-end mb-2">
                  <h3 className="font-bold text-white">Seu Progresso</h3>
                  <span className="text-sm font-black text-sf-orange">{progressPercentage}%</span>
               </div>
               <div className="w-full bg-black/50 rounded-full h-2 mb-1 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    className="bg-gradient-to-r from-sf-orange to-fuchsia-500 h-full rounded-full"
                  ></motion.div>
               </div>
               <p className="text-[10px] text-sf-text-muted uppercase tracking-tighter">
                  {completedIds.size} de {filtered18aulas.length} aulas concluídas
               </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
               {Object.entries(aulasByModule.grouped).map(([moduleName, moduleAulas]) => (
                  <div key={moduleName} className="space-y-1">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 pt-2 pb-1">{moduleName}</h4>
                     {moduleAulas.map((aula) => (
                        <button 
                           key={aula.id}
                           onClick={() => setActiveAulaId(aula.id)}
                           className={cn(
                              "w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors group",
                              aula.id === activeAula?.id ? "bg-white/10 border border-white/20" : "hover:bg-white/5 border border-transparent"
                           )}
                        >
                           <div className="mt-0.5 shrink-0">
                              {getIcon(aula.id, aula.id === activeAula?.id)}
                           </div>
                           <div className="flex-1">
                              <h4 className={cn(
                                 "text-sm font-medium mb-1 line-clamp-2", 
                                 (aula.id === activeAula?.id || completedIds.has(aula.id)) ? "text-white" : "text-white/60"
                              )}>
                                 {aula.title}
                              </h4>
                           </div>
                        </button>
                     ))}
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
