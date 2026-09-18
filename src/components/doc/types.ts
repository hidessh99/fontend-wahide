export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ParameterDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
  example?: string;
  depth?: number; // 0 for root, 1 for nested (e.g. text.body)
  parent?: string;
}

export interface ResponseAttrDoc {
  name: string;
  type: string;
  description: string;
}

export interface ResponseDoc {
  status: number;
  statusText: string;
  description: string;
  json: string;
  attributes?: ResponseAttrDoc[];
}

export interface CodeSnippetDoc {
  curl: string;
  nodejs: string;
  php: string;
  python: string;
  go: string;
}

export interface ErrorMatrixItem {
  code: number;
  error: string;
  description: string;
  solution: string;
}

export interface ChannelSubtypeDoc {
  id: string; // "text" | "media"
  label: string; // "Teks" | "Media + Caption"
  method?: HttpMethod;
  path?: string;
  description?: string;
  parameters?: ParameterDoc[];
  snippets?: CodeSnippetDoc;
  responses?: ResponseDoc[];
}

export interface ChannelVariantDoc {
  id: string; // "whatsmeow" | "waba" | "telegram" | "messenger" | "instagram"
  label: string; // "WhatsApp (Whatsmeow)" | "WABA (Official)" | "Telegram"
  icon: string; // "Smartphone" | "Globe" | "Send" | "MessageSquare" | "Camera"
  disabled?: boolean;
  badge?: string; // "Unofficial Socket" | "Meta Official" | "Bot API" | "Coming Soon"
  method: HttpMethod;
  path: string;
  description?: string;
  headers?: {
    key: string;
    value: string;
    required: boolean;
    description: string;
  }[];
  parameters: ParameterDoc[];
  snippets: CodeSnippetDoc;
  responses: ResponseDoc[];
  errorMatrix?: ErrorMatrixItem[];
  subtypes?: ChannelSubtypeDoc[];
}

export interface EndpointDoc {
  type: "endpoint";
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  method: HttpMethod;
  path: string;
  badge?: string;
  channelVariants?: ChannelVariantDoc[];
  bannerNotice?: {
    type: "info" | "warning" | "success";
    title: string;
    content: string;
  };
  headers?: {
    key: string;
    value: string;
    required: boolean;
    description: string;
  }[];
  parameters: ParameterDoc[];
  snippets: CodeSnippetDoc;
  responses: ResponseDoc[];
  errorMatrix?: ErrorMatrixItem[];
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: "info" | "warning" | "success" | "tip";
    title: string;
    content: string;
  };
  code?: {
    language: string;
    content: string;
    title?: string;
  };
  codeTabs?: CodeSnippetDoc;
  codeTabsTitle?: string;
}

export interface GuideDoc {
  type: "guide";
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  bannerNotice?: {
    type: "info" | "warning" | "success";
    title: string;
    content: string;
  };
  sections: GuideSection[];
}

export type DocItem = EndpointDoc | GuideDoc;

export interface NavItem {
  id: string;
  title: string;
  path: string;
  method?: HttpMethod;
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface NavSection {
  id: string;
  title: string;
  icon?: string;
  items?: NavItem[];
  groups?: NavGroup[];
}
