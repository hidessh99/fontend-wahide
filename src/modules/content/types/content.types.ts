export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  publishedAt: string;
}

export interface SystemSettings {
  siteName: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  supportEmail: string;
}
