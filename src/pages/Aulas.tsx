import { motion } from 'motion/react';
import { GraduationCap, PlayCircle, Download, CheckCircle2, Circle, FileText, Image as ImageIcon } from 'lucide-react';
import { cn, getEmbedUrl } from '@/lib/utils';
import { useAulas, use18PlusMode } from '@/lib/storage';
import { useState, useEffect, useMemo } from 'react';

export default function Aulas() {
  const [aulas] = useAulas();
  const [is18PlusMode] = use18PlusMode();
  const filtered18aulas = is18PlusMode ? aulas : aulas.filter(item => !item.is18Plus);
  const [activeAulaId, setActiveAulaId] = useState<string | null>(null);

  useEffect(() => {
    if (filtered18aulas.length > 0 && !activeAulaId) {
      setActiveAulaId(filtered18aulas[0].id);
    }
  }, [filtered18aulas, activeAulaId]);

  const activeAula = useMemo(() => filtered18aulas.find(a => a.id === activeAulaId) || filtered18aulas[0], [filtered18aulas, activeAulaId]);

  const aulasByModule = useMemo(() => {
    const grouped: Record<string, typeof filtered18aulas> = {};
    const unmapped: typeof filtered18aulas = [];
    filtered18aulas.forEach(aula => {
      if (aula.module) {
        if (!grouped[aula.module]) grouped[aula.module] = [];
        grouped[aula.module].push(aula);
      } else {
        unmapped.push(aula);
      }
    });
    return { grouped, unmapped };
  }, [filtered18aulas]);

  const hasVideo = !!activeAula?.videoUrl || (activeAula?.type === 'video' && !!activeAula?.url);
  const hasImage = !!activeAula?.imageUrl;
  const hasPdf = !!activeAula?.pdfUrl || (activeAula?.type === 'pdf' && !!activeAula?.url);

  const videoUrl = activeAula?.videoUrl || (activeAula?.type === 'video' ? activeAula?.url : '') || '';
  const imageUrl = activeAula?.imageUrl || '';
  const pdfUrl = activeAula?.pdfUrl || (activeAula?.type === 'pdf' ? activeAula?.url : '') || '';

  const getIcon = (aula: any, isActive: boolean) => {
    const isVideo = !!aula.videoUrl || aula.type === 'video';
    const isImage = !!aula.imageUrl;
    const isPdf = !!aula.pdfUrl || aula.type === 'pdf';
    
    if (isVideo) return isActive ? <PlayCircle className="w-5 h-5 text-sf-orange animate-pulse" /> : <PlayCircle className="w-5 h-5 text-sf-orange/50 group-hover:text-sf-orange" />;
    if (isImage) return isActive ? <ImageIcon className="w-5 h-5 text-sf-purple animate-pulse" /> : <ImageIcon className="w-5 h-5 text-sf-purple/50 group-hover:text-sf-purple" />;
    if (isPdf) return isActive ? <FileText className="w-5 h-5 text-sf-blue animate-pulse" /> : <FileText className="w-5 h-5 text-sf-blue/50 group-hover:text-sf-blue" />;
    
    return isActive ? <Circle className="w-5 h-5 text-white/80 animate-pulse" /> : <Circle className="w-5 h-5 text-white/20 group-hover:text-white/40" />;
  };

  const getLabel = (aula: any) => {
    const types = [];
    if (aula.videoUrl || aula.type === 'video') types.push('Vídeo');
    if (aula.imageUrl) types.push('Imagem');
    if (aula.pdfUrl || aula.type === 'pdf') types.push('PDF');
    return types.length > 0 ? types.join(' + ') : 'Texto';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
         <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-sf-orange w-8 h-8" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Sala de Aula</h1>
         </div>

         {/* Content Wrapper */}
         <div className="aspect-video w-full bg-[#050505] rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative group bg-black flex items-center justify-center">
            {hasVideo ? (
               <iframe 
                  src={getEmbedUrl(videoUrl)} 
                  className="w-full h-full border-none z-0 relative"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  title={activeAula.title}
               />
            ) : hasImage ? (
               <img 
                  src={imageUrl} 
                  alt={activeAula?.title} 
                  className="w-full h-full object-contain"
               />
            ) : hasPdf ? (
               <iframe 
                  src={pdfUrl} 
                  className="w-full h-full border-none z-0 relative bg-white/5"
                  title={activeAula.title}
               />
            ) : (
               <div className="text-white/40 flex flex-col items-center gap-4 z-0 relative">
                  <Circle className="w-12 h-12 opacity-30" />
                  Nenhum conteúdo de mídia cadastrado para esta aula.
               </div>
            )}
            
            {(hasVideo || hasImage) && (
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

         {/* Extra Resources */}
         {hasPdf && (hasVideo || hasImage) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <a 
                  href={pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="glass-card p-4 hover:border-sf-blue/40 hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer"
               >
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-sf-blue/10 rounded-lg text-sf-blue group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div className="text-left">
                        <h4 className="font-semibold text-white">Material de Apoio (PDF)</h4>
                        <p className="text-xs text-sf-text-muted">Faça o download do conteúdo</p>
                     </div>
                  </div>
                  <Download className="w-4 h-4 text-white/20 group-hover:text-sf-blue transition-colors" />
               </a>
            </div>
         )}

         {/* Description */}
         <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">
               Sobre {(!hasVideo && !hasImage && hasPdf) ? 'este material' : 'esta aula'}
            </h3>
            <p className="text-sf-text-muted leading-relaxed whitespace-pre-line">
               {activeAula?.description || `Nesta aula, ${activeAula?.title.toLowerCase()} será o foco. Adquira as técnicas avançadas e eleve seu conhecimento prático agora mesmo.`}
            </p>
         </div>
      </div>

      {/* Sidebar - Playlist */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col pt-14">
         <div className="glass-card overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-6">
            <div className="p-4 border-b border-white/5 bg-white/5">
               <h3 className="font-bold text-white mb-2">Trilha de Aprendizado</h3>
               <div className="w-full bg-black/50 rounded-full h-1.5 mb-1">
                  <div className="bg-gradient-to-r from-sf-orange to-sf-purple h-1.5 rounded-full" style={{ width: aulas.length > 0 ? `${(1 / aulas.length) * 100}%` : '0%' }}></div>
               </div>
               <p className="text-xs text-sf-text-muted">Progresso dependente das visualizações</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-4">
               {aulas.length === 0 && (
                  <p className="text-center text-sm text-white/50 py-10">Nenhuma aula encontrada.</p>
               )}
               {Object.entries(aulasByModule.grouped).map(([moduleName, moduleAulas]) => (
                  <div key={moduleName} className="space-y-1">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 pt-2 pb-1">{moduleName}</h4>
                     {(moduleAulas as any[]).map((aula: any) => (
                        <button 
                           key={aula.id}
                           onClick={() => setActiveAulaId(aula.id)}
                           className={cn(
                              "w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors group",
                              aula.id === activeAula?.id ? "bg-white/10 border border-white/20 shadow-inner" : "hover:bg-white/5 border border-transparent"
                           )}
                        >
                           <div className="mt-0.5 shrink-0">
                              {getIcon(aula, aula.id === activeAula?.id)}
                           </div>
                           <div>
                              <h4 className={cn(
                                 "text-sm font-medium mb-1 line-clamp-2", 
                                 (aula.id === activeAula?.id) ? "text-white" : "text-white/80"
                              )}>
                                 {aula.title}
                              </h4>
                              <span className="text-[10px] text-sf-text-muted uppercase tracking-wider">
                                 {getLabel(aula)}
                              </span>
                           </div>
                        </button>
                     ))}
                  </div>
               ))}
               
               {aulasByModule.unmapped.length > 0 && (
                  <div className="space-y-1">
                     {Object.keys(aulasByModule.grouped).length > 0 && (
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 pt-2 pb-1">Outros</h4>
                     )}
                     {aulasByModule.unmapped.map((aula) => (
                        <button 
                           key={aula.id}
                           onClick={() => setActiveAulaId(aula.id)}
                           className={cn(
                              "w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors group",
                              aula.id === activeAula?.id ? "bg-white/10 border border-white/20 shadow-inner" : "hover:bg-white/5 border border-transparent"
                           )}
                        >
                           <div className="mt-0.5 shrink-0">
                              {getIcon(aula, aula.id === activeAula?.id)}
                           </div>
                           <div>
                              <h4 className={cn(
                                 "text-sm font-medium mb-1 line-clamp-2", 
                                 (aula.id === activeAula?.id) ? "text-white" : "text-white/80"
                              )}>
                                 {aula.title}
                              </h4>
                              <span className="text-[10px] text-sf-text-muted uppercase tracking-wider">
                                  {getLabel(aula)}
                              </span>
                           </div>
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
      
    </div>
  );
}
