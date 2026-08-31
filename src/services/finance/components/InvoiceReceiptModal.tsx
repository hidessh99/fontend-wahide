"use client";

import React, { useEffect } from "react";
import { Invoice } from "../types/finance.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
  Printer,
  CheckCircle2,
  Receipt,
} from "lucide-react";

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceReceiptModal({
  isOpen,
  onClose,
  invoice,
}: InvoiceReceiptModalProps) {
  const { t } = useI18n();

  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(invoice.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const safeAmount = Number(invoice.amount ?? 0);

  const paidDate = invoice.paidAt
    ? new Date(invoice.paidAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : formattedDate;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in print:p-0 print:bg-white"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95 print:border-none print:shadow-none print:max-h-full">
        {/* Sticky Modal Header (Hidden on Print) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
              <Receipt className="size-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-foreground">
                {t("billing.officialInvoiceTitle")}
              </h2>
              <span className="text-[11px] font-mono text-foreground-muted block">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Printable Official Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-foreground print:p-0">
          {/* Company Header & Brand */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-foreground">
                  WAHIDE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
                  Enterprise
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground-secondary">
                Infrastruktur WhatsApp Gateway B2B Multi-Tenant
              </p>
              <p className="text-[11px] text-foreground-muted">
                support@wahide.com • https://wahide.com
              </p>
            </div>

            {/* Paid Stamp / Badge */}
            <div className="flex flex-col items-start sm:items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black tracking-wider uppercase">
                <CheckCircle2 className="size-3.5" />
                <span>LUNAS / PAID</span>
              </div>
              <span className="text-[10px] text-foreground-muted font-mono mt-1">
                Tgl: {paidDate}
              </span>
            </div>
          </div>

          {/* Invoice Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                No. Faktur
              </span>
              <span className="font-mono font-bold text-foreground block">
                {invoice.invoiceNumber}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                Tanggal Terbit
              </span>
              <span className="font-semibold text-foreground block">
                {formattedDate}
              </span>
            </div>

            <div className="space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                Metode Pembayaran
              </span>
              <span className="font-semibold text-foreground block">
                {invoice.paymentMethod || "QRIS Instan"}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 bg-muted/60 p-3 text-[11px] font-bold uppercase tracking-wider text-foreground-muted border-b border-border">
              <div className="col-span-8">Deskripsi Layanan</div>
              <div className="col-span-4 text-right">Jumlah</div>
            </div>

            <div className="p-3 text-xs space-y-2">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-8 font-semibold text-foreground">
                  {invoice.description || "Layanan WhatsApp Gateway"}
                </div>
                <div className="col-span-4 text-right font-mono font-bold text-foreground">
                  Rp {safeAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-muted/30 p-3 border-t border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-foreground-secondary text-[11px]">
                <span>Biaya Transaksi / Gateway</span>
                <span className="font-mono">Rp 0</span>
              </div>
              <div className="flex justify-between font-black text-sm text-foreground pt-1 border-t border-border/50">
                <span>Total Pembayaran</span>
                <span className="font-mono text-dark-green dark:text-wise-green">
                  Rp {safeAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Official Footnote */}
          <div className="p-3.5 rounded-md bg-muted/30 border border-border/60 text-[11px] text-foreground-secondary space-y-1">
            <p className="font-bold text-foreground">Catatan Resmi:</p>
            <p>
              Faktur ini merupakan bukti pembayaran elektronik yang sah dan diterbitkan secara otomatis oleh sistem Wahide Enterprise. Saldo deposit telah dikreditkan ke akun organisasi Anda secara real-time.
            </p>
          </div>
        </div>

        {/* Sticky Footer (Hidden on Print) */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-3 shrink-0 bg-surface/50 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs font-bold px-5 border-border hover:border-foreground-muted cursor-pointer"
          >
            {t("billing.cancel")}
          </Button>

          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={handlePrint}
            className="rounded-full text-xs font-bold gap-1.5 px-6 shadow-sm cursor-pointer"
          >
            <Printer className="size-3.5" />
            <span>{t("billing.printReceipt")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
