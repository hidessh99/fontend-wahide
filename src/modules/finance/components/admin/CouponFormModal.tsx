"use client";

import React, { useState, useEffect } from "react";
import {
  Voucher,
  CreateVoucherInput,
  DiscountType,
} from "../../types/coupon.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Ticket,
  Percent,
  Coins,
  Calendar,
  Layers,
  Save,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface CouponFormModalProps {
  coupon: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVoucherInput) => Promise<boolean>;
}

export function CouponFormModal({
  coupon,
  isOpen,
  onClose,
  onSubmit,
}: CouponFormModalProps) {
  const { t } = useI18n();
  const isEdit = Boolean(coupon);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicableProduct, setApplicableProduct] = useState("SUBSCRIPTION");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setName(coupon.name);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue);
      setMaxDiscountAmount(coupon.maxDiscountAmount);
      setMinPurchaseAmount(coupon.minPurchaseAmount);
      setMaxUsage(coupon.maxUsage);
      setStartDate(
        coupon.startDate
          ? new Date(coupon.startDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      );
      setEndDate(
        coupon.endDate
          ? new Date(coupon.endDate).toISOString().slice(0, 16)
          : new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
      );
      setApplicableProduct(coupon.applicableProduct || "SUBSCRIPTION");
      setIsActive(coupon.isActive);
    } else {
      setCode("");
      setName("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(20);
      setMaxDiscountAmount(50000);
      setMinPurchaseAmount(0);
      setMaxUsage(100);
      setStartDate(new Date().toISOString().slice(0, 16));
      setEndDate(
        new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 16),
      );
      setApplicableProduct("SUBSCRIPTION");
      setIsActive(true);
    }
  }, [coupon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || discountValue <= 0) return;

    setIsSubmitting(true);
    try {
      const payload: CreateVoucherInput = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        discountType,
        discountValue: Number(discountValue),
        maxDiscountAmount: Number(maxDiscountAmount || 0),
        minPurchaseAmount: Number(minPurchaseAmount || 0),
        maxUsage: Number(maxUsage || 0),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        applicableProduct,
        isActive,
      };

      const ok = await onSubmit(payload);
      if (ok) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-xl">
        {/* Modal Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Ticket className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight">
              {isEdit
                ? t("admin.coupons.editModalTitle") || "Edit Kupon Promo"
                : t("admin.coupons.createModalTitle") || "Tambah Kupon Baru"}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {isEdit
                ? t("admin.coupons.editModalSubtitle") || "Perbarui parameter potongan dan kuota kupon."
                : t("admin.coupons.createModalSubtitle") || "Buat kupon diskon baru untuk pembelian langganan."}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Modal Form Scrollable */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
            {/* Code & Name Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  {t("admin.coupons.formCode") || "Kode Kupon *"}
                </label>
                <Input
                  type="text"
                  required
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                  }
                  placeholder="CONTOH: PROMO2026"
                  className="font-mono uppercase font-bold tracking-wider"
                  disabled={isEdit || isSubmitting}
                />
                <p className="text-foreground-muted text-[10px]">
                  {t("admin.coupons.formCodeHint") || "Hanya huruf kapital & angka."}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  {t("admin.coupons.formName") || "Nama Promo *"}
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Diskon Awal Tahun"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Discount Type & Value */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-foreground text-xs font-bold">
                  {t("admin.coupons.formDiscountType") || "Tipe Potongan Diskon *"}
                </label>
                <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setDiscountType("PERCENTAGE")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                      discountType === "PERCENTAGE"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    <Percent className="size-3" />
                    <span>{t("admin.coupons.typePercentage") || "Persentase (%)"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("FIXED")}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                      discountType === "FIXED"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-foreground-muted hover:text-foreground"
                    }`}
                  >
                    <Coins className="size-3" />
                    <span>{t("admin.coupons.typeFixed") || "Nominal Tetap (Rp)"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-bold">
                    {discountType === "PERCENTAGE"
                      ? t("admin.coupons.formPercentValue") || "Besaran Diskon (%) *"
                      : t("admin.coupons.formFixedValue") || "Nominal Potongan (Rp) *"}
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={discountType === "PERCENTAGE" ? 100 : 100000000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                </div>

                {discountType === "PERCENTAGE" && (
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-bold">
                      {t("admin.coupons.formMaxDiscount") || "Maksimal Potongan (Rp)"}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      placeholder="0 = Tanpa Batas"
                      disabled={isSubmitting}
                    />
                    <p className="text-foreground-muted text-[10px]">
                      {t("admin.coupons.formMaxDiscountHint") || "Isi 0 jika tidak ada batas maksimal."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thresholds: Min Purchase & Max Usage */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  {t("admin.coupons.formMinPurchase") || "Minimal Pembelian (Rp)"}
                </label>
                <Input
                  type="number"
                  min={0}
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                  placeholder="0 = Tanpa Syarat"
                  disabled={isSubmitting}
                />
                <p className="text-foreground-muted text-[10px]">
                  {t("admin.coupons.formMinPurchaseHint") || "Syarat minimal total tagihan pesanan."}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold">
                  {t("admin.coupons.formMaxUsage") || "Batas Kuota Penggunaan"}
                </label>
                <Input
                  type="number"
                  min={0}
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  placeholder="0 = Tak Terbatas"
                  disabled={isSubmitting}
                />
                <p className="text-foreground-muted text-[10px]">
                  {t("admin.coupons.formMaxUsageHint") || "Total kupon yang dapat diklaim seluruh tenant."}
                </p>
              </div>
            </div>

            {/* Validity Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold flex items-center gap-1">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{t("admin.coupons.formStartDate") || "Tanggal Mulai *"}</span>
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold flex items-center gap-1">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{t("admin.coupons.formEndDate") || "Tanggal Berakhir *"}</span>
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Applicable Product & Status Switch */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold flex items-center gap-1">
                  <Layers className="size-3.5 text-muted-foreground" />
                  <span>{t("admin.coupons.formProduct") || "Target Produk"}</span>
                </label>
                <select
                  value={applicableProduct}
                  onChange={(e) => setApplicableProduct(e.target.value)}
                  disabled={isSubmitting}
                  className="border-input bg-background text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
                >
                  <option value="SUBSCRIPTION">Hanya Langganan (SUBSCRIPTION)</option>
                  <option value="ALL">Semua Produk (ALL)</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="space-y-0.5">
                  <label className="text-foreground text-xs font-bold block">
                    {t("admin.coupons.formIsActive") || "Status Aktif Kupon"}
                  </label>
                  <span className="text-foreground-muted text-[10px]">
                    {isActive
                      ? t("admin.coupons.statusActiveHint") || "Dapat digunakan oleh tenant"
                      : t("admin.coupons.statusInactiveHint") || "Kupon dinonaktifkan sementara"}
                  </span>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-border bg-muted/20 flex shrink-0 flex-row items-center justify-end gap-2 border-t p-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border hover:bg-muted text-foreground h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
            >
              {t("common.cancel") || "Batal"}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-9 cursor-pointer gap-1.5 rounded-full px-6 text-xs font-black shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("common.saving") || "Menyimpan..."}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>
                    {isEdit
                      ? t("common.saveChanges") || "Simpan Perubahan"
                      : t("admin.coupons.submitCreate") || "Buat Kupon"}
                  </span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
