"use client";

import { Invoice } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { X, Printer, CheckCircle2, Receipt } from "lucide-react";

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceReceiptModal({ isOpen, onClose, invoice }: InvoiceReceiptModalProps) {
  const { t } = useI18n();

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

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
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6 print:bg-white print:p-0"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715] print:max-h-full print:border-none print:shadow-none">
        {/* Sticky Modal Header (Hidden on Print) */}
        <div className="border-border flex shrink-0 items-center justify-between border-b p-4 sm:p-5 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
              <Receipt className="size-4" />
            </div>
            <div>
              <h2 className="text-foreground text-sm font-black sm:text-base">
                {t("billing.officialInvoiceTitle")}
              </h2>
              <span className="text-foreground-muted block font-mono text-[11px]">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Printable Official Invoice Body */}
        <div className="text-foreground flex-1 space-y-6 overflow-y-auto p-6 sm:p-8 print:p-0">
          {/* Company Header & Brand */}
          <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xl font-black tracking-tight">WAHIDE</span>
                <span className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 rounded-full border px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-foreground-secondary text-xs font-semibold">
                Infrastruktur WhatsApp Gateway B2B Multi-Tenant
              </p>
              <p className="text-foreground-muted text-[11px]">
                support@wahide.com • https://wahide.com
              </p>
            </div>

            {/* Paid Stamp / Badge */}
            <div className="flex flex-col items-start sm:items-end">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                <span>LUNAS / PAID</span>
              </div>
              <span className="text-foreground-muted mt-1 font-mono text-[10px]">
                Tgl: {paidDate}
              </span>
            </div>
          </div>

          {/* Invoice Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
            <div className="space-y-0.5">
              <span className="text-foreground-muted block text-[10px] font-bold tracking-wider uppercase">
                No. Faktur
              </span>
              <span className="text-foreground block font-mono font-bold">
                {invoice.invoiceNumber}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-foreground-muted block text-[10px] font-bold tracking-wider uppercase">
                Tanggal Terbit
              </span>
              <span className="text-foreground block font-semibold">{formattedDate}</span>
            </div>

            <div className="col-span-2 space-y-0.5 sm:col-span-1">
              <span className="text-foreground-muted block text-[10px] font-bold tracking-wider uppercase">
                Metode Pembayaran
              </span>
              <span className="text-foreground block font-semibold">
                {invoice.paymentMethod || "QRIS Instan"}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border-border overflow-hidden rounded-md border">
            <div className="bg-muted/60 text-foreground-muted border-border grid grid-cols-12 gap-2 border-b p-3 text-[11px] font-bold tracking-wider uppercase">
              <div className="col-span-8">Deskripsi Layanan</div>
              <div className="col-span-4 text-right">Jumlah</div>
            </div>

            <div className="space-y-2 p-3 text-xs">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="text-foreground col-span-8 font-semibold">
                  {invoice.description || "Layanan WhatsApp Gateway"}
                </div>
                <div className="text-foreground col-span-4 text-right font-mono font-bold">
                  Rp {safeAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-muted/30 border-border space-y-1.5 border-t p-3 text-xs">
              <div className="text-foreground-secondary flex justify-between text-[11px]">
                <span>Biaya Transaksi / Gateway</span>
                <span className="font-mono">Rp 0</span>
              </div>
              <div className="text-foreground border-border/50 flex justify-between border-t pt-1 text-sm font-black">
                <span>Total Pembayaran</span>
                <span className="text-dark-green dark:text-wise-green font-mono">
                  Rp {safeAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Official Footnote */}
          <div className="bg-muted/30 border-border/60 text-foreground-secondary space-y-1 rounded-md border p-3.5 text-[11px]">
            <p className="text-foreground font-bold">Catatan Resmi:</p>
            <p>
              Faktur ini merupakan bukti pembayaran elektronik yang sah dan diterbitkan secara
              otomatis oleh sistem Wahide Enterprise. Saldo deposit telah dikreditkan ke akun
              organisasi Anda secara real-time.
            </p>
          </div>
        </div>

        {/* Sticky Footer (Hidden on Print) */}
        <div className="border-border bg-surface/50 flex shrink-0 items-center justify-between gap-3 border-t p-4 sm:p-5 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-5 text-xs font-bold"
          >
            {t("billing.cancel")}
          </Button>

          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={handlePrint}
            className="cursor-pointer gap-1.5 rounded-full px-6 text-xs font-bold shadow-sm"
          >
            <Printer className="size-3.5" />
            <span>{t("billing.printReceipt")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
