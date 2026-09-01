"use client";

import React from "react";
import { Invoice, InvoiceStatus } from "../types/finance.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { FileText, CheckCircle2, Clock, AlertCircle, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            <span>{t("billing.statusPaid")}</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            <span>{t("billing.statusPending")}</span>
          </span>
        );
      case "EXPIRED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
            <AlertCircle className="size-3" />
            <span>{t("billing.statusExpired")}</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
        <div className="col-span-4 sm:col-span-3">{t("billing.tableHeaderInvoice")}</div>
        <div className="hidden sm:block sm:col-span-4">{t("billing.tableHeaderDesc")}</div>
        <div className="col-span-3 sm:col-span-2">{t("billing.tableHeaderAmount")}</div>
        <div className="col-span-3 sm:col-span-2 text-center">{t("billing.tableHeaderStatus")}</div>
        <div className="col-span-2 sm:col-span-1 text-right">{t("billing.tableHeaderAction")}</div>
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <div className="p-6 sm:p-10 text-center space-y-2">
          <FileText className="size-10 text-foreground-muted mx-auto" />
          <h3 className="font-bold text-sm text-foreground">{t("billing.noInvoices")}</h3>
          <p className="text-xs text-foreground-secondary">{t("billing.noInvoicesDesc")}</p>
        </div>
      ) : (
        <div>
          {/* Mobile View: Card-based Invoice List (Visible on < 768px) */}
          <div className="md:hidden divide-y divide-border/50">
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
                <div key={inv.id} className="p-3.5 sm:p-4 space-y-3 bg-surface dark:bg-[#161715]">
                  {/* Top: Invoice Number & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                      {inv.invoiceNumber || "INV-WAHIDE"}
                    </span>
                    <div>{renderStatusBadge(inv.status)}</div>
                  </div>

                  {/* Middle: Description & Amount */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground-secondary line-clamp-1">
                      {inv.description || "Layanan WhatsApp Gateway"}
                    </p>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-base font-black font-mono text-foreground">
                        Rp {safeAmount.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-foreground-muted">{dateStr}</span>
                    </div>
                  </div>

                  {/* Bottom: Action CTA Button */}
                  {inv.status === "PENDING" ? (
                    <Button
                      variant="primaryPill"
                      size="sm"
                      onClick={() => {
                        if (inv.paymentUrl || inv.invoiceUrl) {
                          window.open(inv.paymentUrl || inv.invoiceUrl, "_blank", "noopener,noreferrer");
                        } else if (onPay) {
                          onPay(inv);
                        }
                      }}
                      className="w-full h-9 text-xs font-bold gap-1.5 rounded-full shadow-xs cursor-pointer justify-center"
                    >
                      <CreditCard className="size-3.5" />
                      <span>{t("billing.payNow")}</span>
                    </Button>
                  ) : inv.status === "PAID" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewReceipt(inv)}
                      className="w-full h-9 text-xs font-bold gap-1.5 rounded-full border-border hover:border-foreground-muted cursor-pointer justify-center"
                    >
                      <FileText className="size-3.5 text-foreground-secondary" />
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
            <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
              <div className="col-span-3">{t("billing.tableHeaderInvoice")}</div>
              <div className="col-span-4">{t("billing.tableHeaderDesc")}</div>
              <div className="col-span-2">{t("billing.tableHeaderAmount")}</div>
              <div className="col-span-2 text-center">{t("billing.tableHeaderStatus")}</div>
              <div className="col-span-1 text-right">{t("billing.tableHeaderAction")}</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50 text-xs font-semibold">
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
                    className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
                  >
                    {/* Invoice Number & Date */}
                    <div className="col-span-3 space-y-0.5">
                      <span className="font-bold text-foreground block font-mono text-sm tracking-tight truncate">
                        {inv.invoiceNumber || "INV-WAHIDE"}
                      </span>
                      <span className="text-xs text-foreground-muted block">
                        {dateStr}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="col-span-4 text-sm font-semibold text-foreground-secondary truncate">
                      {inv.description || "Layanan WhatsApp Gateway"}
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 font-mono font-bold text-sm text-foreground truncate">
                      Rp {safeAmount.toLocaleString("id-ID")}
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-2 flex justify-center">
                      {renderStatusBadge(inv.status)}
                    </div>

                    {/* Action Column */}
                    <div className="col-span-1 flex justify-end items-center">
                      {inv.status === "PENDING" ? (
                        <Button
                          variant="primaryPill"
                          size="sm"
                          onClick={() => {
                            if (inv.paymentUrl || inv.invoiceUrl) {
                              window.open(inv.paymentUrl || inv.invoiceUrl, "_blank", "noopener,noreferrer");
                            } else if (onPay) {
                              onPay(inv);
                            }
                          }}
                          className="h-8 px-3.5 text-xs font-bold gap-1 rounded-full shadow-xs cursor-pointer"
                        >
                          <CreditCard className="size-3.5" />
                          <span>{t("billing.payNow")}</span>
                        </Button>
                      ) : inv.status === "PAID" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewReceipt(inv)}
                          className="h-8 px-3 text-xs font-bold gap-1.5 rounded-full border-border hover:border-foreground-muted cursor-pointer"
                          title={t("billing.viewInvoice")}
                        >
                          <FileText className="size-3.5 text-foreground-secondary" />
                          <span>{t("billing.viewInvoice")}</span>
                        </Button>
                      ) : (
                        <span className="text-foreground-muted text-xs font-mono pr-2">-</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-t border-border bg-muted/30">
          {/* Item count summary */}
          <div className="text-xs font-semibold text-foreground-secondary">
            Menampilkan {startItem} - {endItem} dari {total} faktur
          </div>

          {/* Page navigation: Previous, Page Indicator, Next */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                Halaman {page} dari {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
                className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span>Sebelumnya</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
                className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span>Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
