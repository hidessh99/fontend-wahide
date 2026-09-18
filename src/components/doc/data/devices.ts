import { EndpointDoc } from "../types";

export const devicesEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "devices-list",
    slug: "devices/list",
    title: "List Devices",
    description:
      "Retrieves all WhatsApp device slots configured for your organization, including their live connection states, trust scores, and warmup limits.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "GET",
    path: "/api/v1/wa/devices",
    parameters: [
      {
        name: "page",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page number for pagination.",
        example: "1",
      },
      {
        name: "size",
        type: "integer",
        required: false,
        defaultValue: "10",
        description: "Number of devices per page (max: 50).",
        example: "10",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/wa/devices?page=1&size=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/wa/devices", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  params: {
    page: 1,
    size: 10,
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/devices?page=1&size=10",
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

url = "https://api.wahide.com/api/v1/wa/devices"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}
params = {
    "page": 1,
    "size": 10,
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
	url := "https://api.wahide.com/api/v1/wa/devices?page=1&size=10"

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
        description: "Array of device objects with pagination metadata.",
        json: `{
  "success": true,
  "message": "devices retrieved successfully",
  "payload": [
    {
      "id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
      "tenant_id": "01M1TG7TWDHZSXVPBEAZVFNF24",
      "jid": "628123456789@s.whatsapp.net",
      "push_name": "Customer Support 1",
      "status": "CONNECTED",
      "trust_score": 85,
      "warmup_day": 14,
      "daily_sent_count": 42,
      "last_seen_at": "2026-09-07T09:45:35.481+07:00",
      "created_at": "2026-08-24T10:00:00.000+07:00"
    }
  ],
  "additional_info": {
    "page": 1,
    "size": 10,
    "total": 1
  }
}`,
        attributes: [
          {
            name: "payload[].status",
            type: "string",
            description:
              "Connection status: 'QR_PENDING', 'CONNECTED', or 'DISCONNECTED'.",
          },
          {
            name: "payload[].trust_score",
            type: "integer",
            description:
              "Dynamic health score (0-100) calculated from account age, spam flags, and response rates.",
          },
          {
            name: "payload[].warmup_day",
            type: "integer",
            description:
              "Current day in anti-ban warmup schedule (Day 1: 50 msgs/day -> Day 14+: Unrestricted).",
          },
        ],
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-create",
    slug: "devices/create",
    title: "Create Device Slot",
    description:
      "Allocates a new WhatsApp device slot ready for QR code pairing.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices",
    parameters: [
      {
        name: "push_name",
        type: "string",
        required: true,
        description:
          "Friendly label for this device (e.g. 'CS Sales Bandung').",
        example: "CS Sales Bandung",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "push_name": "CS Sales Bandung"
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/wa/devices", {
  push_name: "CS Sales Bandung",
}, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/devices",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "push_name" => "CS Sales Bandung",
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

url = "https://api.wahide.com/api/v1/wa/devices"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "push_name": "CS Sales Bandung",
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
	url := "https://api.wahide.com/api/v1/wa/devices"
	payload, _ := json.Marshal(map[string]string{
		"push_name": "CS Sales Bandung",
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
        description: "Device slot created with QR_PENDING status.",
        json: `{
  "success": true,
  "message": "device created successfully",
  "payload": {
    "id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "push_name": "CS Sales Bandung",
    "status": "QR_PENDING",
    "trust_score": 10,
    "warmup_day": 1
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-pair",
    slug: "devices/pair",
    title: "Pair Device (QR Code)",
    description:
      "Initiates Multi-Device WhatsApp pairing and returns the Base64 QR code string to scan with the WhatsApp mobile app.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/{deviceId}/pair",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Unique ULID identifier of the device slot.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND/pair" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
const res = await axios.post(
  \`https://api.wahide.com/api/v1/wa/devices/\${deviceId}/pair\`,
  {},
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
      php: `<?php
$deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/devices/{$deviceId}/pair",
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

device_id = "01M1WW3FKR1JS7CW4KGY78Q5ND"
url = f"https://api.wahide.com/api/v1/wa/devices/{device_id}/pair"
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
	deviceID := "01M1WW3FKR1JS7CW4KGY78Q5ND"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/wa/devices/%s/pair", deviceID)

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
        description: "QR pairing code generated.",
        json: `{
  "success": true,
  "message": "QR code generated",
  "payload": {
    "device_id": "01M1WW3FKR1JS7CW4KGY78Q5ND",
    "qr_code": "2@qP...base64_qr_data...",
    "expires_in_seconds": 60
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-disconnect",
    slug: "devices/disconnect",
    title: "Disconnect Device",
    description:
      "Gracefully terminates the WhatsApp Web session and transitions the device to DISCONNECTED status without deleting historic analytics.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/{deviceId}/disconnect",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Unique ULID identifier of the device.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND/disconnect" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
const res = await axios.post(
  \`https://api.wahide.com/api/v1/wa/devices/\${deviceId}/disconnect\`,
  {},
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
      php: `<?php
$deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/devices/{$deviceId}/disconnect",
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

device_id = "01M1WW3FKR1JS7CW4KGY78Q5ND"
url = f"https://api.wahide.com/api/v1/wa/devices/{device_id}/disconnect"
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
	deviceID := "01M1WW3FKR1JS7CW4KGY78Q5ND"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/wa/devices/%s/disconnect", deviceID)

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
        description: "Device disconnected successfully.",
        json: `{
  "success": true,
  "message": "device disconnected successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-delete",
    slug: "devices/delete",
    title: "Delete Device Slot",
    description:
      "Permanently removes a device slot from your tenant organization.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "DELETE",
    path: "/api/v1/wa/devices/{deviceId}",
    parameters: [
      {
        name: "deviceId",
        type: "string",
        required: true,
        description: "Device ULID to delete.",
        example: "01M1WW3FKR1JS7CW4KGY78Q5ND",
      },
    ],
    snippets: {
      curl: `curl -X DELETE "https://api.wahide.com/api/v1/wa/devices/01M1WW3FKR1JS7CW4KGY78Q5ND" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
const res = await axios.delete(
  \`https://api.wahide.com/api/v1/wa/devices/\${deviceId}\`,
  {
    headers: { Authorization: "Bearer YOUR_API_KEY" },
  }
);
console.log(res.data);`,
      php: `<?php
$deviceId = "01M1WW3FKR1JS7CW4KGY78Q5ND";
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/wa/devices/{$deviceId}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "DELETE",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer YOUR_API_KEY",
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;`,
      python: `import requests

device_id = "01M1WW3FKR1JS7CW4KGY78Q5ND"
url = f"https://api.wahide.com/api/v1/wa/devices/{device_id}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}

response = requests.delete(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	deviceID := "01M1WW3FKR1JS7CW4KGY78Q5ND"
	url := fmt.Sprintf("https://api.wahide.com/api/v1/wa/devices/%s", deviceID)

	req, _ := http.NewRequest("DELETE", url, nil)
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
        description: "Device removed.",
        json: `{
  "success": true,
  "message": "device deleted successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-pair-phone",
    slug: "devices/pair-phone",
    title: "Pair WhatsApp via Phone Code",
    description:
      "Generates an 8-digit alphanumeric pairing code directly sent to the WhatsApp mobile app, allowing device linking without camera/QR scanning.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/:id/pair-phone",
    badge: "Anti-Camera",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "Target Device Slot ULID.",
        example: "01JPLAN0000000000000000001",
      },
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Phone number with country code (E.164, without '+' or dashes).",
        example: "628123456789",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/pair-phone" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "628123456789"}'`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/pair-phone",
  { phone: "628123456789" },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/pair-phone",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode(["phone" => "628123456789"]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/pair-phone"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.post(url, headers=headers, json={"phone": "628123456789"})
print(response.json())`,
      go: `package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/pair-phone"
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer([]byte(\`{"phone":"628123456789"}\`)))
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Set("Content-Type", "application/json")

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
        description: "8-digit pairing code issued successfully.",
        json: `{
  "success": true,
  "data": {
    "pairing_code": "AB12-CD34",
    "expires_in_seconds": 160
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-hibernate",
    slug: "devices/hibernate",
    title: "Hibernate WhatsApp Session",
    description:
      "Disconnects the background WebSocket to conserve server memory while retaining device encryption credentials. Sessions with active autoreply rules are automatically exempted.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/:id/hibernate",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ULID of the WhatsApp device slot.",
        example: "01JPLAN0000000000000000001",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/hibernate" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/hibernate",
  {},
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/hibernate",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/hibernate"
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
	url := "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/hibernate"
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
        description: "Device session hibernated.",
        json: `{
  "success": true,
  "message": "device session hibernated successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "devices-wake",
    slug: "devices/wake",
    title: "Wake WhatsApp Session",
    description:
      "Wakes up a hibernated WhatsApp device session and re-establishes the encrypted WebSocket connection.",
    category: "WhatsApp Devices",
    categorySlug: "devices",
    method: "POST",
    path: "/api/v1/wa/devices/:id/wake",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ULID of the WhatsApp device slot.",
        example: "01JPLAN0000000000000000001",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/wake" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/wake",
  {},
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/wake",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/wake"
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
	url := "https://api.wahide.id/api/v1/wa/devices/01JPLAN0000000000000000001/wake"
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
        description: "Device session awakened.",
        json: `{
  "success": true,
  "message": "device session awakened successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "waba-accounts-list",
    slug: "waba/accounts",
    title: "List Meta WABA Accounts",
    description:
      "Retrieves official WhatsApp Business API (WABA) Cloud API accounts connected via Meta Business Manager.",
    category: "WhatsApp Cloud API (WABA)",
    categorySlug: "waba",
    method: "GET",
    path: "/api/v1/waba/accounts",
    parameters: [],
    snippets: {
      curl: `curl -X GET "https://api.wahide.id/api/v1/waba/accounts" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.id/api/v1/waba/accounts", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/waba/accounts",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/waba/accounts"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.get(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/waba/accounts"
	req, _ := http.NewRequest("GET", url, nil)
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
        description: "Official WABA accounts retrieved.",
        json: `{
  "success": true,
  "data": [
    {
      "id": "01JPLAN0000000000000000088",
      "waba_account_id": "109876543210987",
      "phone_number_id": "101234567890123",
      "display_phone_number": "+62 811-2345-6789",
      "verified_name": "Wahide Enterprise",
      "quality_rating": "GREEN",
      "is_active": true
    }
  ]
}`,
      },
    ],
  },
];
