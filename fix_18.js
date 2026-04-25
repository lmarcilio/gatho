import fs from 'fs';
const files = [
  'src/pages/admin/AdminAulas.tsx',
  'src/pages/admin/AdminBonus.tsx',
  'src/pages/admin/AdminCursos.tsx',
  'src/pages/admin/AdminFerramentas.tsx',
  'src/pages/admin/AdminPrompts.tsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/checked=\{formData\.is18Plus\}/g, 'checked={!!formData.is18Plus}');
  fs.writeFileSync(f, c);
});
