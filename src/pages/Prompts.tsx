import { motion } from 'motion/react';
import { Copy, Terminal, Search, Star, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { usePrompts, use18PlusMode } from '@/lib/storage';

const categories = ["Todas", "Copywriting", "Imagens", "Vídeos", "Pesquisa e Análise", "Código"];

export default function Prompts() {
  const [prompts] = usePrompts();
  const [is18PlusMode] = use18PlusMode();
  const filtered18prompts = is18PlusMode ? prompts : prompts.filter(item => !item.is18Plus);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const subcategories = useMemo(() => {
    if (activeCategory === "Todas") return [];
    
    const subs = new Set<string>();
    filtered18prompts.forEach(p => {
      if (p.category === activeCategory && p.subcategory) {
        subs.add(p.subcategory);
      }
    });
    return Array.from(subs).sort();
  }, [filtered18prompts, activeCategory]);

  const filteredPrompts = useMemo(() => {
    return filtered18prompts.filter(prompt => {
      const matchCategory = activeCategory === "Todas" || prompt.category === activeCategory;
      const matchSubcategory = !activeSubcategory || prompt.subcategory === activeSubcategory;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = prompt.title.toLowerCase().includes(searchLower) || 
                          (prompt.copy?.toLowerCase() || "").includes(searchLower) ||
                          (prompt.subcategory?.toLowerCase() || "").includes(searchLower);
      return matchCategory && matchSubcategory && matchSearch;
    });
  }, [filtered18prompts, activeCategory, activeSubcategory, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubcategory(null);
  };

  const handleCopy = (id: string, text: string) => {
    setCopiedId(id);
    navigator.clipboard.writeText(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Terminal className="text-sf-blue w-8 h-8" />
            Biblioteca de Prompts
          </h1>
          <p className="text-sf-text-muted max-w-xl">
            Copie e cole prompts testados em batalha para obter os melhores resultados das IAs instantaneamente.
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
             <input 
               type="text" 
               placeholder="Buscar palavra-chave..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-sf-blue/50 focus:bg-white/10 transition-colors" 
             />
           </div>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="space-y-4 mb-6">
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
        
        {subcategories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {subcategories.map((subcat) => (
              <button 
                key={subcat}
                onClick={() => setActiveSubcategory(activeSubcategory === subcat ? null : subcat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  activeSubcategory === subcat 
                    ? "bg-sf-blue/20 text-sf-blue border-sf-blue/30" 
                    : "bg-transparent text-sf-text-muted hover:bg-white/5 hover:text-white border-white/10"
                )}
              >
                {subcat}
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
              <p>Nenhum prompt encontrado para o seu filtro.</p>
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
               {/* Hover gradient effect inside card */}
               <div className="absolute inset-0 bg-gradient-to-r from-sf-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

               <div className="flex-1 space-y-2 z-10 w-full">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                     {prompt.copy}
                     {/* Fade out text */}
                     <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050505] to-transparent rounded-r-lg" />
                  </div>
               </div>

               <div className="w-full md:w-auto flex md:flex-col gap-3 justify-end shrink-0 z-10">
                  <button 
                     onClick={() => handleCopy(prompt.id, prompt.copy)}
                     className={cn(
                        "w-full md:w-32 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300",
                        copiedId === prompt.id 
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-sf-blue/10 hover:bg-sf-blue/20 text-sf-blue border border-sf-blue/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                     )}
                  >
                     {copiedId === prompt.id ? (
                        <>Copiado!</>
                     ) : (
                        <><Copy className="w-4 h-4" /> Copiar</>
                     )}
                  </button>
               </div>
            </motion.div>
          ))
         )}
      </div>
    </div>
  );
}
