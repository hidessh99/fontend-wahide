import { Metadata } from "next";
import { InboxView } from "@/modules/inbox/views/InboxView";

export const metadata: Metadata = {
  title: "Live Chat Inbox CS | Wahide",
  description:
    "Omnichannel Live Chat CS real-time interaktif untuk WhatsApp Unofficial, Meta WABA Official, dan Telegram Bot.",
};

export default function InboxPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <InboxView />
    </div>
  );
}
