const GITHUB_REPO = "nokikathauntoldstories-gif/untold-stories-site";

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GitHub token not configured");
  return { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" };
}

export async function fetchPostsFromGitHub(): Promise<{ posts: Record<string, unknown>[]; fileSha: string }> {
  const headers = getHeaders();

  const fileRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/posts.json`,
    { headers }
  );
  const fileData = await fileRes.json();
  const fileSha = fileData.sha;

  if (!fileSha) {
    throw new Error("Failed to get file SHA from GitHub. Response: " + JSON.stringify(fileData).substring(0, 200));
  }

  let currentContent: string;
  if (fileData.content) {
    currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  } else {
    const blobRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/blobs/${fileSha}`,
      { headers }
    );
    if (!blobRes.ok) {
      throw new Error(`Failed to fetch blob: ${blobRes.status} ${blobRes.statusText}`);
    }
    const blobData = await blobRes.json();
    if (!blobData.content) {
      throw new Error("Blob response missing content field");
    }
    currentContent = Buffer.from(blobData.content, "base64").toString("utf-8");
  }

  const posts = JSON.parse(currentContent);
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error(`Posts data appears invalid: got ${Array.isArray(posts) ? posts.length : typeof posts} entries. Aborting to prevent data loss.`);
  }

  return { posts, fileSha };
}

export async function commitPostsToGitHub(
  posts: Record<string, unknown>[],
  fileSha: string,
  commitMessage: string
): Promise<void> {
  const headers = getHeaders();

  // Remove lone Unicode surrogates that break JSON parsing
  const postsJson = JSON.stringify(posts, null, 2).replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );

  const updateRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/posts.json`,
    {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(postsJson).toString("base64"),
        sha: fileSha,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(`GitHub commit failed: ${JSON.stringify(err)}`);
  }
}

// Commits a binary file (image bytes) to the repo. Returns a jsDelivr CDN
// URL — jsDelivr proxies raw GitHub content with aggressive caching, so the
// URL is serveable within seconds of the commit without burning GitHub
// bandwidth on every page view.
export async function commitImageToGitHub(
  pathInRepo: string,
  bytes: Buffer,
  commitMessage: string
): Promise<string> {
  const headers = getHeaders();

  // Images live under public/uploads/. Check for an existing file at this
  // path — shouldn't happen because we timestamp names, but if it does we
  // need the existing SHA to overwrite.
  let existingSha: string | undefined;
  const checkRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${pathInRepo}`,
    { headers }
  );
  if (checkRes.ok) {
    const j = await checkRes.json();
    existingSha = j.sha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${pathInRepo}`,
    {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: bytes.toString("base64"),
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub image commit failed: ${err.substring(0, 300)}`);
  }

  // jsDelivr: https://cdn.jsdelivr.net/gh/<user>/<repo>@<ref>/<path>
  // Using @main so URLs stay stable across deploys.
  return `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@main/${pathInRepo}`;
}
