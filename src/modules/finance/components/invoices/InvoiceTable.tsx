"use client";

import React from "react";
import { Invoice, InvoiceStatus } from "@/modules/finance/types/finance.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";
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
  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<Invoice>({
    initialKey: "createdAt",
    initialOrder: "desc",
  });

  const sortedInvoices = sortData(invoices);

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
    <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
      {/* Invoices List */}
      {sortedInvoices.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title={t("billing.noInvoices")}
          description={t("billing.noInvoicesDesc")}
        />
      ) : (
        <div>
          {/* Mobile View: Card-based Invoice List (Visible on < 1024px) */}
          <div className="divide-border/50 divide-y lg:hidden">
            {sortedInvoices.map((inv) => {
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

          {/* Desktop View: shadcn/ui Table (Visible on >= 1024px) */}
          <div className="hidden lg:block">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                  <TableHead className="w-[30%] px-5 py-3.5">
                    <DataTableColumnHeader
                      title={t("billing.tableHeaderInvoice")}
                      columnKey="invoiceNumber"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="w-[35%] px-4 py-3.5">
                    <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                      {t("billing.tableHeaderDesc")}
                    </div>
                  </TableHead>
                  <TableHead className="w-[15%] px-4 py-3.5">
                    <DataTableColumnHeader
                      title={t("billing.tableHeaderAmount")}
                      columnKey="amount"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="w-[10%] px-3 py-3.5 text-center">
                    <DataTableColumnHeader
                      title={t("billing.tableHeaderStatus")}
                      columnKey="status"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="w-[10%] px-5 py-3.5 text-right">
                    <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                      {t("billing.tableHeaderAction")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedInvoices.map((inv) => {
                  const safeAmount = Number(inv.amount ?? 0);
                  const dateStr = inv.createdAt
                    ? new Date(inv.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-";

                  return (
                    <TableRow key={inv.id} className="hover:bg-muted/30 transition-colors">
                      {/* Invoice Number & Date */}
                      <TableCell className="px-5 py-3.5 align-middle">
                        <div className="space-y-0.5">
                          <span className="text-foreground block truncate font-mono text-sm font-bold tracking-tight">
                            {inv.invoiceNumber || "INV-WAHIDE"}
                          </span>
                          <span className="text-foreground-muted block text-xs">{dateStr}</span>
                        </div>
                      </TableCell>

                      {/* Description */}
                      <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle text-sm font-semibold">
                        <span className="line-clamp-1">
                          {inv.description || "Layanan WhatsApp Gateway"}
                        </span>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-foreground px-4 py-3.5 text-right align-middle font-mono text-sm font-bold">
                        Rp {safeAmount.toLocaleString("id-ID")}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="px-3 py-3.5 text-center align-middle">
                        <div className="inline-flex items-center justify-center">
                          {renderStatusBadge(inv.status)}
                        </div>
                      </TableCell>

                      {/* Action Column */}
                      <TableCell className="px-5 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Standardized Shadcn UI Data Table Pagination Footer */}
      {total > 0 && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          entityName="faktur"
          prevText={t("billing.prevPage") || "Sebelumnya"}
          nextText={t("billing.nextPage") || "Berikutnya"}
        />
      )}
    </div>
  );
}
