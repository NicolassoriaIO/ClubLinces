const fs = require('fs');
const path = require('path');

const root = process.cwd();

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function clean(content) {
  
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  content = content.replace(/(^|[^:\\])\/\/.*$/gm, function(m, p1){
    return p1 === undefined ? '' : p1;
  });
  
  content = content.replace(/\n{3,}/g, '\n\n');
  return content;
}

const all = walk(root).filter(f => /\.(js|jsx|ts|tsx|md|json)$/.test(f));

for (const file of all) {
  
  const rel = path.relative(root, file);
  if (rel.startsWith('node_modules')) continue;
  if (rel === 'package-lock.json' || rel === 'yarn.lock') continue;

  try {
    const src = fs.readFileSync(file, 'utf8');
    const cleaned = clean(src);
    if (cleaned !== src) {
      fs.writeFileSync(file, cleaned, 'utf8');
      console.log('Cleaned:', rel);
    }
  } catch (e) {
    console.error('Error', rel, e.message);
  }
}

console.log('Done');
