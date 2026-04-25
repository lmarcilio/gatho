import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Video, FileText, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTools, usePrompts, useAulas, use18PlusMode } from '@/lib/storage';

export default function Dashboard() {
  const [tools] = useTools();
  const [prompts] = usePrompts();
  const [aulas] = useAulas();
  const [is18PlusMode] = use18PlusMode();

  const filteredTools = is18PlusMode ? tools : tools.filter(t => !t.is18Plus);
  const ObjectPrompts = is18PlusMode ? prompts : prompts.filter(p => !p.is18Plus);
  const filteredAulas = is18PlusMode ? aulas : aulas.filter(a => !a.is18Plus);

  const recentTool = filteredTools[filteredTools.length - 1];
  const recentPrompt = ObjectPrompts[ObjectPrompts.length - 1];
  const recentAula = filteredAulas[filteredAulas.length - 1];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card p-8 border-neon-purple relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sf-purple/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sf-blue/10 border border-sf-blue/20 text-sf-blue text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> Novidades
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Bem-vindo ao <span className="text-gradient-neon">GATHO</span>
          </h1>
          <p className="text-sf-text-muted text-lg leading-relaxed">
            Sua jornada para dominar a Inteligência Artificial começa aqui. 
            Acesse ferramentas, copie prompts testados e aprenda rápido com nossas aulas.
          </p>
          <div className="flex gap-4 pt-2">
            <NavLink to="/dashboard/ferramentas" className="btn-neon-primary text-sm font-semibold group space-x-2">
              <span>Explorar Ferramentas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>
        <div className="z-10 hidden lg:block">
           <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" alt="AI Abstract" className="max-w-[300px] rounded-2xl border border-white/10 shadow-2xl opacity-80" />
        </div>
      </motion.div>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Ferramentas Ativas", value: tools.length.toString(), icon: Wrench, color: "text-sf-purple", bg: "bg-sf-purple/10", border: "border-sf-purple/20" },
          { title: "Prompts na Biblioteca", value: prompts.length.toString(), icon: FileText, color: "text-sf-blue", bg: "bg-sf-blue/10", border: "border-sf-blue/20" },
          { title: "Aulas", value: aulas.length.toString(), icon: Video, color: "text-sf-orange", bg: "bg-sf-orange/10", border: "border-sf-orange/20" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1) }}
            className={`glass-card p-6 border ${stat.border} hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sf-text-muted font-medium mb-2">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity/Highlights */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
      >
        <h2 className="text-xs font-black tracking-widest text-sf-orange uppercase mb-6 flex items-center gap-2">
          Adicionados Recentemente <Sparkles className="w-5 h-5 text-sf-orange" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           
           {recentTool && (
             <NavLink to="/dashboard/ferramentas" className="glass-card p-5 group cursor-pointer hover:border-sf-purple/50 transition-colors">
                <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/5 overflow-hidden relative">
                  {recentTool.img ? (
                    <img src={recentTool.img} alt={recentTool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Wrench className="w-8 h-8 text-white/20 group-hover:text-sf-purple transition-colors" />
                  )}
                </div>
                <span className="text-xs text-sf-purple font-medium uppercase tracking-wider">Ferramenta</span>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-sf-purple transition-colors">{recentTool.name}</h4>
             </NavLink>
           )}
           
           {recentPrompt && (
             <NavLink to="/dashboard/prompts" className="glass-card p-5 group cursor-pointer hover:border-sf-blue/50 transition-colors">
                <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/5">
                   <FileText className="w-8 h-8 text-white/20 group-hover:text-sf-blue transition-colors" />
                </div>
                <span className="text-xs text-sf-blue font-medium uppercase tracking-wider">Prompt ({recentPrompt.type})</span>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-sf-blue transition-colors">{recentPrompt.title}</h4>
             </NavLink>
           )}

           {recentAula && (
             <NavLink to="/dashboard/aulas" className="glass-card p-5 group cursor-pointer hover:border-sf-orange/50 transition-colors">
                <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-sf-orange transition-colors z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616161560417-66d4aba5ce44?q=80&w=400&auto=format&fit=crop')] opacity-20 group-hover:opacity-40 transition-opacity bg-cover bg-center" />
                </div>
                <span className="text-xs text-sf-orange font-medium uppercase tracking-wider">Aula Prática</span>
                <h4 className="text-lg font-bold text-white mt-1 group-hover:text-sf-orange transition-colors">{recentAula.title}</h4>
             </NavLink>
           )}

           <NavLink to="/dashboard/ferramentas" className="glass-card p-5 group cursor-pointer hover:border-sf-purple/50 transition-colors flex items-center justify-center border-dashed border-2 border-white/10 hover:border-sf-purple/30 hover:bg-sf-purple/5">
              <div className="text-center">
                <ArrowRight className="w-8 h-8 text-white/40 mx-auto mb-2 group-hover:text-sf-purple transition-colors group-hover:translate-x-1" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Ver tudo</span>
              </div>
           </NavLink>
        </div>
      </motion.div>
    </div>
  );
}
