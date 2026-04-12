"use client";

import { useState, useCallback, useRef, useEffect } from "react";

const CATEGORIES = [
  { value: "mysteries", label: "🔍 අභිරහස් — Mysteries" },
  { value: "true-crime", label: "🔪 සැබෑ අපරාධ — True Crime" },
  { value: "historical", label: "📜 ඉතිහාසය — Historical Events" },
  { value: "geopolitics", label: "🌍 භූ දේශපාලනය — Geopolitics" },
  { value: "psychology", label: "🧠 මනෝවිද්‍යාව — Psychology" },
  { value: "other", label: "📰 වෙනත් — Other" },
];

interface PostItem {
  id: string;
  message: string;
  category: string;
  categoryInfo?: { emoji: string; nameEn: string };
  created_time: string;
  full_picture?: string;
}

interface ResultMsg {
  success?: boolean;
  error?: string;
  message?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");

  // Create post state
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("mysteries");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [postToFb, setPostToFb] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [result, setResult] = useState<ResultMsg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Manage posts state
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [postsPage, setPostsPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [manageResult, setManageResult] = useState<ResultMsg | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (file: File, type: "image" | "video") => {
    if (type === "image") setUploading(true);
    else setUploadingVideo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (type === "image") setImageUrl(data.url);
      else setVideoUrl(data.url);
    } catch (err) {
      alert(`${type} upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      if (type === "image") setUploading(false);
      else setUploadingVideo(false);
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
          videoUrl: videoUrl.trim() || null,
          postToFb,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Server returned empty response");
      }
      if (res.ok) {
        setResult({
          success: true,
          message:
            data.message +
            (data.fbPosted
              ? " (Facebook post created)"
              : data.fbError
              ? ` (Facebook failed: ${data.fbError})`
              : " (Facebook post skipped)"),
        });
        setMessage("");
        setImageUrl("");
        setVideoUrl("");
      } else {
        setResult({ error: data.error || "Publishing failed" });
      }
    } catch (err) {
      setResult({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setPublishing(false);
    }
  }, [message, category, imageUrl, videoUrl, postToFb, password]);

  // Fetch posts for manage tab
  const fetchPosts = useCallback(async (page = 1) => {
    setLoadingPosts(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (searchQuery) params.set("search", searchQuery);
      if (filterCategory) params.set("category", filterCategory);

      const res = await fetch(`/api/admin/posts?${params}`, {
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.total);
        setPostsPage(data.page);
      }
    } catch {
      // ignore
    } finally {
      setLoadingPosts(false);
    }
  }, [password, searchQuery, filterCategory]);

  useEffect(() => {
    if (authenticated && activeTab === "manage") {
      fetchPosts(1);
    }
  }, [authenticated, activeTab, fetchPosts]);

  const handleEdit = (post: PostItem) => {
    setEditingPost(post);
    setEditMessage(post.message);
    setEditCategory(post.category);
    setEditImageUrl(post.full_picture || "");
    setManageResult(null);
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !editMessage.trim()) return;
    setSaving(true);
    setManageResult(null);

    try {
      const res = await fetch("/api/admin/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          postId: editingPost.id,
          message: editMessage.trim(),
          category: editCategory,
          imageUrl: editImageUrl.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setManageResult({
          success: true,
          message: data.message +
            (data.fbEdited ? " (Facebook updated)" : data.fbError ? ` (Facebook: ${data.fbError})` : ""),
        });
        // Update locally
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? { ...p, message: editMessage.trim(), category: editCategory, full_picture: editImageUrl.trim() || undefined }
              : p
          )
        );
        setEditingPost(null);
      } else {
        setManageResult({ error: data.error || "Edit failed" });
      }
    } catch (err) {
      setManageResult({ error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    setManageResult(null);

    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();
      if (res.ok) {
        setManageResult({
          success: true,
          message: data.message +
            (data.fbDeleted ? " (Removed from Facebook)" : data.fbError ? ` (Facebook: ${data.fbError})` : ""),
        });
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setTotalPosts((prev) => prev - 1);
      } else {
        setManageResult({ error: data.error || "Delete failed" });
      }
    } catch (err) {
      setManageResult({ error: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getTitle = (msg: string) => {
    const firstLine = msg.split("\n")[0];
    return firstLine.length > 80 ? firstLine.substring(0, 80) + "..." : firstLine;
  };

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gold-400">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Manage your stories</p>
        </div>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-gray-400 hover:text-red-400 text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-navy-900 border border-navy-700 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "create"
              ? "bg-gold-500 text-navy-950"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          + Create Post
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "manage"
              ? "bg-gold-500 text-navy-950"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Manage Posts ({totalPosts || "..."})
        </button>
      </div>

      {/* CREATE TAB */}
      {activeTab === "create" && (
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 sm:p-8">
          {/* Category */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:border-gold-500/50 appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Story Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your story here...&#10;&#10;First line becomes the title."
              rows={15}
              className="w-full bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 leading-relaxed resize-y"
            />
            <div className="flex justify-between mt-1">
              <p className="text-gray-500 text-xs">First line = title. Use blank lines to separate paragraphs.</p>
              <p className="text-gray-500 text-xs">{message.length} chars</p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Featured Image</label>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-lg px-5 py-3 text-gray-300 text-sm transition-colors"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="or paste image URL here"
                className="flex-1 bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 text-sm"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, "image");
              }}
            />
            {imageUrl && (
              <div className="mt-3 relative inline-block">
                <div className="rounded-lg overflow-hidden border border-navy-600 max-w-xs">
                  <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
                </div>
                <button
                  onClick={() => setImageUrl("")}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            )}
          </div>

          {/* Video */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">Video (optional)</label>
            <div className="flex gap-3">
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={uploadingVideo}
                className="flex items-center gap-2 bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-lg px-5 py-3 text-gray-300 text-sm transition-colors"
              >
                {uploadingVideo ? "Uploading..." : "Upload Video"}
              </button>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="or paste video/reel URL here"
                className="flex-1 bg-navy-800 border border-navy-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 text-sm"
              />
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, "video");
              }}
            />
            {videoUrl && (
              <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                <span>Video attached</span>
                <button onClick={() => setVideoUrl("")} className="text-red-400 hover:text-red-300 ml-2">x Remove</button>
              </div>
            )}
          </div>

          {/* Facebook toggle */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-12 h-6 rounded-full transition-colors ${postToFb ? "bg-blue-600" : "bg-navy-600"}`}
                onClick={() => setPostToFb(!postToFb)}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${postToFb ? "translate-x-6" : ""}`} />
              </div>
              <span className="text-gray-300 text-sm">Also post to Facebook page</span>
            </label>
          </div>

          {/* Preview */}
          {message && (
            <div className="mb-8 border border-navy-600 rounded-xl p-5 bg-navy-800/50">
              <h3 className="text-gold-400 text-sm font-medium mb-3">Preview</h3>
              <div className="border-l-2 border-gold-500/30 pl-4">
                <h4 className="text-gray-100 font-semibold text-lg mb-2">{message.split("\n")[0]}</h4>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                  {message.split("\n").slice(1).join("\n").substring(0, 300)}{message.length > 300 ? "..." : ""}
                </p>
                <span className="inline-block mt-3 text-xs bg-navy-700 px-2 py-1 rounded-full text-gold-400">
                  {CATEGORIES.find((c) => c.value === category)?.label}
                </span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${result.success ? "bg-green-900/30 border border-green-700 text-green-300" : "bg-red-900/30 border border-red-700 text-red-300"}`}>
              {result.success ? "OK " : "Error: "}{result.message || result.error}
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
            {publishing ? "Publishing..." : `Publish Story ${postToFb ? "& Post to Facebook" : ""}`}
          </button>
        </div>
      )}

      {/* MANAGE TAB */}
      {activeTab === "manage" && (
        <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6 sm:p-8">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchPosts(1)}
              placeholder="Search posts..."
              className="flex-1 bg-navy-800 border border-navy-600 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 text-sm"
            />
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); }}
              className="bg-navy-800 border border-navy-600 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-gold-500/50 text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={() => fetchPosts(1)}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Search
            </button>
          </div>

          {/* Result message */}
          {manageResult && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${manageResult.success ? "bg-green-900/30 border border-green-700 text-green-300" : "bg-red-900/30 border border-red-700 text-red-300"}`}>
              {manageResult.success ? "OK " : "Error: "}{manageResult.message || manageResult.error}
            </div>
          )}

          {/* Posts list */}
          {loadingPosts ? (
            <div className="text-center py-12 text-gray-400">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No posts found</div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="border border-navy-600 rounded-xl overflow-hidden">
                  {/* Post row */}
                  <div className="flex items-start gap-4 p-4">
                    {/* Thumbnail */}
                    {post.full_picture && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-navy-600">
                        <img src={post.full_picture} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-100 font-medium text-sm truncate">
                        {getTitle(post.message)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-navy-700 px-2 py-0.5 rounded-full text-gold-400">
                          {post.categoryInfo?.emoji} {post.categoryInfo?.nameEn || post.category}
                        </span>
                        <span className="text-gray-500 text-xs">{formatDate(post.created_time)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {confirmDeleteId === post.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingId === post.id}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            {deletingId === post.id ? "..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-navy-700 hover:bg-navy-600 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit form (inline) */}
                  {editingPost?.id === post.id && (
                    <div className="border-t border-navy-600 p-4 bg-navy-800/50">
                      <div className="mb-4">
                        <label className="block text-gray-400 text-xs font-medium mb-1">Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-gold-500/50"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-400 text-xs font-medium mb-1">Content</label>
                        <textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          rows={8}
                          className="w-full bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-gold-500/50 leading-relaxed resize-y"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-400 text-xs font-medium mb-1">
                          Image <span className="text-gray-500">(image changes apply to website only, not Facebook)</span>
                        </label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={editUploading}
                            className="flex items-center gap-2 bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-lg px-4 py-2 text-gray-300 text-xs transition-colors"
                          >
                            {editUploading ? "Uploading..." : "Upload Image"}
                          </button>
                          <input
                            type="url"
                            value={editImageUrl}
                            onChange={(e) => setEditImageUrl(e.target.value)}
                            placeholder="or paste image URL"
                            className="flex-1 bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-gold-500/50"
                          />
                        </div>
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setEditUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append("file", file);
                              const res = await fetch("/api/admin/upload", {
                                method: "POST",
                                headers: { "x-admin-password": password },
                                body: formData,
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error);
                              setEditImageUrl(data.url);
                            } catch (err) {
                              alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
                            } finally {
                              setEditUploading(false);
                            }
                          }}
                        />
                        {editImageUrl && (
                          <div className="mt-2 relative inline-block">
                            <div className="rounded-lg overflow-hidden border border-navy-600 max-w-[120px]">
                              <img src={editImageUrl} alt="Preview" className="w-full h-20 object-cover" />
                            </div>
                            <button
                              onClick={() => setEditImageUrl("")}
                              className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                            >
                              x
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving || !editMessage.trim()}
                          className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="bg-navy-700 hover:bg-navy-600 text-gray-300 px-5 py-2 rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-navy-700">
              <button
                onClick={() => fetchPosts(postsPage - 1)}
                disabled={postsPage <= 1}
                className="bg-navy-800 hover:bg-navy-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-400 text-sm">
                Page {postsPage} of {totalPages} ({totalPosts} posts)
              </span>
              <button
                onClick={() => fetchPosts(postsPage + 1)}
                disabled={postsPage >= totalPages}
                className="bg-navy-800 hover:bg-navy-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
