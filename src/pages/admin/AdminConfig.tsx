import { useState, useRef } from 'react';
import { Save, Upload, Trash2 } from 'lucide-react';
import { useConfig } from '@/lib/storage';

export default function AdminConfiguracoes() {
  const [storedConfig, setStoredConfig] = useConfig();
  const [config, setConfig] = useState(storedConfig);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInput18Ref = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setStoredConfig(config);
    alert("Pronto! Configurações salvas.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, is18: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
         alert("A imagem deve ter no máximo 2MB.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (is18) {
           setConfig({...config, logo18Url: reader.result as string});
        } else {
           setConfig({...config, logoUrl: reader.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações Gerais</h1>
          <p className="text-gray-400">Ajustes da plataforma, nomes e detalhes técnicos.</p>
        </div>
        
        <button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <Save className="w-4 h-4" /> Salvar Configurações
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-8">
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Identidade Principal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome da Plataforma</label>
                  <input 
                     type="text" 
                     value={config.title}
                     onChange={(e) => setConfig({...config, title: e.target.value})}
                     className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Suporte</label>
                  <input 
                     type="email" 
                     value={config.supportEmail}
                     onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                     className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                  />
               </div>
               <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logomarca (Logo)</label>
                  
                  <div className="flex flex-col gap-4">
                     {config.logoUrl ? (
                        <div className="p-6 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                           <img src={config.logoUrl} alt="Preview do Logo" className="max-h-20 object-contain bg-white/5 rounded p-2" />
                           <button 
                             type="button"
                             onClick={() => setConfig({...config, logoUrl: ''})}
                             className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center justify-center"
                             title="Remover Logo"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     ) : (
                        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer bg-black/40 border border-white/10 border-dashed rounded-lg p-10 hover:border-red-500 transition-colors group">
                           <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                              <Upload className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                           </div>
                           <div className="text-center">
                              <p className="text-white font-medium mb-1">Clique para enviar uma imagem do seu PC</p>
                              <p className="text-xs text-gray-500">PNG, JPG, SVG (Máx. 2MB)</p>
                           </div>
                           <input 
                              type="file" 
                              ref={fileInputRef}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, false)}
                           />
                        </label>
                     )}
                     
                     <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                        <span>OU COLE O LINK</span>
                        <span className="h-[1px] flex-1 bg-white/10"></span>
                     </div>

                     <input 
                        type="text" 
                        value={config.logoUrl || ''}
                        onChange={(e) => setConfig({...config, logoUrl: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                     />
                  </div>

                  <div className="h-6"></div>
                  
                  <label className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">Logomarca (Conteúdo +18)</label>
                  
                  <div className="flex flex-col gap-4 mt-2">
                     {config.logo18Url ? (
                        <div className="p-6 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                           <img src={config.logo18Url} alt="Preview do Logo +18" className="max-h-20 object-contain bg-white/5 rounded p-2" />
                           <button 
                             type="button"
                             onClick={() => setConfig({...config, logo18Url: ''})}
                             className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center justify-center"
                             title="Remover Logo +18"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     ) : (
                        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer bg-red-500/5 border border-red-500/20 border-dashed rounded-lg p-10 hover:border-red-500 transition-colors group">
                           <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                              <Upload className="w-6 h-6 text-red-500 group-hover:text-red-400 transition-colors" />
                           </div>
                           <div className="text-center">
                              <p className="text-red-500 font-medium mb-1">Clique para enviar uma imagem +18</p>
                              <p className="text-xs text-red-500/50">PNG, JPG, SVG (Máx. 2MB)</p>
                           </div>
                           <input 
                              type="file" 
                              ref={fileInput18Ref}
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, true)}
                           />
                        </label>
                     )}
                     
                     <div className="flex items-center gap-3 text-xs text-red-500/50">
                        <span className="h-[1px] flex-1 bg-red-500/10"></span>
                        <span>OU COLE O LINK</span>
                        <span className="h-[1px] flex-1 bg-red-500/10"></span>
                     </div>

                     <input 
                        type="text" 
                        value={config.logo18Url || ''}
                        onChange={(e) => setConfig({...config, logo18Url: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" 
                     />
                  </div>

                  {(config.logoUrl || config.logo18Url) && (
                     <div className="mt-6 p-4 bg-black/40 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tamanho da Logo: {config.logoHeight || 32}px</label>
                        </div>
                        <input 
                           type="range" 
                           min="16" 
                           max="128" 
                           step="4"
                           value={config.logoHeight || 32}
                           onChange={(e) => setConfig({...config, logoHeight: parseInt(e.target.value)})}
                           className="w-full accent-red-500 hover:accent-red-400"
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="space-y-6 pt-6">
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">Parâmetros do Sistema</h2>
            
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
               <div>
                  <h3 className="font-bold text-white mb-1">Novas Matrículas</h3>
                  <p className="text-sm text-gray-400">Permitir que novas contas sejam criadas na plataforma e comprar os planos assinaturas.</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                 <input 
                   type="checkbox" 
                   className="sr-only peer" 
                   checked={config.registrationOpen}
                   onChange={(e) => setConfig({...config, registrationOpen: e.target.checked})}
                 />
                 <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
               </label>
            </div>
         </div>
      </div>
    </div>
  );
}
