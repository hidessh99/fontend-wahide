import { EndpointDoc } from "../types";

export const otpEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "otp-send",
    slug: "otp/send",
    title: "Send WhatsApp OTP Code",
    description:
      "Dispatches an instant, cryptographically secure OTP code to a recipient WhatsApp number. Features Redis in-memory storage (5-minute TTL), 60-second cooldown protection against flooding, automatic 6-digit code generation, and VIP express stream priority.",
    category: "OTP & Verification",
    categorySlug: "otp",
    method: "POST",
    path: "/api/v1/otp/send",
    badge: "Instant VIP",
    channelVariants: [
      {
        id: "whatsmeow",
        label: "WhatsApp (Whatsmeow)",
        icon: "Smartphone",
        badge: "Unofficial Socket",
        method: "POST",
        path: "/api/v1/wa/otp/send",
        description:
          "Dispatches an instant OTP verification code via WhatsApp Multi-Device session (whatsmeow) with 5-minute Redis TTL and VIP priority express queue.",
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
            name: "otp",
            type: "string",
            required: false,
            defaultValue: "Auto 6-digit",
            description: "Custom OTP code (4-8 digits). If omitted, automatically generated.",
            example: "884920",
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
          curl: `curl -X POST "https://api.wahide.id/api/v1/wa/otp/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "template": "Kode verifikasi Anda adalah *{{otp}}*. Jangan bagikan kode ini.",
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/otp/send",
  {
    phone: "628123456789",
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
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/otp/send",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "phone" => "628123456789",
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
    "https://api.wahide.id/api/v1/wa/otp/send",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"phone": "628123456789", "expires_in": 300}
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
		"expires_in": 300,
	})
	req, _ := http.NewRequest("POST", "https://api.wahide.id/api/v1/wa/otp/send", bytes.NewBuffer(payload))
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
            description: "OTP dispatched to WhatsApp.",
            json: `{
  "success": true,
  "message": "Kode OTP berhasil dikirim",
  "data": {
    "message_id": "3EB0A1B2C3D4E5F6",
    "phone": "628123456789",
    "status": "SENT",
    "expires_in": 300,
    "sent_at": "2026-09-18T10:00:00Z"
  }
}`,
          },
        ],
      },
      {
        id: "waba",
        label: "WABA (Official)",
        icon: "Globe",
        badge: "Meta Official",
        method: "POST",
        path: "/api/v1/otp/send",
        description:
          "Dispatches an official Meta WhatsApp Business Authentication OTP using pre-approved authentication templates with one-tap copy button.",
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
            name: "otp",
            type: "string",
            required: false,
            defaultValue: "Auto 6-digit",
            description: "6-digit OTP code to inject into the Meta Authentication template.",
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
    "expires_in": 300
  }'`,
          nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/otp/send",
  { phone: "628123456789", expires_in: 300 },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
          php: `<?php
/* Meta Official OTP Dispatch */`,
          python: `import requests
res = requests.post("https://api.wahide.id/api/v1/otp/send", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"phone": "628123456789"})`,
          go: `// Meta Official OTP Dispatch in Go`,
        },
        responses: [
          {
            status: 200,
            statusText: "OK",
            description: "Meta Authentication OTP delivered.",
            json: `{
  "success": true,
  "message": "Kode OTP Meta WABA berhasil dikirim",
  "data": {
    "message_id": "wamid.HBgMNjI4MTIzNDU2Nzg5...",
    "phone": "628123456789",
    "expires_in": 300
  }
}`,
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
          "Dispatches an OTP verification code directly to a Telegram user's Chat ID via your connected Telegram bot.",
        headers: [
          {
            key: "Authorization",
            value: "Bearer <your_api_key>",
            required: true,
            description: "Your secret Wahide API Key prefixed with Bearer.",
          },
        ],
        parameters: [
          {
            name: "bot_id",
            type: "string",
            required: true,
            description: "ULID of your connected Telegram Bot.",
            example: "01JPLAN0000000000000000001",
          },
          {
            name: "chat_id",
            type: "integer",
            required: true,
            description: "Telegram user's Chat ID.",
            example: "987654321",
          },
          {
            name: "text",
            type: "string",
            required: true,
            description: "HTML formatted OTP text with <code> tags for easy tap-to-copy.",
            example: "Kode verifikasi Anda: <code>884920</code>. Berlaku 5 menit.",
          },
        ],
        snippets: {
          curl: `curl -X POST "https://api.wahide.id/api/v1/telegram/messages/send" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "bot_id": "01JPLAN0000000000000000001",
    "chat_id": 987654321,
    "text": "Kode verifikasi Anda: <code>884920</code>. Berlaku 5 menit.",
    "parse_mode": "HTML"
  }'`,
          nodejs: `import axios from "axios";
const res = await axios.post("https://api.wahide.id/api/v1/telegram/messages/send", {
  bot_id: "01JPLAN0000000000000000001",
  chat_id: 987654321,
  text: "Kode verifikasi Anda: <code>884920</code>",
  parse_mode: "HTML"
}, { headers: { Authorization: "Bearer YOUR_API_KEY" } });`,
          php: `<?php /* Telegram OTP */`,
          python: `import requests
res = requests.post("https://api.wahide.id/api/v1/telegram/messages/send", headers={"Authorization": "Bearer YOUR_API_KEY"}, json={"bot_id": "01JPLAN...", "chat_id": 987654321, "text": "Kode OTP: 884920"})`,
          go: `// Telegram OTP in Go`,
        },
        responses: [
          {
            status: 200,
            statusText: "OK",
            description: "Telegram OTP delivered.",
            json: `{ "success": true, "data": { "message_id": 12347, "status": "SENT" } }`,
          },
        ],
      },
    ],
    bannerNotice: {
      type: "success",
      title: "In-Memory Fast Path & Anti-Bombing Cooldown",
      content:
        "OTP verification state is stored purely in Redis with an automated 5-minute TTL, avoiding disk write overhead to MySQL. Protection includes a 60-second resend cooldown and a daily limit of 10 requests per destination number.",
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
        required: false,
        defaultValue: "Auto 6-digit",
        description:
          "Custom OTP code (4-8 digits). If omitted or empty, the engine automatically generates a cryptographically random 6-digit numeric code.",
        example: "884920",
      },
      {
        name: "template",
        type: "string",
        required: false,
        defaultValue: `"Your verification code is *{{otp}}*. Keep this code confidential. Valid for 5 minutes."`,
        description:
          "Custom message template body. Must include the '{{otp}}' placeholder which will be replaced by the generated OTP code.",
        example:
          "Your login verification code is *{{otp}}*. Do not share this code with anyone.",
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
      {
        name: "priority",
        type: "boolean",
        required: false,
        defaultValue: "true",
        description:
          "When true, routes the dispatch into the VIP Express stream to bypass bulk marketing campaign queues and deliver within sub-seconds.",
        example: "true",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/otp/send" \\
  -H "Authorization: Bearer hide_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "628123456789",
    "template": "Your account verification code is *{{otp}}*. Valid for 5 minutes.",
    "device_id": "auto",
    "expires_in": 300,
    "priority": true
  }'`,
      nodejs: `import axios from "axios";

const response = await axios.post(
  "https://api.wahide.com/api/v1/otp/send",
  {
    phone: "628123456789",
    template: "Your account verification code is *{{otp}}*. Valid for 5 minutes.",
    device_id: "auto",
    expires_in: 300,
    priority: true,
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
    "template" => "Your account verification code is *{{otp}}*. Valid for 5 minutes.",
    "device_id" => "auto",
    "expires_in" => 300,
    "priority" => true,
];

curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.wahide.com/api/v1/otp/send",
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

url = "https://api.wahide.com/api/v1/otp/send"
headers = {
    "Authorization": "Bearer hide_YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "phone": "628123456789",
    "template": "Your account verification code is *{{otp}}*. Valid for 5 minutes.",
    "device_id": "auto",
    "expires_in": 300,
    "priority": True,
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
		"template":   "Your account verification code is *{{otp}}*. Valid for 5 minutes.",
		"device_id":  "auto",
		"expires_in": 300,
		"priority":   true,
	})

	req, _ := http.NewRequest("POST", "https://api.wahide.com/api/v1/otp/send", bytes.NewBuffer(payload))
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
          "OTP generated, stored in Redis cache, and queued for instant WhatsApp delivery.",
        json: `{
  "code": 200,
  "status": "success",
  "message": "OTP sent successfully",
  "data": {
    "phone": "628123456789",
    "expires_in": 300,
    "cooldown": 60
  }
}`,
        attributes: [
          {
            name: "data.phone",
            type: "string",
            description: "Target normalized phone number in E.164 format.",
          },
          {
            name: "data.expires_in",
            type: "integer",
            description:
              "Remaining validity period in seconds (default: 300s).",
          },
          {
            name: "data.cooldown",
            type: "integer",
            description:
              "Minimum interval in seconds before the next OTP request is allowed (60s).",
          },
        ],
      },
      {
        status: 429,
        statusText: "Too Many Requests",
        description:
          "Request rejected due to active cooldown timer or daily limit.",
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
        description: "No WhatsApp device is connected and healthy.",
        json: `{
  "code": 503,
  "status": "error",
  "error": "ERR_NO_CONNECTED_DEVICE",
  "message": "No connected WhatsApp device available to send OTP"
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
          "Tenant has no WhatsApp device currently in 'Connected' state.",
        solution:
          "Connect at least one WhatsApp device via QR code pairing in the Wahide dashboard.",
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
