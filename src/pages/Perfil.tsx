import { Settings, User } from 'lucide-react';

export default function Perfil() {
  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
         <Settings className="w-8 h-8 text-white/60" /> Configurações
      </h1>

      <div className="glass-card p-6 md:p-8">
         <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
               <User className="w-10 h-10 text-white/40" />
            </div>
            <div>
               <h2 className="text-2xl font-bold text-white">Membro Pro</h2>
               <p className="text-sf-text-muted">membro@exemplo.com</p>
               <button className="mt-3 text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  Alterar Foto
               </button>
            </div>
         </div>

         <hr className="border-white/5 my-8" />

         <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Plano Atual</h3>
            <div className="p-4 rounded-xl relative overflow-hidden flex justify-between items-center bg-sf-purple/10 border border-sf-purple/20">
               <div>
                  <h4 className="font-bold text-white">GATHO Anual</h4>
                  <p className="text-sm text-sf-text-muted mt-1">Sua renovação será em 10/10/2026</p>
               </div>
               <button className="text-sm font-medium bg-sf-purple/20 hover:bg-sf-purple/40 text-sf-purple px-4 py-2 rounded-lg transition-colors">
                  Gerenciar
               </button>
            </div>
         </div>
         

      </div>
    </div>
  );
}
