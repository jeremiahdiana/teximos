import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

/**
 * A topic label to a URL slug. "Model releases" becomes "model-releases", so
 * the kicker a reader sees and the path they land on stay legibly the same.
 */
export function topicSlug(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Topic {
  label: string;
  slug: string;
  count: number;
}

/**
 * Distinct topics across a set of posts, first-seen label wins per slug, sorted
 * by label. Shared by the archive chip row and the /topic/[topic] routes, so
 * the two never disagree on what a topic is called or where it lives.
 */
export function topicsFromPosts(posts: Post[]): Topic[] {
  const seen = new Map<string, Topic>();
  for (const post of posts) {
    const label = post.data.topic;
    const slug = topicSlug(label);
    const existing = seen.get(slug);
    if (existing) existing.count += 1;
    else seen.set(slug, { label, slug, count: 1 });
  }
  return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}
