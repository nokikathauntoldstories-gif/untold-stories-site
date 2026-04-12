import postsData from '@/data/posts.json';
import categoriesData from '@/data/categories.json';

export interface Post {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  attachments?: {
    data: Array<{
      media?: { image?: { src: string } };
      subattachments?: {
        data: Array<{ media?: { image?: { src: string } } }>;
      };
      description?: string;
      title?: string;
      url?: string;
    }>;
  };
  category: string;
  categoryInfo: {
    slug: string;
    name: string;
    nameEn: string;
    emoji: string;
    description: string;
  };
}

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  emoji: string;
  description: string;
}

const posts: Post[] = postsData as Post[];
const categories: Record<string, Category> = categoriesData as Record<string, Category>;

export function getAllPosts(): Post[] {
  return posts
    .filter((p) => p.message && p.message.trim().length > 0)
    .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime());
}

export function getPostById(id: string): Post | undefined {
  return posts.find((p) => p.id === id);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((p) => p.category === categorySlug);
}

export function getAllCategories(): Record<string, Category> {
  return categories;
}

export function getPostTitle(post: Post): string {
  if (!post.message) return 'නොකී කතාව';
  const firstLine = post.message.split('\n')[0];
  return firstLine.length > 120 ? firstLine.substring(0, 120) + '...' : firstLine;
}

export function getPostExcerpt(post: Post, length = 200): string {
  if (!post.message) return '';
  const clean = post.message.replace(/\n+/g, ' ').trim();
  return clean.length > length ? clean.substring(0, length) + '...' : clean;
}

export function getPostImage(post: Post): string | null {
  const postId = post.id.replace(/\//g, '_');
  return `/images/${postId}.jpg`;
}

export function getPostImages(post: Post): string[] {
  const postId = post.id.replace(/\//g, '_');
  const images: string[] = [];
  if (post.full_picture) {
    images.push(`/images/${postId}.jpg`);
  }
  if (post.attachments?.data) {
    for (const att of post.attachments.data) {
      if (att.subattachments?.data) {
        att.subattachments.data.forEach((_, idx) => {
          images.push(`/images/${postId}_sub${idx}.jpg`);
        });
      }
    }
  }
  return images.length > 0 ? images : [`/images/${postId}.jpg`];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('si-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCategoryStats(): Array<{ category: Category; count: number }> {
  const allPosts = getAllPosts();
  return Object.values(categories).map((cat) => ({
    category: cat,
    count: allPosts.filter((p) => p.category === cat.slug).length,
  })).sort((a, b) => b.count - a.count);
}
