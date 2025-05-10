export enum PostStatus {
  Draft = "draft",
  Online = "online",
  Offline = "offline",
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: PostStatus;
  locale: string;
  created_at: string;
  updated_at: string;
}