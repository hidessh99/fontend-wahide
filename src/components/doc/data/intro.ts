import { GuideDoc } from "../types";

export const introDoc: GuideDoc = {
  type: "guide",
  id: "intro",
  slug: "intro",
  title: "Introduction",
  description:
    "The Wahide REST API provides enterprise-grade programmatic access to Omnichannel Messaging (WhatsApp Multi-Device, Meta WABA, Telegram, Email) and an Intelligent Autoreply & Visual Flow chatbot ecosystem.",
  category: "Getting Started",
  categorySlug: "getting-started",
  sections: [
    {
      id: "api-overview",
      title: "API Architecture & Standards",
      content:
        "The Wahide API is organized around RESTful principles. All requests are communicated over HTTPS using standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) and expect/return UTF-8 encoded JSON payloads.\n\nAll endpoints require authentication using a Bearer token or API key in the request headers.",
      callout: {
        type: "info",
        title: "API Base URL",
        content:
          "Active API Base URL:\n`https://api.wahide.id/api/v1`\n\nAll endpoint paths documented in this reference are relative to this root URL. In local development or staging, this dynamically adapts from `NEXT_PUBLIC_API_BASE_URL`.",
      },
    },
    {
      id: "omnichannel-channels",
      title: "Supported Omnichannel Channels",
      content:
        "• **WhatsApp Multi-Device (whatsmeow)**: High-concurrency socket engine with 5-layer anti-ban protection, pairing via QR or 8-digit phone code, and session hibernation & wake.\n• **WhatsApp Cloud API (WABA)**: Official Meta Cloud API integration with high deliverability and embedded signup support.\n• **Telegram Bot API**: Multi-bot management, interactive buttons, webhook synchronization, and message dispatching.\n• **Transactional Email**: High-reputation transactional delivery powered by Resend / SMTP.\n• **Autoreply Ecosystem**: Single-turn keyword rules (Aho-Corasick O(M)), Interactive Visual DAG Flows, Form Submissions (LMAX Ring-Buffer Batch Flusher), and Live Google Spreadsheet lookup.",
    },
    {
      id: "phone-format",
      title: "Phone Number Formatting",
      content:
        "All phone numbers must follow the international E.164 standard without spaces, dashes, parentheses, or a leading plus sign (+) or zero.\n\nFor example, an Indonesian number 0812-3456-7890 should be formatted as:\n`6281234567890`",
      callout: {
        type: "tip",
        title: "Country Code Required",
        content:
          "Always include the country dial code (e.g. 62 for Indonesia, 1 for United States, 60 for Malaysia). Requests with invalid formats will return an HTTP 400 response.",
      },
    },
    {
      id: "quick-start",
      title: "Quickstart",
      content:
        "You can test your API connectivity by dispatching a test message via cURL. Replace `YOUR_API_KEY` with your secret key from the dashboard settings:",
      code: {
        language: "bash",
        title: "cURL Quickstart",
        content: `curl -X POST "https://api.wahide.id/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "Hello, your order #INV-2026 has been confirmed."
  }'`,
      },
    },
    {
      id: "features",
      title: "Key Capabilities",
      content:
        "• **Multi-Device Rotation**: Connect multiple WhatsApp phone numbers and distribute message loads automatically via round-robin pooling.\n• **Aho-Corasick Multi-Pattern Automaton**: Instant O(M) keyword evaluation for 50,000+ autoreply rules without linear loop overhead.\n• **Hibernation Exemption Guard**: Automatically prevents device socket reaper disconnects for devices with active autoreply rules.\n• **Dual-Driver NATS & Redis Support**: Stateless Go runtime with sub-millisecond in-memory cache and stream pipelines.\n• **Interactive Visual DAG Flow Builder**: Multi-turn conversational flows with drag-and-drop canvas and real-time simulator.",
    },
  ],
};
