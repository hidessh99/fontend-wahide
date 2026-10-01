"use client";

import { useState, useEffect, useCallback } from "react";
import { inboxApi } from "../api/inbox.api";
import { BusinessHoursConfig, DaySchedule } from "../types/inbox.types";
import { toast } from "sonner";

const DEFAULT_DAYS: Record<string, DaySchedule> = {
  mon: { open: "08:00", close: "17:00", active: true },
  tue: { open: "08:00", close: "17:00", active: true },
  wed: { open: "08:00", close: "17:00", active: true },
  thu: { open: "08:00", close: "17:00", active: true },
  fri: { open: "08:00", close: "17:00", active: true },
  sat: { open: "08:00", close: "12:00", active: false },
  sun: { open: "08:00", close: "12:00", active: false },
};

export function useBusinessHours() {
  const [config, setConfig] = useState<BusinessHoursConfig>({
    timezone: "Asia/Jakarta",
    is_enabled: false,
    schedule: DEFAULT_DAYS,
    out_of_office_message:
      "Halo! Terima kasih telah menghubungi kami. Saat ini kami sedang di luar jam kerja. Kami akan segera merespons pesan Anda pada jam kerja berikutnya.",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await inboxApi.getBusinessHours();
      if (data) {
        setConfig({
          ...data,
          schedule: data.schedule || DEFAULT_DAYS,
        });
      }
    } catch {
      toast.error("Gagal memuat pengaturan jam kerja");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const updateScheduleDay = (
    dayKey: string,
    field: keyof DaySchedule,
    value: string | boolean,
  ) => {
    setConfig((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayKey]: {
          ...prev.schedule[dayKey],
          [field]: value,
        },
      },
    }));
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const updated = await inboxApi.updateBusinessHours(config);
      setConfig(updated);
      toast.success("Pengaturan jam kerja berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan jam kerja");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    setConfig,
    isLoading,
    isSaving,
    updateScheduleDay,
    saveConfig,
    refreshConfig: fetchConfig,
  };
}
