import { DocItem, EndpointDoc, GuideDoc } from "../types";
import { introDoc } from "./intro";
import { authenticationDoc } from "./authentication";
import { errorsDoc } from "./errors";
import { devicesEndpoints } from "./devices";
import { messagingEndpoints } from "./messaging";
import { contactsEndpoints } from "./contacts";
import { campaignsEndpoints } from "./campaigns";
import { otpEndpoints } from "./otp";
import { telegramEndpoints } from "./telegram";
import { autoreplyEndpoints } from "./autoreply";
import {
  webhooksGuideDoc,
  webhooksEventsDoc,
  webhooksReceivedDoc,
  webhooksAckDoc,
  webhooksSentDoc,
  webhooksStatusDoc,
  webhooksQrDoc,
} from "./webhooks";
import { n8nDoc } from "./n8n";

export { docNavigation } from "./navigation";
export { introDoc } from "./intro";
export { authenticationDoc } from "./authentication";
export { errorsDoc } from "./errors";
export { devicesEndpoints } from "./devices";
export { messagingEndpoints } from "./messaging";
export { otpEndpoints } from "./otp";
export { contactsEndpoints } from "./contacts";
export { campaignsEndpoints } from "./campaigns";
export { telegramEndpoints } from "./telegram";
export { autoreplyEndpoints } from "./autoreply";
export { n8nDoc } from "./n8n";
export {
  webhooksGuideDoc,
  webhooksEventsDoc,
  webhooksReceivedDoc,
  webhooksAckDoc,
  webhooksSentDoc,
  webhooksStatusDoc,
  webhooksQrDoc,
} from "./webhooks";
export { getDocSeoMetadata, generateDocJsonLd } from "./seo";
export { getApiBaseUrl, getApiHost } from "./env";

export const allGuides: GuideDoc[] = [
  introDoc,
  authenticationDoc,
  errorsDoc,
  webhooksGuideDoc,
  n8nDoc,
];

export const allEndpoints: EndpointDoc[] = [
  ...devicesEndpoints,
  ...messagingEndpoints,
  ...telegramEndpoints,
  ...autoreplyEndpoints,
  ...otpEndpoints,
  ...contactsEndpoints,
  ...campaignsEndpoints,
  webhooksEventsDoc,
  webhooksReceivedDoc,
  webhooksAckDoc,
  webhooksSentDoc,
  webhooksStatusDoc,
  webhooksQrDoc,
];

export const allDocs: DocItem[] = [...allGuides, ...allEndpoints];

/**
 * Resolve a DocItem by its slug array (e.g. ["messaging", "send-text"] or ["intro"])
 */
export function getDocBySlug(slug: string[] | string): DocItem | undefined {
  const normalizedSlug = Array.isArray(slug) ? slug.join("/") : slug;
  return allDocs.find((doc) => doc.slug === normalizedSlug);
}

/**
 * Return all slugs for generateStaticParams in Next.js
 */
export function getAllDocSlugs(): { slug: string[] }[] {
  return allDocs.map((doc) => ({
    slug: doc.slug.split("/"),
  }));
}

/**
 * Quick search across all docs for the DocsSearchModal
 */
export function searchDocs(query: string): DocItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return allDocs.filter((doc) => {
    if (doc.title.toLowerCase().includes(q)) return true;
    if (doc.description.toLowerCase().includes(q)) return true;
    if (doc.type === "endpoint") {
      if (doc.path.toLowerCase().includes(q)) return true;
      if (
        doc.parameters.some(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        )
      ) {
        return true;
      }
    }
    if (doc.type === "guide") {
      if (
        doc.sections.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.content.toLowerCase().includes(q),
        )
      ) {
        return true;
      }
    }
    return false;
  });
}
