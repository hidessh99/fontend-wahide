import { EndpointDoc } from "../types";

export const messagingEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "messaging-send-text",
    slug: "messaging/send-text",
    title: "Send Text Messages",
    description:
      "Dispatches an instant WhatsApp text message to a single recipient phone number with automatic typing simulation, Spintax variation, and smart device rotation.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Popular",
    channelVariants: [
      {
        id: "whatsmeow",
        label: "WhatsApp (Whatsmeow)",
        icon: "Smartphone",
        badge: "Unofficial Socket",
        method: "POST",
        path: "/api/v1/wa/messages/send",
        description:
          "Dispatches WhatsApp messages via connected WhatsApp Multi-Device socket (whatsmeow) with Spintax, presence typing simulation, and anti-ban safeguards.",
        headers: [
          {
            key: "Authorization",
            value: "Bearer <your_api_key>",
            required: true,
            description: "Your secret Wahide API Key prefixed with Bearer.",
          },
          {
            key: "Content-Type",
            value: "application/json",
            required: true,
            description: "Must be set to application/json.",
          },
        ],
        parameters: [
          {
            name: "phone",
            type: "string",
            required: true,
            description:
              "Target recipient phone number in international E.164 format without spaces or symbols (e.g. 628123456789).",
            example: "628123456789",
          },
          {
            name: "message",
            type: "string",
            required: true,
            description:
              "Text message body. Supports UTF-8 emojis, WhatsApp markdown (*bold*, _italic_), and Spintax variations {Halo|Hai|Pagi}.",
            example: "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
          },
          {
            name: "device_id",
            type: "string",
            required: false,
            defaultValue: `"auto"`,
            description:
              "Specific WhatsApp Device ID slot. If 'auto' or omitted, uses round-robin across active devices.",
            example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
          },
          {
            name: "simulate_typing",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description:
              "When true, broadcasts a natural typing presence event before dispatching.",
            example: "true",
          },
          {
            name: "typing_delay_ms",
            type: "integer",
            required: false,
            defaultValue: "0",
            description:
              "Custom typing delay in milliseconds. If 0 with simulate_typing: true, calculated based on message length.",
            example: "1500",
          },
          {
            name: "parse_spintax",
            type: "boolean",
            required: false,
            defaultValue: "true",
            description:
              "Automatically resolves Spintax variations for anti-ban rotation.",
            example: "true",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id": "auto",
    "simulate_typing": true,
    "typing_delay_ms": 1500,
    "parse_spintax": true
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/messages/send",
  {
    phone: "628123456789",
    message: "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    device_id: "auto",
    simulate_typing: true,
    typing_delay_ms: 1500,
    parse_spintax: true,
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
$curl = curl_init();
$payload = [
    "phone" => "628123456789",
    "message" => "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id" => "auto",
    "simulate_typing" => true,
    "typing_delay_ms" => 1500,
    "parse_spintax" => true
];
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.id/api/v1/wa/messages/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json"
    ],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
          python: `import requests

url = "https://api.wahide.id/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "phone": "628123456789",
    "message": "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id": "auto",
    "simulate_typing": True,
    "typing_delay_ms": 1500,
    "parse_spintax": True
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
	url := "https://api.wahide.id/api/v1/wa/messages/send"
	payload := map[string]interface{}{
		"phone":           "628123456789",
		"message":         "Halo Alex, pesanan #INV-2026 Anda sedang diproses.",
		"device_id":       "auto",
		"simulate_typing": true,
		"typing_delay_ms": 1500,
		"parse_spintax":   true,
	}
	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
            status: 200,
            statusText: "OK",
            description: "WhatsApp message dispatched successfully.",
            json: `{
  "success": true,
  "message": "Pesan WhatsApp berhasil dikirim",
  "data": {
    "message_id": "3EB0A1B2C3D4E5F6",
    "phone": "628123456789",
    "device_id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "status": "SENT",
    "sent_at": "2026-09-18T10:00:00Z"
  }
}`,
          },
        ],
        subtypes: [
          {
            id: "text",
            label: "Teks",
            method: "POST",
            path: "/api/v1/wa/messages/send",
            description: "Dispatches an instant WhatsApp text message with Spintax and typing simulation.",
            parameters: [
              {
                name: "phone",
                type: "string",
                required: true,
                description: "Target recipient phone number in E.164 format.",
                example: "628123456789",
              },
              {
                name: "message",
                type: "string",
                required: true,
                description: "Text message body with optional Spintax {Halo|Hai}.",
                example: "{Halo|Hai} Alex, pesanan Anda dikonfirmasi!",
              },
              {
                name: "device_id",
                type: "string",
                required: false,
                defaultValue: `"auto"`,
                description: "WhatsApp device slot ULID or 'auto'.",
                example: "auto",
              },
              {
                name: "simulate_typing",
                type: "boolean",
                required: false,
                defaultValue: "false",
                description: "Broadcast presence typing event before sending.",
                example: "true",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id": "auto",
    "simulate_typing": true
  }'`,
              nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/messages/send",
  {
    phone: "628123456789",
    message: "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    device_id: "auto",
    simulate_typing: true,
  },
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
              php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/messages/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "message" => "Halo Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id" => "auto",
    "simulate_typing" => true,
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
              python: `import requests

res = requests.post(
    "https://api.wahide.id/api/v1/wa/messages/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "phone": "628123456789",
        "message": "Halo Alex, pesanan #INV-2026 Anda sedang diproses.",
        "device_id": "auto",
        "simulate_typing": True,
    }
)
print(res.json())`,
              go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"phone":           "628123456789",
		"message":         "Halo Alex, pesanan #INV-2026 Anda sedang diproses.",
		"device_id":       "auto",
		"simulate_typing": true,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/wa/messages/send", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Println("Status:", resp.Status)
}`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Text message sent.",
                json: `{
  "success": true,
  "data": {
    "message_id": "3EB0A1B2C3D4E5F6",
    "phone": "628123456789",
    "status": "SENT"
  }
}`,
              },
            ],
          },
          {
            id: "media",
            label: "Media + Caption",
            method: "POST",
            path: "/api/v1/wa/messages/send",
            description: "Send photo, document, PDF, audio, or video attachment with custom caption.",
            parameters: [
              {
                name: "phone",
                type: "string",
                required: true,
                description: "Target recipient phone number.",
                example: "628123456789",
              },
              {
                name: "media_url",
                type: "string",
                required: true,
                description: "Public HTTPS URL of media asset.",
                example: "https://storage.wahide.id/invoices/inv-2026.pdf",
              },
              {
                name: "media_type",
                type: "string",
                required: true,
                description: "`image`, `document`, `video`, or `audio`.",
                example: "document",
              },
              {
                name: "caption",
                type: "string",
                required: false,
                description: "Text caption attached to the media file.",
                example: "Berikut lampiran invoice #INV-2026 Anda.",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "media_url": "https://storage.wahide.id/invoices/inv-2026.pdf",
    "media_type": "document",
    "caption": "Berikut lampiran invoice #INV-2026 Anda."
  }'`,
              nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/messages/send",
  {
    phone: "628123456789",
    media_url: "https://storage.wahide.id/invoices/inv-2026.pdf",
    media_type: "document",
    caption: "Berikut lampiran invoice #INV-2026 Anda.",
  },
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
              php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/messages/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "media_url" => "https://storage.wahide.id/invoices/inv-2026.pdf",
    "media_type" => "document",
    "caption" => "Berikut lampiran invoice #INV-2026 Anda.",
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
    "Content-Type: application/json",
  ],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
              python: `import requests

res = requests.post(
    "https://api.wahide.id/api/v1/wa/messages/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "phone": "628123456789",
        "media_url": "https://storage.wahide.id/invoices/inv-2026.pdf",
        "media_type": "document",
        "caption": "Berikut lampiran invoice #INV-2026 Anda.",
    }
)
print(res.json())`,
              go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"phone":      "628123456789",
		"media_url":  "https://storage.wahide.id/invoices/inv-2026.pdf",
		"media_type": "document",
		"caption":    "Berikut lampiran invoice #INV-2026 Anda.",
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/wa/messages/send", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Println("Status:", resp.Status)
}`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Media message sent.",
                json: `{
  "success": true,
  "data": {
    "message_id": "3EB0D8E9A0B1C2D3",
    "media_url": "https://storage.wahide.id/invoices/inv-2026.pdf",
    "status": "SENT"
  }
}`,
              },
            ],
          },
        ],
      },
      {
        id: "waba",
        label: "WABA (Official)",
        icon: "Globe",
        badge: "Meta Official",
        method: "POST",
        path: "/api/v1/v18.0/:device_id/messages",
        description:
          "Dispatches official WhatsApp Business messages via Meta WhatsApp Cloud API v18.0. Supports both standard Meta nested JSON and normalized flat format (`/api/v1/messages/send`).",
        headers: [
          {
            key: "Authorization",
            value: "Bearer <your_api_key>",
            required: true,
            description: "Your secret Wahide API Key prefixed with Bearer.",
          },
          {
            key: "Content-Type",
            value: "application/json",
            required: true,
            description: "Must be set to application/json.",
          },
        ],
        parameters: [
          {
            name: "messaging_product",
            type: "string",
            required: true,
            defaultValue: `"whatsapp"`,
            description: "Always set to 'whatsapp'.",
            example: "whatsapp",
          },
          {
            name: "recipient_type",
            type: "string",
            required: false,
            defaultValue: `"individual"`,
            description: "Target recipient scope ('individual').",
            example: "individual",
          },
          {
            name: "to",
            type: "string",
            required: true,
            description: "Recipient phone number in E.164 format without plus or symbols.",
            example: "628123456789",
          },
          {
            name: "type",
            type: "string",
            required: true,
            description: "Message payload type ('text', 'image', 'document', 'template').",
            example: "text",
          },
          {
            name: "text.body",
            type: "string",
            required: true,
            description: "The actual message content string inside text object.",
            example: "Halo, ini pesan dari official WhatsApp Cloud API!",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/v18.0/101234567890123/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "628123456789",
    "type": "text",
    "text": {
      "body": "Halo, ini pesan resmi dari Meta WhatsApp Cloud API!"
    }
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/v18.0/101234567890123/messages",
  {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "628123456789",
    type: "text",
    text: {
      body: "Halo, ini pesan resmi dari Meta WhatsApp Cloud API!",
    },
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
$curl = curl_init();
$payload = [
  "messaging_product" => "whatsapp",
  "recipient_type" => "individual",
  "to" => "628123456789",
  "type" => "text",
  "text" => [
    "body" => "Halo, ini pesan resmi dari Meta WhatsApp Cloud API!"
  ]
];
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/v18.0/101234567890123/messages",
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

res = requests.post(
    "https://api.wahide.id/api/v1/v18.0/101234567890123/messages",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "628123456789",
        "type": "text",
        "text": {"body": "Halo, ini pesan resmi dari Meta WhatsApp Cloud API!"}
    }
)
print(res.json())`,
          go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"messaging_product": "whatsapp",
		"recipient_type":    "individual",
		"to":                "628123456789",
		"type":              "text",
		"text":              map[string]string{"body": "Halo dari Meta WABA API!"},
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/v18.0/101234567890123/messages", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Println("Status:", resp.Status)
}`,
        },
        responses: [
          {
            status: 200,
            statusText: "OK",
            description: "Meta Cloud API standard response format.",
            json: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "628123456789",
      "wa_id": "628123456789"
    }
  ],
  "messages": [
    {
      "id": "wamid.HBgMNjI4MTIzNDU2Nzg5FQIAERgSQTFCMkMzRDRFNUY2RzdBOEY5AA=="
    }
  ]
}`,
          },
        ],
        subtypes: [
          {
            id: "text",
            label: "Teks",
            method: "POST",
            path: "/api/v1/v18.0/:device_id/messages",
            description: "Official Meta text message dispatch format.",
            parameters: [
              {
                name: "messaging_product",
                type: "string",
                required: true,
                defaultValue: `"whatsapp"`,
                description: "Must be 'whatsapp'.",
                example: "whatsapp",
              },
              {
                name: "to",
                type: "string",
                required: true,
                description: "Recipient phone number in E.164 format.",
                example: "628123456789",
              },
              {
                name: "type",
                type: "string",
                required: true,
                description: "Type 'text'.",
                example: "text",
              },
              {
                name: "text.body",
                type: "string",
                required: true,
                description: "Body text.",
                example: "Halo dari Official WABA!",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/v18.0/101234567890123/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "to": "628123456789",
    "type": "text",
    "text": { "body": "Halo dari Official WABA!" }
  }'`,
              nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/v18.0/101234567890123/messages", {
  messaging_product: "whatsapp",
  to: "628123456789",
  type: "text",
  text: { body: "Halo dari Official WABA!" }
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
              php: `<?php /* cURL request to Meta Cloud API */`,
              python: `import requests
res = requests.post("https://api.wahide.id/api/v1/v18.0/101234567890123/messages", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"messaging_product": "whatsapp", "to": "628123456789", "type": "text", "text": {"body": "Halo!"}})`,
              go: `// Meta Cloud API POST in Go`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Meta WABA text message delivered.",
                json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "wamid.HBgMNjI4MTIzNDU2Nzg5..." }]
}`,
              },
            ],
          },
          {
            id: "media",
            label: "Media + Caption",
            method: "POST",
            path: "/api/v1/v18.0/:device_id/messages",
            description: "Official Meta image/document dispatch format.",
            parameters: [
              {
                name: "messaging_product",
                type: "string",
                required: true,
                defaultValue: `"whatsapp"`,
                description: "Must be 'whatsapp'.",
                example: "whatsapp",
              },
              {
                name: "to",
                type: "string",
                required: true,
                description: "Recipient phone number.",
                example: "628123456789",
              },
              {
                name: "type",
                type: "string",
                required: true,
                description: "Type 'image'.",
                example: "image",
              },
              {
                name: "image.link",
                type: "string",
                required: true,
                description: "Public HTTPS URL.",
                example: "https://example.com/banner.jpg",
              },
              {
                name: "image.caption",
                type: "string",
                required: false,
                description: "Image caption text.",
                example: "Promo Spesial Hari Ini!",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/v18.0/101234567890123/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "to": "628123456789",
    "type": "image",
    "image": {
      "link": "https://example.com/banner.jpg",
      "caption": "Promo Spesial Hari Ini!"
    }
  }'`,
              nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/v18.0/101234567890123/messages", {
  messaging_product: "whatsapp",
  to: "628123456789",
  type: "image",
  image: { link: "https://example.com/banner.jpg", caption: "Promo Spesial!" }
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
              php: `<?php /* cURL Media request to Meta Cloud API */`,
              python: `import requests
res = requests.post("https://api.wahide.id/api/v1/v18.0/101234567890123/messages", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"messaging_product": "whatsapp", "to": "628123456789", "type": "image", "image": {"link": "https://example.com/banner.jpg", "caption": "Promo!"}})`,
              go: `// Meta Cloud API Image POST in Go`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Meta WABA image delivered.",
                json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "wamid.HBgMNjI4MTIzNDU2Nzg5..." }]
}`,
              },
            ],
          },
        ],
      },
      {
        id: "telegram",
        label: "Telegram",
        icon: "Send",
        badge: "Bot API",
        method: "POST",
        path: "/api/v1/telegram/messages/send",
        description:
          "Delivers direct messages or media attachments to Telegram Chat IDs or groups via your configured Telegram bot.",
        headers: [
          {
            key: "Authorization",
            value: "Bearer <your_api_key>",
            required: true,
            description: "Your secret Wahide API Key prefixed with Bearer.",
          },
          {
            key: "Content-Type",
            value: "application/json",
            required: true,
            description: "Must be set to application/json.",
          },
        ],
        parameters: [
          {
            name: "bot_id",
            type: "string",
            required: true,
            description: "ULID identifier of your connected Telegram Bot.",
            example: "01JPLAN0000000000000000001",
          },
          {
            name: "chat_id",
            type: "integer",
            required: true,
            description: "Target Telegram Chat ID (numeric integer).",
            example: "987654321",
          },
          {
            name: "text",
            type: "string",
            required: true,
            description: "Message content. Supports HTML or Markdown formatting tags.",
            example: "<b>Order Dispatched!</b> Your tracking code is #TRX-998.",
          },
          {
            name: "parse_mode",
            type: "string",
            required: false,
            defaultValue: `"HTML"`,
            description: "Formatting mode: `HTML`, `MarkdownV2`, or `Markdown`.",
            example: "HTML",
          },
          {
            name: "disable_web_page_preview",
            type: "boolean",
            required: false,
            defaultValue: "false",
            description: "Disables link previews in the Telegram chat bubble.",
            example: "false",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/telegram/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "01JPLAN0000000000000000001",
    "chat_id": 987654321,
    "text": "<b>Order Dispatched!</b> Your package is on the way.",
    "parse_mode": "HTML"
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/telegram/messages/send",
  {
    bot_id: "01JPLAN0000000000000000001",
    chat_id: 987654321,
    text: "<b>Order Dispatched!</b> Your package is on the way.",
    parse_mode: "HTML",
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
$curl = curl_init();
$payload = [
  "bot_id" => "01JPLAN0000000000000000001",
  "chat_id" => 987654321,
  "text" => "<b>Order Dispatched!</b> Your package is on the way.",
  "parse_mode" => "HTML",
];
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/telegram/messages/send",
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

res = requests.post(
    "https://api.wahide.id/api/v1/telegram/messages/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "bot_id": "01JPLAN0000000000000000001",
        "chat_id": 987654321,
        "text": "<b>Order Dispatched!</b> Your package is on the way.",
        "parse_mode": "HTML"
    }
)
print(res.json())`,
          go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"bot_id":     "01JPLAN0000000000000000001",
		"chat_id":    987654321,
		"text":       "<b>Order Dispatched!</b> Your package is on the way.",
		"parse_mode": "HTML",
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/telegram/messages/send", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Println("Status:", resp.Status)
}`,
        },
        responses: [
          {
            status: 200,
            statusText: "OK",
            description: "Telegram message sent successfully.",
            json: `{
  "success": true,
  "message": "Message dispatched successfully",
  "data": {
    "id": "01JPLAN0000000000000000099",
    "bot_id": "01JPLAN0000000000000000001",
    "chat_id": 987654321,
    "message_id": 12345,
    "status": "SENT",
    "sent_at": "2026-09-18T10:00:00Z"
  }
}`,
          },
        ],
        subtypes: [
          {
            id: "text",
            label: "Teks",
            method: "POST",
            path: "/api/v1/telegram/messages/send",
            description: "Sends HTML or Markdown formatted text to Telegram.",
            parameters: [
              {
                name: "bot_id",
                type: "string",
                required: true,
                description: "ULID of connected bot.",
                example: "01JPLAN0000000000000000001",
              },
              {
                name: "chat_id",
                type: "integer",
                required: true,
                description: "Telegram numeric chat ID.",
                example: "987654321",
              },
              {
                name: "text",
                type: "string",
                required: true,
                description: "Message content.",
                example: "Halo dari Telegram Bot!",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/telegram/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "01JPLAN0000000000000000001",
    "chat_id": 987654321,
    "text": "Halo dari Telegram Bot!"
  }'`,
              nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/telegram/messages/send", {
  bot_id: "01JPLAN0000000000000000001",
  chat_id: 987654321,
  text: "Halo dari Telegram Bot!"
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
              php: `<?php /* Telegram Text POST */`,
              python: `import requests
res = requests.post("https://api.wahide.id/api/v1/telegram/messages/send", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"bot_id": "01JPLAN...", "chat_id": 987654321, "text": "Halo!"})`,
              go: `// Telegram Text POST in Go`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Telegram message dispatched.",
                json: `{ "success": true, "data": { "message_id": 12345 } }`,
              },
            ],
          },
          {
            id: "media",
            label: "Media + Caption",
            method: "POST",
            path: "/api/v1/telegram/messages/send",
            description: "Sends photo or document attachment to Telegram.",
            parameters: [
              {
                name: "bot_id",
                type: "string",
                required: true,
                description: "ULID of connected bot.",
                example: "01JPLAN0000000000000000001",
              },
              {
                name: "chat_id",
                type: "integer",
                required: true,
                description: "Telegram numeric chat ID.",
                example: "987654321",
              },
              {
                name: "media_url",
                type: "string",
                required: true,
                description: "Public HTTPS URL of image or document.",
                example: "https://example.com/receipt.pdf",
              },
              {
                name: "media_type",
                type: "string",
                required: true,
                description: "`PHOTO`, `DOCUMENT`, `VIDEO`, or `VOICE`.",
                example: "DOCUMENT",
              },
              {
                name: "caption",
                type: "string",
                required: false,
                description: "Attachment caption.",
                example: "Lampiran bukti transaksi.",
              },
            ],
            snippets: {
              curl: `curl -X POST "https://api.wahide.id/api/v1/telegram/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "01JPLAN0000000000000000001",
    "chat_id": 987654321,
    "media_url": "https://example.com/receipt.pdf",
    "media_type": "DOCUMENT",
    "caption": "Lampiran bukti transaksi."
  }'`,
              nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/telegram/messages/send", {
  bot_id: "01JPLAN0000000000000000001",
  chat_id: 987654321,
  media_url: "https://example.com/receipt.pdf",
  media_type: "DOCUMENT",
  caption: "Lampiran bukti transaksi."
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
              php: `<?php /* Telegram Media POST */`,
              python: `import requests
res = requests.post("https://api.wahide.id/api/v1/telegram/messages/send", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"bot_id": "01JPLAN...", "chat_id": 987654321, "media_url": "https://example.com/receipt.pdf", "media_type": "DOCUMENT"})`,
              go: `// Telegram Media POST in Go`,
            },
            responses: [
              {
                status: 200,
                statusText: "OK",
                description: "Telegram media dispatched.",
                json: `{ "success": true, "data": { "message_id": 12346 } }`,
              },
            ],
          },
        ],
      },
      {
        id: "messenger",
        label: "Messenger",
        icon: "MessageSquare",
        badge: "Coming Soon",
        disabled: true,
        method: "POST",
        path: "/api/v1/messenger/messages/send",
        parameters: [],
        snippets: {
          curl: "# Messenger API integration coming soon in Q4 2026",
          nodejs: "// Messenger API integration coming soon in Q4 2026",
          php: "// Messenger API integration coming soon in Q4 2026",
          python: "# Messenger API integration coming soon in Q4 2026",
          go: "// Messenger API integration coming soon in Q4 2026",
        },
        responses: [],
      },
      {
        id: "instagram",
        label: "Instagram",
        icon: "Instagram",
        badge: "Coming Soon",
        disabled: true,
        method: "POST",
        path: "/api/v1/instagram/messages/send",
        parameters: [],
        snippets: {
          curl: "# Instagram Direct Message API coming soon in Q4 2026",
          nodejs: "// Instagram Direct Message API coming soon in Q4 2026",
          php: "// Instagram Direct Message API coming soon in Q4 2026",
          python: "# Instagram Direct Message API coming soon in Q4 2026",
          go: "// Instagram Direct Message API coming soon in Q4 2026",
        },
        responses: [],
      },
    ],
    bannerNotice: {
      type: "success",
      title: "Omnichannel Dual-Format: Whatsmeow & Meta Cloud API",
      content:
        "Supports both Wahide native flat schema and official Meta WhatsApp Cloud API nested JSON. Dispatches through WhatsApp Multi-Device (whatsmeow) or Meta WABA accounts with typing simulation and Spintax randomizer.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer <your_api_key>",
        required: true,
        description: "Your secret Wahide API Key prefixed with Bearer.",
      },
      {
        key: "Content-Type",
        value: "application/json",
        required: true,
        description: "Must be set to application/json.",
      },
    ],
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description:
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. (Also accepts 'to' for Meta Cloud API format).",
        example: "628123456789",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description:
          "Text message body to send. Supports full UTF-8 emojis, WhatsApp formatting (*bold*, _italic_, ~strike~, ```code```), and Spintax variations {Halo|Hai|Pagi}. (Also accepts 'text.body' for Meta Cloud API format).",
        example:
          "{Halo|Hai} Pelanggan, pesanan #INV-2026 Anda telah dikonfirmasi!",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Specific WhatsApp Device ID slot or WABA Account ULID to dispatch from. If omitted or set to 'auto', the engine uses intelligent round-robin across connected healthy devices.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
      {
        name: "simulate_typing",
        type: "boolean",
        required: false,
        defaultValue: "false",
        description:
          "When true, broadcasts a natural 'typing...' presence event to WhatsApp before dispatching the message.",
        example: "true",
      },
      {
        name: "typing_delay_ms",
        type: "integer",
        required: false,
        defaultValue: "0",
        description:
          "Custom typing indicator duration in milliseconds. If 0 or omitted with simulate_typing: true, duration is dynamically calculated based on message length (~40ms/char, clamped between 1,000ms - 5,000ms).",
        example: "1500",
      },
      {
        name: "parse_spintax",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description:
          "When true, automatically parses and resolves Spintax patterns like {Halo|Hai|Pagi} into a randomized unique variation for Anti-Ban protection.",
        example: "true",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id": "auto",
    "simulate_typing": true,
    "typing_delay_ms": 1500,
    "parse_spintax": true
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.id/api/v1/wa/messages/send",
  {
    phone: "628123456789",
    message: "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    device_id: "auto",
    simulate_typing: true,
    typing_delay_ms: 1500,
    parse_spintax: true,
  },
  {
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "message" => "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id" => "auto",
    "simulate_typing" => true,
    "typing_delay_ms" => 1500,
    "parse_spintax" => true
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.id/api/v1/wa/messages/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer YOUR_API_KEY",
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "phone": "628123456789",
    "message": "{Halo|Hai} Alex, pesanan #INV-2026 Anda sedang diproses.",
    "device_id": "auto",
    "simulate_typing": True,
    "typing_delay_ms": 1500,
    "parse_spintax": True
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
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":           "628123456789",
		"message":         "Hello from Wahide WhatsApp API! Your order #INV-2026 is confirmed.",
		"device_id":       "auto",
		"simulate_typing": true,
		"typing_delay_ms": 1500,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
        status: 200,
        statusText: "OK",
        description: "Message successfully queued and dispatched to WhatsApp.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "628123456789",
      "wa_id": "628123456789"
    }
  ],
  "messages": [
    {
      "id": "3EB0A1B2C3D4E5F6"
    }
  ]
}`,
        attributes: [
          {
            name: "messaging_product",
            type: "string",
            description:
              "Identifies the messaging platform. Always returns 'whatsapp'.",
          },
          {
            name: "contacts[].input",
            type: "string",
            description:
              "The original phone number string provided in the request.",
          },
          {
            name: "contacts[].wa_id",
            type: "string",
            description:
              "Normalized international WhatsApp JID identifier without suffixes.",
          },
          {
            name: "messages[].id",
            type: "string",
            description:
              "Unique WhatsApp message ID assigned by WhatsApp servers (e.g., 3EB0...). Can be tracked via webhooks for delivery status.",
          },
        ],
      },
      {
        status: 400,
        statusText: "Bad Request",
        description:
          "Invalid phone number format or missing required payload parameters.",
        json: `{
  "success": false,
  "message": "Invalid recipient phone number format",
  "error": "INVALID_PHONE_NUMBER",
  "additional_info": {
    "field": "phone",
    "expected": "E.164 international format without leading +"
  }
}`,
        attributes: [
          {
            name: "success",
            type: "boolean",
            description: "Always false for non-2xx responses.",
          },
          {
            name: "message",
            type: "string",
            description:
              "Human-readable explanation of why the validation failed.",
          },
          {
            name: "error",
            type: "string",
            description: "Machine-readable standard error code.",
          },
        ],
      },
      {
        status: 401,
        statusText: "Unauthorized",
        description: "Missing or invalid API Key.",
        json: `{
  "success": false,
  "message": "Invalid API Key",
  "error": "UNAUTHORIZED"
}`,
      },
      {
        status: 503,
        statusText: "Service Unavailable",
        description: "Specified WhatsApp device is offline or session expired.",
        json: `{
  "success": false,
  "message": "WhatsApp device session is offline or unlinked",
  "error": "DEVICE_OFFLINE",
  "additional_info": {
    "device_id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "solution": "Reconnect or scan QR code in dashboard"
  }
}`,
      },
    ],
    errorMatrix: [
      {
        code: 400,
        error: "INVALID_PHONE_NUMBER",
        description:
          "Phone number contains non-numeric characters, too few digits, or starts with 0.",
        solution:
          "Format phone number to international E.164 (e.g., 628123456789).",
      },
      {
        code: 401,
        error: "UNAUTHORIZED",
        description: "API Key is missing from Authorization header or revoked.",
        solution: "Check Authorization: Bearer <API_KEY> header.",
      },
      {
        code: 429,
        error: "WARMUP_LIMIT_EXCEEDED",
        description:
          "Device is still in warmup period and reached its daily send ceiling.",
        solution:
          "Distribute across older devices or configure round-robin auto rotation.",
      },
      {
        code: 503,
        error: "DEVICE_OFFLINE",
        description: "Target WhatsApp device session disconnected.",
        solution: "Re-pair device using QR code endpoint or dashboard.",
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-round-robin",
    slug: "messaging/send-round-robin",
    title: "Round-Robin Multi-Device Sending",
    description:
      "Automatically load-balances outbound messages across a pool of connected devices to bypass single-number limits, prevent bans, and achieve high delivery throughput.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Smart Pool",
    bannerNotice: {
      type: "info",
      title: "Multi-Device Load Distribution",
      content:
        "By setting `device_id: 'auto'` or omitting it, the queue worker dynamically routes messages across healthy connected devices.",
    },
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number in international E.164 format.",
        example: "628987654321",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description: "Message content.",
        example: "Your daily report is ready to download.",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Set to 'auto' to trigger round-robin across all active devices in your tenant.",
        example: "auto",
      },
      {
        name: "simulate_typing",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description: "Simulate typing status before sending.",
        example: "true",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628987654321",
    "message": "Your automated report is ready for viewing.",
    "device_id": "auto",
    "simulate_typing": true
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628987654321",
  message: "Your automated report is ready for viewing.",
  device_id: "auto",
  simulate_typing: true
}, {
  headers: { Authorization: "Bearer YOUR_API_KEY" }
});`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628987654321",
  "message" => "Your automated report is ready for viewing.",
  "device_id" => "auto",
  "simulate_typing" => true,
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
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

