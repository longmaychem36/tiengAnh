const fs = require('fs');
const path = require('path');

function processFile(fullPath) {
  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  let modified = false;

  // For OUTPUT INSERTED.* VALUES (...) -> VALUES (...) RETURNING *
  content = content.replace(/OUTPUT\s+INSERTED\.\*\s*(VALUES\s*\([\s\S]*?\))/gi, (match, valuesClause) => {
    modified = true;
    return valuesClause + ' RETURNING *';
  });

  // For OUTPUT INSERTED.Col VALUES (...) -> VALUES (...) RETURNING Col
  content = content.replace(/OUTPUT\s+INSERTED\.([\w\.\s,]+?)\s*(VALUES\s*\([\s\S]*?\))/gi, (match, cols, valuesClause) => {
    modified = true;
    const cleanCols = cols.replace(/INSERTED\./gi, '').trim();
    return valuesClause + ' RETURNING ' + cleanCols;
  });

  // Check if any OUTPUT INSERTED still exists (e.g. without VALUES)
  if (/OUTPUT\s+INSERTED/i.test(content)) {
      console.log('WARNING: Unreplaced OUTPUT INSERTED found in', fullPath);
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated OUTPUT in', fullPath);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

processDir(path.join(__dirname, 'src'));
processDir(path.join(__dirname, 'scripts'));
console.log('Phase 2 completed');
