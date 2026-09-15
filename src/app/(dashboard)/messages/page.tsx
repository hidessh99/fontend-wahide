import { Metadata } from "next";
import { WhatsAppUserMessagesView } from "@/modules/whatsapp/views/user/WhatsAppUserMessagesView";

export const metadata: Metadata = {
  title: "WhatsApp Chats & Messages | Wahide",
  description:
    "Monitor real-time WhatsApp message logs, check delivery statuses, and compose instant messages with live preview.",
};

export default function MessagesPage() {
  return <WhatsAppUserMessagesView />;
}
