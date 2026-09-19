// ==============================================================================
// Wahide Omnichannel - Template Starter Presets Library
// Shared dataset for Telegram Bot, WhatsApp Web (Whatsmeow), and Meta WABA (HSM)
// ==============================================================================

import {
  Template,
  TemplateCategory,
  TemplateChannelType,
  TemplateButton,
  TelegramInlineRow,
} from "../types/template.types";

export type PresetCategoryFilter =
  | "ALL"
  | "BLANK"
  | "WELCOME"
  | "OTP"
  | "ORDER"
  | "REMINDER"
  | "NOTIFICATION"
  | "PROMO"
  | "FEEDBACK"
  | "SUPPORT";

export interface PresetTelegramContent {
  parseMode: "HTML" | "MarkdownV2";
  text: string;
  inlineButtons?: TelegramInlineRow[];
}

export interface PresetWhatsAppContent {
  text: string;
  buttons?: TemplateButton[];
  spintaxEnabled?: boolean;
}

export interface PresetWABAContent {
  category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
  headerType?: "NONE" | "TEXT" | "IMAGE" | "DOCUMENT";
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: Array<{
    type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    text: string;
    value?: string;
  }>;
  exampleValues: Record<string, string>;
}

export interface TemplatePreset {
  id: string;
  title: string;
  description: string;
  category: PresetCategoryFilter;
  mappedTemplateCategory: TemplateCategory;
  supportedChannels: ("TELEGRAM_BOT" | "WHATSMEOW_UNOFFICIAL" | "META_WABA_OFFICIAL")[];
  isBlank?: boolean;
  content: {
    telegram: PresetTelegramContent;
    whatsapp: PresetWhatsAppContent;
    waba: PresetWABAContent;
  };
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  // 1. + Blank
  {
    id: "preset_blank",
    title: "+ Blank",
    description: "Mulai dari kertas kosong sesuai kreativitas Anda",
    category: "BLANK",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    isBlank: true,
    content: {
      telegram: {
        parseMode: "HTML",
        text: "",
        inlineButtons: [],
      },
      whatsapp: {
        text: "",
        buttons: [],
      },
      waba: {
        category: "UTILITY",
        headerType: "NONE",
        bodyText: "",
        exampleValues: {},
      },
    },
  },

