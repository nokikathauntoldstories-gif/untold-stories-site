const FB_PAGE_ID = "842442602292665";

function getToken() {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) throw new Error("Facebook token not configured");
  return token;
}

export async function postToFacebook(message: string, imageUrl?: string) {
  const token = getToken();

  let endpoint: string;
  const body: Record<string, string> = { message, access_token: token };

  if (imageUrl) {
    endpoint = `https://graph.facebook.com/v25.0/${FB_PAGE_ID}/photos`;
    body.url = imageUrl;
  } else {
    endpoint = `https://graph.facebook.com/v25.0/${FB_PAGE_ID}/feed`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: new URLSearchParams(body),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function editFacebookPost(postId: string, message: string) {
  const token = getToken();

  const res = await fetch(`https://graph.facebook.com/v25.0/${postId}`, {
    method: "POST",
    body: new URLSearchParams({ message, access_token: token }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export async function deleteFacebookPost(postId: string) {
  const token = getToken();

  const res = await fetch(
    `https://graph.facebook.com/v25.0/${postId}?access_token=${token}`,
    { method: "DELETE" }
  );

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// Posts created without Facebook have synthetic IDs like 842442602292665_1712345678901
export function isRealFacebookId(id: string): boolean {
  const parts = id.split("_");
  if (parts.length !== 2) return false;
  // Synthetic IDs use Date.now() which is 13 digits
  return parts[1].length !== 13;
}
