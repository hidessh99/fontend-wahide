import { EndpointDoc } from "../types";

export const otpEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "otp-send",
    slug: "otp/send",
    title: "Send Omnichannel OTP Verification Code",
    description:
      "Dispatches an instant, cryptographically secure OTP verification code via Smart Cascading Failover (Meta WABA Official -> Whatsmeow Socket -> Telegram Bot) or Explicit Channel. Features Redis in-memory storage (5-minute TTL), 60-second anti-bombing cooldown protection, single-use auto-burn upon verification, and sub-second VIP express delivery.",
    category: "OTP & Verification",
    categorySlug: "otp",
    method: "POST",
    path: "/api/v1/otp/send",
    badge: "Omnichannel VIP",
    channelVariants: [
      {
        id: "auto",
        label: "Auto (Smart Failover)",
        icon: "Zap",
        badge: "Recommended",
        method: "POST",
        path: "/api/v1/otp/send",
        description:
          "Intelligent auto-routing with zero-downtime cascading failover: checks Meta WABA Official first, falls back to Whatsmeow Multi-Device socket, and cascades to Telegram Bot if phone is associated with Telegram. Guarantees the highest delivery SLA without quota double-spend.",
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
            description: "Target recipient phone number in international E.164 format without '+' (e.g. 628123456789).",
            example: "628123456789",
          },
          {
            name: "channel",
            type: "string",
            required: false,
            defaultValue: `"AUTO"`,
            description: "Channel routing strategy. When set to 'AUTO' or omitted, enables smart cascading failover across active channels.",
            example: "AUTO",
          },
          {
            name: "otp",
            type: "string",
            required: false,
            defaultValue: "Auto 6-digit",
            description: "Custom numeric OTP code (4-10 digits). If omitted, automatically generated via crypto/rand.",
            example: "884920",
          },
          {
            name: "template",
            type: "string",
            required: false,
            defaultValue: `"Kode verifikasi OTP Anda adalah *{{otp}}*. Berlaku 5 menit."`,
            description: "Message template body containing {{otp}} and optional {{expires_in}} placeholders.",
            example: "Kode login Wahide Anda adalah *{{otp}}*. Berlaku {{expires_in}}.",
          },
          {
            name: "expires_in",
            type: "integer",
            required: false,
            defaultValue: "300",
            description: "Validity lifetime in seconds (60 - 900 seconds).",
            example: "300",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/otp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "channel": "AUTO",
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/otp/send",
  {
    phone: "628123456789",
    channel: "AUTO",
    expires_in: 300,
  },
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
          php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/otp/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "channel" => "AUTO",
    "expires_in" => 300,
  ]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
          python: `import requests

res = requests.post(
    "https://api.wahide.id/api/v1/otp/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "phone": "628123456789",
        "channel": "AUTO",
        "expires_in": 300
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
	payload, _ := json.Marshal(map[string]any{
		"phone":      "628123456789",
		"channel":    "AUTO",
		"expires_in": 300,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/otp/send", bytes.NewBuffer(payload))
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
            description: "OTP dispatched via primary channel or seamlessly cascaded to healthy fallback.",
            json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "wamid.HBgMNjI4MTIzNDU2Nzg5...",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-19T10:00:00Z",
    "channel": "WABA",
    "provider": "META_WABA_OFFICIAL",
    "failover_applied": false
  }
}`,
          },
        ],
      },
      {
        id: "waba",
        label: "Meta WABA (Official)",
        icon: "Globe",
        badge: "Meta Official",
        method: "POST",
        path: "/api/v1/otp/send",
        description:
          "Dispatches an official Meta WhatsApp Business Authentication OTP using pre-approved authentication HSM templates with one-tap copy button. Enforces strict channel isolation without failover.",
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
            description: "Recipient phone number in E.164 format without '+'.",
            example: "628123456789",
          },
          {
            name: "channel",
            type: "string",
            required: true,
            defaultValue: `"WABA"`,
            description: "Must be set to 'WABA' to lock dispatch specifically to Meta Cloud API.",
            example: "WABA",
          },
          {
            name: "template_name",
            type: "string",
            required: false,
            defaultValue: `"otp_verification"`,
            description: "Name of the approved AUTHENTICATION template registered in your Meta Business Manager.",
            example: "otp_verification",
          },
          {
            name: "otp",
            type: "string",
            required: false,
            defaultValue: "Auto 6-digit",
            description: "6-digit OTP code to inject into parameter {{1}} of the Meta template.",
            example: "123456",
          },
          {
            name: "expires_in",
            type: "integer",
            required: false,
            defaultValue: "300",
            description: "Validity in seconds.",
            example: "300",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/otp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "channel": "WABA",
    "template_name": "otp_verification",
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/otp/send",
  {
    phone: "628123456789",
    channel: "WABA",
    template_name: "otp_verification",
    expires_in: 300
  },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
          php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/otp/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "channel" => "WABA",
    "template_name" => "otp_verification",
    "expires_in" => 300,
  ]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
          python: `import requests
res = requests.post(
    "https://api.wahide.id/api/v1/otp/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "phone": "628123456789",
        "channel": "WABA",
        "template_name": "otp_verification",
        "expires_in": 300
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
	payload, _ := json.Marshal(map[string]any{
		"phone":         "628123456789",
		"channel":       "WABA",
		"template_name": "otp_verification",
		"expires_in":    300,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/otp/send", bytes.NewBuffer(payload))
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
            description: "Meta Authentication HSM OTP delivered successfully.",
            json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "wamid.HBgMNjI4MTIzNDU2Nzg5...",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-19T10:00:00Z",
    "channel": "WABA",
    "provider": "META_WABA_OFFICIAL",
    "failover_applied": false
  }
}`,
          },
        ],
      },
      {
        id: "whatsmeow",
        label: "WhatsApp (Whatsmeow)",
        icon: "Smartphone",
        badge: "Unofficial Socket",
        method: "POST",
        path: "/api/v1/otp/send",
        description:
          "Dispatches an instant OTP verification code via WhatsApp Multi-Device session (whatsmeow) with humanized typing simulation and 5-minute Redis TTL.",
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
            description: "Target recipient WhatsApp number in E.164 format (e.g. 628123456789).",
            example: "628123456789",
          },
          {
            name: "channel",
            type: "string",
            required: false,
            defaultValue: `"WHATSMEOW"`,
            description: "Set to 'WHATSMEOW' for explicit WhatsApp Web socket dispatch.",
            example: "WHATSMEOW",
          },
          {
            name: "device_id",
            type: "string",
            required: false,
            defaultValue: `"auto"`,
            description: "Specific WhatsApp Device ID slot. If omitted, uses intelligent round-robin across healthy connected devices.",
            example: "dev_01JPLAN001",
          },
          {
            name: "template",
            type: "string",
            required: false,
            defaultValue: `"Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit."`,
            description: "Template message body containing {{otp}} placeholder.",
            example: "Kode login Wahide Anda adalah *{{otp}}*.",
          },
          {
            name: "expires_in",
            type: "integer",
            required: false,
            defaultValue: "300",
            description: "Validity lifetime in seconds (60 - 900 seconds).",
            example: "300",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/otp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "channel": "WHATSMEOW",
    "template": "Kode verifikasi Anda adalah *{{otp}}*. Jangan bagikan kode ini.",
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/otp/send",
  {
    phone: "628123456789",
    channel: "WHATSMEOW",
    template: "Kode verifikasi Anda adalah *{{otp}}*.",
    expires_in: 300,
  },
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
          php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/otp/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "channel" => "WHATSMEOW",
    "template" => "Kode verifikasi Anda adalah *{{otp}}*.",
    "expires_in" => 300,
  ]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
          python: `import requests
res = requests.post(
    "https://api.wahide.id/api/v1/otp/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"phone": "628123456789", "channel": "WHATSMEOW", "expires_in": 300}
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
	payload, _ := json.Marshal(map[string]any{
		"phone":      "628123456789",
		"channel":    "WHATSMEOW",
		"expires_in": 300,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/otp/send", bytes.NewBuffer(payload))
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
            description: "OTP dispatched to WhatsApp socket session.",
            json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "3EB0A1B2C3D4E5F6",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-19T10:00:00Z",
    "channel": "WHATSMEOW",
    "provider": "WHATSMEOW_UNOFFICIAL",
    "failover_applied": false
  }
}`,
          },
        ],
      },
      {
        id: "telegram",
        label: "Telegram Bot",
        icon: "Send",
        badge: "Official Bot API",
        method: "POST",
        path: "/api/v1/otp/send",
        description:
          "Dispatches an OTP verification code directly to a Telegram user's Chat ID via your connected Telegram bot using formatted MarkdownV2 monospace tap-to-copy.",
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
            description: "Recipient phone number in E.164 format.",
            example: "628123456789",
          },
          {
            name: "channel",
            type: "string",
            required: true,
            defaultValue: `"TELEGRAM"`,
            description: "Must be set to 'TELEGRAM'.",
            example: "TELEGRAM",
          },
          {
            name: "chat_id",
            type: "integer",
            required: true,
            description: "Telegram user's numeric Chat ID.",
            example: "987654321",
          },
          {
            name: "expires_in",
            type: "integer",
            required: false,
            defaultValue: "300",
            description: "Validity in seconds.",
            example: "300",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/otp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "channel": "TELEGRAM",
    "chat_id": 987654321,
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/otp/send", {
  phone: "628123456789",
  channel: "TELEGRAM",
  chat_id: 987654321,
  expires_in: 300
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });
console.log(res.data);`,
          php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/otp/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
    "channel" => "TELEGRAM",
    "chat_id" => 987654321,
    "expires_in" => 300,
  ]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
          python: `import requests
