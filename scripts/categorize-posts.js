const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf-8'));

// Keyword-based categorization for Sinhala content
const categories = {
  'mysteries': {
    slug: 'mysteries',
    name: 'අභිරහස්',
    nameEn: 'Mysteries',
    emoji: '🔍',
    description: 'Unsolved cases, mysterious disappearances, unexplained events',
    keywords: [
      'අභිරහස', 'mystery', 'අභිරහස්', 'රහස', 'සැඟවුණු', 'අද්භූත', 'පැහැදිලි කරගන්න බැරි',
      'අතුරුදන්', 'disappear', 'හොයාගන්න බැරි', 'නොවිසඳුණු', 'unsolved', 'විද්‍යාවටවත්',
      'අබිරහස', 'පුදුම', 'අමුතු', 'හිරවී', 'රහසක්', 'අභිරහසක්', 'mystery',
      'කොහෙද ගියේ', 'සොයාගන්න බැරි', 'භයානක', 'අද්භුත', 'unexplained',
      'බර්මියුඩා', 'bermuda', 'පිටසක්වල', 'UFO', 'alien', 'එලියන්',
      'ආත්ම', 'ghost', 'අභිරහස් ලෙස', 'සැක සහිත', 'අභිරහසක්ම'
    ]
  },
  'true-crime': {
    slug: 'true-crime',
    name: 'සැබෑ අපරාධ',
    nameEn: 'True Crime',
    emoji: '🔪',
    description: 'Murders, criminal investigations, forensic cases',
    keywords: [
      'මිනීමරු', 'murder', 'ඝාතන', 'අපරාධ', 'crime', 'serial killer', 'මරණ',
      'ඝාතකයා', 'පොලිසිය', 'police', 'විමර්ශන', 'අත්අඩංගු', 'වංචා', 'fraud',
      'බැංකු වංචා', 'මිනීමැරුම', 'killer', 'අපහරණ', 'kidnap', 'සොරකම',
      'මත්ද්‍රව්‍ය', 'drug', 'මාෆියා', 'mafia', 'gangster', 'criminal',
      'ඝාතනය', 'මරා', 'බන්ධනාගාර', 'prison', 'දඬුවම', 'මරණ දඬුවම',
      'serial', 'සීරියල්', 'හිංසා', 'බිහිසුණු', 'මිනීමරුවෝ', 'victim',
      'forensic', 'DNA', 'ප්‍රහාරය', 'ප්‍රහාර', 'බෝම්බ ප්‍රහාර',
      'මිනිස් වෙස් ගත්තු', 'දරුණුම', 'භයානකම මිනීමරුවෝ'
    ]
  },
  'historical': {
    slug: 'historical',
    name: 'ඉතිහාසය',
    nameEn: 'Historical Events',
    emoji: '📜',
    description: 'Civil rights, historical figures, wars, significant events',
    keywords: [
      'ඉතිහාස', 'history', 'historical', 'යුද්ධ', 'war', 'සටන', 'battle',
      'රජ', 'king', 'queen', 'රැජින', 'අධිරාජ්‍ය', 'empire',
      'ලෝක යුද්ධ', 'world war', 'නිදහස', 'independence', 'විප්ලව', 'revolution',
      'පුරාණ', 'ancient', 'ශිෂ්ටාචාර', 'civilization', 'pyramid',
      'ටයිටැනික්', 'titanic', 'NASA', 'අභ්‍යවකාශ', 'space',
      'ඉතිහාසයේ', 'පරම්පරා', 'සාම්රාජ්‍ය', 'Honda', 'සමාගම',
      'කාන්තාව', 'civil rights', 'වෙනස් වුණු', 'ලෝකේ හොල්ලන',
      'දශකය', 'සියවස', 'century', 'පළමු', 'අවසාන'
    ]
  },
  'geopolitics': {
    slug: 'geopolitics',
    name: 'භූ දේශපාලනය',
    nameEn: 'Geopolitics',
    emoji: '🌍',
    description: 'International politics, current affairs, diplomacy',
    keywords: [
      'දේශපාලන', 'politics', 'ට්‍රම්ප්', 'trump', 'බයිඩන්', 'biden',
      'ඇමරිකා', 'america', 'USA', 'චීන', 'china', 'රුසියා', 'russia',
      'ඉරාන', 'iran', 'ඉන්දිය', 'india', 'පකිස්ථාන', 'pakistan',
      'සාකච්ඡා', 'negotiation', 'සම්බාධක', 'sanction', 'NATO',
      'UN', 'එක්සත් ජාතීන්', 'තානාපති', 'ambassador', 'ගිවිසුම',
      'treaty', 'සටන් විරාම', 'ceasefire', 'යුක්රේන', 'ukraine',
      'ඉස්රායල', 'israel', 'පලස්තීන', 'palestine', 'ගාසා', 'gaza',
      'හෝමුස්', 'ගෝලීය', 'global', 'ජාත්‍යන්තර', 'international',
      'NATO', 'EU', 'මැදපෙරදිග', 'middle east', 'ජනාධිපති',
      'president', 'prime minister', 'අගමැති', 'මෙල්බර්න්', 'ජාතිවාදී',
      'ත්‍රස්ත', 'terror', 'ISIS', 'ගුවන් හමුදා', 'යුධ', 'nuclear', 'න්‍යෂ්ටික'
    ]
  },
  'psychology': {
    slug: 'psychology',
    name: 'මනෝවිද්‍යාව',
    nameEn: 'Psychology',
    emoji: '🧠',
    description: 'Human behavior, social experiments, psychological phenomena',
    keywords: [
      'මනෝවිද්‍යා', 'psychology', 'මනස', 'mind', 'මොළ', 'brain',
      'හැසිරීම', 'behavior', 'පර්යේෂණ', 'research', 'experiment',
      'සමාජ', 'social', 'චිත්ත', 'mental', 'ආතතිය', 'stress',
      'මානසික', 'psychological', 'psychopath', 'sociopath',
      'manipulation', 'හැඟීම්', 'emotion', 'IQ', 'බුද්ධි',
      'ව්‍යාකූල', 'disorder', 'syndrome', 'ස්නායු', 'nerve'
    ]
  }
};

