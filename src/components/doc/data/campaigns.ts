import { EndpointDoc } from "../types";

export const campaignsEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "campaigns-list",
    slug: "campaigns/list",
    title: "List Campaigns",
    description:
      "Fetch broadcast campaigns, their delivery progress, and schedule states.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "GET",
    path: "/api/v1/campaigns",
    parameters: [
      {
        name: "status",
        type: "string",
        required: false,
        description:
          "Filter by status: 'DRAFT', 'RUNNING', 'PAUSED', 'COMPLETED'.",
        example: "RUNNING",
      },
      {
        name: "page",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page number.",
      },
      {
        name: "size",
        type: "integer",
        required: false,
        defaultValue: "10",
        description: "Page size.",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/campaigns?status=RUNNING" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/campaigns", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  params: {
    status: "RUNNING",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/campaigns?status=RUNNING",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/campaigns"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}
params = {
    "status": "RUNNING",
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/campaigns?status=RUNNING"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaigns array.",
        json: `{
  "success": true,
  "payload": [
    {
      "id": "01M1CP001",
      "name": "September Flash Sale Promo",
      "status": "RUNNING",
      "total_recipients": 1200,
      "sent_count": 845,
      "failed_count": 5,
      "device_pool": ["01M1WW3FKR1JS7CW4KGY78Q5ND"]
    }
  ]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-create",
    slug: "campaigns/create",
    title: "Create Campaign",
    description:
      "Drafts a high-throughput broadcast campaign with multi-device pooling, audience segmentation (Tags, All, Custom numbers), human typing simulation, and anti-ban jitter pacing.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns",
    badge: "Omnichannel",
    channelVariants: [
      {
        id: "whatsmeow",
        label: "WhatsApp (Whatsmeow)",
        icon: "Smartphone",
        badge: "Unofficial Socket",
        method: "POST",
        path: "/api/v1/campaigns",
        description:
          "Mass broadcast to WhatsApp contacts using WhatsApp Multi-Device session rotation, Spintax randomizer, human typing jitter pacing, and anti-ban safeguards.",
        parameters: [
          {
            name: "name",
            type: "string",
            required: true,
            description: "Campaign display title.",
            example: "Weekend Flash Sale 50%",
          },
          {
            name: "channel_type",
            type: "string",
            required: false,
            defaultValue: `"WHATSMEOW_UNOFFICIAL"`,
            description: "Channel engine: `WHATSMEOW_UNOFFICIAL`.",
            example: "WHATSMEOW_UNOFFICIAL",
          },
          {
            name: "device_ids",
            type: "array",
            required: true,
            description: "Array of WhatsApp device ULIDs for multi-device round-robin pooling.",
            example: '["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"]',
          },
          {
            name: "message_template",
            type: "string",
            required: true,
            description: "Broadcast template supporting {{name}} placeholders and Spintax {Halo|Hai}.",
            example: "{Halo|Hai} {{name}}, promo diskon 50% spesial untuk Anda!",
          },
          {
            name: "target_type",
            type: "string",
            required: false,
            defaultValue: "TAGS",
            description: "Audience targeting: `TAGS`, `ALL`, or `CUSTOM`.",
            example: "TAGS",
          },
          {
            name: "tag_ids",
            type: "array",
            required: false,
            description: "Tag ULIDs to broadcast to.",
            example: '["01M1TAG01"]',
          },
          {
            name: "jitter_delay_seconds",
            type: "integer",
            required: false,
            defaultValue: "4",
            description: "Anti-ban delay between dispatches (seconds).",
            example: "4",
          },
          {
            name: "enable_human_typing",
            type: "boolean",
            required: false,
            defaultValue: "true",
            description: "Simulate typing presence before sending.",
            example: "true",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Weekend Flash Sale 50%",
    "channel_type": "WHATSMEOW_UNOFFICIAL",
    "device_ids": ["01JPLAN0000000000000000001"],
    "message_template": "{Halo|Hai} {{name}}, promo spesial!",
    "target_type": "TAGS",
    "tag_ids": ["01M1TAG01"],
    "jitter_delay_seconds": 4
  }'`,
          nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/campaigns", {
  name: "Weekend Flash Sale 50%",
  channel_type: "WHATSMEOW_UNOFFICIAL",
  device_ids: ["01JPLAN0000000000000000001"],
  message_template: "{Halo|Hai} {{name}}, promo!",
  target_type: "TAGS",
  tag_ids: ["01M1TAG01"]
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
          php: `<?php /* WhatsApp Broadcast */`,
          python: `import requests
res = requests.post("https://api.wahide.id/api/v1/campaigns", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"name": "Flash Sale", "channel_type": "WHATSMEOW_UNOFFICIAL", "device_ids": ["01JPLAN..."], "message_template": "Promo!"})`,
          go: `// WhatsApp Broadcast in Go`,
        },
        responses: [
          {
            status: 201,
            statusText: "Created",
            description: "Campaign drafted successfully.",
            json: `{ "success": true, "data": { "id": "01M1CP001", "name": "Weekend Flash Sale", "channel_type": "WHATSMEOW_UNOFFICIAL", "status": "DRAFT" } }`,
          },
        ],
      },
      {
        id: "waba",
        label: "WABA (Official)",
        icon: "Globe",
        badge: "Meta Official",
        method: "POST",
        path: "/api/v1/campaigns",
        description:
          "Official Meta WhatsApp Business Cloud API marketing broadcast campaign with verified green tick delivery.",
        parameters: [
          {
            name: "name",
            type: "string",
            required: true,
            description: "Campaign display title.",
            example: "Official Meta New Season Promo",
          },
          {
            name: "channel_type",
            type: "string",
            required: true,
            description: "Must be `META_WABA_OFFICIAL`.",
            example: "META_WABA_OFFICIAL",
          },
          {
            name: "device_id",
            type: "string",
            required: true,
            description: "WABA Account ULID.",
            example: "01JPLAN0000000000000000088",
          },
          {
            name: "message_template",
            type: "string",
            required: true,
            description: "Approved Meta HSM Template string.",
            example: "Halo {{name}}, penawaran resmi dari Wahide.",
          },
          {
            name: "target_type",
            type: "string",
            required: false,
            defaultValue: "TAGS",
            description: "Audience targeting: `TAGS`, `ALL`, or `CUSTOM`.",
            example: "TAGS",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Official Meta New Season Promo",
    "channel_type": "META_WABA_OFFICIAL",
    "device_id": "01JPLAN0000000000000000088",
    "message_template": "Halo {{name}}, promo resmi!",
    "target_type": "TAGS",
    "tag_ids": ["01M1TAG01"]
  }'`,
          nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/campaigns", {
  name: "Official Meta New Season Promo",
  channel_type: "META_WABA_OFFICIAL",
  device_id: "01JPLAN0000000000000000088",
  message_template: "Halo {{name}}!",
  target_type: "TAGS"
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
          php: `<?php /* Meta WABA Broadcast */`,
          python: `import requests
res = requests.post("https://api.wahide.id/api/v1/campaigns", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"name": "WABA Promo", "channel_type": "META_WABA_OFFICIAL"})`,
          go: `// Meta WABA Broadcast in Go`,
        },
        responses: [
          {
            status: 201,
            statusText: "Created",
            description: "WABA campaign created.",
            json: `{ "success": true, "data": { "id": "01M1CP002", "name": "Official Meta Promo", "channel_type": "META_WABA_OFFICIAL", "status": "DRAFT" } }`,
          },
        ],
      },
      {
        id: "telegram",
        label: "Telegram",
        icon: "Send",
        badge: "Bot API",
        method: "POST",
        path: "/api/v1/campaigns",
        description:
          "High-throughput announcement broadcast to registered Telegram users and community subscribers via Telegram Bot API.",
        parameters: [
          {
            name: "name",
            type: "string",
            required: true,
            description: "Campaign display title.",
            example: "Telegram Community Announcement",
          },
          {
            name: "channel_type",
            type: "string",
            required: true,
            description: "Must be `TELEGRAM_BOT`.",
            example: "TELEGRAM_BOT",
          },
          {
            name: "device_id",
            type: "string",
            required: true,
            description: "Target Telegram Bot ULID.",
            example: "01JPLAN0000000000000000001",
          },
          {
            name: "message_template",
            type: "string",
            required: true,
            description: "Broadcast message body supporting HTML tags.",
            example: "<b>Pengumuman:</b> Layanan baru telah aktif!",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Telegram Community Announcement",
    "channel_type": "TELEGRAM_BOT",
    "device_id": "01JPLAN0000000000000000001",
    "message_template": "<b>Pengumuman:</b> Fitur baru telah aktif!",
    "target_type": "ALL"
  }'`,
          nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/campaigns", {
  name: "Telegram Announcement",
  channel_type: "TELEGRAM_BOT",
  device_id: "01JPLAN0000000000000000001",
  message_template: "<b>Pengumuman:</b> Fitur baru telah aktif!",
  target_type: "ALL"
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
          php: `<?php /* Telegram Broadcast */`,
          python: `import requests
res = requests.post("https://api.wahide.id/api/v1/campaigns", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"name": "Telegram Promo", "channel_type": "TELEGRAM_BOT"})`,
          go: `// Telegram Broadcast in Go`,
        },
        responses: [
          {
            status: 201,
            statusText: "Created",
            description: "Telegram broadcast created.",
            json: `{ "success": true, "data": { "id": "01M1CP003", "name": "Telegram Announcement", "channel_type": "TELEGRAM_BOT", "status": "DRAFT" } }`,
          },
        ],
      },
    ],
    bannerNotice: {
      type: "info",
      title: "Omnichannel Multi-Device Rotation Pool",
      content:
        "Supply a single 'device_id' or an array of 'device_ids' to distribute high-volume broadcasts across multiple WhatsApp numbers automatically.",
    },
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Campaign display title (2-150 characters).",
        example: "Weekend Flash Sale 50%",
      },
      {
        name: "device_id",
        type: "string",
        required: true,
        description:
          "Primary WhatsApp sender device ULID. Required if 'device_ids' is omitted.",
        example: "01JPLAN0000000000000000001",
      },
      {
        name: "device_ids",
        type: "array",
        required: false,
        description:
          "Array of device ULIDs for multi-device round-robin pooling across numbers.",
        example: '["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"]',
      },
      {
        name: "message_template",
        type: "string",
        required: true,
        description:
          "Broadcast template supporting {{name}} placeholders and Spintax format {Halo|Hai|Pagi}.",
        example: "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
      },
      {
        name: "media_url",
        type: "string",
        required: false,
        description: "Public URL of an image or PDF flyer attachment.",
        example: "https://example.com/promo.jpg",
      },
      {
        name: "target_type",
        type: "string",
        required: false,
        defaultValue: "TAGS",
        description:
          "Audience targeting strategy: `TAGS` (filter by tag_ids), `ALL` (all saved contacts), or `CUSTOM` (direct phone numbers).",
        example: "TAGS",
      },
      {
        name: "tag_ids",
        type: "array",
        required: false,
        description:
          "Array of contact tag IDs to target. Required when target_type is 'TAGS'.",
        example: '["01M1TAG01"]',
      },
      {
        name: "target_numbers",
        type: "array",
        required: false,
        description:
          "Array of destination phone numbers (E.164). Used when target_type is 'CUSTOM'.",
        example: '["628123456789", "628987654321"]',
      },
      {
        name: "jitter_delay_seconds",
        type: "integer",
        required: false,
        defaultValue: "4",
        description:
          "Dynamic jitter delay between outbound messages to simulate authentic human pacing (Anti-Ban Layer 2).",
        example: "4",
      },
      {
        name: "enable_human_typing",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description: "Broadcasts typing presence indicator before sending each message.",
        example: "true",
      },
      {
        name: "auto_scrub_dead_numbers",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description: "Automatically tags and scrubs invalid numbers from future blasts.",
        example: "false",
      },
      {
        name: "scheduled_at",
        type: "string",
        required: false,
        description:
          "ISO 8601 future datetime string to schedule automated execution. If omitted, campaign is saved as DRAFT.",
        example: "2026-09-25T10:00:00Z",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Weekend Flash Sale 50%",
    "device_id": "01JPLAN0000000000000000001",
    "device_ids": ["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"],
    "message_template": "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
    "target_type": "TAGS",
    "tag_ids": ["01M1TAG01"],
    "jitter_delay_seconds": 4,
    "enable_human_typing": true,
    "auto_scrub_dead_numbers": false
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/campaigns",
  {
    name: "Weekend Flash Sale 50%",
    device_id: "01JPLAN0000000000000000001",
    device_ids: ["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"],
    message_template: "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
    target_type: "TAGS",
    tag_ids: ["01M1TAG01"],
    jitter_delay_seconds: 4,
    enable_human_typing: true,
    auto_scrub_dead_numbers: false,
  },
  {
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);
console.log(res.data);`,
      php: `<?php
$payload = [
  "name" => "Weekend Flash Sale 50%",
  "device_id" => "01JPLAN0000000000000000001",
  "device_ids" => ["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"],
  "message_template" => "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
  "target_type" => "TAGS",
  "tag_ids" => ["01M1TAG01"],
  "jitter_delay_seconds" => 4,
  "enable_human_typing" => true,
  "auto_scrub_dead_numbers" => false,
];

$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/campaigns",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/campaigns"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "name": "Weekend Flash Sale 50%",
    "device_id": "01JPLAN0000000000000000001",
    "device_ids": ["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"],
    "message_template": "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
    "target_type": "TAGS",
    "tag_ids": ["01M1TAG01"],
    "jitter_delay_seconds": 4,
    "enable_human_typing": True,
    "auto_scrub_dead_numbers": False,
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/campaigns"
	payload, _ := json.Marshal(map[string]interface{}{
		"name":                 "Weekend Flash Sale 50%",
		"device_id":            "01JPLAN0000000000000000001",
		"device_ids":           []string{"01JPLAN0000000000000000001", "01JPLAN0000000000000000002"},
		"message_template":     "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
		"target_type":          "TAGS",
		"tag_ids":              []string{"01M1TAG01"},
		"jitter_delay_seconds": 4,
		"enable_human_typing":  true,
	})

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 201,
        statusText: "Created",
        description: "Campaign created in DRAFT state.",
        json: `{
  "success": true,
  "message": "campaign created successfully",
  "data": {
    "id": "01JPLAN0000000000000000077",
    "tenant_id": "01JPLAN0000000000000000000",
    "device_id": "01JPLAN0000000000000000001",
    "device_ids": ["01JPLAN0000000000000000001", "01JPLAN0000000000000000002"],
    "name": "Weekend Flash Sale 50%",
    "message_template": "{Halo|Hai} {{name}}, dapatkan promo diskon 50% akhir pekan ini!",
    "status": "DRAFT",
    "total_target": 1250,
    "total_sent": 0,
    "total_failed": 0,
    "created_at": "2026-09-18T10:00:00Z"
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-start",
    slug: "campaigns/start",
    title: "Start Campaign",
    description:
      "Triggers the Redis Streams background worker to begin dispatching queued messages.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/{campaignId}/start",
    parameters: [
      {
        name: "campaignId",
        type: "string",
        required: true,
        description: "ULID of campaign to launch.",
        example: "01M1CP002",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns/01M1CP002/start" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const campaignId = "01M1CP002";
const res = await axios.post(
  \`https://api.wahide.com/api/v1/campaigns/\${campaignId}/start\`,
  {},
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
      php: `<?php
$campaignId = "01M1CP002";
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/campaigns/{$campaignId}/start",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

campaign_id = "01M1CP002"
url = f"https://api.wahide.com/api/v1/campaigns/{campaign_id}/start"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}

