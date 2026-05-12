const fs = require('fs');
let content = fs.readFileSync('scripts/seed_grammar.js', 'utf8');

// Strip all inline styles
content = content.replace(/ style=\"[^\"]*\"/g, '');
content = content.replace(/ style=\'[^\']*\'/g, '');

// Convert highlighted paragraphs into blockquotes (for rules and warnings)
content = content.replace(/<p><b>Quy tắc:<\/b>([\s\S]*?)<\/p>/g, '<blockquote><strong>Quy tắc:</strong>$1</blockquote>');

// Replace table structures with standard paragraphs and lists
content = content.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (match, p1) => {
    let text = p1;
    // Replace table rows with lists
    text = text.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, '<ul>$1</ul>');
    text = text.replace(/<th[^>]*>([\s\S]*?)<\/th>/g, '<li><strong>$1</strong></li>');
    text = text.replace(/<td[^>]*>([\s\S]*?)<\/td>/g, '<li>$1</li>');
    return text;
});

// Remove overused emojis
const emojis = ['✅', '❌', '📌', '📐', '📊', '📖', '✏️', '⚠️', '💡', '🔑'];
emojis.forEach(emoji => {
    // Escape and create regex for each emoji, removing it and any trailing space
    const regex = new RegExp(emoji + '\\s*', 'g');
    content = content.replace(regex, '');
});

fs.writeFileSync('scripts/seed_grammar_new.js', content);
console.log('Script successfully transformed tables to lists, removed styles, and stripped overused emojis.');
