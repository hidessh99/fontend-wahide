import { NavSection } from "../types";

export const docNavigation: NavSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "BookOpen",
    items: [
      {
        id: "intro",
        title: "Introduction",
        path: "/docs/intro",
      },
      {
        id: "authentication",
        title: "Authentication",
        path: "/docs/authentication",
      },
      {
        id: "errors",
        title: "Errors & Rate Limits",
        path: "/docs/errors",
      },
    ],
  },
  {
    id: "channel",
    title: "Channel",
    icon: "Smartphone",
    groups: [
      {
        id: "channel-web-wa",
        title: "WEB Wa (Unofficial)",
        items: [
          {
            id: "devices-list",
            title: "List Devices",
            path: "/docs/devices/list",
            method: "GET",
          },
          {
            id: "devices-create",
            title: "Create Device Slot",
            path: "/docs/devices/create",
            method: "POST",
          },
          {
            id: "devices-pair",
            title: "Connect (QR Code)",
            path: "/docs/devices/pair",
            method: "POST",
          },
          {
            id: "devices-pair-phone",
            title: "Connect (Phone Code)",
            path: "/docs/devices/pair-phone",
            method: "POST",
            badge: "Anti-Camera",
          },
          {
            id: "devices-disconnect",
            title: "Disconnect Device",
            path: "/docs/devices/disconnect",
            method: "POST",
          },
          {
            id: "devices-hibernate",
            title: "Hibernate Session",
            path: "/docs/devices/hibernate",
            method: "POST",
          },
          {
            id: "devices-wake",
            title: "Wake Session",
            path: "/docs/devices/wake",
            method: "POST",
          },
          {
            id: "devices-delete",
            title: "Delete Device",
            path: "/docs/devices/delete",
            method: "DELETE",
          },
        ],
      },
      {
        id: "channel-waba",
        title: "WABA (Official)",
        items: [
          {
            id: "waba-accounts-list",
            title: "List Accounts",
            path: "/docs/waba/accounts",
            method: "GET",
            badge: "Meta Official",
          },
          {
            id: "waba-accounts-connect",
            title: "Connect Account",
            path: "/docs/waba/connect",
            method: "POST",
          },
          {
            id: "waba-accounts-disconnect",
            title: "Disconnect Account",
            path: "/docs/waba/disconnect",
            method: "DELETE",
          },
        ],
      },
      {
        id: "channel-telegram",
        title: "Telegram",
        items: [
          {
            id: "telegram-bots-list",
            title: "List Bots",
            path: "/docs/telegram/bots",
            method: "GET",
          },
          {
            id: "telegram-bots-create",
            title: "Connect Bot (@BotFather)",
            path: "/docs/telegram/create-bot",
            method: "POST",
          },
          {
            id: "telegram-bots-sync",
            title: "Sync Webhook",
            path: "/docs/telegram/sync-webhook",
            method: "POST",
          },
          {
            id: "telegram-bots-delete",
            title: "Delete Bot",
            path: "/docs/telegram/delete-bot",
            method: "DELETE",
          },
        ],
      },
    ],
  },
  {
    id: "send",
    title: "Send",
    icon: "Send",
    groups: [
      {
        id: "send-messenger",
        title: "Messenger",
        items: [
          {
            id: "messaging-send-text",
            title: "Send Text Messages",
            path: "/docs/messaging/send-text",
            method: "POST",
            badge: "Omnichannel",
          },
          {
            id: "messaging-media",
            title: "Send Media Message",
            path: "/docs/messaging/send-media",
            method: "POST",
          },
          {
            id: "messaging-spintax",
            title: "Spintax Dynamic Text",
            path: "/docs/messaging/send-spintax",
            method: "POST",
          },
          {
            id: "messaging-round-robin",
            title: "Round-Robin Dispatch",
            path: "/docs/messaging/send-round-robin",
            method: "POST",
            badge: "Smart",
          },
        ],
      },
      {
        id: "send-otp",
        title: "OTP & Verification",
        items: [
          {
            id: "otp-send",
            title: "Send OTP",
            path: "/docs/otp/send",
            method: "POST",
            badge: "Instant VIP",
          },
          {
            id: "otp-verify",
            title: "Verify OTP",
            path: "/docs/otp/verify",
            method: "POST",
            badge: "Secure",
          },
        ],
      },
      {
        id: "send-campaigns",
        title: "Broadcast / Campaign",
        items: [
          {
            id: "campaigns-create",
            title: "Create Campaign",
            path: "/docs/campaigns/create",
            method: "POST",
            badge: "Omnichannel",
          },
          {
            id: "campaigns-list",
            title: "List Campaigns",
            path: "/docs/campaigns/list",
            method: "GET",
          },
          {
            id: "campaigns-start",
            title: "Start Campaign",
            path: "/docs/campaigns/start",
            method: "POST",
          },
          {
            id: "campaigns-pause",
            title: "Pause Campaign",
            path: "/docs/campaigns/pause",
            method: "POST",
          },
          {
            id: "campaigns-resume",
            title: "Resume Campaign",
            path: "/docs/campaigns/resume",
            method: "POST",
          },
          {
            id: "campaigns-cancel",
            title: "Cancel Campaign",
            path: "/docs/campaigns/cancel",
            method: "POST",
          },
          {
            id: "campaigns-logs",
            title: "Delivery Logs",
            path: "/docs/campaigns/logs",
            method: "GET",
          },
        ],
      },
    ],
  },
  {
    id: "contacts",
    title: "Contacts",
    icon: "Users",
    items: [
      {
        id: "contacts-list",
        title: "List Contacts",
        path: "/docs/contacts/list",
        method: "GET",
      },
      {
        id: "contacts-create",
        title: "Create Contact",
        path: "/docs/contacts/create",
        method: "POST",
      },
      {
        id: "contacts-bulk-import",
        title: "Bulk Import Contacts",
        path: "/docs/contacts/bulk-import",
        method: "POST",
      },
      {
        id: "contacts-bulk-delete",
        title: "Bulk Delete Contacts",
        path: "/docs/contacts/bulk-delete",
        method: "POST",
      },
      {
        id: "contacts-export",
        title: "Export Contacts (CSV)",
        path: "/docs/contacts/export",
        method: "GET",
      },
      {
        id: "contacts-tags",
        title: "Contact Tags",
        path: "/docs/contacts/tags",
        method: "GET",
      },
      {
        id: "contacts-tags-create",
        title: "Create Contact Tag",
        path: "/docs/contacts/create-tag",
        method: "POST",
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks",
    icon: "Webhook",
    items: [
      {
        id: "webhooks-overview",
        title: "Overview & Quickstart",
        path: "/docs/webhooks",
      },
      {
        id: "webhooks-n8n",
        title: "n8n & AI Bot Integration",
        path: "/docs/webhooks/n8n",
        badge: "Workflow",
      },
      {
        id: "webhook-event-received",
        title: "Event: message.received",
        path: "/docs/webhooks/events/message-received",
        method: "POST",
        badge: "Real-Time",
      },
      {
        id: "webhook-event-ack",
        title: "Event: message.ack",
        path: "/docs/webhooks/events/message-ack",
        method: "POST",
        badge: "Receipt",
      },
      {
        id: "webhook-event-sent",
        title: "Event: message.sent",
        path: "/docs/webhooks/events/message-sent",
        method: "POST",
      },
      {
        id: "webhook-event-status",
        title: "Event: device.status",
        path: "/docs/webhooks/events/device-status",
        method: "POST",
        badge: "Device",
      },
      {
        id: "webhook-event-qr",
        title: "Event: device.qr",
        path: "/docs/webhooks/events/device-qr",
        method: "POST",
        badge: "Pairing",
      },
    ],
  },
];
