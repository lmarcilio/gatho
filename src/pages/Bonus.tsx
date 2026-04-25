import { motion, AnimatePresence } from 'motion/react';
import { Gift, ExternalLink, PlaySquare, ArrowLeft, PlayCircle, FileText } from 'lucide-react';
import { useBonus, use18PlusMode } from '@/lib/storage';
import { useState, useMemo } from 'react';
import { cn, getEmbedUrl } from '@/lib/utils';

export default function Bonus() {
  const [bonus] = useBonus();
  const [is18PlusMode] = use18PlusMode();
  const filtered18bonus = is18PlusMode ? bonus : bonus.filter(item => !item.is18Plus);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeBonusId, setActiveBonusId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(filtered18bonus.map(b => b.category).filter(Boolean));
    return ['Todos', ...Array.from(cats).sort()];
  }, [filtered18bonus]);

  const filteredBonus = useMemo(() => {
    if (selectedCategory === 'Todos') return filtered18bonus;
    return filtered18bonus.filter(b => b.category === selectedCategory);
  }, [filtered18bonus, selectedCategory]);

  const activeBonus = useMemo(() => {
    return filtered18bonus.find(b => b.id === activeBonusId);
  }, [filtered18bonus, activeBonusId]);

  const getVideos = (item: any) => {
    const vids = [];
    if (item.videos && item.videos.length > 0) {
      vids.push(...item.videos);
    } else if (item.videoLink) {
      vids.push({ title: 'Vídeo Explicativo', url: item.videoLink });
    }
    return vids.filter((v: any) => v.url);
  };

  if (activeBonus) {
    const videos = getVideos(activeBonus);
    
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-[60vh] animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={() => setActiveBonusId(null)}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{activeBonus.title}</h1>
            
            {activeBonus.category && (
              <span className="inline-block text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-3 py-1.5 uppercase tracking-wider rounded">
                {activeBonus.category}
              </span>
            )}

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sobre este bônus</h3>
              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">{activeBonus.description}</p>
            </div>

            {videos.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlaySquare className="w-6 h-6 text-rose-500" />
                  Passo a Passo / Treinamento
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {videos.map((video, idx) => (
                    <div key={idx} className="bg-black border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                       {video.title && (
                          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                            <h4 className="font-bold text-white">{video.title}</h4>
                          </div>
                       )}
                       <div className="aspect-video w-full bg-black relative">
                         <iframe 
                            src={getEmbedUrl(video.url)} 
                            className="w-full h-full absolute inset-0 border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            title={video.title || "Video"}
                         />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 rounded-2xl sticky top-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Acesso ao Material</h3>
                <p className="text-sm text-gray-400 mb-8">
                  Clique no botão abaixo para acessar a ferramenta ou baixar este bônus exclusivo da sua assinatura.
                </p>

                {activeBonus.pageLink ? (
                  <a 
                    href={activeBonus.pageLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] text-base font-bold group"
                  >
                    Acessar Ferramenta <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <div className="w-full py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-center text-gray-500 text-sm font-bold">
                    Link não disponível
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-[60vh]">
      <div className="mb-10 text-center max-w-2xl mx-auto">
         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <Gift className="w-8 h-8 text-white" />
         </div>
         <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Meus Bônus</h1>
         <p className="text-sf-text-muted text-lg">
            Acesse seus materiais extras, páginas exclusivas e conteúdos especiais.
         </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all",
              selectedCategory === cat 
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]" 
                : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredBonus.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
           Nenhum bônus encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBonus.map((item, idx) => {
            const hasVideos = getVideos(item).length > 0;

            return (
              <motion.button 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setActiveBonusId(item.id)}
                className="glass-card p-6 flex flex-col h-full group hover:border-rose-500/50 transition-colors text-left relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 blur-2xl group-hover:bg-rose-500/20 transition-colors rounded-full" />
                
                <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                  <span className="text-[10px] bg-white/10 border border-white/10 font-bold px-2 py-1 uppercase tracking-wider rounded text-white group-hover:bg-rose-500/20 group-hover:text-rose-400 group-hover:border-rose-500/20 transition-colors">
                    {item.category || 'Bônus'}
                  </span>
                  
                  <div className="flex gap-2">
                     {hasVideos && <div className="text-rose-400"><PlaySquare className="w-4 h-4" /></div>}
                     {item.pageLink && <div className="text-blue-400"><ExternalLink className="w-4 h-4" /></div>}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3 relative z-10">{item.description}</p>
                
                <div className="mt-auto relative z-10 flex items-center gap-2 text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                   Acessar Bônus <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
