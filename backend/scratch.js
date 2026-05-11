const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'scripts');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix database.js require paths
  content = content.replace(/require\(['"]\.\/src\/config\/database['"]\)/g, 'require(\'../src/config/database\')');
  
  // Add dotenv if missing
  if (!content.includes('dotenv')) {
    content = "require('dotenv').config({ path: require('path').join(__dirname, '../.env') });\n" + content;
  } else {
    // If it has dotenv, ensure it uses the correct path just in case
    content = content.replace(/require\(['"]dotenv['"]\)\.config\(\);?/g, "require('dotenv').config({ path: require('path').join(__dirname, '../.env') });");
  }
  
  fs.writeFileSync(filePath, content);
}
console.log('Fixed scripts!');
