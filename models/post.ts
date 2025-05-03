import { Post } from "@/types/post";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

// Helper function to read posts from markdown files
async function getPostsFromFiles(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'data/posts');

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory not found:', postsDirectory);
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.filter(fileName => fileName.endsWith('.md')).map(fileName => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Combine the data with the content
    return {
      ...data,
      content,
    } as Post;
  });

  // Sort posts by date
  return allPosts.sort((a, b) => {
    if (a.created_at < b.created_at) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function insertPost(post: Post) {
  // In a static implementation, this would write to a file
  console.log('Insert post functionality is not available in static mode');
  return null;
}

export async function updatePost(uuid: string, post: Partial<Post>) {
  // In a static implementation, this would update a file
  console.log('Update post functionality is not available in static mode');
  return null;
}

export async function findPostByUuid(uuid: string): Promise<Post | undefined> {
  const posts = await getPostsFromFiles();
  return posts.find(post => post.uuid === uuid);
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<Post | undefined> {
  const posts = await getPostsFromFiles();
  return posts.find(post => post.slug === slug && post.locale === locale);
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const posts = await getPostsFromFiles();
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return posts.slice(startIndex, endIndex);
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<Post[]> {
  const posts = await getPostsFromFiles();
  const filteredPosts = posts.filter(
    post => post.locale === locale && post.status === PostStatus.Online
  );

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return filteredPosts.slice(startIndex, endIndex);
}
