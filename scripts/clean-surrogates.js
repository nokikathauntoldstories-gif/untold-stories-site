/**
 * One-time script to strip lone/broken Unicode surrogate halves from posts.json.
 * These can appear in Facebook post content (mangled emoji) and corrupt JSON
 * when sent to APIs like Claude.
 */
const fs = require('fs');
const path = require('path');

function stripLoneSurrogates(str) {
  return str.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
            .replace(/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '$1');
}

function cleanObject(obj) {
  if (typeof obj === 'string') return stripLoneSurrogates(obj);
  if (Array.isArray(obj)) return obj.map(cleanObject);
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanObject(value);
    }
    return cleaned;
  }
  return obj;
}

const filePath = path.join(__dirname, 'posts.json');
const posts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const cleaned = cleanObject(posts);

let changes = 0;
for (let i = 0; i < posts.length; i++) {
  if (JSON.stringify(posts[i]) !== JSON.stringify(cleaned[i])) {
    console.log(`Cleaned post ${i}: ${posts[i].id}`);
    changes++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log(`Done. ${changes} post(s) had lone surrogates removed.`);