response = requests.post(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	campaignID := "01M1CP002"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/campaigns/%s/start", campaignID)

	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign started.",
        json: `{ "success": true, "message": "campaign started" }`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-pause",
    slug: "campaigns/pause",
    title: "Pause Campaign",
    description: "Halts dispatching temporarily without losing queue index.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/{campaignId}/pause",
    parameters: [
      {
        name: "campaignId",
        type: "string",
        required: true,
        description: "ULID of campaign to pause.",
        example: "01M1CP002",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns/01M1CP002/pause" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const campaignId = "01M1CP002";
const res = await axios.post(
  \`https://api.wahide.com/api/v1/campaigns/\${campaignId}/pause\`,
  {},
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
      php: `<?php
$campaignId = "01M1CP002";
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/campaigns/{$campaignId}/pause",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

campaign_id = "01M1CP002"
url = f"https://api.wahide.com/api/v1/campaigns/{campaign_id}/pause"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}

response = requests.post(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	campaignID := "01M1CP002"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/campaigns/%s/pause", campaignID)

	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign paused.",
        json: `{ "success": true, "message": "campaign paused" }`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-logs",
    slug: "campaigns/logs",
    title: "Campaign Delivery Logs",
    description:
      "Inspect message-by-message delivery status, timestamps, and error codes for a campaign.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "GET",
    path: "/api/v1/campaigns/logs",
    parameters: [
      {
        name: "campaign_id",
        type: "string",
        required: true,
        description: "ULID of the campaign.",
        example: "01M1CP001",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/campaigns/logs?campaign_id=01M1CP001" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/campaigns/logs", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  params: {
    campaign_id: "01M1CP001",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/campaigns/logs?campaign_id=01M1CP001",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/campaigns/logs"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}
params = {
    "campaign_id": "01M1CP001",
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/campaigns/logs?campaign_id=01M1CP001"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Delivery log items.",
        json: `{
  "success": true,
  "payload": [
    {
      "id": "01M1LOG01",
      "phone": "628123456789",
      "status": "SENT",
      "message_id": "3EB0ABC123",
      "dispatched_at": "2026-09-07T10:15:00.000+07:00"
    }
  ]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-resume",
    slug: "campaigns/resume",
    title: "Resume Paused Campaign",
    description:
      "Resumes an actively paused broadcast campaign. Continues queued message dispatches from where it stopped.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/:id/resume",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ULID of the campaign to resume.",
        example: "01JPLAN0000000000000000077",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/resume" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/resume",
  {},
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/resume",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/resume"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.post(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/resume"
	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign resumed.",
        json: `{
  "success": true,
  "message": "campaign resumed successfully",
  "data": { "id": "01JPLAN0000000000000000077", "status": "RUNNING" }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "campaigns-cancel",
    slug: "campaigns/cancel",
    title: "Cancel Broadcast Campaign",
    description:
      "Permanently halts campaign execution and drains unsent pending message queues.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns/:id/cancel",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ULID of the campaign to cancel.",
        example: "01JPLAN0000000000000000077",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/cancel" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/cancel",
  {},
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/cancel",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/cancel"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.post(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/campaigns/01JPLAN0000000000000000077/cancel"
	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "Campaign cancelled.",
        json: `{
  "success": true,
  "message": "campaign cancelled successfully",
  "data": { "id": "01JPLAN0000000000000000077", "status": "CANCELLED" }
}`,
      },
    ],
  },
];
