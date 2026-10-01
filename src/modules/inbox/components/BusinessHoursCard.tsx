"use client";

import React from "react";
import { useBusinessHours } from "../hooks/useBusinessHours";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Save, ShieldCheck, Loader2 } from "lucide-react";

const DAY_LABELS: Record<string, string> = {
  mon: "Senin",
  tue: "Selasa",
  wed: "Rabu",
  thu: "Kamis",
  fri: "Jumat",
  sat: "Sabtu",
  sun: "Minggu",
};

export function BusinessHoursCard() {
  const {
    config,
    setConfig,
    isLoading,
    isSaving,
    updateScheduleDay,
    saveConfig,
  } = useBusinessHours();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-xs text-muted-foreground animate-pulse">
          Memuat konfigurasi jam kerja operasional...
        </CardContent>
      </Card>
    );
  }

  const daysOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Jam Kerja Pintar (Business Hours)
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Atur jam buka operasional layanan CS, hindari hibernasi whatsmeow selama jam kerja,
              dan balas otomatis pesan di luar jam kerja dengan pesan santun (OOO Autoresponder).
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              {config.is_enabled ? "Aktif" : "Non-aktif (24 Jam)"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={config.is_enabled}
              onClick={() => setConfig((prev) => ({ ...prev, is_enabled: !prev.is_enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.is_enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                  config.is_enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timezone Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Zona Waktu Operasional
            </label>
            <select
              value={config.timezone}
              onChange={(e) => setConfig((prev) => ({ ...prev, timezone: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Asia/Jakarta">WIB - Asia/Jakarta (GMT+7)</option>
              <option value="Asia/Makassar">WITA - Asia/Makassar (GMT+8)</option>
              <option value="Asia/Jayapura">WIT - Asia/Jayapura (GMT+9)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>
              Perangkat WhatsApp yang aktif selama jam kerja dibebaskan dari auto-hibernasi
              agar live CS selalu responsif seketika.
            </span>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground">
            Jadwal Harian Buka - Tutup
          </h4>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Hari</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Jam Buka</th>
                  <th className="px-4 py-2.5 font-medium">Jam Tutup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {daysOrder.map((dayKey) => {
                  const day = config.schedule[dayKey] || { open: "08:00", close: "17:00", active: false };

                  return (
                    <tr key={dayKey} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {DAY_LABELS[dayKey] || dayKey.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.active}
                            onChange={(e) => updateScheduleDay(dayKey, "active", e.target.checked)}
                            className="rounded border-input text-primary focus:ring-primary"
                          />
                          <span className={day.active ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
                            {day.active ? "Buka" : "Libur"}
                          </span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="time"
                          value={day.open}
                          disabled={!day.active}
                          onChange={(e) => updateScheduleDay(dayKey, "open", e.target.value)}
                          className="h-8 w-28 text-xs disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="time"
                          value={day.close}
                          disabled={!day.active}
                          onChange={(e) => updateScheduleDay(dayKey, "close", e.target.value)}
                          className="h-8 w-28 text-xs disabled:opacity-50"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OOO Message */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">
            Pesan Otomatis Luar Jam Kerja (Out of Office Autoresponder)
          </label>
          <Textarea
            value={config.out_of_office_message}
            onChange={(e) => setConfig((prev) => ({ ...prev, out_of_office_message: e.target.value }))}
            rows={3}
            placeholder="Pesan yang otomatis dikirim ke pelanggan saat menghubungi di luar jam operasional..."
            className="text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Pesan ini didebounce per nomor telepon selama 12 jam agar tidak melakukan spam berulang.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={saveConfig}
            disabled={isSaving}
            size="sm"
            className="gap-2 text-xs"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Perubahan Jam Kerja
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
