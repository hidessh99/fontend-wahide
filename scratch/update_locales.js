const fs = require("fs");
const path = require("path");

const idTelegramPath = path.join(__dirname, "../src/locales/id/telegram.json");
const enTelegramPath = path.join(__dirname, "../src/locales/en/telegram.json");
const idWaPath = path.join(__dirname, "../src/locales/id/whatsapp.json");
const enWaPath = path.join(__dirname, "../src/locales/en/whatsapp.json");

const idTele = JSON.parse(fs.readFileSync(idTelegramPath, "utf-8"));
const enTele = JSON.parse(fs.readFileSync(enTelegramPath, "utf-8"));
const idWa = JSON.parse(fs.readFileSync(idWaPath, "utf-8"));
const enWa = JSON.parse(fs.readFileSync(enWaPath, "utf-8"));

// 1. Update Telegram Bots
Object.assign(idTele.bots, {
  webhookStatus: "Status Webhook",
  webhookActive: "Aktif & Terhubung",
  webhookInactive: "Terputus",
  messagesSentToday: "Pesan Terkirim Hari Ini",
  messagesUnit: "pesan",
  rateLimitProtection: "Proteksi Rate Limit",
  globalLimit: "30 req/s Global",
  syncWebhook: "Sync Webhook",
  openBotFather: "Buka BotFather",
  nameRequired: "Nama bot harus diisi",
  webhookNoteTitle: "Otomatisasi Webhook Instan",
  webhookNoteDesc: "Backend Wahide akan langsung mendaftarkan endpoint webhook aman dengan sertifikat SSL dan mengaktifkan token-bucket rate limiter.",
  emptyTitle: "Belum Ada Bot Telegram Terhubung",
  emptyDesc: "Hubungkan bot Telegram pertama Anda menggunakan BotFather token untuk mulai mengirimkan pesan dan notifikasi instan."
});

Object.assign(enTele.bots, {
  webhookStatus: "Webhook Status",
  webhookActive: "Active & Connected",
  webhookInactive: "Disconnected",
  messagesSentToday: "Messages Sent Today",
  messagesUnit: "messages",
  rateLimitProtection: "Rate Limit Protection",
  globalLimit: "30 req/s Global",
  syncWebhook: "Sync Webhook",
  openBotFather: "Open BotFather",
  nameRequired: "Bot name is required",
  webhookNoteTitle: "Instant Webhook Automation",
  webhookNoteDesc: "Wahide backend automatically registers a secure SSL webhook endpoint and enables token-bucket rate limiting.",
  emptyTitle: "No Telegram Bots Connected Yet",
  emptyDesc: "Connect your first Telegram bot using a BotFather token to start sending instant messages and notifications."
});

// 2. Update Telegram Logs
Object.assign(idTele.logs, {
  exportCsv: "Ekspor CSV",
  directionOut: "Keluar",
  directionIn: "Masuk",
  directionOutBot: "Keluar (Bot)",
  directionInUser: "Masuk (User)",
  statusDeliveredBadge: "TERKIRIM",
  statusFailedBadge: "GAGAL",
  statusQueued: "Antrean",
  statusQueuedBadge: "ANTEAN",
  kpiTotalTitle: "Total Log Telegram",
  kpiDeliveredTitle: "Pesan Terkirim",
  kpiDeliveredSubtitle: "Terkirim ke Chat / Grup",
  kpiSuccessRateTitle: "Tingkat Keberhasilan",
  kpiFailedTitle: "Pesan Gagal",
  colDirection: "Arah",
  colChatIdHeader: "Chat ID",
  colType: "Tipe",
  colContent: "Konten Pesan",
  colTimeHeader: "Waktu",
  colStatusHeader: "Status",
  mediaLabel: "Media",
  mediaAttachmentFallback: "(Lampiran berkas media)",
  prevText: "Sebelumnya",
  nextText: "Selanjutnya",
  entityName: "log pesan",
  detail: {
    title: "Detail Pesan Telegram",
    subtitle: "Audit transmisi bot Telegram dan payload pesan API real-time.",
    errorBannerTitle: "Pengiriman Telegram Gagal",
    recipientChatId: "Chat ID Penerima",
    directionAndType: "Arah & Tipe",
    botId: "Bot ID",
    messageId: "Telegram Message ID",
    idempotencyKey: "Idempotency Key",
    messageContent: "Isi Pesan",
    copyMessage: "Salin Pesan",
    noContent: "(Tidak ada konten teks / Pesan Berkas Media)",
    openMedia: "Buka",
    created: "Dibuat",
    sent: "Dikirim",
    logUuid: "Log UUID",
    toastCopyText: "Teks pesan Telegram berhasil disalin!",
    toastCopyChatId: "Chat ID Telegram berhasil disalin!",
    toastCopyLogId: "ID Log Telegram berhasil disalin!"
  }
});

