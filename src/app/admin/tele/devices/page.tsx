import type { Metadata } from "next";
import { TelegramAdminBotsView } from "@/modules/telegram/views/admin/TelegramAdminBotsView";

export const metadata: Metadata = {
  title: "Manajemen Bot Telegram Seluruh Pengguna | Wahide Admin",
  description:
    "Audit, pantau, dan kelola seluruh bot Telegram BotFather dan webhook platform di Wahide.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminTelegramDevicesPage() {
  return <TelegramAdminBotsView />;
}
