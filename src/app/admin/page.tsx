"use client";

import { useState, useCallback } from "react";

const CATEGORIES = [
  { value: "mysteries", label: "🔍 අභිරහස් — Mysteries" },
  { value: "true-crime", label: "🔪 සැබෑ අපරාධ — True Crime" },
  { value: "historical", label: "📜 ඉතිහාසය — Historical Events" },
  { value: "geopolitics", label: "🌍 භූ දේශපාලනය — Geopolitics" },
  { value: "psychology", label: "🧠 මනෝවිද්‍යාව — Psychology" },
  { value: "other", label: "📰 වෙනත් — Other" },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("mysteries");
  const [imageUrl, setImageUrl] = useState("");
  const [postToFb, setPostToFb] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

  const handleLogin = async () => {
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setAuthError("Incorrect password");
    }
  };

  const handlePublish = useCallback(async () => {
    if (!message.trim()) return;
    setPublishing(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          message: message.trim(),
          category,
          imageUrl: imageUrl.trim() || null,
          postToFb,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message + (data.fbPosted ? " (Facebook post created)" : " (Facebook post skipped)") });
        setMessage("");
        setImageUrl("");
      } else {
        setResult({ error: data.error || "Publishing failed" });
      }
    } catch {
      setResult({ error: "Network error. Try again." });
    } finally {
      setPublishing(false);
    }
  }, [message, category, imageUrl, postToFb, password]);

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h1 className="text-gold-400 font-bold text-xl mt-3">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">නොකී කතා - Untold Stories</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 mb-4"
          />
          {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gold-400">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Create and publish new stories</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-gray-400 hover:text-red-400 text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 sm:p-8">
        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            ප්‍රවර්ගය (Category)
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-gold-500/50 appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message / Story Content */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            කතාව (Story Content)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ඔබේ කතාව මෙහි ලියන්න...&#10;&#10;පළමු පේළිය මාතෘකාව ලෙස භාවිතා වේ."
            rows={15}
            className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 leading-relaxed resize-y"
          />
          <div className="flex justify-between mt-1">
            <p className="text-gray-500 text-xs">
              First line = title. Use blank lines to separate paragraphs.
            </p>
            <p className="text-gray-500 text-xs">{message.length} chars</p>
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
          />
          <p className="text-gray-500 text-xs mt-1">
            Paste a direct image URL. This will be used as the featured image and shared on Facebook.
          </p>
          {imageUrl && (
            <div className="mt-3 rounded-lg overflow-hidden border border-navy-600 max-w-xs">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
        </div>

        {/* Facebook toggle */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`relative w-12 h-6 rounded-full transition-colors ${
                postToFb ? "bg-blue-600" : "bg-navy-600"
              }`}
              onClick={() => setPostToFb(!postToFb)}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  postToFb ? "translate-x-6" : ""
                }`}
              />
            </div>
            <span className="text-gray-300 text-sm">
              📘 Also post to Facebook page
            </span>
          </label>
        </div>

        {/* Preview */}
        {message && (
          <div className="mb-8 border border-navy-600 rounded-xl p-5 bg-navy-800/50">
            <h3 className="text-gold-400 text-sm font-medium mb-3">Preview</h3>
            <div className="border-l-2 border-gold-500/30 pl-4">
              <h4 className="text-gray-100 font-semibold text-lg mb-2">
                {message.split("\n")[0]}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {message.split("\n").slice(1).join("\n").substring(0, 300)}
                {message.length > 300 ? "..." : ""}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-navy-700 px-2 py-1 rounded-full text-gold-400">
                  {CATEGORIES.find((c) => c.value === category)?.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Result message */}
        {result && (
          <div
            className={`mb-6 p-4 rounded-lg text-sm ${
              result.success
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}
          >
            {result.success ? "✅ " : "❌ "}
            {result.message || result.error}
          </div>
        )}

        {/* Publish button */}
        <button
          onClick={handlePublish}
          disabled={publishing || !message.trim()}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            publishing || !message.trim()
              ? "bg-navy-700 text-gray-500 cursor-not-allowed"
              : "bg-gold-500 hover:bg-gold-400 text-navy-950 hover:shadow-lg hover:shadow-gold-500/20"
          }`}
        >
          {publishing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Publishing...
            </span>
          ) : (
            <>Publish Story {postToFb ? "& Post to Facebook" : ""}</>
          )}
        </button>
      </div>
    </div>
  );
}
