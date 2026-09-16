import type { Metadata } from "next";
import { OmnichannelMessagesView } from "@/modules/omnichannel/views/OmnichannelMessagesView";

export const metadata: Metadata = {
  title: "Pesan Cepat (Quick Message) | Wahide",
  description:
    "Kirim pesan instan 1-on-1 langsung ke pelanggan via WhatsApp Web, Meta WABA Official, dan Telegram Bot dengan simulasi live.",
  alternates: {
    canonical: "/send/message",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SendMessagePage() {
  return <OmnichannelMessagesView />;
}
