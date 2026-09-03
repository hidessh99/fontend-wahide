"use client";

import React from "react";
import { Invoice, InvoiceStatus } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { DataTablePagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n/context";
import { FileText, CheckCircle2, Clock, AlertCircle, CreditCard } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onViewReceipt: (invoice: Invoice) => void;
  onPay?: (invoice: Invoice) => void;
}

export function InvoiceTable({
  invoices,
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  onViewReceipt,
  onPay,
}: InvoiceTableProps) {
  const { t } = useI18n();

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  const renderStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return (
          <Badge variant="success">
            <CheckCircle2 className="size-3" />
            <span>{t("billing.statusPaid")}</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="warning">
            <Clock className="size-3" />
            <span>{t("billing.statusPending")}</span>
          </Badge>
        );
      case "EXPIRED":
      default:
        return (
          <Badge variant="neutral">
            <AlertCircle className="size-3" />
            <span>{t("billing.statusExpired")}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="border-border bg-surface overflow-hidden rounded-md border shadow-xs dark:bg-[#161715]">
      {/* Invoices List */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title={t("billing.noInvoices")}
          description={t("billing.noInvoicesDesc")}
        />
      ) : (
        <div>
          {/* Mobile View: Card-based Invoice List (Visible on < 768px) */}
          <div className="divide-border/50 divide-y md:hidden">
            {invoices.map((inv) => {
              const safeAmount = Number(inv.amount ?? 0);
              const dateStr = inv.createdAt
                ? new Date(inv.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-";

              return (
                <div key={inv.id} className="bg-surface space-y-3 p-3.5 sm:p-4 dark:bg-[#161715]">
                  {/* Top: Invoice Number & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground bg-muted border-border rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                      {inv.invoiceNumber || "INV-WAHIDE"}
                    </span>
                    <div>{renderStatusBadge(inv.status)}</div>
                  </div>

                  {/* Middle: Description & Amount */}
                  <div className="space-y-1">
                    <p className="text-foreground-secondary line-clamp-1 text-xs font-semibold">
                      {inv.description || "Layanan WhatsApp Gateway"}
                    </p>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-foreground font-mono text-base font-black">
                        Rp {safeAmount.toLocaleString("id-ID")}
                      </span>
                      <span className="text-foreground-muted text-[11px]">{dateStr}</span>
                    </div>
                  </div>

                  {/* Bottom: Action CTA Button */}
                  {inv.status === "PENDING" ? (
                    <Button
                      variant="primaryPill"
                      size="sm"
                      onClick={() => {
                        if (inv.paymentUrl || inv.invoiceUrl) {
                          window.open(
                            inv.paymentUrl || inv.invoiceUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else if (onPay) {
                          onPay(inv);
                        }
                      }}
                      className="h-9 w-full cursor-pointer justify-center gap-1.5 rounded-full text-xs font-bold shadow-xs"
                    >
                      <CreditCard className="size-3.5" />
                      <span>{t("billing.payNow")}</span>
                    </Button>
                  ) : inv.status === "PAID" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReceipt(inv)}
                      className="border-border hover:border-foreground-muted h-9 w-full cursor-pointer justify-center gap-1.5 rounded-full text-xs font-bold"
                    >
                      <FileText className="text-foreground-secondary size-3.5" />
                      <span>{t("billing.viewInvoice")}</span>
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-4 text-xs font-extrabold tracking-wider uppercase select-none">
              <div className="col-span-3">{t("billing.tableHeaderInvoice")}</div>
              <div className="col-span-4">{t("billing.tableHeaderDesc")}</div>
              <div className="col-span-2">{t("billing.tableHeaderAmount")}</div>
              <div className="col-span-2 text-center">{t("billing.tableHeaderStatus")}</div>
              <div className="col-span-1 text-right">{t("billing.tableHeaderAction")}</div>
            </div>

            {/* Table Body */}
            <div className="divide-border/50 divide-y text-xs font-semibold">
              {invoices.map((inv) => {
                const safeAmount = Number(inv.amount ?? 0);
                const dateStr = inv.createdAt
                  ? new Date(inv.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";

                return (
                  <div
                    key={inv.id}
                    className="hover:bg-muted/40 grid min-h-14.5 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                  >
                    {/* Invoice Number & Date */}
                    <div className="col-span-3 space-y-0.5">
                      <span className="text-foreground block truncate font-mono text-sm font-bold tracking-tight">
                        {inv.invoiceNumber || "INV-WAHIDE"}
                      </span>
                      <span className="text-foreground-muted block text-xs">{dateStr}</span>
                    </div>

                    {/* Description */}
                    <div className="text-foreground-secondary col-span-4 truncate text-sm font-semibold">
                      {inv.description || "Layanan WhatsApp Gateway"}
                    </div>

                    {/* Amount */}
                    <div className="text-foreground col-span-2 truncate font-mono text-sm font-bold">
                      Rp {safeAmount.toLocaleString("id-ID")}
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-2 flex justify-center">
                      {renderStatusBadge(inv.status)}
                    </div>

                    {/* Action Column */}
                    <div className="col-span-1 flex items-center justify-end">
                      {inv.status === "PENDING" ? (
                        <Button
                          variant="primaryPill"
                          size="sm"
                          onClick={() => {
                            if (inv.paymentUrl || inv.invoiceUrl) {
                              window.open(
                                inv.paymentUrl || inv.invoiceUrl,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            } else if (onPay) {
                              onPay(inv);
                            }
                          }}
                          className="h-8 cursor-pointer gap-1 rounded-full px-3.5 text-xs font-bold shadow-xs"
                        >
                          <CreditCard className="size-3.5" />
                          <span>{t("billing.payNow")}</span>
                        </Button>
                      ) : inv.status === "PAID" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReceipt(inv)}
                          className="border-border hover:border-foreground-muted h-8 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
                          title={t("billing.viewInvoice")}
                        >
                          <FileText className="text-foreground-secondary size-3.5" />
                          <span>{t("billing.viewInvoice")}</span>
                        </Button>
                      ) : (
                        <span className="text-foreground-muted pr-2 font-mono text-xs">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="border-border bg-muted/30 flex flex-col items-center justify-between gap-3 border-t p-3 sm:flex-row sm:px-5 sm:py-3.5">
          {/* Item count summary */}
          <div className="text-foreground-secondary text-xs font-semibold">
            Menampilkan {startItem} - {endItem} dari {total} faktur
          </div>

          {/* Shadcn UI Pagination */}
          {totalPages > 1 && (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              prevText={t("billing.prevPage") || "Sebelumnya"}
              nextText={t("billing.nextPage") || "Berikutnya"}
              className="mx-0 w-auto"
            />
          )}
        </div>
      )}
    </div>
  );
}
