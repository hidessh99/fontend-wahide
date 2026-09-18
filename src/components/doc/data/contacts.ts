import { EndpointDoc } from "../types";

export const contactsEndpoints: EndpointDoc[] = [
  {
    type: "endpoint",
    id: "contacts-list",
    slug: "contacts/list",
    title: "List Contacts",
    description:
      "Search, filter, and paginate through your stored WhatsApp contact list.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "GET",
    path: "/api/v1/contacts",
    parameters: [
      {
        name: "search",
        type: "string",
        required: false,
        description: "Filter contacts by name or phone query.",
        example: "Alex",
      },
      {
        name: "tag",
        type: "string",
        required: false,
        description: "Filter contacts tagged with a specific tag name.",
        example: "VIP",
      },
      {
        name: "page",
        type: "integer",
        required: false,
        defaultValue: "1",
        description: "Page index.",
      },
      {
        name: "size",
        type: "integer",
        required: false,
        defaultValue: "20",
        description: "Number of contacts per page.",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/contacts?search=Alex&page=1&size=20" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/contacts", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
  params: {
    search: "Alex",
    page: 1,
    size: 20,
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/contacts?search=Alex&page=1&size=20",
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

url = "https://api.wahide.com/api/v1/contacts"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}
params = {
    "search": "Alex",
    "page": 1,
    "size": 20,
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
	url := "https://api.wahide.com/api/v1/contacts?search=Alex&page=1&size=20"

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
        description: "Paginated list of contacts.",
        json: `{
  "success": true,
  "payload": [
    {
      "id": "01M1CT001",
      "name": "Alex Johnson",
      "phone": "628123456789",
      "tags": ["VIP", "Retail"],
      "custom_fields": { "city": "Jakarta" }
    }
  ],
  "additional_info": { "page": 1, "size": 20, "total": 1 }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-create",
    slug: "contacts/create",
    title: "Create Contact",
    description: "Adds a new individual contact record to your address book.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "POST",
    path: "/api/v1/contacts",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Full name of the contact.",
        example: "Alex Johnson",
      },
      {
        name: "phone",
        type: "string",
        required: true,
        description: "Phone number in E.164 format.",
        example: "628123456789",
      },
      {
        name: "tags",
        type: "array",
        required: false,
        description: "Array of tag strings.",
        example: '["VIP", "Prospect"]',
      },
      {
        name: "custom_fields",
        type: "object",
        required: false,
        description:
          "Key-value dictionary for dynamic variable substitution in broadcasts.",
        example: '{"company": "Acme Corp"}',
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/contacts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Johnson",
    "phone": "628123456789",
    "tags": ["VIP"]
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/contacts", {
  name: "Alex Johnson",
  phone: "628123456789",
  tags: ["VIP"],
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
  CURLOPT_URL => "https://api.wahide.com/api/v1/contacts",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "name" => "Alex Johnson",
    "phone" => "628123456789",
    "tags" => ["VIP"],
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

url = "https://api.wahide.com/api/v1/contacts"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "name": "Alex Johnson",
    "phone": "628123456789",
    "tags": ["VIP"],
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
	url := "https://api.wahide.com/api/v1/contacts"
	payload, _ := json.Marshal(map[string]interface{}{
		"name":  "Alex Johnson",
		"phone": "628123456789",
		"tags":  []string{"VIP"},
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
        description: "Contact created successfully.",
        json: `{
  "success": true,
  "message": "contact created successfully",
  "payload": {
    "id": "01M1CT001",
    "name": "Alex Johnson",
    "phone": "628123456789"
  }
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-bulk-import",
    slug: "contacts/bulk-import",
    title: "Bulk Import Contacts",
    description:
      "Imports up to 5,000 contacts in a single asynchronous batch operation.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "POST",
    path: "/api/v1/contacts/bulk",
    badge: "High Throughput",
    parameters: [
      {
        name: "contacts",
        type: "array",
        required: true,
        description:
          "Array of contact objects (name, phone, tags, custom_fields).",
        depth: 0,
      },
      {
        name: "contacts[].name",
        type: "string",
        required: true,
        description: "Contact name.",
        depth: 1,
        parent: "contacts",
      },
      {
        name: "contacts[].phone",
        type: "string",
        required: true,
        description: "Contact phone in E.164 format.",
        depth: 1,
        parent: "contacts",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/contacts/bulk" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contacts": [
      { "name": "Alice", "phone": "628111111111" },
      { "name": "Bob", "phone": "628222222222" }
    ]
  }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/contacts/bulk", {
  contacts: [
    { name: "Alice", phone: "628111111111" },
    { name: "Bob", phone: "628222222222" },
  ],
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
  CURLOPT_URL => "https://api.wahide.com/api/v1/contacts/bulk",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "contacts" => [
      ["name" => "Alice", "phone" => "628111111111"],
      ["name" => "Bob", "phone" => "628222222222"],
    ],
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

url = "https://api.wahide.com/api/v1/contacts/bulk"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "contacts": [
        {"name": "Alice", "phone": "628111111111"},
        {"name": "Bob", "phone": "628222222222"},
    ],
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
	url := "https://api.wahide.com/api/v1/contacts/bulk"
	payload, _ := json.Marshal(map[string]interface{}{
		"contacts": []map[string]string{
			{"name": "Alice", "phone": "628111111111"},
			{"name": "Bob", "phone": "628222222222"},
		},
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
        status: 200,
        statusText: "OK",
        description: "Bulk import queued.",
        json: `{
  "success": true,
  "message": "imported 2 contacts successfully"
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-bulk-delete",
    slug: "contacts/bulk-delete",
    title: "Bulk Delete Contacts",
    description: "Deletes multiple contacts by IDs.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "POST",
    path: "/api/v1/contacts/bulk-delete",
    parameters: [
      {
        name: "ids",
        type: "array",
        required: true,
        description: "Array of contact ID strings to delete.",
        example: '["01M1CT001", "01M1CT002"]',
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.com/api/v1/contacts/bulk-delete" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "ids": ["01M1CT001", "01M1CT002"] }'`,
      nodejs: `import axios from "axios";

const res = await axios.post("https://api.wahide.com/api/v1/contacts/bulk-delete", {
  ids: ["01M1CT001", "01M1CT002"],
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
  CURLOPT_URL => "https://api.wahide.com/api/v1/contacts/bulk-delete",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "ids" => ["01M1CT001", "01M1CT002"],
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

url = "https://api.wahide.com/api/v1/contacts/bulk-delete"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
}
payload = {
    "ids": ["01M1CT001", "01M1CT002"],
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
	url := "https://api.wahide.com/api/v1/contacts/bulk-delete"
	payload, _ := json.Marshal(map[string]interface{}{
		"ids": []string{"01M1CT001", "01M1CT002"},
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
        status: 200,
        statusText: "OK",
        description: "Contacts deleted.",
        json: `{ "success": true, "message": "contacts deleted successfully" }`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-tags",
    slug: "contacts/tags",
    title: "List Contact Tags",
    description: "Retrieves all user tags and their associated contact counts.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "GET",
    path: "/api/v1/contacts/tags",
    parameters: [],
    snippets: {
      curl: `curl -X GET "https://api.wahide.com/api/v1/contacts/tags" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      nodejs: `import axios from "axios";

const res = await axios.get("https://api.wahide.com/api/v1/contacts/tags", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});
console.log(res.data);`,
      php: `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.com/api/v1/contacts/tags",
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

url = "https://api.wahide.com/api/v1/contacts/tags"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
}

response = requests.get(url, headers=headers)
print(response.json())`,
      go: `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.com/api/v1/contacts/tags"

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
        description: "List of tags.",
        json: `{
  "success": true,
  "payload": [
    { "id": "01M1TAG01", "name": "VIP", "total_contacts": 142 },
    { "id": "01M1TAG02", "name": "Retail", "total_contacts": 850 }
  ]
}`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-export",
    slug: "contacts/export",
    title: "Export Contacts to CSV",
    description:
      "Exports your entire contact list or filtered contacts by tag directly as a downloadable CSV stream.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "GET",
    path: "/api/v1/contacts/export",
    parameters: [
      {
        name: "tag",
        type: "string",
        required: false,
        description: "Optional tag name to filter exported contacts.",
        example: "VIP",
      },
    ],
    snippets: {
      curl: `curl -X GET "https://api.wahide.id/api/v1/contacts/export?tag=VIP" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -o contacts.csv`,
      nodejs: `import axios from "axios";
import fs from "fs";

const res = await axios.get("https://api.wahide.id/api/v1/contacts/export", {
  headers: { Authorization: "Bearer YOUR_API_KEY" },
  params: { tag: "VIP" },
  responseType: "stream",
});
res.data.pipe(fs.createWriteStream("contacts.csv"));`,
      php: `<?php
$fp = fopen("contacts.csv", "w+");
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/contacts/export?tag=VIP",
  CURLOPT_FILE => $fp,
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY"],
]);
curl_exec($curl);
curl_close($curl);
fclose($fp);`,
      python: `import requests

url = "https://api.wahide.id/api/v1/contacts/export"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
params = {"tag": "VIP"}

res = requests.get(url, headers=headers, params=params)
with open("contacts.csv", "wb") as f:
    f.write(res.content)`,
      go: `package main

import (
	"io"
	"net/http"
	"os"
)

func main() {
	url := "https://api.wahide.id/api/v1/contacts/export?tag=VIP"
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer YOUR_API_KEY")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	out, _ := os.Create("contacts.csv")
	defer out.Close()
	io.Copy(out, resp.Body)
}`,
    },
    responses: [
      {
        status: 200,
        statusText: "OK",
        description: "CSV stream payload.",
        json: `name,phone,tags\\n"Alex Johnson","628123456789","VIP"`,
      },
    ],
  },
  {
    type: "endpoint",
    id: "contacts-tags-create",
    slug: "contacts/create-tag",
    title: "Create Contact Tag",
    description: "Creates a new contact segmentation tag.",
    category: "Contacts Management",
    categorySlug: "contacts",
    method: "POST",
    path: "/api/v1/contacts/tags",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Unique tag name.",
        example: "Customer-Loyal",
      },
      {
        name: "color",
        type: "string",
        required: false,
        description: "Hex color code for UI badging.",
        example: "#10B981",
      },
    ],
    snippets: {
      curl: `curl -X POST "https://api.wahide.id/api/v1/contacts/tags" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Customer-Loyal", "color": "#10B981"}'`,
      nodejs: `import axios from "axios";

const res = await axios.post(
  "https://api.wahide.id/api/v1/contacts/tags",
  { name: "Customer-Loyal", color: "#10B981" },
  { headers: { Authorization: "Bearer YOUR_API_KEY" } }
);
console.log(res.data);`,
      php: `<?php
$curl = curl_init();
curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.wahide.id/api/v1/contacts/tags",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode(["name" => "Customer-Loyal", "color" => "#10B981"]),
  CURLOPT_HTTPHEADER => ["Authorization: Bearer YOUR_API_KEY", "Content-Type: application/json"],
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;`,
      python: `import requests

url = "https://api.wahide.id/api/v1/contacts/tags"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
response = requests.post(url, headers=headers, json={"name": "Customer-Loyal", "color": "#10B981"})
print(response.json())`,
      go: `package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "https://api.wahide.id/api/v1/contacts/tags"
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer([]byte(\`{"name":"Customer-Loyal"}\`)))
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
        status: 201,
        statusText: "Created",
        description: "Tag created successfully.",
        json: `{
  "success": true,
  "data": { "id": "01M1TAG99", "name": "Customer-Loyal", "color": "#10B981" }
}`,
      },
    ],
  },
];
