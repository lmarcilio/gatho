import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, KeyRound, Cat, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useConfig } from '@/lib/storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config] = useConfig();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sf-text-muted hover:text-white transition-colors font-bold group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar para a Home
      </Link>

      {/* Background blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sf-purple/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sf-blue/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-1 mb-6">
            {config.logoUrl ? (
               <img src={config.logoUrl} alt={config.title} className="object-contain" style={{ height: `${(config.logoHeight || 32) * 2}px` }} />
            ) : (
               <>
                 <span className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">GATH</span>
                 <Cat className="w-14 h-14 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
               </>
            )}
          </div>
          <p className="text-sf-text-muted text-lg">Acesse a sua biblioteca de IA.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
           {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
                 {error}
              </div>
           )}

           <div className="space-y-1.5">
             <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider pl-1">E-mail</label>
             <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-sf-purple focus:ring-1 focus:ring-sf-purple transition-all"
                   placeholder="seu@email.com"
                />
             </div>
           </div>

           <div className="space-y-1.5 mb-6">
             <label className="text-xs font-bold text-sf-text-muted uppercase tracking-wider pl-1">Senha</label>
             <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                   type="password" 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-sf-purple focus:ring-1 focus:ring-sf-purple transition-all"
                   placeholder="••••••••"
                />
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-gradient-to-r from-sf-purple to-sf-blue hover:from-sf-purple/90 hover:to-sf-blue/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] disabled:opacity-50 mt-6"
           >
             {loading ? 'Carregando...' : <><Lock className="w-4 h-4" /> Entrar na Plataforma</>}
           </button>
        </form>

        <div className="mt-8 text-center text-sf-text-muted text-sm">
           Para adquirir acesso, escolha um plano na página inicial.
        </div>
      </motion.div>
    </div>
  );
}
