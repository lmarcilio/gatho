import fs from 'fs';

function processUserFile(path, varName) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');

    // Add import for use18PlusMode if not there
    if (!content.includes('use18PlusMode')) {
        content = content.replace(/import \{.*?\} from '@\/lib\/storage';/, (match) => {
            return match.replace(" } from", ", use18PlusMode } from");
        });
    }

    // Add the hook inside the component
    if (!content.includes('const [is18PlusMode] = use18PlusMode();')) {
        content = content.replace(/(export default function \w+\(\) \{)/, "$1\n  const [is18PlusMode] = use18PlusMode();");
    }

    // Filter the items list
    const filterLine = `const filtered18${varName} = is18PlusMode ? ${varName} : ${varName}.filter(item => !item.is18Plus);`;
    
    if (!content.includes(filterLine)) {
        // e.g. tools -> filtered18Tools
        const regexFindVarDeclaration = new RegExp(`const \\[${varName}\\] = use`, 'g');
        content = content.replace(regexFindVarDeclaration, `const [${varName}] = use`);
        
        // Let's insert the filter line right below the hook
        content = content.replace(/const \[is18PlusMode\] = use18PlusMode\(\);/, `const [is18PlusMode] = use18PlusMode();\n  ${filterLine}`);

        // Now we need to make sure the component uses `filtered18Tools` instead of `tools`
        // Exception: `filteredTools` vs `tools`... if the view already filters by category or search, we just replace `tools.filter` with `filtered18Tools.filter`
        content = content.replace(new RegExp(`(?<!\\[\\s*)${varName}\\.filter`, 'g'), `filtered18${varName}.filter`);
        content = content.replace(new RegExp(`(?<!\\[\\s*)${varName}\\.map`, 'g'), `filtered18${varName}.map`);
    }

    fs.writeFileSync(path, content, 'utf8');
}

processUserFile('src/pages/Ferramentas.tsx', 'tools');
processUserFile('src/pages/Prompts.tsx', 'prompts');
processUserFile('src/pages/Aulas.tsx', 'aulas');
processUserFile('src/pages/Cursos.tsx', 'cursos');
processUserFile('src/pages/Bonus.tsx', 'bonus');
processUserFile('src/pages/Dashboard.tsx', 'tools');