  // 2. OTP Code (Official & Secure)
  {
    id: "preset_otp_code",
    title: "OTP Code",
    description: "Kode verifikasi OTP aman dengan masa berlaku dan tombol salin",
    category: "OTP",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>🔐 KODE VERIFIKASI OTP</b>\n\nKode OTP Anda adalah: <code>{{otp}}</code>\n<i>(Ketuk kode di atas untuk menyalin)</i>\n\n⚠️ Kode berlaku selama 5 menit. Jangan pernah membagikan kode ini kepada siapa pun demi keamanan akun Anda.",
        inlineButtons: [
          [
            { text: "📋 Salin Kode OTP", callback_data: "COPY_{{otp}}" },
          ],
        ],
      },
      whatsapp: {
        text: "Kode verifikasi OTP Anda adalah *{{otp}}*.\n\nBerlaku selama 5 menit. JANGAN bagikan kode rahasia ini kepada siapa pun demi keamanan akun Anda.",
        buttons: [
          { type: "QUICK_REPLY", text: "Salin Kode" },
        ],
      },
      waba: {
        category: "AUTHENTICATION",
        headerType: "NONE",
        bodyText: "{{1}} adalah kode verifikasi OTP akun Anda. Demi keamanan, jangan pernah membagikan kode ini kepada siapapun.",
        footerText: "Pesan otomatis sistem keamanan Wahide",
        buttons: [
          { type: "QUICK_REPLY", text: "Salin Kode" },
        ],
        exampleValues: {
          "1": "782941",
        },
      },
    },
  },

  // 3. OTP — Minimal
  {
    id: "preset_otp_minimal",
    title: "OTP — Minimal",
    description: "Pesan kode verifikasi ringkas dan langsung to-the-point",
    category: "OTP",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "Kode verifikasi akun Anda: <code>{{otp}}</code>. Berlaku 5 menit.",
      },
      whatsapp: {
        text: "{Halo|Hai} Pelanggan, kode verifikasi Anda adalah *{{otp}}*. Jangan bagikan kode ini kepada orang lain.",
        spintaxEnabled: true,
      },
      waba: {
        category: "AUTHENTICATION",
        headerType: "NONE",
        bodyText: "Kode verifikasi Anda adalah {{1}}. Berlaku 5 menit.",
        exampleValues: {
          "1": "451029",
        },
      },
    },
  },

  // 4. Welcome (Sapaan Pelanggan Baru)
  {
    id: "preset_welcome",
    title: "Welcome",
    description: "Menyambut dan menyapa pelanggan baru yang baru bergabung",
    category: "WELCOME",
    mappedTemplateCategory: "MARKETING",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>Selamat Datang di {{company}}! 🎉</b>\n\nHalo <b>{{name}}</b>, terima kasih telah bergabung bersama kami. Kami siap membantu Anda mendapatkan pengalaman terbaik.",
        inlineButtons: [
          [
            { text: "🚀 Mulai Sekarang", url: "https://wahide.com/start" },
            { text: "💬 Hubungi CS", url: "https://t.me/WahideSupport" },
          ],
        ],
      },
      whatsapp: {
        text: "{Halo|Hai|Selamat datang} *{{name}}*! 👋\n\nTerima kasih telah bergabung di *{{company}}*. Silakan jelajahi katalog produk kami atau hubungi kami jika ada pertanyaan.",
        spintaxEnabled: true,
        buttons: [
          { type: "URL", text: "Kunjungi Website", value: "https://wahide.com" },
        ],
      },
      waba: {
        category: "MARKETING",
        headerType: "TEXT",
        headerText: "Selamat Datang!",
        bodyText: "Halo {{1}}, selamat datang di {{2}}! Kami sangat senang dapat melayani Anda. Jelajahi penawaran terbaik kami sekarang.",
        footerText: "Wahide Official Service",
        buttons: [
          { type: "URL", text: "Buka Katalog", value: "https://wahide.com/katalog" },
        ],
        exampleValues: {
          "1": "Budi Santoso",
          "2": "Wahide Store",
        },
      },
    },
  },

  // 5. Welcome + Promo
  {
    id: "preset_welcome_promo",
    title: "Welcome + Promo",
    description: "Sapaan hangat disertai penawaran voucher belanja perdana",
    category: "WELCOME",
    mappedTemplateCategory: "MARKETING",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>Selamat Datang! Ada Hadiah Buat Kamu 🎁</b>\n\nHalo <b>{{name}}</b>, klaim voucher diskon <b>20%</b> untuk pembelian pertama Anda.\n\nGunakan kode: <code>WELCOME20</code>",
        inlineButtons: [
          [
            { text: "⚡ Klaim Voucher", url: "https://wahide.com/voucher" },
          ],
        ],
      },
      whatsapp: {
        text: "{Halo|Hai} *{{name}}*! 🎁\n\nSebagai sambutan hangat, nikmati *diskon 20%* untuk order pertama Anda dengan kode promo: *WELCOME20*.\n\nPromo berlaku hingga akhir pekan!",
        spintaxEnabled: true,
        buttons: [
          { type: "URL", text: "Belanja Sekarang", value: "https://wahide.com/shop" },
        ],
      },
      waba: {
        category: "MARKETING",
        headerType: "TEXT",
        headerText: "Voucher Sambutan Spesial",
        bodyText: "Halo {{1}}, nikmati diskon khusus {{2}}% untuk pembelian pertama Anda dengan kode voucher {{3}}.",
        footerText: "Syarat & ketentuan berlaku",
        buttons: [
          { type: "URL", text: "Klaim Diskon", value: "https://wahide.com/claim" },
        ],
        exampleValues: {
          "1": "Andi Pratama",
          "2": "20",
          "3": "WELCOME20",
        },
      },
    },
  },

  // 6. Order Confirmed
  {
    id: "preset_order_confirmed",
    title: "Order Confirmed",
    description: "Konfirmasi pesanan dan pembayaran berhasil diverifikasi",
    category: "ORDER",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>Pesanan Dikonfirmasi! ✅</b>\n\nHalo <b>{{name}}</b>, pembayaran untuk pesanan <code>#{{order_id}}</code> sebesar <b>Rp {{total}}</b> telah kami terima.\n\nPesanan Anda sedang dipersiapkan oleh tim kami.",
        inlineButtons: [
          [
            { text: "📦 Lacak Pesanan", url: "https://t.me/WahideBot?start={{order_id}}" },
          ],
        ],
      },
      whatsapp: {
        text: "Halo *{{name}}*, pesanan *#{{order_id}}* sebesar *Rp {{total}}* telah berhasil dikonfirmasi! ✅\n\nKami segera mengemas barang Anda dan memberikan update resi secepatnya.",
        buttons: [
          { type: "URL", text: "Detail Invoice", value: "https://wahide.com/orders/{{order_id}}" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Konfirmasi Pembayaran",
        bodyText: "Halo {{1}}, pesanan nomor {{2}} sebesar Rp {{3}} telah berhasil diverifikasi dan sedang diproses.",
        footerText: "Terima kasih atas pesanan Anda",
        buttons: [
          { type: "URL", text: "Lihat Pesanan", value: "https://wahide.com/orders/{{2}}" },
        ],
        exampleValues: {
          "1": "Rina Wijaya",
          "2": "WH-8819",
          "3": "150.000",
        },
      },
    },
  },

  // 7. Order Shipped
  {
    id: "preset_order_shipped",
    title: "Order Shipped",
    description: "Pemberitahuan paket telah dikirim beserta nomor resi ekspedisi",
    category: "ORDER",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>Paket Sedang Dalam Perjalanan! 🚚</b>\n\nPesanan <code>#{{order_id}}</code> telah diserahkan ke kurir <b>{{kurir}}</b>.\n\nNomor Resi: <code>{{resi}}</code>\nEstimasi tiba: {{estimasi}}",
        inlineButtons: [
          [
            { text: "📍 Cek Resi Live", url: "https://cekresi.com/?no={{resi}}" },
          ],
        ],
      },
      whatsapp: {
        text: "Paket pesanan *#{{order_id}}* telah dikirim via *{{kurir}}*! 🚚\n\nNo Resi: *{{resi}}*\nEstimasi tiba: {{estimasi}}.\n\nTerima kasih telah berbelanja bersama kami!",
        buttons: [
          { type: "URL", text: "Lacak Pengiriman", value: "https://cekresi.com/?no={{resi}}" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Paket Telah Dikirim",
        bodyText: "Halo {{1}}, paket Anda nomor {{2}} telah dikirim menggunakan kurir {{3}} dengan nomor resi {{4}}.",
        footerText: "Layanan Pengiriman Wahide Official",
        buttons: [
          { type: "URL", text: "Lacak Paket", value: "https://cekresi.com/?no={{4}}" },
        ],
        exampleValues: {
          "1": "Doni Kurnia",
          "2": "WH-8819",
          "3": "JNE Express",
          "4": "JN123456789ID",
        },
      },
    },
  },

  // 8. Payment Reminder
  {
    id: "preset_payment_reminder",
    title: "Payment Reminder",
    description: "Pengingat tagihan pembayaran yang akan segera jatuh tempo",
    category: "REMINDER",
    mappedTemplateCategory: "REMINDER",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>⏰ Pengingat Tagihan Pembayaran</b>\n\nHalo <b>{{name}}</b>, tagihan <code>#{{invoice_id}}</code> sebesar <b>Rp {{amount}}</b> akan jatuh tempo pada <b>{{due_date}}</b>.\n\nSilakan selesaikan pembayaran untuk menghindari penangguhan layanan.",
        inlineButtons: [
          [
            { text: "💳 Bayar Sekarang", url: "https://wahide.com/pay/{{invoice_id}}" },
          ],
        ],
      },
      whatsapp: {
        text: "{Halo|Hai} *{{name}}*, ini pengingat pembayaran tagihan *#{{invoice_id}}* sebesar *Rp {{amount}}* yang jatuh tempo pada *{{due_date}}*.\n\nSegera selesaikan sebelum tenggat waktu tiba:",
        spintaxEnabled: true,
        buttons: [
          { type: "URL", text: "Bayar Tagihan", value: "https://wahide.com/pay/{{invoice_id}}" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Pengingat Jatuh Tempo",
        bodyText: "Halo {{1}}, tagihan {{2}} sebesar Rp {{3}} akan jatuh tempo pada {{4}}. Segera lakukan pembayaran sebelum batas waktu berakhir.",
        footerText: "Sistem Penagihan Otomatis Wahide",
        buttons: [
          { type: "URL", text: "Bayar Tagihan", value: "https://wahide.com/pay/{{2}}" },
        ],
        exampleValues: {
          "1": "Budi Santoso",
          "2": "INV-771",
          "3": "250.000",
          "4": "20 September 2026",
        },
      },
    },
  },

  // 9. Appointment Reminder
  {
    id: "preset_appointment_reminder",
    title: "Appointment Reminder",
    description: "Pengingat jadwal reservasi atau sesi janji temu",
    category: "REMINDER",
    mappedTemplateCategory: "RESERVATION",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>📅 Pengingat Janji Temu</b>\n\nHalo <b>{{name}}</b>, jadwal kunjungan Anda dengan <b>{{doctor_or_agent}}</b> dijadwalkan pada:\n\n🗓 Hari: <b>{{date}}</b>\n⏰ Jam: <b>{{time}}</b>\n📍 Lokasi: {{location}}",
        inlineButtons: [
          [
            { text: "✅ Konfirmasi Kehadiran", callback_data: "CONFIRM_APPT" },
            { text: "🔄 Reschedule", callback_data: "RESCHEDULE_APPT" },
          ],
        ],
      },
      whatsapp: {
        text: "Halo *{{name}}*, mengingatkan jadwal janji temu Anda pada *{{date}}* pukul *{{time}}* di *{{location}}*.\n\nMohon hadir 15 menit sebelum jadwal dimulai.",
        buttons: [
          { type: "QUICK_REPLY", text: "Saya Hadir" },
          { type: "QUICK_REPLY", text: "Minta Jadwal Ulang" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Jadwal Janji Temu",
        bodyText: "Halo {{1}}, kami mengingatkan jadwal janji temu Anda pada tanggal {{2}} pukul {{3}} di {{4}}.",
        footerText: "Konfirmasikan kehadiran Anda",
        buttons: [
          { type: "QUICK_REPLY", text: "Konfirmasi Hadir" },
        ],
        exampleValues: {
          "1": "Maya Sari",
          "2": "21 September 2026",
          "3": "10:00 WIB",
          "4": "Klinik Wahide Sentra",
        },
      },
    },
  },

  // 10. Flash Sale (Promo)
  {
    id: "preset_flash_sale",
    title: "Flash Sale 50%",
    description: "Promosi kilat dengan diskon eksklusif dan batas waktu terbatas",
    category: "PROMO",
    mappedTemplateCategory: "MARKETING",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>⚡ FLASH SALE HARI INI 50% OFF!</b>\n\nPenawaran terbatas khusus untuk Anda <b>{{name}}</b>! Dapatkan diskon hingga <b>50%</b> untuk seluruh paket Wahide.\n\nGunakan kode: <code>KILAT50</code> (Hanya berlaku 24 jam!)",
        inlineButtons: [
          [
            { text: "🔥 Belanja Flash Sale", url: "https://wahide.com/flashsale" },
          ],
        ],
      },
      whatsapp: {
        text: "⚡ *FLASH SALE TERBATAS!* ⚡\n\nHalo *{{name}}*, dapatkan diskon spesial hingga *50%* hanya berlaku untuk 50 transaksi pertama hari ini!\n\nKlaim diskon sebelum kehabisan:",
        buttons: [
          { type: "URL", text: "Klaim Diskon 50%", value: "https://wahide.com/flashsale" },
        ],
      },
      waba: {
        category: "MARKETING",
        headerType: "TEXT",
        headerText: "Flash Sale Spesial",
        bodyText: "Halo {{1}}, nikmati penawaran terbatas diskon {{2}}% untuk pembelian hari ini dengan kode promo {{3}}.",
        footerText: "Berlaku selama persediaan masih ada",
        buttons: [
          { type: "URL", text: "Lihat Promo", value: "https://wahide.com/flashsale" },
        ],
        exampleValues: {
          "1": "Fahri",
          "2": "50",
          "3": "KILAT50",
        },
      },
    },
  },

  // 11. Customer Feedback
  {
    id: "preset_feedback",
    title: "Customer Feedback",
    description: "Survei kepuasan pelanggan setelah transaksi atau konsultasi",
    category: "FEEDBACK",
    mappedTemplateCategory: "QUICK_REPLY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>⭐ Bagaimana Pengalaman Anda?</b>\n\nHalo <b>{{name}}</b>, pesanan <code>#{{order_id}}</code> Anda telah selesai. Mohon luangkan waktu 1 menit untuk memberikan penilaian layanan kami.",
        inlineButtons: [
          [
            { text: "⭐⭐⭐⭐⭐ Sangat Puas", callback_data: "RATING_5" },
            { text: "⭐⭐⭐ Cukup Puas", callback_data: "RATING_3" },
          ],
        ],
      },
      whatsapp: {
        text: "Halo *{{name}}*, terima kasih telah berbelanja bersama kami! 🙏\n\nBagaimana pengalaman Anda saat bertransaksi kemarin? Masukan Anda sangat berharga bagi peningkatan layanan kami:",
        buttons: [
          { type: "URL", text: "Isi Ulasan Singkat", value: "https://wahide.com/survey/{{order_id}}" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Survei Kepuasan",
        bodyText: "Halo {{1}}, terima kasih telah berbelanja di {{2}}. Silakan beri ulasan singkat untuk membantu kami meningkatkan layanan.",
        footerText: "Survei Kepuasan Pelanggan Wahide",
        buttons: [
          { type: "URL", text: "Beri Ulasan", value: "https://wahide.com/survey" },
        ],
        exampleValues: {
          "1": "Linda",
          "2": "Wahide Store",
        },
      },
    },
  },

  // 12. Security Alert (Notification)
  {
    id: "preset_system_alert",
    title: "Security Alert",
    description: "Pemberitahuan aktivitas login baru atau status keamanan sistem",
    category: "NOTIFICATION",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "⚠️ <b>PERINGATAN KEAMANAN AKUN</b>\n\nTerdeteksi login baru pada akun Anda dari perangkat <b>{{device}}</b> (IP: <code>{{ip_address}}</code>) pada {{time}}.\n\nJika bukan Anda yang melakukan ini, segera amankan akun Anda!",
        inlineButtons: [
          [
            { text: "🛡 Amankan Akun Saya", url: "https://wahide.com/security" },
          ],
        ],
      },
      whatsapp: {
        text: "⚠️ *Peringatan Keamanan*: Login baru terdeteksi dari *{{device}}* (IP: {{ip_address}}) pada *{{time}}*.\n\nJika ini bukan Anda, segera ubah kata sandi akun Anda:",
        buttons: [
          { type: "URL", text: "Amankan Akun", value: "https://wahide.com/security" },
        ],
      },
      waba: {
        category: "UTILITY",
        headerType: "TEXT",
        headerText: "Peringatan Keamanan",
        bodyText: "Peringatan: Terdeteksi upaya login baru ke akun Anda dari {{1}} pada {{2}}. Jika ini bukan Anda, segera hubungi dukungan teknis.",
        footerText: "Pusat Keamanan Wahide",
        buttons: [
          { type: "URL", text: "Pusat Bantuan", value: "https://wahide.com/support" },
        ],
        exampleValues: {
          "1": "Jakarta, ID",
          "2": "19 Sep 2026 10:30",
        },
      },
    },
  },

  // 13. Password Reset (Support)
  {
    id: "preset_password_reset",
    title: "Password Reset",
    description: "Tautan pengaturan ulang kata sandi dengan batas waktu kadaluarsa",
    category: "SUPPORT",
    mappedTemplateCategory: "UTILITY",
    supportedChannels: ["TELEGRAM_BOT", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL"],
    content: {
      telegram: {
        parseMode: "HTML",
        text: "<b>🔐 Reset Kata Sandi Akun</b>\n\nHalo <b>{{name}}</b>, kami menerima permintaan untuk mengatur ulang kata sandi akun Anda.\n\nKlik tombol di bawah ini untuk melanjutkan (Tautan aman berlaku 15 menit):",
        inlineButtons: [
          [
            { text: "🔑 Reset Password Saya", url: "https://wahide.com/auth/reset?token={{token}}" },
          ],
        ],
      },
      whatsapp: {
        text: "Halo *{{name}}*, kami menerima permintaan reset kata sandi akun Anda.\n\nKlik tautan ini untuk mengatur ulang: {{reset_url}}\n\nJika Anda tidak merasa meminta reset kata sandi, abaikan pesan ini.",
        buttons: [
          { type: "URL", text: "Reset Password", value: "https://wahide.com/auth/reset" },
        ],
      },
      waba: {
        category: "AUTHENTICATION",
        headerType: "NONE",
        bodyText: "Halo {{1}}, gunakan tautan berikut untuk mengatur ulang kata sandi akun Anda: {{2}}. Berlaku selama 15 menit.",
        footerText: "Pesan sistem keamanan otomatis",
        buttons: [
          { type: "URL", text: "Reset Password", value: "https://wahide.com/auth/reset" },
        ],
        exampleValues: {
          "1": "Hendra",
          "2": "https://wahide.com/reset/token123",
        },
      },
    },
  },
];