requests.post(
    "https://api.wahide.com/api/v1/wa/messages/send",
    json={
        "phone": "628987654321",
        "message": "Your automated report is ready for viewing.",
        "device_id": "auto",
        "simulate_typing": True
    },
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`,
      go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":           "628987654321",
		"message":         "Your automated report is ready for viewing.",
		"device_id":       "auto",
		"simulate_typing": true,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
        status: 200,
        statusText: "OK",
        description: "Message dispatched via optimal device from pool.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628987654321", "wa_id": "628987654321" }],
  "messages": [{ "id": "3EB09876543210AB" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-spintax",
    slug: "messaging/send-spintax",
    title: "Spintax Dynamic Variation",
    description:
      "Send randomized message variations using standard `{option1|option2|option3}` syntax to make every message unique and prevent WhatsApp anti-spam fingerprinting.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    bannerNotice: {
      type: "success",
      title: "Spintax Evaluation",
      content:
        "The engine evaluates nested Spintax tags server-side before queueing the message into the dispatch stream.",
    },
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number.",
        example: "628123456789",
      },
      {
        name: "message",
        type: "string",
        required: true,
        description:
          "Spintax formatted message string using `{option1|option2}` syntax.",
        example:
          "{Hello|Hi|Good day} {Kak|Bro}, {thank you for your order|your order has been received}!",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628123456789",
  message: "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
}, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628123456789",
  "message" => "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
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

url = "https://api.wahide.com/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
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
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":   "628123456789",
		"message": "{Hello|Hi|Greetings} {John|Partner}, {hope you have a great week|wishing you high productivity}!",
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
        status: 200,
        statusText: "OK",
        description: "Spintax processed and sent.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "3EB0FF1122334455" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-media",
    slug: "messaging/send-media",
    title: "Send Media / Document",
    description:
      "Send images, PDF invoices, audio recordings, or video clips directly to WhatsApp recipients with optional captions.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/wa/messages/send",
    badge: "Media",
    parameters: [
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Target phone number in international E.164 format.",
        example: "628123456789",
      },
      {
        name: "media_url",
        type: "string",
        required: true,
        description: "Direct publicly accessible HTTPS URL to the media asset.",
        example: "https://cdn.wahide.com/invoices/INV-2026.pdf",
      },
      {
        name: "caption",
        type: "string",
        required: false,
        description: "Optional text caption accompanying the media file.",
        example: "Here is your invoice for September 2026.",
      },
      {
        name: "filename",
        type: "string",
        required: false,
        description:
          "Custom filename for PDF / document files shown to the recipient.",
        example: "Invoice-September-2026.pdf",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
    "caption": "Your official invoice",
    "filename": "Invoice-INV2026.pdf"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/messages/send", {
  phone: "628123456789",
  media_url: "https://cdn.wahide.com/invoices/INV-2026.pdf",
  caption: "Your official invoice",
  filename: "Invoice-INV2026.pdf",
}, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

$payload = [
  "phone" => "628123456789",
  "media_url" => "https://cdn.wahide.com/invoices/INV-2026.pdf",
  "caption" => "Your official invoice",
  "filename" => "Invoice-INV2026.pdf",
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/messages/send",
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

url = "https://api.wahide.com/api/v1/wa/messages/send"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
    "caption": "Your official invoice",
    "filename": "Invoice-INV2026.pdf",
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
	url := "https://api.wahide.com/api/v1/wa/messages/send"

	payload := map[string]interface{}{
		"phone":     "628123456789",
		"media_url": "https://cdn.wahide.com/invoices/INV-2026.pdf",
		"caption":   "Your official invoice",
		"filename":  "Invoice-INV2026.pdf",
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
        status: 200,
        statusText: "OK",
        description: "Media downloaded and dispatched to recipient.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "628123456789", "wa_id": "628123456789" }],
  "messages": [{ "id": "3EB0CCDDEEFF0011" }]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "messaging-meta-cloud",
    slug: "messaging/meta-cloud-api",
    title: "Meta Cloud API Compatible",
    description:
      "Drop-in compatibility route for developers migrating from Meta WhatsApp Cloud API. Supports nested `text: { body }` and `template` objects.",
    category: "Messaging",
    categorySlug: "messaging",
    method: "POST",
    path: "/api/v1/v18.0/{deviceId}/messages",
    badge: "Meta v18.0",
    bannerNotice: {
      type: "info",
      title: "Meta Cloud API Compatibility",
      content:
        "Point your existing Meta WhatsApp Cloud API SDK base URL to https://api.wahide.com/api/v1 without modifying your request schemas.",
    },
    parameters: [
      {
        name: "messaging_product",
        type: "string",
        required: true,
        description: "Always set to 'whatsapp'.",
        example: "whatsapp",
      },
      {
        name: "recipient_type",
        type: "string",
        required: false,
        defaultValue: `"individual"`,
        description: "Type of recipient. Defaults to 'individual'.",
      },
      {
        name: "to",
        type: "string",
        required: true,
        description: "Recipient phone number in E.164 international format.",
        example: "628123456789",
      },
      {
        name: "type",
        type: "string",
        required: true,
        description:
          "Message type: 'text', 'image', 'document', or 'template'.",
        example: "text",
      },
      {
        name: "text",
        type: "object",
        required: true,
        description: "Text message payload object containing the body string.",
        depth: 0,
      },
      {
        name: "text.body",
        type: "string",
        required: true,
        description:
          "The actual message content string inside the text object.",
        depth: 1,
        parent: "text",
        example: "Hello from Meta-compatible route!",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/v18.0/01M1WW3FKR1JS7CW4KGY78Q5ND/messages" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "628123456789",
    "type": "text",
    "text": {
      "body": "Hello from Meta-compatible route!"
    }
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.com/api/v1/v18.0/DEVICE_ID/messages",
  {
    messaging_product: "whatsapp",
    to: "628123456789",
    type: "text",
    text: { body: "Hello from Meta SDK compatible format!" }
  },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);`,
      php: `<?php
$deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
$curl = curl_init();

$payload = [
  "messaging_product" => "whatsapp",
  "recipient_type" => "individual",
  "to" => "628123456789",
  "type" => "text",
  "text" => [
    "body" => "Hello from Meta SDK compatible format!",
  ],
];

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/v18.0/{$deviceId}/messages",
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

device_id = "01M1WW3FKR1JS7CW4KGY78Q5ND"
url = f"https://api.wahide.com/api/v1/v18.0/{device_id}/messages"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "628123456789",
    "type": "text",
    "text": {
        "body": "Hello from Meta SDK compatible format!"
    }
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
	deviceID := "01M1WW3FKR1JS7CW4KGY78Q5ND"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/v18.0/%s/messages", deviceID)

	payload := map[string]interface{}{
		"messaging_product": "whatsapp",
		"recipient_type":    "individual",
		"to":                "628123456789",
		"type":              "text",
		"text": map[string]string{
			"body": "Hello from Meta SDK compatible format!",
		},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
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
        status: 200,
        statusText: "OK",
        description: "Meta formatted 200 OK message response.",
        json: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "628123456789",
      "wa_id": "628123456789"
    }
  ],
  "messages": [
    {
      "id": "wamid.HBgNNjI4MTIzNDU2Nzg5FQIAERgSM0VCMEExQjJDM0Q0RTVGNkEA"
    }
  ]
}`,
        attributes: [
          {
            name: "messages[].id",
            type: "string",
            description: "Standard Meta WAMID (WhatsApp Message ID).",
          },
        ],
      },
    ],
  },
];
