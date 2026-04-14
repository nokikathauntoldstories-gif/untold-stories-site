const fs = require('fs');
const path = require('path');
const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY not set');
  process.exit(1);
}

const CATEGORIES = {
  mysteries: { slug: 'mysteries', name: 'අභිරහස්', nameEn: 'Mysteries', emoji: '🔍', description: 'Unsolved cases, mysterious disappearances, unexplained events' },
  'true-crime': { slug: 'true-crime', name: 'සැබෑ අපරාධ', nameEn: 'True Crime', emoji: '🔪', description: 'Murders, criminal investigations, forensic cases' },
  historical: { slug: 'historical', name: 'ඉතිහාසය', nameEn: 'Historical Events', emoji: '📜', description: 'Civil rights, historical figures, wars, significant events' },
  geopolitics: { slug: 'geopolitics', name: 'භූ දේශපාලනය', nameEn: 'Geopolitics', emoji: '🌍', description: 'International politics, current affairs, diplomacy' },
  psychology: { slug: 'psychology', name: 'මනෝවිද්‍යාව', nameEn: 'Psychology', emoji: '🧠', description: 'Human behavior, social experiments, psychological phenomena' },
  other: { slug: 'other', name: 'වෙනත්', nameEn: 'Other', emoji: '📰', description: 'Other interesting stories' },
};

const VALID = Object.keys(CATEGORIES);

function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.content[0].text.trim());
        } catch (e) {
          reject(new Error(`Parse error: ${data.substring(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function categorizeBatch(posts) {
  const items = posts.map((p, i) => {
    const msg = p.message.substring(0, 400).replace(/\n+/g, ' ');
    const title = p.attachments?.data?.[0]?.title || p.attachments?.data?.[0]?.description || '';
    const line = title ? `${msg}\n[Attachment title: ${title}]` : msg;
    return `[${i}] ${line}`;
  }).join('\n\n');

  const prompt = `You are a content categorizer for a Sinhala storytelling website. Categorize each post into exactly ONE category.

CATEGORIES:
- mysteries: ONLY genuinely unsolved/unexplained events, supernatural phenomena, disappearances with no answer
- true-crime: Murders, criminal investigations, fraud, scams, serial killers, kidnappings, solved crimes
- historical: Historical figures, events, wars, inventions, achievements, famous people biographies, company/brand origins
- geopolitics: International politics, current affairs, diplomacy, country conflicts, government actions, terrorism
- psychology: Human behavior, social experiments, psychological studies, mental health
- other: Cultural traditions, inspirational stories, interesting facts, lifestyle, technology, meta/promotional posts, anything not clearly above

RULES:
- A crime story with a known criminal = true-crime, NOT mysteries
- A historical person's life/achievements = historical, NOT mysteries
- Cultural customs/traditions = other
- Company/brand founding stories = historical
- Promotional/meta posts about the page itself = other
- If unsure between mysteries and true-crime: if there's a specific criminal or victim, it's true-crime

POSTS:
${items}

Reply with ONLY the index and category, one per line, like:
0:mysteries
1:true-crime
2:historical
No other text.`;

  const response = await callClaude(prompt);
  const results = {};
  for (const line of response.split('\n')) {
    const match = line.match(/^(\d+)\s*:\s*([a-z-]+)/);
    if (match) {
      const idx = parseInt(match[1]);
      const cat = match[2].trim();
      if (VALID.includes(cat)) results[idx] = cat;
    }
  }
  return results;
}

async function main() {
  const postsFile = path.join(__dirname, '..', 'src', 'data', 'posts.json');
  const posts = JSON.parse(fs.readFileSync(postsFile, 'utf-8'));

  const withMessage = [];
  const indices = [];
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].message && posts[i].message.trim()) {
      withMessage.push(posts[i]);
      indices.push(i);
    }
  }

  console.log(`Posts to categorize: ${withMessage.length}`);
  const BATCH_SIZE = 20;
  let changed = 0;

  for (let b = 0; b < withMessage.length; b += BATCH_SIZE) {
    const batch = withMessage.slice(b, b + BATCH_SIZE);
    const batchNum = Math.floor(b / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(withMessage.length / BATCH_SIZE);
    process.stdout.write(`Batch ${batchNum}/${totalBatches}...`);

    try {
      const results = await categorizeBatch(batch);
      for (const [localIdx, cat] of Object.entries(results)) {
        const globalIdx = indices[b + parseInt(localIdx)];
        const post = posts[globalIdx];
        const oldCat = post.category;
        if (oldCat !== cat) {
          post.category = cat;
          post.categoryInfo = CATEGORIES[cat];
          changed++;
        }
      }
      console.log(` done (${Object.keys(results).length} categorized)`);
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
    }

    // Rate limit pause
    if (b + BATCH_SIZE < withMessage.length) {
      await new Promise(r => setTimeout(r, 8000));
    }
  }

  // Sort by date
  posts.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), 'utf-8');

  // Stats
  const stats = {};
  posts.forEach(p => { stats[p.category] = (stats[p.category] || 0) + 1; });
  console.log(`\nChanged: ${changed} posts`);
  console.log('New distribution:');
  for (const [cat, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
    const info = CATEGORIES[cat] || { emoji: '📰', nameEn: cat };
    console.log(`  ${info.emoji} ${info.nameEn}: ${count}`);
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