/**
 * Filter presets by category pill and target channel
 */
export function getFilteredPresets(
  category: PresetCategoryFilter,
  channel: TemplateChannelType | "ALL",
): TemplatePreset[] {
  return TEMPLATE_PRESETS.filter((preset) => {
    // Channel filter
    if (channel !== "ALL") {
      if (!preset.supportedChannels.includes(channel)) return false;
    }
    // Category filter
    if (category === "ALL") return true;
    return preset.category === category;
  });
}

/**
 * Convert a preset to a clean Template object suitable for TemplateEditorModal
 */
export function convertPresetToTemplate(
  preset: TemplatePreset,
  targetChannel: TemplateChannelType,
): Template {
  if (preset.isBlank) {
    return {
      id: "",
      name: "",
      category: "UTILITY",
      channelType: targetChannel,
      content: "",
      mediaType: "NONE",
      variables: [],
      isFavorite: false,
      usageCount: 0,
      telegramDetail: targetChannel === "TELEGRAM_BOT" || targetChannel === "ALL" ? {
        parseMode: "HTML",
        inlineKeyboard: [],
        disableWebPagePreview: false,
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const isTelegram = targetChannel === "TELEGRAM_BOT";
  const content = isTelegram ? preset.content.telegram.text : preset.content.whatsapp.text;
  const buttons = isTelegram ? undefined : preset.content.whatsapp.buttons;

  // Extract variables from content
  const matches = content.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  const variables = Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, ""))));

  return {
    id: "",
    name: preset.title === "+ Blank" ? "" : preset.title,
    category: preset.mappedTemplateCategory,
    channelType: targetChannel,
    content,
    mediaType: "NONE",
    buttons,
    variables,
    isFavorite: false,
    usageCount: 0,
    telegramDetail: isTelegram || targetChannel === "ALL" ? {
      parseMode: preset.content.telegram.parseMode,
      inlineKeyboard: preset.content.telegram.inlineButtons || [],
      disableWebPagePreview: false,
    } : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
