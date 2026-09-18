import { DocItem } from "../types";

export interface DocSeoMetadata {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

const SEO_DIRECTORY: Record<string, DocSeoMetadata> = {
  intro: {
    seoTitle: "WhatsApp API Documentation",
    seoDescription:
      "Official developer guide for Wahide WhatsApp Multi-Device REST API. Explore architecture, base URLs, phone number formats, and cURL quickstart.",
    keywords: [
      "WhatsApp API",
      "WhatsApp REST API",
      "WhatsApp Multi Device API",
      "WhatsApp Developer Docs",
      "WhatsApp Gateway Indonesia",
    ],
  },
  authentication: {
    seoTitle: "API Authentication & Bearer Tokens",
    seoDescription:
      "Learn how to authenticate requests to the Wahide REST API using Bearer tokens and API keys. Best practices for secure WhatsApp integration.",
    keywords: [
      "WhatsApp API Authentication",
      "Bearer Token API",
      "Wahide API Keys",
      "WhatsApp API Security",
    ],
  },
  errors: {
    seoTitle: "API Status Codes & Rate Limits",
    seoDescription:
      "Complete reference for Wahide WhatsApp REST API HTTP status codes, JSON error schemas, troubleshooting solutions, and rate limit policies.",
    keywords: [
      "WhatsApp API Error Codes",
      "WhatsApp Rate Limits",
      "REST API HTTP Status Codes",
      "WhatsApp Error Handling",
    ],
  },
  "messaging/send-text": {
    seoTitle: "Send WhatsApp Text Message API",
    seoDescription:
      "Dispatch instant WhatsApp text messages with typing indicators and multi-device rotation. Ready code examples in cURL, Node.js, PHP, Python, and Go.",
    keywords: [
      "Send WhatsApp Message API",
      "WhatsApp Text Message REST API",
      "Send WhatsApp Message API",
      "WhatsApp cURL Node PHP",
      "WhatsApp Anti Ban API",
    ],
  },
  "messaging/send-round-robin": {
    seoTitle: "Multi-Device WhatsApp Rotation API",
    seoDescription:
      "Distribute outbound WhatsApp messages across multiple active devices automatically. Eliminate single-number limits and prevent account restrictions.",
    keywords: [
      "WhatsApp Round Robin API",
      "WhatsApp Multi Device Rotation",
      "Load Balancing WhatsApp",
      "High Volume WhatsApp API",
    ],
  },
  "messaging/send-spintax": {
    seoTitle: "Send Dynamic Spintax WhatsApp API",
    seoDescription:
      "Randomize message variations using nested Spintax tags to create unique message copies. Prevent automated WhatsApp spam heuristics.",
    keywords: [
      "WhatsApp Spintax API",
      "Dynamic Message Variations",
      "WhatsApp Anti Spam",
      "Spintax Formatting WhatsApp",
    ],
  },
  "messaging/send-media": {
    seoTitle: "Send WhatsApp Media & PDF API",
    seoDescription:
      "Send images, PDF invoices, documents, audio, and video files to WhatsApp contacts via REST API with custom filenames and captions.",
    keywords: [
      "Send WhatsApp PDF API",
      "Send WhatsApp Image API",
      "WhatsApp Media REST API",
      "Send WhatsApp Media API",
    ],
  },
  "messaging/meta-cloud-api": {
    seoTitle: "Meta WhatsApp Cloud API Endpoint",
    seoDescription:
      "Drop-in compatibility route for Meta WhatsApp Cloud API v18.0 SDKs. Connect your existing Meta applications to Wahide without rewriting schemas.",
    keywords: [
      "Meta Cloud API Compatible",
      "WhatsApp Cloud API v18",
      "Meta SDK WhatsApp Alternative",
      "WhatsApp Cloud API Migration",
    ],
  },
  "otp/send": {
    seoTitle: "Send WhatsApp OTP API | Wahide",
    seoDescription:
      "Instant WhatsApp OTP code delivery with automatic 6-digit cryptographic generation, Redis 5-minute TTL, 60s cooldown, and VIP stream priority.",
    keywords: [
      "Send WhatsApp OTP API",
      "WhatsApp OTP REST API",
      "Send WhatsApp OTP API",
      "WhatsApp Verification Code API",
      "WhatsApp OTP Gateway Indonesia",
    ],
  },
  "otp/verify": {
    seoTitle: "Verify WhatsApp OTP API | Wahide",
    seoDescription:
      "Atomic WhatsApp OTP verification API. Features single-use auto-burn against replay attacks, 5-attempt brute-force protection, and constant-time validation.",
    keywords: [
      "Verify WhatsApp OTP API",
      "Verify WhatsApp OTP API",
      "WhatsApp OTP Verification API",
      "Single Use OTP API",
      "WhatsApp Secure Auth API",
    ],
  },
  "devices/list": {
    seoTitle: "List Connected WhatsApp Devices",
    seoDescription:
      "Retrieve all WhatsApp device slots, live connection states, trust scores, and anti-ban warmup limits via Wahide REST API.",
    keywords: [
      "List WhatsApp Devices API",
      "WhatsApp Device Status",
      "WhatsApp Session Monitor",
      "WhatsApp Multi-Device Pool",
    ],
  },
  "devices/create": {
    seoTitle: "Register WhatsApp Device Slot API",
    seoDescription:
      "Create and allocate a new WhatsApp device slot for your organization ready for QR code pairing and automated messaging.",
    keywords: [
      "Create WhatsApp Device API",
      "Add WhatsApp Device Slot",
      "WhatsApp Slot Registration",
    ],
  },
  "devices/pair": {
    seoTitle: "Pair WhatsApp Device via QR API",
    seoDescription:
      "Generate Base64 QR code streams for instant Multi-Device WhatsApp Web pairing directly from your backend application.",
    keywords: [
      "WhatsApp QR Code API",
      "Pair WhatsApp Web API",
      "Scan QR WhatsApp API",
      "WhatsApp Session Connect",
    ],
  },
  "devices/disconnect": {
    seoTitle: "Disconnect WhatsApp Device Session",
    seoDescription:
      "Safely terminate an active WhatsApp session without losing historic message analytics or contact associations.",
    keywords: [
      "Disconnect WhatsApp API",
      "Logout WhatsApp Session",
      "Unlink WhatsApp Web",
    ],
  },
  "devices/delete": {
    seoTitle: "Delete WhatsApp Device Slot API",
    seoDescription:
      "Permanently delete a WhatsApp device slot from your tenant organization through the Wahide REST API.",
    keywords: ["Delete WhatsApp Device API", "Remove WhatsApp Slot"],
  },
  "contacts/list": {
    seoTitle: "List & Search WhatsApp Contacts API",
    seoDescription:
      "Search, filter, and paginate through your stored WhatsApp contact address book with tag-based queries and custom field attributes.",
    keywords: [
      "WhatsApp Contacts API",
      "Search WhatsApp Contacts",
      "WhatsApp Address Book REST",
    ],
  },
  "contacts/create": {
    seoTitle: "Create WhatsApp Contact API",
    seoDescription:
      "Add individual WhatsApp contact records with custom attributes and tags for broadcast personalization and CRM integration.",
    keywords: ["Create WhatsApp Contact API", "Add Contact WhatsApp CRM"],
  },
  "contacts/bulk-import": {
    seoTitle: "Bulk Import WhatsApp Contacts API",
    seoDescription:
      "Import up to 5,000 WhatsApp contacts in a single high-throughput batch operation with automatic validation and tag assignment.",
    keywords: [
      "Bulk Import WhatsApp Contacts",
      "Import Kontak WhatsApp API",
      "Mass Contact Upload WhatsApp",
    ],
  },
  "contacts/bulk-delete": {
    seoTitle: "Bulk Delete WhatsApp Contacts API",
    seoDescription:
      "Delete multiple WhatsApp contact records simultaneously by ID array for efficient contact database hygiene.",
    keywords: ["Bulk Delete WhatsApp Contacts", "Hapus Kontak WhatsApp API"],
  },
  "contacts/tags": {
    seoTitle: "Manage WhatsApp Contact Tags API",
    seoDescription:
      "Retrieve user tags and audience counts to segment WhatsApp contacts for targeted marketing and automated broadcast campaigns.",
    keywords: [
      "WhatsApp Contact Tags API",
      "Tag Kontak WhatsApp",
      "Audience Segmentation WhatsApp",
    ],
  },
  "campaigns/list": {
    seoTitle: "List WhatsApp Broadcast Campaigns",
    seoDescription:
      "Fetch broadcast campaigns, real-time message delivery progress, queue counts, and schedule states via Wahide REST API.",
    keywords: [
      "List WhatsApp Campaigns",
      "WhatsApp Broadcast Status",
      "Broadcast Monitor WhatsApp",
    ],
  },
  "campaigns/create": {
    seoTitle: "Create WhatsApp Broadcast Campaign",
    seoDescription:
      "Configure automated WhatsApp broadcast queues with rate limits, randomized jitter backoff, and targeted contact tags.",
    keywords: [
      "Create WhatsApp Broadcast API",
      "Send WhatsApp Broadcast API",
      "WhatsApp Blast API",
    ],
  },
  "campaigns/start": {
    seoTitle: "Start WhatsApp Broadcast Campaign",
    seoDescription:
      "Trigger the Redis Streams queue worker to initiate dispatching queued WhatsApp broadcast messages across active devices.",
    keywords: ["Start WhatsApp Campaign API", "Dispatch WhatsApp Broadcast"],
  },
  "campaigns/pause": {
    seoTitle: "Pause WhatsApp Broadcast Campaign",
    seoDescription:
      "Temporarily halt active WhatsApp broadcast message dispatching without losing current queue positions or campaign logs.",
    keywords: ["Pause WhatsApp Broadcast", "Hentikan Sementara Broadcast"],
  },
  "campaigns/logs": {
    seoTitle: "WhatsApp Campaign Delivery Logs API",
    seoDescription:
      "Inspect message-level delivery statuses (PENDING, SENT, DELIVERED, READ, FAILED), timestamps, and error codes for any broadcast campaign.",
    keywords: [
      "WhatsApp Campaign Logs API",
      "Message Delivery Status Tracking",
      "Laporan Pengiriman WhatsApp",
    ],
  },
  webhooks: {
    seoTitle: "WhatsApp Webhook Integration Guide",
    seoDescription:
      "Configure secure HTTP Webhooks for real-time incoming WhatsApp messages, delivery receipts, retry policies, and Circuit Breaker architecture.",
    keywords: [
      "WhatsApp Webhook",
      "WhatsApp Real-Time Events",
      "WhatsApp Webhook Secret",
      "WhatsApp Webhooks API",
    ],
  },
  "webhooks/events": {
    seoTitle: "WhatsApp Webhook Events Reference",
    seoDescription:
      "Complete JSON payload schemas for WhatsApp incoming messages, delivery receipts, and device status events in Wahide.",
    keywords: ["WhatsApp Webhook Events", "WhatsApp Message Webhook JSON"],
  },
  "webhooks/events/message-received": {
    seoTitle: "Webhook Event: message.received API",
    seoDescription:
      "Receive incoming WhatsApp messages (text, photos, PDF attachments) via HTTP POST with automatic Cloudflare R2 streaming.",
    keywords: [
      "WhatsApp Incoming Message Webhook",
      "WhatsApp Media Attachment Webhook",
      "message.received JSON Schema",
    ],
  },
  "webhooks/events/message-ack": {
    seoTitle: "Webhook Event: message.ack Delivery API",
    seoDescription:
      "Track WhatsApp delivery receipt checkmarks in real time (Sent, Delivered Double Tick, and Read Blue Tick) via webhook callback.",
    keywords: [
      "WhatsApp Delivery Receipt Webhook",
      "WhatsApp Blue Tick Callback",
      "message.ack Status Codes",
    ],
  },
  "webhooks/events/message-sent": {
    seoTitle: "Webhook Event: message.sent Dispatch API",
    seoDescription:
      "Immediate confirmation webhook dispatched when outbound WhatsApp messages are successfully handed over to WhatsApp servers.",
    keywords: [
      "WhatsApp Message Sent Webhook",
      "Outbound WhatsApp Confirmation",
    ],
  },
  "webhooks/events/device-status": {
    seoTitle: "Webhook Event: device.status Health API",
    seoDescription:
      "Monitor WhatsApp device connection state changes (ONLINE, OFFLINE, HIBERNATED, LOGGED_OUT) with automatic alerting payloads.",
    keywords: [
      "WhatsApp Device Status Webhook",
      "WhatsApp Disconnect Alert",
      "Device Health Monitoring API",
    ],
  },
  "webhooks/events/device-qr": {
    seoTitle: "Webhook Event: device.qr Streaming API",
    seoDescription:
      "Real-time streaming Base64 QR code and raw pairing strings for custom WhatsApp web login and pairing screens.",
    keywords: [
      "WhatsApp QR Webhook Stream",
      "Headless WhatsApp Pairing",
      "Custom WhatsApp QR Login",
    ],
  },
  "telegram/bots": {
    seoTitle: "Telegram Bots Management API",
    seoDescription:
      "Manage Telegram bot instances, view webhook synchronization states, and monitor daily transmission limits.",
    keywords: ["Telegram Bot API", "Telegram Gateway", "Telegram Bot Management", "Wahide Telegram"],
  },
  "telegram/create-bot": {
    seoTitle: "Connect Telegram Bot via @BotFather Token",
    seoDescription:
      "Register a Telegram Bot token, automatically configure webhooks, and start sending messages instantly.",
    keywords: ["Telegram Bot Token", "Connect Telegram Bot", "Telegram Webhook Setup"],
  },
  "telegram/send-message": {
    seoTitle: "Send Telegram Message API",
    seoDescription:
      "Dispatch markdown or HTML formatted messages to Telegram users and channels via high-speed REST API.",
    keywords: ["Send Telegram Message", "Telegram REST API", "Telegram Omnichannel Gateway"],
  },
  "autoreply/rules": {
    seoTitle: "Autoreply Rules & O(M) Keyword Matching",
    seoDescription:
      "Configure instant keyword-based auto-replies powered by the Aho-Corasick multi-pattern automaton with zero linear loop latency.",
    keywords: ["WhatsApp Autoreply API", "Chatbot Keyword Matching", "Aho-Corasick Autoreply", "Auto Responder"],
  },
  "autoreply/flows": {
    seoTitle: "Interactive Conversational Chatbot Flows API",
    seoDescription:
      "Build and automate visual DAG multi-step chatbot flows with message prompts, variables, conditional branches, and lead capture.",
    keywords: ["Interactive Chatbot Flow", "WhatsApp Visual Flow Builder", "Conversational AI Gateway"],
  },
  "autoreply/simulate-flow": {
    seoTitle: "Simulate Conversational Flow API",
    seoDescription:
      "Test and preview step-by-step chatbot responses in real time without requiring a physical connected device.",
    keywords: ["Chatbot Flow Simulator", "Test WhatsApp Bot", "Conversational Flow Testing"],
  },
  "autoreply/submissions": {
    seoTitle: "Captured Form Leads & Submissions API",
    seoDescription:
      "Access leads captured through interactive conversational forms. Ingested with high-throughput LMAX Ring-Buffer Batch Flusher.",
    keywords: ["Form Submissions API", "WhatsApp Lead Generation", "Chatbot Data Capture"],
  },
  "autoreply/spreadsheet": {
    seoTitle: "Google Sheets Live CSV Lookup Table API",
    seoDescription:
      "Connect published Google Sheets CSV URLs for dynamic automated Q&A lookups with background cron synchronization.",
    keywords: ["Google Sheets WhatsApp Sync", "Spreadsheet Chatbot Lookup", "Auto Response from Sheet"],
  },
  "devices/pair-phone": {
    seoTitle: "Pair WhatsApp via 8-Digit Phone Code",
    seoDescription:
      "Link WhatsApp devices using an 8-character phone pairing code directly in the WhatsApp mobile app without camera QR scanning.",
    keywords: ["WhatsApp Phone Pairing Code", "Link Device Without QR", "WhatsApp Pairing API"],
  },
  "devices/hibernate": {
    seoTitle: "WhatsApp Session Hibernation API",
    seoDescription:
      "Hibernate idle WhatsApp device sockets to save memory while keeping authentication tokens secure in stateless Go runtime.",
    keywords: ["WhatsApp Session Hibernation", "Memory Efficient WhatsApp Gateway", "Socket Hibernation"],
  },
  "waba/accounts": {
    seoTitle: "Official Meta WhatsApp Cloud API (WABA) Accounts",
    seoDescription:
      "Connect and manage official Meta WhatsApp Business API Cloud accounts with verified business name badging.",
    keywords: ["WhatsApp Business Cloud API", "Meta WABA Accounts", "Official WhatsApp API Indonesia"],
  },
};

/**
 * Get highly optimized SEO metadata for a document item
 */
export function getDocSeoMetadata(
  slug: string,
  fallbackTitle: string,
  fallbackDesc: string,
): DocSeoMetadata {
  const custom = SEO_DIRECTORY[slug];
  if (custom) {
    return custom;
  }

  // Smart fallback adhering strictly to 45 chars title & 150 chars description
  const cleanTitle =
    fallbackTitle.length > 40
      ? `${fallbackTitle.slice(0, 37)}...`
      : fallbackTitle;
  const cleanDesc =
    fallbackDesc.length > 155
      ? `${fallbackDesc.slice(0, 150).trim()}...`
      : fallbackDesc;

  return {
    seoTitle: `${cleanTitle} API`,
    seoDescription: cleanDesc,
    keywords: ["WhatsApp API", "Wahide API Docs", "REST API"],
  };
}

/**
 * Generate Schema.org JSON-LD structured data for Google Rich Results
 */
export function generateDocJsonLd(doc: DocItem, baseUrl: string) {
  const seo = getDocSeoMetadata(doc.slug, doc.title, doc.description);
  const pageUrl = `${baseUrl}/docs/${doc.slug}`;

  // 1. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Docs",
        item: `${baseUrl}/docs/intro`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: doc.category,
        item: `${baseUrl}/docs/${doc.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: doc.title,
        item: pageUrl,
      },
    ],
  };

  // 2. TechArticle / APIReference Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${seo.seoTitle} | Wahide API`,
    description: seo.seoDescription,
    url: pageUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "Wahide WhatsApp API Docs",
      url: `${baseUrl}/docs`,
    },
    publisher: {
      "@type": "Organization",
      name: "Wahide",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.png`,
      },
    },
    about: {
      "@type": "SoftwareApplication",
      name: "Wahide WhatsApp REST API",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cloud / All",
    },
  };

  return [breadcrumbSchema, articleSchema];
}
