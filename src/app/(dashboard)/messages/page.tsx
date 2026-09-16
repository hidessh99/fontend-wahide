import { Metadata } from "next";
import { OmnichannelMessagesView } from "@/modules/omnichannel/views/OmnichannelMessagesView";

export const metadata: Metadata = {
  title: "Omnichannel Chats & Messages | Wahide",
  description:
    "Pantau riwayat pesan multi-saluran, cek status delivery, dan kirim pesan instan via WhatsApp Web, Meta WABA Official, dan Telegram Bot dengan live preview.",
};

export default function MessagesPage() {
  return <OmnichannelMessagesView />;
}

