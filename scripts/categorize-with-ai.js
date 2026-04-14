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

const VALID_CATEGORIES = Object.keys(CATEGORIES);

function callClaude(messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages,
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
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.content[0].text.trim());
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function categorizePost(message) {
  const truncated = message.substring(0, 800);

  const prompt = `You are a content categorizer for a Sinhala storytelling website. Categorize this Facebook post into exactly ONE of these categories:

- mysteries: Unsolved cases, mysterious disappearances, unexplained supernatural events, paranormal activity
- true-crime: Murders, criminal investigations, forensic cases, fraud, scams, serial killers, kidnappings
- historical: Historical figures, events, wars, inventions, historical achievements, biographical stories of famous people
- geopolitics: International politics, current affairs, diplomacy, country conflicts, government actions
- psychology: Human behavior, social experiments, psychological studies, mental health phenomena
- other: Cultural traditions, inspirational stories, interesting facts, lifestyle, technology, anything that doesn't clearly fit above

IMPORTANT RULES:
- If the story is about a SOLVED crime or criminal case, it's "true-crime" not "mysteries"
- If the story is about a historical person's life/achievements, it's "historical" not "mysteries"
- "mysteries" is ONLY for genuinely unsolved/unexplained events
- Cultural customs, traditions, and interesting facts are "other"
- Stories about famous companies, brands, or inventions are "historical"

Post:
${truncated}

Reply with ONLY the category name, nothing else.`;

  const response = await callClaude([{ role: 'user', content: prompt }]);
  const category = response.toLowerCase().replace(/[^a-z-]/g, '');

  if (VALID_CATEGORIES.includes(category)) {
    return category;
  }
  // Try to match partial
  const match = VALID_CATEGORIES.find(c => response.toLowerCase().includes(c));
  return match || 'other';
}

async function main() {
  const newPosts = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8'));
  const existing = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'posts.json'), 'utf-8'));

  console.log(`Facebook returned: ${newPosts.length} posts`);
  console.log(`Existing posts: ${existing.length}`);

  if (newPosts.length < 10 && existing.length > 100) {
    console.log('WARNING: Facebook returned too few posts. Skipping to prevent data loss.');
    process.exit(0);
  }

  const existingMap = new Map(existing.map(p => [p.id, p]));

  // Find new posts that need categorization
  const uncategorized = newPosts.filter(p => !existingMap.has(p.id) && p.message);
  console.log(`New posts to categorize: ${uncategorized.length}`);

  // Categorize each new post with Claude
  for (const post of uncategorized) {
    try {
      const category = await categorizePost(post.message);
      post.category = category;
      post.categoryInfo = CATEGORIES[category] || CATEGORIES.other;
      const snippet = post.message.substring(0, 60).replace(/\n/g, ' ');
      console.log(`  ✓ ${category} → ${snippet}...`);
    } catch (err) {
      console.error(`  ✗ Failed to categorize ${post.id}: ${err.message}`);
      post.category = 'other';
      post.categoryInfo = CATEGORIES.other;
    }
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  // Merge: add new posts, keep existing ones untouched
  let added = 0;
  for (const post of newPosts) {
    if (!existingMap.has(post.id)) {
      existingMap.set(post.id, post);
      added++;
    }
  }

  const merged = Array.from(existingMap.values())
    .sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'posts.json'),
    JSON.stringify(merged, null, 2),
    'utf-8'
  );
  console.log(`\nNew posts added: ${added}, Total: ${merged.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
