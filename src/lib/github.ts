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

  let currentContent: string;
  if (fileData.content) {
    currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  } else {
    const blobRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/blobs/${fileSha}`,
      { headers }
    );
    const blobData = await blobRes.json();
    currentContent = Buffer.from(blobData.content, "base64").toString("utf-8");
  }

  return { posts: JSON.parse(currentContent), fileSha };
}

export async function commitPostsToGitHub(
  posts: Record<string, unknown>[],
  fileSha: string,
  commitMessage: string
): Promise<void> {
  const headers = getHeaders();

  const updateRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/posts.json`,
    {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(JSON.stringify(posts, null, 2)).toString("base64"),
        sha: fileSha,
      }),
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(`GitHub commit failed: ${JSON.stringify(err)}`);
  }
}
