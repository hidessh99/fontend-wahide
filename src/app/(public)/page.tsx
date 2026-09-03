import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";

export const metadata: Metadata = {
  title: "Platform WhatsApp Multi-Device SaaS & Gateway Skala Industri",
  description:
    "Solusi Enterprise WhatsApp Multi-Device Gateway untuk bisnis dengan teknologi Session Hibernation hemat RAM 95%, 5 Lapis Anti-Ban, Spintax Engine acak kata, dan integrasi Go Microservices.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wahide - Enterprise WhatsApp Multi-Tenant Gateway",
    description:
      "Scale hingga 10.000+ perangkat WhatsApp aktif dengan 5 Lapis Anti-Ban dan Session Hibernation berkinerja tinggi.",
    url: "/",
    siteName: "Wahide",
    locale: "id_ID",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apakah nomor WhatsApp saya aman dari pemblokiran (banned)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wahide dilengkapi sistem proteksi 5-Lapis Anti-Ban meliputi dynamic spintax, simulasi pengetikan manusia (ChatPresence), jeda acak jitter 3–15 detik, dan rotasi nomor load-balancing otomatis.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara menghubungkan nomor WhatsApp saya ke Wahide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prosesnya sangat mudah dan instan. Anda cukup membuka dashboard Wahide, klik Tambah Perangkat, lalu scan QR Code yang muncul menggunakan aplikasi WhatsApp di ponsel Anda (seperti menghubungkan WhatsApp Web).",
      },
    },
    {
      "@type": "Question",
      name: "Apakah Wahide mendukung pengiriman OTP dan notifikasi transaksi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, Wahide memiliki antrean prioritas tinggi (high-priority queue) khusus untuk transmisi kode OTP, faktur transaksi, dan notifikasi pesanan agar terkirim dalam hitungan detik.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah saya bisa mengintegrasikan Wahide ke sistem website/aplikasi saya?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tentu saja! Kami menyediakan REST API lengkap dengan contoh kode dalam cURL, Node.js, Go, PHP, dan Python, serta Webhook dua arah terenkripsi HMAC SHA256.",
      },
    },
    {
      "@type": "Question",
      name: "Apa perbedaan Wahide dengan WhatsApp Cloud API resmi Meta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WhatsApp Cloud API resmi mengenakan biaya per percakapan berbasis template kaku. Wahide memberikan fleksibilitas penuh untuk multi-device tanpa biaya per percakapan yang mahal, sangat cocok untuk UMKM dan bisnis berkembang.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeView />
    </>
  );
}