Object.assign(enTele.logs, {
  exportCsv: "Export CSV",
  directionOut: "Outgoing",
  directionIn: "Incoming",
  directionOutBot: "Outbound (Bot)",
  directionInUser: "Inbound (User)",
  statusDeliveredBadge: "DELIVERED",
  statusFailedBadge: "FAILED",
  statusQueued: "Queued",
  statusQueuedBadge: "QUEUED",
  kpiTotalTitle: "Total Telegram Logs",
  kpiDeliveredTitle: "Delivered Messages",
  kpiDeliveredSubtitle: "Sent to Chat / Group",
  kpiSuccessRateTitle: "Success Rate",
  kpiFailedTitle: "Failed Messages",
  colDirection: "Direction",
  colChatIdHeader: "Chat ID",
  colType: "Type",
  colContent: "Message Content",
  colTimeHeader: "Time",
  colStatusHeader: "Status",
  mediaLabel: "Media",
  mediaAttachmentFallback: "(Media attachment)",
  prevText: "Previous",
  nextText: "Next",
  entityName: "message logs",
  detail: {
    title: "Telegram Message Details",
    subtitle: "Audit Telegram bot transmission and real-time API message payload.",
    errorBannerTitle: "Telegram Delivery Failed",
    recipientChatId: "Recipient Chat ID",
    directionAndType: "Direction & Type",
    botId: "Bot ID",
    messageId: "Telegram Message ID",
    idempotencyKey: "Idempotency Key",
    messageContent: "Message Content",
    copyMessage: "Copy Message",
    noContent: "(No text content / Media File Message)",
    openMedia: "Open",
    created: "Created",
    sent: "Sent",
    logUuid: "Log UUID",
    toastCopyText: "Telegram message text copied successfully!",
    toastCopyChatId: "Telegram Chat ID copied successfully!",
    toastCopyLogId: "Telegram Log ID copied successfully!"
  }
});

// 3. Update Telegram Stats
Object.assign(idTele.stats, {
  totalSends: "Total sends",
  successLabel: "Success (Terkirim)",
  failedLabel: "Failed (Gagal)",
  successRateSuffix: "success rate",
  failureRateSuffix: "failure rate",
  dailyActivity: "Daily activity",
  dailyActivitySubtitle: "Success vs failed per day — {period}",
  legendSuccess: "Success",
  legendFailed: "Failed",
  noActivity: "Tidak ada aktivitas pesan dalam periode ini.",
  topSendTypes: "Top send types",
  topSendTypesSubtitle: "Direct alerts vs broadcast blasts dalam periode ini.",
  directAlerts: "Direct alerts (Notifikasi 1-on-1)",
  broadcastBlasts: "Broadcast blasts (Siaran Massal)",
  noSends: "Belum ada pengiriman dalam periode ini.",
  byBot: "By bot",
  byBotSubtitle: "Bot teratas berdasarkan volume pengiriman.",
  connectedBots: "Bot Terhubung",
  connectedBotsDesc: "Semua bot terdaftar di akun Anda",
  activeSuffix: "aktif",
  webhookHealth: "Kesehatan Webhook",
  webhookHealthDesc: "Tingkat keberhasilan callback",
  avgLatency: "Rata-rata Latensi",
  avgLatencyDesc: "Kecepatan dispatch ke Telegram Server",
  dailyQuotaUsed: "Kuota Harian Terpakai"
});

