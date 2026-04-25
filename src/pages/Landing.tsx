import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, Video, BookOpen, Gift, ShieldAlert, Star, Check, ArrowRight, Zap, Flame, Infinity, Shield, Lock } from 'lucide-react';
import { useConfig } from '@/lib/storage';

export default function Landing() {
  const [config] = useConfig();
  
  // Use uploaded logo if available, otherwise fallback to the neon cat SVG
  const hasLogo = !!config.logoUrl;
  const logoHeight = config.logoHeight ? `${config.logoHeight}px` : '40px';
  const plans = [
    {
      name: "Mensal",
      price: "R$ 47",
      period: "/mês",
      popular: false,
      features: [
        "Acesso completo a Ferramentas de IA",
        "Biblioteca de Prompts (+1000)",
        "Todos os Cursos Oficiais",
        "Aulas e Tutoriais",
        "Atualizações Regulares",
      ]
    },
    {
      name: "Anual VIP",
      price: "R$ 297",
      period: "/ano",
      popular: true,
      features: [
        "Tudo do plano Mensal",
        "Bônus Exclusivos Premium",
        "Acesso à Área +18 VIP",
        "Suporte Prioritário",
        "Acesso a novas features primeiro",
      ]
    }
  ];

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-fuchsia-500/30">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative">
                {hasLogo ? (
                   <img 
                     src={config.logoUrl} 
                     alt="Logo" 
                     style={{ height: logoHeight }}
                     className="object-contain drop-shadow-[0_0_10px_rgba(192,38,211,0.5)]" 
                   />
                ) : (
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(192,38,211,0.5)]">
                      <defs>
                         <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c026d3" />
                            <stop offset="1" stopColor="#e81cff" />
                         </linearGradient>
                      </defs>
                      <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8918 4.6565 13.63 5.75 14.99L5 22L8.5 19H12H15.5L19 22L18.25 14.99C19.3435 13.63 20 11.8918 20 10C20 5.58172 16.4183 2 12 2Z" />
                      {/* Olhos vermelhos */}
                      <circle cx="8.5" cy="9.5" r="1.5" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)]" stroke="none" />
                      <circle cx="15.5" cy="9.5" r="1.5" fill="#ef4444" className="drop-shadow-[0_0_8px_rgba(239,68,68,1)]" stroke="none" />
                   </svg>
                )}
             </div>
             {!hasLogo && <span className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">GATHO</span>}
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
             <a href="#ferramentas" className="hover:text-white transition-colors">Ferramentas</a>
             <a href="#prompts" className="hover:text-white transition-colors">Prompts</a>
             <a href="#cursos" className="hover:text-white transition-colors">Cursos</a>
             <a href="#area18" className="hover:text-fuchsia-400 transition-colors">Área +18</a>
          </div>
          <div className="flex gap-4">
             <Link to="/login" className="px-5 py-2.5 rounded-lg font-bold text-white hover:bg-white/5 transition-colors hidden md:block">Login</Link>
             <a href="#planos" className="px-6 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(192,38,211,0.4)]">
                Assinar Agora
             </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-screen">
         {/* Background Effects */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="flex justify-center mb-8"
            >
               <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-48 h-48 bg-black border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                     {hasLogo ? (
                        <img 
                           src={config.logoUrl} 
                           alt="Logo"
                           className="w-full h-full object-cover drop-shadow-[0_0_15px_rgba(192,38,211,0.6)]" 
                        />
                     ) : (
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="url(#paint1_linear)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                           <defs>
                              <linearGradient id="paint1_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                 <stop stopColor="#c026d3" />
                                 <stop offset="1" stopColor="#e81cff" />
                              </linearGradient>
                           </defs>
                           <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8918 4.6565 13.63 5.75 14.99L5 22L8.5 19H12H15.5L19 22L18.25 14.99C19.3435 13.63 20 11.8918 20 10C20 5.58172 16.4183 2 12 2Z" />
                           <circle cx="8.5" cy="9.5" r="2" fill="#ef4444" className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse" stroke="none" />
                           <circle cx="15.5" cy="9.5" r="2" fill="#ef4444" className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse" stroke="none" />
                        </svg>
                     )}
                  </div>
               </div>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter"
            >
               O UNIVERSO <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500">GATHO</span>
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, delay: 0.3 }}
               className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
            >
               A plataforma definitiva de Inteligência Artificial. Ferramentas poderosas, prompts profissionais, cursos, bônus e uma área <span className="text-fuchsia-400 font-bold border-b border-fuchsia-400/30 border-dashed">+18 irresistível</span>.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, delay: 0.4 }}
               className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
               <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(192,38,211,0.4)] text-lg flex items-center justify-center gap-2 group">
                  Entrar na Plataforma <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <a href="#planos" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-lg flex items-center justify-center">
                  Ver Planos
               </a>
            </motion.div>
         </div>
      </section>

      {/* 1. Ferramentas de IA */}
      <section id="ferramentas" className="py-24 relative overflow-hidden bg-black/40 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 mx-auto flex items-center justify-center mb-6 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(192,38,211,0.2)]">
                  <Zap className="w-8 h-8 text-fuchsia-400" />
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Poder Além dos Limites</h2>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto">Um diretório selecionado com as mais poderosas ferramentas de Inteligência Artificial do mundo em um só lugar.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { icon: Sparkles, title: "Geração de Imagens", desc: "Ferramentas para criar visuais impressionantes e fotorrealistas." },
                  { icon: Terminal, title: "Código & Texto", desc: "Modelos avançados para copywriting e desenvolvimento rápido." },
                  { icon: Video, title: "Automação e Vídeo", desc: "Edição por IA, fluxos automatizados e criação audiovisual." }
               ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-fuchsia-500/30 transition-all group shadow-xl">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40 transition-colors">
                        <item.icon className="w-6 h-6 text-gray-400 group-hover:text-fuchsia-400" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                     <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 2 & 3. Prompts e Cursos */}
      <section id="prompts" className="py-24 relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-wider mb-6">
                  <Terminal className="w-4 h-4" /> ENGENHARIA DE PROMPT
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">A Biblioteca Mais Completa</h2>
               <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Não perca tempo tentando acertar. Acesse mais de 1.000 prompts mastigados e testados por especialistas em ChatGPT, Claude, Midjourney e muito mais. Basta copiar, colar e gerar resultados profissionais.
               </p>
               <ul className="space-y-4 mb-8">
                  {['Copywriting e Vendas', 'Design e Imagens', 'Desenvolvimento', 'Análise de Dados'].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                        <Check className="w-5 h-5 text-blue-500" /> {item}
                     </li>
                  ))}
               </ul>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
               <div className="relative bg-black/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 font-mono text-sm text-gray-300 shadow-2xl">
                  <div className="flex gap-2 mb-4">
                     <div className="w-3 h-3 rounded-full bg-red-500/50" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                     <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <p className="text-blue-400 mb-2"># Contexto: Copywriter Black Belt</p>
                  <p className="text-emerald-400 mb-2">&gt; Atue como um especialista em persuasão de alto nível.</p>
                  <p className="mb-2">Escreva uma VSL para o meu produto de...</p>
                  <p className="text-fuchsia-400 mt-4 animate-pulse">Gerando estrutura vencedora...</p>
               </div>
            </div>
         </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="py-24 relative bg-white/[0.02] border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1 grid grid-cols-2 gap-4 relative">
               <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
               <div className="space-y-4 relative z-10">
                  <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
                     <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
                     <h4 className="text-white font-bold mb-2">Fundamentos de IA</h4>
                     <p className="text-sm text-gray-400">12 Aulas • 3h 40m</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 backdrop-blur-xl p-6 rounded-2xl shadow-xl mt-4">
                     <Video className="w-8 h-8 text-purple-400 mb-4" />
                     <h4 className="text-white font-bold mb-2">Midjourney Avançado</h4>
                     <p className="text-sm text-gray-400">Certificado Incluso</p>
                  </div>
               </div>
               <div className="space-y-4 pt-8 relative z-10">
                  <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl">
                     <Star className="w-8 h-8 text-yellow-400 mb-4" />
                     <h4 className="text-white font-bold mb-2">Parceiros Oficiais</h4>
                     <p className="text-sm text-gray-400">Descontos VIP</p>
                  </div>
               </div>
            </div>
            
            <div className="order-1 md:order-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold tracking-wider mb-6">
                  <BookOpen className="w-4 h-4" /> APRENDIZADO CONTÍNUO
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Aulas e Cursos Profissionais</h2>
               <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  Trilhas de conhecimento desde o absoluto zero até o nível sênior. Hospedamos as melhores aulas sobre as IA do mercado, mais recomendações VIP de treinamentos dos maiores parceiros do Brasil.
               </p>
               <a href="#planos" className="inline-flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Explorar trilhas de estudo <ArrowRight className="w-4 h-4" />
               </a>
            </div>
         </div>
      </section>

      {/* 5. Área +18 */}
      <section id="area18" className="py-32 relative overflow-hidden bg-black">
         {/* Sexy Cyberpunk Accents */}
         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />
         <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
         
         <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
            
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-red-600 to-pink-600 rounded-full p-[4px] mb-8 shadow-[0_0_40px_rgba(225,29,72,0.4)] text-red-500">
               <div className="w-full h-full bg-black rounded-full items-center justify-center flex overflow-hidden">
                  {config.logo18Url ? (
                     <img src={config.logo18Url} alt="Logo +18" className="w-full h-full object-cover" />
                  ) : (
                     <Flame className="w-16 h-16 text-pink-500" />
                  )}
               </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-fuchsia-500 mb-6 tracking-tight">
               O Lado Oculto da IA
            </h2>
            <h3 className="text-2xl font-bold text-white mb-8 tracking-widest uppercase">Área Exclusiva +18</h3>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
               Uma zona secreta reservada para assinantes VIP. Tecnologias sem censura, geradores de arte sem restrições, deep-dive em conteúdos obscuros e sedutores. Protegido por uma chave criptografada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
               <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-2xl backdrop-blur-md">
                  <ShieldAlert className="w-6 h-6 text-red-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-1">Sem Censura</h4>
                  <p className="text-xs text-gray-400">IA sem as limitações éticas padrão (NSFW).</p>
               </div>
               <div className="bg-pink-950/20 border border-pink-500/20 p-6 rounded-2xl backdrop-blur-md">
                  <Infinity className="w-6 h-6 text-pink-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-pink-400 mb-1">Arte Realista</h4>
                  <p className="text-xs text-gray-400">Prompts master class para anatomia e estilo ad*lto.</p>
               </div>
               <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 p-6 rounded-2xl backdrop-blur-md">
                  <Lock className="w-6 h-6 text-fuchsia-500 mx-auto mb-3" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-fuchsia-400 mb-1">Total Privacidade</h4>
                  <p className="text-xs text-gray-400">Seu histórico na Área +18 nunca é rastreado.</p>
               </div>
            </div>

            <div className="inline-flex flex-col items-center">
               <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase mb-2">Acesso Restrito</span>
               <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-full flex items-center gap-3 backdrop-blur-sm shadow-xl">
                   <Lock className="w-4 h-4 text-gray-400" />
                   <span className="text-sm font-bold text-gray-300">Desbloqueado apenas no Plano VIP</span>
               </div>
            </div>
         </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-24 relative bg-black/50 border-t border-white/5">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Escolha Seu Acesso</h2>
               <p className="text-xl text-gray-400">Desbloqueie todo o poder da inteligência artificial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               {plans.map((plan, i) => (
                  <div key={i} className={`relative p-8 rounded-3xl backdrop-blur-md transition-all duration-300 ${plan.popular ? 'bg-gradient-to-b from-fuchsia-900/30 to-black border-2 border-fuchsia-500/50 shadow-[0_0_40px_rgba(192,38,211,0.2)] lg:-translate-y-4' : 'bg-white/5 border border-white/10'}`}>
                     {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                           Mais Popular
                        </div>
                     )}
                     
                     <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-end justify-center gap-1">
                           <span className="text-5xl font-black text-white tracking-tighter">{plan.price}</span>
                           <span className="text-gray-400 font-medium mb-1">{plan.period}</span>
                        </div>
                     </div>

                     <div className="space-y-4 mb-8">
                        {plan.features.map((feat, idx) => (
                           <div key={idx} className="flex items-start gap-3">
                              <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-fuchsia-400' : 'text-gray-400'}`} />
                              <span className="text-gray-300">{feat}</span>
                           </div>
                        ))}
                     </div>

                     <Link 
                        to="/login" 
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${plan.popular ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                     >
                        Quero este plano
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#0A0A0A] text-center">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
               {hasLogo ? (
                  <img src={config.logoUrl} alt="Logo" className="h-6 w-auto grayscale" />
               ) : (
                  <>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8918 4.6565 13.63 5.75 14.99L5 22L8.5 19H12H15.5L19 22L18.25 14.99C19.3435 13.63 20 11.8918 20 10C20 5.58172 16.4183 2 12 2Z" />
                     </svg>
                     <span className="font-bold tracking-widest text-lg">GATHO</span>
                  </>
               )}
            </div>
            <p className="text-gray-500 text-sm">
               © {new Date().getFullYear()} GATHO Plataforma. Todos os direitos reservados.
            </p>
         </div>
      </footer>
    </div>
  );
}
