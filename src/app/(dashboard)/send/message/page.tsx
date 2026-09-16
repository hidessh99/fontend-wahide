import type { Metadata } from "next";
import { OmnichannelMessagesView } from "@/modules/omnichannel/views/OmnichannelMessagesView";

export const metadata: Metadata = {
  title: "Pesan Cepat Omnichannel | Wahide",
  description:
    "Pantau riwayat pesan multi-saluran, cek status delivery, dan kirim pesan instan via WhatsApp Web, Meta WABA Official, dan Telegram Bot dengan live preview.",
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