Object.assign(enTele.stats, {
  totalSends: "Total sends",
  successLabel: "Success (Delivered)",
  failedLabel: "Failed",
  successRateSuffix: "success rate",
  failureRateSuffix: "failure rate",
  dailyActivity: "Daily activity",
  dailyActivitySubtitle: "Success vs failed per day — {period}",
  legendSuccess: "Success",
  legendFailed: "Failed",
  noActivity: "No message activity in this period.",
  topSendTypes: "Top send types",
  topSendTypesSubtitle: "Direct alerts vs broadcast blasts in this period.",
  directAlerts: "Direct alerts (1-on-1 Notifications)",
  broadcastBlasts: "Broadcast blasts (Mass Broadcast)",
  noSends: "No sends in this period.",
  byBot: "By bot",
  byBotSubtitle: "Top bots by outbound volume.",
  connectedBots: "Connected Bots",
  connectedBotsDesc: "All bots registered in your account",
  activeSuffix: "active",
  webhookHealth: "Webhook Health",
  webhookHealthDesc: "Callback success rate",
  avgLatency: "Average Latency",
  avgLatencyDesc: "Dispatch speed to Telegram Server",
  dailyQuotaUsed: "Daily Quota Used"
});

// 4. Update Telegram Templates
Object.assign(idTele.templates, {
  previewBubble: "Pratinjau Balon Chat",
  inlineButtonsCount: "{count} tombol inline",
  copied: "Tersalin",
  copySyntax: "Salin Sintaks",
  toastCopied: "Sintaks template disalin ke clipboard",
  toastCopyFailed: "Gagal menyalin template"
});

Object.assign(enTele.templates, {
  previewBubble: "Chat Bubble Preview",
  inlineButtonsCount: "{count} inline buttons",
  copied: "Copied",
  copySyntax: "Copy Syntax",
  toastCopied: "Template syntax copied to clipboard",
  toastCopyFailed: "Failed to copy template"
});

// 5. Update WhatsApp General & WABA
Object.assign(idWa, {
  templatesTitle: "Template Pesan WhatsApp Web",
  templatesSubtitle: "Kelola koleksi template pesan WhatsApp dengan variabel dinamis, spintax anti-ban, dan format tombol aksi."
});

Object.assign(enWa, {
  templatesTitle: "WhatsApp Web Message Templates",
  templatesSubtitle: "Manage WhatsApp message template collection with dynamic variables, anti-ban spintax, and action button formats."
});

Object.assign(idWa.waba, {
  connectWithMeta: "Hubungkan dengan Meta",
  connectSuccess: "Nomor WhatsApp Official berhasil terhubung via Meta!",
  exchangeError: "Gagal menukar otorisasi dengan server Meta.",
  popupError: "Terjadi kesalahan saat membuka pop-up Meta.",
  calloutText1: "Saat Anda klik Hubungkan dengan Meta, Anda masuk dengan Meta untuk menautkan nomor. Chat yang sudah ada dan aplikasi WhatsApp Business di ponsel tetap berjalan — pastikan aplikasinya versi v2.24.17 atau lebih baru.",
  calloutText2: "Jika Meta mengeluarkan Anda nanti, gunakan Hubungkan ulang pada baris itu. Token API dan paket berbayar tetap sama — jangan putuskan lalu tambah lagi.",
  colDisplayName: "Nama Tampilan",
  colPhone: "Telepon",
  colPlan: "Paket",
  colCredit: "Kredit",
  colQuality: "Quality Rating",
  colPhoneId: "ID Nomor Telepon",
  colWabaId: "ID WABA",
  colApiToken: "Token API",
  colCreated: "Dibuat",
  colAction: "Aksi",
  tokenActive: "Aktif",
  noData: "Belum ada data.",
  loadingAccounts: "Memuat data akun WhatsApp Official...",
  modalTitle: "Hubungkan WhatsApp Official (Meta WABA)",
  modalSubtitle: "Integrasikan nomor centang hijau resmi melalui Meta WhatsApp Cloud API",
  channelLabel: "Nama Label Saluran",
  channelLabelPlaceholder: "Contoh: CS Centang Hijau Utama",
  channelLabelHint: "Nama internal saluran untuk membedakan nomor di dashboard.",
  systemTokenLabel: "Permanent System User Token",
  systemTokenHint: "Token permanen dengan permission whatsapp_business_messaging.",
  autoVerifyTitle: "Verifikasi Otomatis Meta Graph API v20.0",
  autoVerifyDesc: "Sistem akan memvalidasi Token & Phone ID langsung ke server Meta sebelum menyimpan ke database.",
  btnVerifying: "Verifikasi Meta...",
  btnVerifyConnect: "Verifikasi & Hubungkan",
  errNameRequired: "Nama saluran wajib diisi",
  errWabaIdRequired: "WABA Account ID wajib diisi",
  errPhoneIdRequired: "Phone Number ID wajib diisi",
  errTokenRequired: "System User Access Token wajib diisi",
  errConnectFailed: "Gagal menghubungkan Meta WABA. Pastikan Phone ID & Token valid.",
  reconnect: "Hubungkan Ulang",
  disconnect: "Putuskan"
});

