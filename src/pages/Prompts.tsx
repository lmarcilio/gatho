import { motion } from 'motion/react';
import { Copy, Terminal, Search, Star, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { use18PlusMode } from '@/lib/storage';
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

const categories = ["Todas", "Copywriting", "Imagens", "Vídeos", "Pesquisa e Análise", "Código"];

export default function Prompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [is18PlusMode] = use18PlusMode();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [activeType, setActiveType] = useState("Todas");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Carregar dados reais do Supabase
  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrompts(data || []);
      } catch (err) {
        console.error('Erro ao buscar prompts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  // Filtra prompts baseado no modo +18 do usuário
  const filtered18prompts = useMemo(() => {
    return is18PlusMode ? prompts : prompts.filter(item => !item.is_18_plus);
  }, [prompts, is18PlusMode]);

  // Extrai dinamicamente as IAs baseadas nos prompts que ESTÃO no banco
  const availableTargetAIs = useMemo(() => {
    const types = new Set<string>();
    types.add("Todas");
    filtered18prompts.forEach(p => {
      if (p.ai_type) types.add(p.ai_type);
    });
    return Array.from(types).sort();
  }, [filtered18prompts]);

  const filteredPrompts = useMemo(() => {
    return filtered18prompts.filter(prompt => {
      const matchCategory = activeCategory === "Todas" || prompt.category === activeCategory;
      const matchType = activeType === "Todas" || prompt.ai_type === activeType;
      const matchSubcategory = !activeSubcategory || prompt.subcategory === activeSubcategory;
      
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = prompt.title.toLowerCase().includes(searchLower) || 
                          prompt.prompt_text.toLowerCase().includes(searchLower) ||
                          (prompt.subcategory?.toLowerCase() || "").includes(searchLower) ||
                          prompt.ai_type.toLowerCase().includes(searchLower);

      return matchCategory && matchType && matchSubcategory && matchSearch;
    });
  }, [filtered18prompts, activeCategory, activeType, activeSubcategory, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
  };

  const handleCopy = (id: string, text: string) => {
    setCopiedId(id);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading && prompts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-12 h-12 text-sf-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Terminal className="text-sf-blue w-8 h-8" />
            Biblioteca de Prompts (Real-time)
          </h1>
          <p className="text-sf-text-muted max-w-xl">
            Abaixo estão os prompts sincronizados diretamente do banco de dados central.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input 
               type="text" 
               placeholder="Buscar no banco..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-sf-blue/50 focus:bg-white/10 transition-colors" 
             />
           </div>
        </div>
      </div>

      {/* IA Alvo Filter */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 mb-2 px-1">
          <Filter className="w-4 h-4 text-sf-blue" />
          <span className="text-xs font-bold text-sf-text-muted uppercase tracking-widest">IA Alvo</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableTargetAIs.map((type) => (
            <button 
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tighter border",
                activeType === type 
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  : "bg-white/5 text-sf-text-muted hover:bg-white/10 hover:text-white border-white/10"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 mb-2 px-1">
          <Star className="w-4 h-4 text-sf-purple" />
          <span className="text-xs font-bold text-sf-text-muted uppercase tracking-widest">Categoria</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === cat 
                  ? "bg-sf-blue text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]" 
                  : "bg-white/5 text-sf-text-muted hover:bg-white/10 hover:text-white border border-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Subcategorias dinâmicas */}
        {activeCategory !== "Todas" && (
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                !activeSubcategory ? "bg-sf-blue/20 text-sf-blue border-sf-blue/30" : "bg-transparent text-gray-500 border-white/10"
              )}
            >
              Ver Tudo
            </button>
            {Array.from(new Set(filtered18prompts.filter(p => p.category === activeCategory && p.subcategory).map(p => p.subcategory))).sort().map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSubcategory(sub)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  activeSubcategory === sub ? "bg-sf-blue/20 text-sf-blue border-sf-blue/30" : "bg-transparent text-sf-text-muted hover:text-white border-white/10"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Prompts List */}
      <div className="space-y-4">
         {filteredPrompts.length === 0 ? (
           <div className="py-20 text-center text-sf-text-muted border border-dashed border-white/10 rounded-2xl">
              <Terminal className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p>Nenhum prompt encontrado no banco de dados.</p>
           </div>
         ) : (
           filteredPrompts.map((prompt, idx) => (
            <motion.div 
               key={prompt.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.05 * idx }}
               className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-sf-blue/40 transition-colors group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-sf-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

               <div className="flex-1 space-y-2 z-10 w-full">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                     <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded bg-white/10 border border-white/20 text-white shadow-sm">
                       {prompt.ai_type}
                     </span>
                     <span className={cn(
                        "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border backdrop-blur-sm",
                        prompt.category === 'Copywriting' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' :
                        prompt.category === 'Imagens' ? 'bg-sf-purple/10 border-sf-purple/20 text-sf-purple' :
                        prompt.category === 'Vídeos' ? 'bg-sf-orange/10 border-sf-orange/20 text-sf-orange' :
                        prompt.category === 'Código' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        'bg-sf-blue/10 border-sf-blue/20 text-sf-blue'
                     )}>
                       {prompt.category}
                     </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-sf-blue transition-colors">{prompt.title}</h3>
                  <div className="bg-[#050505] inset-shadow-sm border border-white/5 rounded-lg p-3 mt-3 relative font-mono text-sm text-sf-text-muted/80 line-clamp-2">
                     {prompt.prompt_text}
                     <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050505] to-transparent rounded-r-lg" />
                  </div>
               </div>

               <div className="w-full md:w-auto flex md:flex-col gap-3 justify-end shrink-0 z-10">
                  <button 
                     onClick={() => handleCopy(prompt.id, prompt.prompt_text)}
                     className={cn(
                        "w-full md:w-32 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300",
                        copiedId === prompt.id 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-sf-blue/10 hover:bg-sf-blue/20 text-sf-blue border border-sf-blue/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                     )}
                  >
                     {copiedId === prompt.id ? "Copiado!" : <><Copy className="w-4 h-4" /> Copiar</>}
                  </button>
               </div>
            </motion.div>
          ))
         )}
      </div>
    </div>
  );
}
