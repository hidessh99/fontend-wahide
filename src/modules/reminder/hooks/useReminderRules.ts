"use client";

import { useState, useEffect, useCallback } from "react";
import { ReminderRule, UpdateReminderRuleInput } from "../types/reminder.types";
import { reminderApi } from "../api/reminder.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

const DEFAULT_RULE: ReminderRule = {
  id: "",
  tenantId: "",
  deviceId: "",
  channelType: "WHATSAPP_WEB",
  sendTime: "09:00",
  showInChat: true,
  rules: [
    {
      daysOffset: -1,
      name: "Pengingat H-1",
      isEnabled: true,
      template:
        "Halo Kak {{nama}}, ini pengingat jadwal Anda untuk besok pada tanggal {{tanggal}}: {{catatan}}.",
    },
    {
      daysOffset: 0,
      name: "Pengingat Hari H",
      isEnabled: true,
      template:
        "Halo Kak {{nama}}, hari ini adalah jadwal Anda: {{catatan}}. Kami siap melayani Anda!",
    },
    {
      daysOffset: 3,
      name: "Follow Up H+3",
      isEnabled: false,
      template:
        "Halo Kak {{nama}}, terima kasih telah berkunjung pada {{tanggal}}. Semoga puas dengan pelayanan kami!",
    },
  ],
};

export function useReminderRules() {
  const { t } = useI18n();
  const [rule, setRule] = useState<ReminderRule>(DEFAULT_RULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reminderApi.getRules();
      if (signal?.aborted) return;
      if (data && data.rules && data.rules.length > 0) {
        setRule(data);
      } else {
        setRule(DEFAULT_RULE);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      // If not configured yet, fallback to DEFAULT_RULE
      setRule(DEFAULT_RULE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRules(controller.signal);
    return () => controller.abort();
  }, [fetchRules]);

  const updateRule = async (
    input: UpdateReminderRuleInput,
  ): Promise<boolean> => {
    setIsSaving(true);
    try {
      const updated = await reminderApi.updateRules(input);
      setRule(updated);
      toast.success(t("reminder.rulesUpdatedSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("reminder.rulesUpdateFailed");
      toast.error(msg);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    rule,
    isLoading,
    isSaving,
    error,
    updateRule,
    reload: () => fetchRules(),
  };
}