function categorizePost(post) {
  if (!post.message) return 'other';

  const msg = post.message.toLowerCase();
  const scores = {};

  for (const [catId, cat] of Object.entries(categories)) {
    scores[catId] = 0;
    for (const keyword of cat.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        scores[catId]++;
      }
    }
  }

  // Find highest scoring category
  let bestCat = 'other';
  let bestScore = 0;
  for (const [catId, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCat = catId;
    }
  }

  // If no significant match, try harder with some heuristics
  if (bestScore < 1) {
    // Check for common patterns
    if (msg.includes('කතාව') || msg.includes('story') || msg.includes('සිදුවීම')) {
      // Generic story - check if it mentions places, people, or events
      if (msg.includes('ලෝක') || msg.includes('world') || msg.includes('රට') || msg.includes('country')) {
        return 'historical';
      }
    }
    return 'other';
  }

  return bestCat;
}

// Categorize all posts
const categorizedPosts = posts.map(post => {
  const category = categorizePost(post);
  return {
    ...post,
    category,
    categoryInfo: categories[category] || {
      slug: 'other',
      name: 'වෙනත්',
      nameEn: 'Other',
      emoji: '📰',
      description: 'Other interesting stories'
    }
  };
});

// Stats
const stats = {};
categorizedPosts.forEach(p => {
  stats[p.category] = (stats[p.category] || 0) + 1;
});
console.log('Category distribution:');
for (const [cat, count] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
  const info = categories[cat] || { emoji: '📰', nameEn: 'Other' };
  console.log(`  ${info.emoji || '📰'} ${info.nameEn || cat}: ${count}`);
}

fs.writeFileSync(
  path.join(__dirname, 'categorized_posts.json'),
  JSON.stringify(categorizedPosts, null, 2),
  'utf-8'
);
console.log(`\nSaved categorized_posts.json (${categorizedPosts.length} posts)`);

// Also save categories metadata
const categoriesMeta = {
  ...Object.fromEntries(
    Object.entries(categories).map(([k, v]) => [k, { ...v, keywords: undefined }])
  ),
  other: {
    slug: 'other',
    name: 'වෙනත්',
    nameEn: 'Other',
    emoji: '📰',
    description: 'Other interesting stories'
  }
};
fs.writeFileSync(
  path.join(__dirname, 'categories.json'),
  JSON.stringify(categoriesMeta, null, 2),
  'utf-8'
);
console.log('Saved categories.json');
