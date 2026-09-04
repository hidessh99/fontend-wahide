"use client";

import { Invoice } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { Printer, CheckCircle2, Receipt } from "lucide-react";

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export function InvoiceReceiptModal({ isOpen, onClose, invoice }: InvoiceReceiptModalProps) {
  const { t } = useI18n();

  if (!invoice) return null;

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-xl dark:bg-[#161715] print:max-h-full print:border-none print:shadow-none">
        {/* Sticky Modal Header (Hidden on Print) */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-2.5 border-b p-4 text-left sm:p-5 print:hidden">
          <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex size-8 items-center justify-center rounded-full">
            <Receipt className="size-4" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-sm font-black sm:text-base">
              {t("billing.officialInvoiceTitle")}
            </DialogTitle>
            <span className="text-foreground-muted block font-mono text-[11px]">
              {invoice.invoiceNumber}
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable Printable Receipt Content */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 print:overflow-visible print:p-0">
          {/* Top Brand Banner */}
          <div className="border-border/60 flex items-start justify-between border-b pb-4">
            <div>
              <span className="text-foreground text-base font-black tracking-tight sm:text-lg">
                Wahide Enterprise
              </span>
              <p className="text-foreground-secondary text-xs">
                Platform Gateway WhatsApp Skala Tinggi
              </p>
              <p className="text-foreground-muted font-mono text-[11px]">
                PT Wahide Global Mandiri
              </p>
            </div>
            <div className="text-right">
              <div className="bg-light-mint dark:bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold">
                <CheckCircle2 className="size-3.5" />
                <span>{t("billing.statusPaid")}</span>
              </div>
              <p className="text-foreground-muted mt-1 font-mono text-[11px]">Tgl: {paidDate}</p>
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
        <DialogFooter className="border-border bg-surface/50 m-0 flex shrink-0 flex-row items-center justify-between gap-3 rounded-none border-t p-4 sm:p-5 print:hidden">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
