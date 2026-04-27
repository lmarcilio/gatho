import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Wrench, ArrowUpRight, Bookmark, PlayCircle, ArrowLeft, PlaySquare, ExternalLink, Loader2 } from 'lucide-react';
import { cn, getEmbedUrl } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { use18PlusMode } from '@/lib/storage';

const categories = ["Todas", "Imagem", "Texto/Código", "Vídeo", "Áudio", "Automação", "Pesquisa"];

export default function Ferramentas() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [is18PlusMode] = use18PlusMode();
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTools(data || []);
      } catch (err) {
        console.error('Erro ao buscar ferramentas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const filtered18tools = useMemo(() => {
    return is18PlusMode ? tools : tools.filter(item => !item.is18Plus);
  }, [tools, is18PlusMode]);

  const filteredTools = useMemo(() => {
    return filtered18tools.filter(tool => {
      const matchCategory = activeCategory === "Todas" || tool.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = tool.name.toLowerCase().includes(searchLower) || 
                          (tool.desc?.toLowerCase() || "").includes(searchLower);
      return matchCategory && matchSearch;
    });
  }, [filtered18tools, activeCategory, searchQuery]);

  const activeTool = useMemo(() => {
    return filtered18tools.find(t => t.id === activeToolId);
  }, [filtered18tools, activeToolId]);

  if (activeTool) {
    const videos = activeTool.videos || [];
    
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-[60vh] animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={() => setActiveToolId(null)}
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-white/70 hover:text-white mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              <img src={activeTool.img || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80"} alt={activeTool.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
              {activeTool.name}
            </h1>
            
            <div className="flex gap-2">
              <span className="inline-block text-xs bg-sf-purple/10 border border-sf-purple/20 text-sf-purple font-bold px-3 py-1.5 uppercase tracking-wider rounded">
                {activeTool.category}
              </span>
              {activeTool.is_popular && (
                <span className="inline-block text-xs bg-sf-orange/10 border border-sf-orange/20 text-sf-orange font-bold px-3 py-1.5 uppercase tracking-wider rounded">
                  Popular
                </span>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sobre a Ferramenta</h3>
              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">{activeTool.desc}</p>
            </div>

            {videos.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlaySquare className="w-6 h-6 text-sf-purple" />
                  Tutoriais / Demonstração
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {videos.map((video: any, idx: number) => (
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
                <div className="w-16 h-16 rounded-2xl bg-sf-purple/20 flex items-center justify-center mb-6 border border-sf-purple/30 shadow-[0_0_30px_rgba(192,38,211,0.2)]">
                  <Wrench className="w-8 h-8 text-sf-purple" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Acesso à Ferramenta</h3>
                <p className="text-sm text-gray-400 mb-8">
                  Clique no botão abaixo para acessar o site oficial e usar esta ferramenta.
                </p>

                {activeTool.url ? (
                  <a 
                    href={activeTool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-sf-purple text-white hover:bg-sf-purple/90 transition-all shadow-[0_0_20px_rgba(192,38,211,0.4)] text-base font-bold group"
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wrench className="text-sf-purple w-8 h-8" />
            Diretório de Ferramentas
          </h1>
          <p className="text-sf-text-muted max-w-xl">
            Explore e acesse as melhores ferramentas de IA do mercado, curadas e categorizadas para impulsionar seus resultados.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input 
               type="text" 
               placeholder="Buscar ferramenta..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-sf-purple/50 focus:bg-white/10 transition-colors"
             />
           </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === cat 
                ? "bg-sf-purple text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]" 
                : "bg-white/5 text-sf-text-muted hover:bg-white/10 hover:text-white border border-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-sf-purple animate-spin" />
              <p className="text-sf-text-muted">Carregando ferramentas do banco...</p>
           </div>
        ) : filteredTools.length === 0 ? (
           <div className="col-span-full py-20 text-center text-sf-text-muted border border-dashed border-white/10 rounded-2xl">
              <Wrench className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p>Nenhuma ferramenta encontrada para o seu filtro.</p>
           </div>
        ) : (
          filteredTools.map((tool, idx) => {
            const hasVideos = tool.videos && tool.videos.length > 0;
            return (
              <motion.button 
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                onClick={() => setActiveToolId(tool.id)}
                className="glass-card overflow-hidden group hover:border-sf-purple/40 hover:shadow-neon-purple transition-all duration-300 flex flex-col text-left"
              >
                {/* Image header */}
                <div className="h-48 relative overflow-hidden w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
                  <img 
                    src={tool.img || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80"} 
                    alt={tool.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                      {tool.category}
                    </span>
                    {tool.is_popular && (
                        <span className="bg-sf-purple/10 backdrop-blur-md border border-sf-purple/20 text-sf-purple text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                          Popular
                        </span>
                    )}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col w-full relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sf-purple transition-colors">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-sf-text-muted mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {tool.desc || "Sem descrição disponível."}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-auto text-sm font-bold text-white group-hover:text-sf-purple transition-colors">
                      Detalhes e Acesso <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
