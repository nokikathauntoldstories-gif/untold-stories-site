try { require('dotenv').config(); } catch(e) { /* dotenv not needed in CI */ }
const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '842442602292665';

// Strip lone/broken Unicode surrogate halves that Facebook sometimes returns
// (mangled emoji). These corrupt JSON when sent to APIs like Claude.
function stripLoneSurrogates(str) {
  return str.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
            .replace(/(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '$1');
}

function sanitizeStrings(obj) {
  if (typeof obj === 'string') return stripLoneSurrogates(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeStrings);
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = sanitizeStrings(value);
    }
    return cleaned;
  }
  return obj;
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${data.substring(0, 200)}`));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchAllPosts() {
  let allPosts = [];
  let url = `https://graph.facebook.com/v25.0/${PAGE_ID}/posts?fields=message,created_time,full_picture,attachments{media,subattachments,description,title,url}&limit=100&access_token=${TOKEN}`;
  let page = 1;

  while (url) {
    console.log(`Fetching page ${page}...`);
    const data = await fetchJSON(url);

    if (data.error) {
      console.error('Facebook API Error:', data.error);
      process.exit(1);
    }

    if (data.data) {
      allPosts = allPosts.concat(data.data);
      console.log(`  Got ${data.data.length} posts (total: ${allPosts.length})`);
    }

    url = data.paging && data.paging.next ? data.paging.next : null;
    page++;
  }

  console.log(`\nTotal posts fetched: ${allPosts.length}`);
  if (allPosts.length === 0) {
    console.error('ERROR: No posts fetched. Token may be expired. Aborting to prevent data loss.');
    process.exit(1);
  }
  const sanitized = sanitizeStrings(allPosts);
  fs.writeFileSync(
    path.join(__dirname, 'posts.json'),
    JSON.stringify(sanitized, null, 2),
    'utf-8'
  );
  console.log('Saved to posts.json (sanitized)');
  return allPosts;
}

fetchAllPosts().catch(console.error);
