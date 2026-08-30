"use client";

import { useState, useEffect, useCallback } from "react";
import { Invoice, TenantBalance, PaymentMethod } from "../types/finance.types";
import { financeApi } from "../api/finance.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useBilling() {
  const { t } = useI18n();
  const [balance, setBalance] = useState<TenantBalance | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBillingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balData, invData] = await Promise.all([
        financeApi.getBalance(),
        financeApi.getInvoices(),
      ]);
      setBalance(balData);
      setInvoices(invData);
    } catch {
      // Fallback in API client
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [balData, invData] = await Promise.all([
          financeApi.getBalance(),
          financeApi.getInvoices(),
        ]);
        if (isMounted) {
          setBalance(balData);
          setInvoices(invData);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const createTopUp = async (amount: number, paymentMethod: PaymentMethod): Promise<Invoice> => {
    try {
      const { invoice } = await financeApi.createTopUp({ amount, paymentMethod });
      setInvoices((prev) => [invoice, ...prev]);
      toast.success(t("billing.toastTopUpSuccess"));
      return invoice;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses top-up";
      toast.error(msg);
      throw err;
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    const invoiceContent = `========================================================\n                 FAKTUR PEMBAYARAN RESMI                \n                    WAHIDE GATEWAY                      \n========================================================\nNomor Faktur   : ${invoice.invoiceNumber}\nTanggal        : ${new Date(invoice.createdAt).toLocaleDateString("id-ID")}\nStatus         : ${invoice.status}\nMetode Bayar   : ${invoice.paymentMethod || "QRIS"}\n--------------------------------------------------------\nDeskripsi      : ${invoice.description}\nTotal Bayar    : Rp ${invoice.amount.toLocaleString("id-ID")}\n========================================================\nTerima kasih atas kepercayaan Anda menggunakan Wahide.\n`;
    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber.replace(/\//g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t("billing.toastInvoiceDownloaded"));
  };

  return {
    balance,
    invoices,
    isLoading,
    fetchBillingData,
    createTopUp,
    downloadInvoice,
  };
}
