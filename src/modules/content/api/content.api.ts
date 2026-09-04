import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { BlogPost, SystemSettings } from "../types/content.types";

const PUBLIC_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "post_01",
    slug: "5-layer-anti-ban-protection-whatsapp-2026",
    title: "5 Lapisan Perlindungan Anti-Ban WhatsApp Gateway 2026",
    excerpt:
      "Panduan lengkap bagaimana arsitektur multi-device native dan Spintax Regex mencegah blokir nomor saat broadcast skala besar.",
    content: `Mengirim pesan broadcast dalam jumlah puluhan ribu nomor setiap harinya membutuhkan arsitektur pertahanan yang disiplin. Pada platform Wahide, kami menerapkan 5 Layer Anti-Ban:\n\n1. **Dynamic Spintax Syntax Engine**: Variasi sinonim kata otomatis.\n2. **Human Typing Simulation (ChatPresence)**: Simulasi mengetik 1.5 - 3 detik.\n3. **Jitter Delay & Random Backoff**: Jeda pengiriman acak 3 - 15 detik.\n4. **Session Hibernation Protocol**: Memutus TCP socket saat idle untuk menghemat memori.\n5. **Zero-Heap Event Filtering**: Mengabaikan status presence broadcast yang membebani heap.`,
    author: "Wahide Core Team",
    tags: ["WhatsApp", "Anti-Ban", "Spintax", "Architecture"],
    publishedAt: "2026-08-25T10:00:00Z",
  },
  {
    id: "post_02",
    slug: "integrasi-webhook-signature-hmac-sha256",
    title: "Panduan Verifikasi Webhook HMAC SHA256 di Node.js & Go",
    excerpt:
      "Cara mengamankan endpoint webhook aplikasi Anda dari serangan replay dan spoofing payload menggunakan header X-Wahide-Signature-256.",
    content: `Keamanan transmisi event real-time adalah prioritas utama. Setiap event HTTP POST yang dikirimkan oleh Wahide Gateway menyertakan header signature HMAC SHA256.\n\nContoh verifikasi di Node.js:\n\`\`\`javascript\nconst crypto = require('crypto');\nconst signature = req.headers['x-wahide-signature-256'];\nconst expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');\nif (signature !== expected) throw new Error('Invalid signature');\n\`\`\``,
    author: "Security Team",
    tags: ["Webhook", "Security", "HMAC", "API"],
    publishedAt: "2026-08-28T14:00:00Z",
  },
];

export const contentApi = {
  getPosts: async (): Promise<BlogPost[]> => {
    try {
      const res = await httpClient.get<BlogPost[]>(`${PUBLIC_BASE}/posts`);
      return res.payload || DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const res = await httpClient.get<BlogPost>(`${PUBLIC_BASE}/posts/${slug}`);
      return res.payload || DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    } catch {
      return DEFAULT_POSTS.find((p) => p.slug === slug) || null;
    }
  },

  getPublicSettings: async (): Promise<SystemSettings> => {
    try {
      const res = await httpClient.get<SystemSettings>(`${PUBLIC_BASE}/settings`);
      return (
        res.payload || {
          siteName: "Wahide",
          allowRegistration: true,
          maintenanceMode: false,
          supportEmail: "support@wahide.com",
        }
      );
    } catch {
      return {
        siteName: "Wahide",
        allowRegistration: true,
        maintenanceMode: false,
        supportEmail: "support@wahide.com",
      };
    }
  },
};
