const fs = require('fs');

let content = fs.readFileSync('src/app/[locale]/(public)/page.tsx', 'utf8');

// 1. Remove fallback objects for dbNews
content = content.replace(/const (u\d|l\d) = dbNews\[\d+\] \|\| \{[^}]+\};/g, 'const $1 = dbNews[...]; // replaced');
content = content.replace(/const u1 = dbNews\[\.\.\.\]; \/\/ replaced/g, 'const u1 = dbNews[0];\n  const u2 = dbNews[1];\n  const u3 = dbNews[2];\n  const u4 = dbNews[3];');
content = content.replace(/const u2 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const u3 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const u4 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');

content = content.replace(/const l1 = dbNews\[\.\.\.\]; \/\/ replaced/g, 'const l1 = dbNews[4];\n  const l2 = dbNews[5];\n  const l3 = dbNews[6];\n  const l4 = dbNews[7];\n  const l5 = dbNews[8];\n  const l6 = dbNews[9];\n  const l7 = dbNews[10];');
content = content.replace(/const l2 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const l3 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const l4 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const l5 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const l6 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');
content = content.replace(/const l7 = dbNews\[\.\.\.\]; \/\/ replaced\n/g, '');

// 2. Add Eye to lucide-react import
if (!content.includes('Eye } from \'lucide-react\'')) {
    content = content.replace(/FileText \} from 'lucide-react'/, 'FileText, Eye } from \'lucide-react\'');
}

// 3. Wrap Links with conditional rendering
const items = ['u1', 'u2', 'u3', 'u4', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'];

items.forEach(item => {
    // Find the Link starting with `<Link href={\`/berita/\${item.slug}\`}`
    const regex = new RegExp(`(<Link href={\`\\/berita\\/\\$\\{${item}\\.slug\\}\`}[^>]*>[\\s\\S]*?<\\/Link>)`, 'g');
    content = content.replace(regex, `{${item} && (\n$1\n)}`);
    
    // Add views display right after category_name inside the Link
    const viewsRegex = new RegExp(`(<span[^>]*>[^<]*\\{${item}\\.category_name \\|\\| 'Berita'\\}<\\/span>)`, 'g');
    content = content.replace(viewsRegex, `$1\n<span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {${item}.views || 0}</span>`);
});

fs.writeFileSync('src/app/[locale]/(public)/page.tsx', content);
console.log('Fixed page.tsx');
