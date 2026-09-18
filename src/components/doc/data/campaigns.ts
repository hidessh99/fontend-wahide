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
      "Configures a new broadcast queue with rate limits, jitter, and target contact tags.",
    category: "Campaigns & Broadcasts",
    categorySlug: "campaigns",
    method: "POST",
    path: "/api/v1/campaigns",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Campaign display name.",
        example: "Weekend Flash Sale 50%",
      },
      {
        name: "message_template",
        type: "string",
        required: true,
        description:
          "Message template with variables like {{name}} and Spintax.",
        example: "{Hi|Hello} {{name}}, our flash sale is live!",
      },
      {
        name: "tag_ids",
        type: "array",
        required: true,
        description: "List of contact tag IDs to target for broadcast.",
        example: '["01M1TAG01"]',
      },
      {
        name: "min_delay_seconds",
        type: "integer",
        required: false,
        defaultValue: "5",
        description:
          "Minimum jitter delay between outbound dispatches (anti-ban).",
      },
      {
        name: "max_delay_seconds",
        type: "integer",
        required: false,
        defaultValue: "15",
        description: "Maximum jitter delay between dispatches.",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/campaigns" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Weekend Flash Sale",
    "message_template": "Hello {{name}}, sale is active!",
    "tag_ids": ["01M1TAG01"],
    "min_delay_seconds": 5,
    "max_delay_seconds": 15
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/campaigns", {
  name: "Weekend Flash Sale",
  message_template: "Hello {{name}}, sale is active!",
  tag_ids: ["01M1TAG01"],
  min_delay_seconds: 5,
  max_delay_seconds: 15,
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
  CURLOPT_URL => "https://api.wahide.com/api/v1/campaigns",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "name" => "Weekend Flash Sale",
    "message_template" => "Hello {{name}}, sale is active!",
    "tag_ids" => ["01M1TAG01"],
    "min_delay_seconds" => 5,
    "max_delay_seconds" => 15,
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

url = "https://api.wahide.com/api/v1/campaigns"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "name": "Weekend Flash Sale",
    "message_template": "Hello {{name}}, sale is active!",
    "tag_ids": ["01M1TAG01"],
    "min_delay_seconds": 5,
    "max_delay_seconds": 15,
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
	url := "https://api.wahide.com/api/v1/campaigns"
	payload, _ := json.Marshal(map[string]interface{}{
		"name":              "Weekend Flash Sale",
		"message_template":  "Hello {{name}}, sale is active!",
		"tag_ids":           []string{"01M1TAG01"},
		"min_delay_seconds": 5,
		"max_delay_seconds": 15,
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
  "payload": {
    "id": "01M1CP002",
    "name": "Weekend Flash Sale",
    "status": "DRAFT"
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
