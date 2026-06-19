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
  let changed = false;

  // Change public to storage
  if (content.includes("'public'")) {
    content = content.replace(/path\.join\([^)]*'public'[^)]*\)/g, (match) => {
      return match.replace("'public'", "'storage'");
    });
    changed = true;
  }

  // Inject file validator import if there is file uploading
  if (content.includes('File') && content.includes('arrayBuffer')) {
    if (!content.includes('isFileSafe')) {
      content = content.replace(/(import .*;\n)+/, (match) => match + "import { isFileSafe } from '@/lib/fileUpload';\n");
    }
    
    // Replace file name extension extraction to include safety check
    // Look for extname, and after it insert validation
    const regexExt = /(const ext = path\.extname\(([^)]+)\.name\)[^;]*;)/g;
    content = content.replace(regexExt, (match, p1, p2) => {
      return `${p1}
        if (!isFileSafe(${p2}.name)) {
          return NextResponse.json({ success: false, error: 'File type not allowed' }, { status: 400 });
        }`;
    });
    
    // What if it's named 'file.name' directly? 
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
}
