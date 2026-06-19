const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('route.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src/app/api'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('export async function DELETE') && !content.includes("session.role !== 'ADMIN'")) {
    
    if (!content.includes('getSession')) {
      content = content.replace(/(import .*;\n)+/, (match) => match + "import { getSession } from '@/lib/auth';\n");
    }

    // Use a regex that matches until try {
    content = content.replace(/(export async function DELETE[^)]+\)(?:\s*:\s*[^{]+)?\s*{\s*try\s*{)/, `$1
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized. Only ADMIN can perform this action.' }, { status: 403 });
    }
`);

    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