Object.assign(enWa.waba, {
  connectWithMeta: "Connect with Meta",
  connectSuccess: "Official WhatsApp number connected via Meta successfully!",
  exchangeError: "Failed to exchange authorization with Meta server.",
  popupError: "An error occurred while opening Meta popup.",
  calloutText1: "When you click Connect with Meta, you log in with Meta to link your number. Existing chats and the WhatsApp Business app on your phone remain active — ensure the app is v2.24.17 or newer.",
  calloutText2: "If Meta logs you out later, use Reconnect on that row. API tokens and paid plans remain intact — do not disconnect and re-add.",
  colDisplayName: "Display Name",
  colPhone: "Phone",
  colPlan: "Plan",
  colCredit: "Credit",
  colQuality: "Quality Rating",
  colPhoneId: "Phone Number ID",
  colWabaId: "WABA ID",
  colApiToken: "API Token",
  colCreated: "Created",
  colAction: "Action",
  tokenActive: "Active",
  noData: "No data available.",
  loadingAccounts: "Loading official WhatsApp account data...",
  modalTitle: "Connect WhatsApp Official (Meta WABA)",
  modalSubtitle: "Integrate official green badge number via Meta WhatsApp Cloud API",
  channelLabel: "Channel Label Name",
  channelLabelPlaceholder: "e.g., Primary CS Green Badge",
  channelLabelHint: "Internal channel name to distinguish numbers in dashboard.",
  systemTokenLabel: "Permanent System User Token",
  systemTokenHint: "Permanent token with whatsapp_business_messaging permission.",
  autoVerifyTitle: "Automatic Verification Meta Graph API v20.0",
  autoVerifyDesc: "System validates Token & Phone ID directly against Meta servers before saving to database.",
  btnVerifying: "Verifying Meta...",
  btnVerifyConnect: "Verify & Connect",
  errNameRequired: "Channel name is required",
  errWabaIdRequired: "WABA Account ID is required",
  errPhoneIdRequired: "Phone Number ID is required",
  errTokenRequired: "System User Access Token is required",
  errConnectFailed: "Failed to connect Meta WABA. Ensure Phone ID & Token are valid.",
  reconnect: "Reconnect",
  disconnect: "Disconnect"
});

fs.writeFileSync(idTelegramPath, JSON.stringify(idTele, null, 2) + "\n", "utf-8");
fs.writeFileSync(enTelegramPath, JSON.stringify(enTele, null, 2) + "\n", "utf-8");
fs.writeFileSync(idWaPath, JSON.stringify(idWa, null, 2) + "\n", "utf-8");
fs.writeFileSync(enWaPath, JSON.stringify(enWa, null, 2) + "\n", "utf-8");

console.log("Updated locale files successfully!");