res = requests.post(
    "https://api.wahide.id/api/v1/otp/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"phone": "628123456789", "channel": "TELEGRAM", "chat_id": 987654321}
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
	payload, _ := json.Marshal(map[string]any{
		"phone":      "628123456789",
		"channel":    "TELEGRAM",
		"chat_id":    987654321,
		"expires_in": 300,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/otp/send", bytes.NewBuffer(payload))
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
            description: "Telegram OTP delivered successfully.",
            json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "12347",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-19T10:00:00Z",
    "channel": "TELEGRAM",
    "provider": "TELEGRAM_BOT",
    "failover_applied": false
  }
}`,
          },
        ],
      },
    ],
    bannerNotice: {
      type: "success",
      title: "Omnichannel Fast Path, Anti-Bombing Cooldown & Smart Cascading Failover",
      content:
        "OTP verification state is stored purely in Redis with an automated 5-minute TTL, avoiding disk write overhead to MySQL. Dual Mode supports 'AUTO' with cascading failover (Meta WABA -> Whatsmeow -> Telegram) or explicit channel isolation. Protection includes a 60-second resend cooldown and a daily limit of 10 requests per destination number.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer hide_<your_api_key>",
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
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. Example: 628123456789.",
        example: "628123456789",
      },
      {
        name: "channel",
        type: "string",
        required: false,
        defaultValue: `"AUTO"`,
        description:
          "Delivery channel strategy: 'AUTO' (Smart Cascading Failover across WABA, Whatsmeow, and Telegram), 'WABA' (Meta Official Authentication Template only), 'WHATSMEOW' (WhatsApp Web session only), or 'TELEGRAM' (Telegram Bot only).",
        example: "AUTO",
      },
      {
        name: "chat_id",
        type: "integer",
        required: false,
        description:
          "Target recipient's Telegram Chat ID. Required when channel is set to 'TELEGRAM', or used as tertiary fallback in 'AUTO' mode.",
        example: "987654321",
      },
      {
        name: "template_name",
        type: "string",
        required: false,
        defaultValue: `"otp_verification"`,
        description:
          "Official Meta WABA Authentication template name. Required when channel is set to 'WABA' or for WABA delivery in 'AUTO' mode.",
        example: "otp_verification",
      },
      {
        name: "otp",
        type: "string",
        required: false,
        defaultValue: "Auto 6-digit",
        description:
          "Custom OTP code (4-10 digits). If omitted or empty, the engine automatically generates a cryptographically random 6-digit numeric code.",
        example: "884920",
      },
      {
        name: "template",
        type: "string",
        required: false,
        defaultValue: `"Kode verifikasi akun Anda adalah *{{otp}}*. Berlaku 5 menit."`,
        description:
          "Custom message template body for Whatsmeow. Must include the '{{otp}}' placeholder which will be replaced by the generated OTP code.",
        example:
          "Kode verifikasi login Wahide Anda adalah *{{otp}}*. Berlaku 5 menit.",
      },
      {
        name: "device_id",
        type: "string",
        required: false,
        defaultValue: `"auto"`,
        description:
          "Specific WhatsApp Device ID slot to dispatch the OTP from. If omitted or set to 'auto', intelligent round-robin across healthy connected devices is used.",
        example: "auto",
      },
      {
        name: "expires_in",
        type: "integer",
        required: false,
        defaultValue: "300",
        description:
          "OTP code validity lifetime in seconds. Default is 300 seconds (5 minutes). Maximum allowed is 900 seconds (15 minutes).",
        example: "300",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/otp/send" \\
  -H "Authorization: Bearer hide_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "channel": "AUTO",
    "expires_in": 300
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.id/api/v1/otp/send",
  {
    phone: "628123456789",
    channel: "AUTO",
    expires_in: 300,
  },
  {
    headers: {
      "Authorization": "Bearer hide_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "channel" => "AUTO",
    "expires_in" => 300,
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.id/api/v1/otp/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer hide_YOUR_API_KEY",
        "Content-Type: application/json",
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/otp/send"
headers = {
    "Authorization": "Bearer hide_YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "channel": "AUTO",
    "expires_in": 300,
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
	payload, _ := json.Marshal(map[string]any{
		"phone":      "628123456789",
		"channel":    "AUTO",
		"expires_in": 300,
	})

	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/otp/send", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer hide_YOUR_API_KEY")
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
        description:
          "OTP generated, stored in Redis cache, and delivered via designated or cascaded channel.",
        json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "wamid.HBgMNjI4MTIzNDU2Nzg5...",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-19T10:00:00Z",
    "channel": "WABA",
    "provider": "META_WABA_OFFICIAL",
    "failover_applied": false
  }
}`,
        attributes: [
          {
            name: "data.phone",
            type: "string",
            description: "Target normalized recipient phone number in E.164 format.",
          },
          {
            name: "data.channel",
            type: "string",
            description: "Actual channel that delivered the OTP ('WABA', 'WHATSMEOW', 'TELEGRAM').",
          },
          {
            name: "data.provider",
            type: "string",
            description: "Underlying provider engine ('META_WABA_OFFICIAL', 'WHATSMEOW_UNOFFICIAL', 'TELEGRAM_BOT').",
          },
          {
            name: "data.failover_applied",
            type: "boolean",
            description: "True if the message was delivered through a cascading fallback channel.",
          },
          {
            name: "data.expires_in",
            type: "integer",
            description:
              "Remaining validity period in seconds (default: 300s).",
          },
        ],
      },
      {
        status: 429,
        statusText: "Too Many Requests",
        description:
          "Request rejected due to active 60-second cooldown timer or 10 OTP/day daily limit.",
        json: `{
  "code": 429,
  "status": "error",
  "error": "ERR_OTP_COOLDOWN",
  "message": "Please wait 60s before requesting another OTP for this phone number"
}`,
      },
      {
        status: 503,
        statusText: "Service Unavailable",
        description: "No active channel or device available to deliver the OTP message.",
        json: `{
  "code": 503,
  "status": "error",
  "error": "ERR_NO_CONNECTED_DEVICE",
  "message": "No connected WhatsApp device or WABA channel available to send OTP"
}`,
      },
    ],
    errorMatrix: [
      {
        code: 429,
        error: "ERR_OTP_COOLDOWN",
        description:
          "New OTP request submitted before the 60-second cooldown elapsed.",
        solution:
          "Display a 60-second countdown timer on your application's 'Resend OTP' button.",
      },
      {
        code: 429,
        error: "ERR_OTP_DAILY_LIMIT",
        description:
          "Daily limit quota (10x OTP/day) for this destination phone number has been reached.",
        solution:
          "Prompt the user to wait for UTC day reset or offer an alternative verification method.",
      },
      {
        code: 503,
        error: "ERR_NO_CONNECTED_DEVICE",
        description:
          "No connected WhatsApp device or WABA account found.",
        solution:
          "In 'AUTO' mode, configure Meta WABA or pair at least one WhatsApp device via QR code.",
      },
      {
        code: 402,
        error: "ERR_QUOTA_EXCEEDED",
        description:
          "Tenant subscription quota limit or prepaid credit balance has been exhausted.",
        solution:
          "Top up your account balance or upgrade your subscription tier.",
      },
    ],
  },
  {
    type: "endpoint",
    id: "otp-verify",
    slug: "otp/verify",
    title: "Verify WhatsApp OTP Code",
    description:
      "Atomically validates the one-time password submitted by your user against the Redis in-memory cache. Features automatic single-use burn (preventing replay attacks), 5-attempt brute-force protection, and constant-time cryptographic comparison.",
    category: "OTP & Verification",
    categorySlug: "otp",
    method: "POST",
    path: "/api/v1/otp/verify",
    badge: "Atomic & Secure",
    bannerNotice: {
      type: "info",
      title: "Single-Use Auto-Burn & Brute-Force Lockout",
      content:
        "Once verified successfully, the OTP is instantly burned from Redis to eliminate replay attacks. If an incorrect code is entered 5 times, the OTP is permanently invalidated to prevent brute-force attacks.",
    },
    headers: [
      {
        key: "Authorization",
        value: "Bearer hide_<your_api_key>",
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
          "Target recipient phone number in international E.164 format without spaces, dashes, or leading plus. Example: 628123456789.",
        example: "628123456789",
      },
      {
        name: "otp",
        type: "string",
        required: true,
        description: "The 4-8 digit OTP code entered by the user to verify.",
        example: "884920",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/otp/verify" \\
  -H "Authorization: Bearer hide_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "otp": "884920"
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.com/api/v1/otp/verify",
  {
    phone: "628123456789",
    otp: "884920",
  },
  {
    headers: {
      "Authorization": "Bearer hide_YOUR_API_KEY",
      "Content-Type": "application/json",
    },
  }
);

console.log(response.data);`,
      php: `<?php

$curl = curl_init();

$payload = [
    "phone" => "628123456789",
    "otp" => "884920",
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.com/api/v1/otp/verify",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer hide_YOUR_API_KEY",
        "Content-Type: application/json",
    ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.com/api/v1/otp/verify"
headers = {
    "Authorization": "Bearer hide_YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "otp": "884920",
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
	payload, _ := json.Marshal(map[string]any{
		"phone": "628123456789",
		"otp":   "884920",
	})

	req, _ := http.NewRequest("POST", "https://api.wahide.com/api/v1/otp/verify", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer hide_YOUR_API_KEY")
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
        description:
          "OTP code successfully validated and automatically burned from cache.",
        json: `{
  "code": 200,
  "status": "success",
  "message": "OTP verified successfully",
  "data": {
    "phone": "628123456789",
    "verified": true
  }
}`,
        attributes: [
          {
            name: "data.phone",
            type: "string",
            description: "Target normalized phone number.",
          },
          {
            name: "data.verified",
            type: "boolean",
            description:
              "Confirmation boolean indicating successful verification.",
          },
        ],
      },
      {
        status: 400,
        statusText: "Bad Request",
        description: "Invalid OTP code provided or code has expired.",
        json: `{
  "code": 400,
  "status": "error",
  "error": "ERR_OTP_INVALID",
  "message": "Invalid OTP code provided"
}`,
      },
      {
        status: 429,
        statusText: "Too Many Requests",
        description:
          "Maximum verification attempts (5/5) exceeded. OTP has been invalidated.",
        json: `{
  "code": 429,
  "status": "error",
  "error": "ERR_OTP_MAX_ATTEMPTS",
  "message": "Maximum verification attempts exceeded (5/5). OTP has been invalidated."
}`,
      },
    ],
    errorMatrix: [
      {
        code: 400,
        error: "ERR_OTP_INVALID",
        description: "Submitted OTP code does not match the stored code.",
        solution:
          "Ask the user to check their WhatsApp messages and enter the correct code.",
      },
      {
        code: 400,
        error: "ERR_OTP_NOT_FOUND",
        description:
          "OTP code has expired (exceeded 5 minutes) or was never requested.",
        solution:
          "Direct the user to tap 'Resend OTP' to receive a fresh verification code.",
      },
      {
        code: 429,
        error: "ERR_OTP_MAX_ATTEMPTS",
        description: "Maximum invalid verification attempts (5 times) reached.",
        solution:
          "OTP code has been permanently deleted for anti-brute-force protection. User must request a new OTP.",
      },
    ],
  },
];
