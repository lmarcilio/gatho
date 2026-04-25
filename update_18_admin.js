import fs from 'fs';

function processAdminFile(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Add is18Plus to form state object definition in useState
    content = content.replace(/(const \[formData, setFormData\] = useState\(\{[\s\S]*?)(\s+\}\);)/g, (match, p1, p2) => {
        if (!p1.includes('is18Plus:')) {
            return p1 + ',\n    is18Plus: false' + p2;
        }
        return match;
    });

    // Add is18Plus to handleOpenForm mapping  (for existing item)
    content = content.replace(/(setFormData\(\{[\s\S]*?)(\s+\}\);\n\s+setEditingId\(\w+\.id\);)/g, (match, p1, p2) => {
        if (!p1.includes('is18Plus:')) {
            const matchVar = p2.match(/(\w+)\.id/);
            const varName = matchVar ? matchVar[1] : 'item';
            return p1 + `,\n        is18Plus: ${varName}.is18Plus || false` + p2;
        }
        return match;
    });

    // Add is18Plus to handleOpenForm mapping (for new item fallback) - this regex isn't perfect, I'll just skip this one and let user set it inside the form, default is false.
    content = content.replace(/(setFormData\(\{.*?)(\} \);\n\s+setEditingId\(null\);)/g, (match, p1, p2) => {
         if (!p1.includes('is18Plus:')) {
             return p1 + ', is18Plus: false ' + p2;
         }
         return match;
    });

    // Add the toggle to the layout before the save button
    const containerFind = /<div className="p-6 border-t border-white\/10 bg-black\/40 flex justify-end gap-3">/g;
    const replacement = `<div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
               <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <input 
                     type="checkbox" 
                     checked={formData.is18Plus}
                     onChange={(e) => setFormData({...formData, is18Plus: e.target.checked})}
                     className="w-4 h-4 rounded border-white/10 bg-white/5 accent-red-500" 
                  />
                  Conteúdo +18
               </label>
               <div className="flex gap-3">`;
    if (!content.includes('Conteúdo +18')) {
        content = content.replace(containerFind, replacement);
        // Add closing div for the new flex gap-3 container
        content = content.replace(/(Salvar(?: no Banco| e Sair).*?<\/button>)\s*<\/div>/g, '$1\n               </div>\n            </div>');
        
    }

    fs.writeFileSync(path, content, 'utf8');
}

['src/pages/admin/AdminFerramentas.tsx', 'src/pages/admin/AdminPrompts.tsx', 'src/pages/admin/AdminAulas.tsx', 'src/pages/admin/AdminCursos.tsx', 'src/pages/admin/AdminBonus.tsx'].forEach(processAdminFile);
