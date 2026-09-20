"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Plus,
  Search,
  Bot,
  RefreshCw,
  Workflow,
  Inbox,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useAutoreplyRules } from "../hooks/useAutoreplyRules";
import { RuleTable } from "../components/RuleTable";
import {
  AutoreplyRule,
  CreateRuleInput,
  UpdateRuleInput,
} from "../types/autoreply.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const RuleModal = dynamic(
  () => import("../components/RuleModal").then((m) => m.RuleModal),
  { ssr: false },
);

export function AutoreplyRulesView() {
  const { t } = useI18n();
  const { devices } = useDevices();
  const {
    rules,
    rawRules,
    total,
    isLoading,
    search,
    setSearch,
    deviceId,
    setDeviceId,
    channelType,
    setChannelType,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  } = useAutoreplyRules();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoreplyRule | null>(null);

  const activeCount = rawRules.filter((r) => r.is_active).length;
  const inactiveCount = rawRules.filter((r) => !r.is_active).length;

  const handleOpenCreate = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: AutoreplyRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSaveRule = async (input: CreateRuleInput | UpdateRuleInput) => {
    if (editingRule) {
      return await updateRule(editingRule.id, input);
    }
    return await createRule(input as CreateRuleInput);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6 p-3 sm:p-6 lg:p-8 pb-12">
      {/* Top Header & Navigation Tabs */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
              {t("autoreply.title")}
            </h1>
            <p className="text-foreground-muted text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-2xl">
              {t("autoreply.subtitle")}
            </p>
          </div>

          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={handleOpenCreate}
            className="gap-2 px-5 text-xs font-bold shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="size-4" />
            <span>{t("autoreply.rules.addRule")}</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex items-center gap-1.5 sm:gap-2 border-b pb-3 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <Link
            href="/autoreply"
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-xs whitespace-nowrap"
          >
            <Bot className="size-3.5" />
            <span>{t("autoreply.tabs.rules")}</span>
          </Link>
          <Link
            href="/autoreply/flow"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Workflow className="size-3.5" />
            <span>{t("autoreply.tabs.flows")}</span>
          </Link>
          <Link
            href="/autoreply/submission"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Inbox className="size-3.5" />
            <span>{t("autoreply.tabs.submissions")}</span>
          </Link>
          <Link
            href="/autoreply/spreadsheet"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>{t("autoreply.tabs.spreadsheet")}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards - Mobile 3-column compact grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="border-border/80 bg-surface hover:border-border flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-3 sm:p-4 lg:p-5 shadow-2xs transition-colors">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">
                {t("autoreply.rules.statTotal")}
              </span>
              <span className="hidden sm:inline">
                {t("autoreply.rules.totalRules")}
              </span>
            </p>
            <p className="text-foreground text-lg sm:text-2xl lg:text-3xl font-black mt-0.5 font-mono">
              {total}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-wise-green/10 p-2.5 lg:p-3 text-dark-green dark:text-wise-green shrink-0 ml-2">
            <Bot className="size-5" />
          </div>
        </div>

        <div className="border-border/80 bg-surface hover:border-border flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-3 sm:p-4 lg:p-5 shadow-2xs transition-colors">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">
                {t("autoreply.rules.statActive")}
              </span>
              <span className="hidden sm:inline">
                {t("autoreply.rules.activeRules")}
              </span>
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg sm:text-2xl lg:text-3xl font-black mt-0.5 font-mono">
              {activeCount}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-emerald-500/10 p-2.5 lg:p-3 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0 ml-2">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        <div className="border-border/80 bg-surface hover:border-border flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-3 sm:p-4 lg:p-5 shadow-2xs transition-colors">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">
                {t("autoreply.rules.statInactive")}
              </span>
              <span className="hidden sm:inline">
                {t("autoreply.rules.inactiveRules")}
              </span>
            </p>
            <p className="text-foreground-muted text-lg sm:text-2xl lg:text-3xl font-black mt-0.5 font-mono">
              {inactiveCount}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-muted p-2.5 lg:p-3 text-foreground-muted shrink-0 ml-2">
            <XCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Responsive Action Toolbar & Filters */}
      <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search & Filters Container */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-1 sm:items-center sm:flex-wrap lg:flex-nowrap">
          {/* Row 1 on mobile: Search + Refresh */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] sm:min-w-[240px]">
            <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2 shadow-2xs">
              <Search className="size-3.5 text-foreground-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("autoreply.rules.searchPlaceholder")}
                className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
              />
            </div>
            {/* Refresh Button on Mobile (next to search) */}
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => fetchRules()}
              className="sm:hidden rounded-xl border-border bg-surface text-foreground-secondary hover:text-foreground shrink-0"
              title="Muat ulang data"
              aria-label="Muat ulang data"
            >
              <RefreshCw
                className={cn("size-3.5", isLoading && "animate-spin")}
              />
            </Button>
          </div>

          {/* Row 2 on mobile: Equal 2-column Dropdowns (Saluran & Perangkat) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 shrink-0">
            {/* Channel Filter */}
            <NativeSelect
              value={channelType}
              onChange={(e) => setChannelType(e.target.value)}
              variant="rounded"
              className="w-full sm:w-auto text-xs"
            >
              <NativeSelectOption value="">
                {t("autoreply.rules.filterChannel")}
              </NativeSelectOption>
              <NativeSelectOption value="whatsapp">
                {t("autoreply.rules.channelWhatsApp")}
              </NativeSelectOption>
              <NativeSelectOption value="telegram">
                {t("autoreply.rules.channelTelegram")}
              </NativeSelectOption>
              <NativeSelectOption value="waba">
                {t("autoreply.rules.channelWABA")}
              </NativeSelectOption>
            </NativeSelect>

            {/* Device Filter */}
            <NativeSelect
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              variant="rounded"
              className="w-full sm:max-w-[190px] text-xs"
            >
              <NativeSelectOption value="">
                {t("autoreply.rules.filterDevice")}
              </NativeSelectOption>
              {devices.map((d) => (
                <NativeSelectOption key={d.id} value={d.id}>
                  {d.name || d.phone || d.id}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {/* Refresh Button on Desktop (inline) */}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => fetchRules()}
            className="hidden sm:flex rounded-xl border-border bg-surface text-foreground-secondary hover:text-foreground shrink-0"
            title="Muat ulang data"
            aria-label="Muat ulang data"
          >
            <RefreshCw
              className={cn("size-3.5", isLoading && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      {/* Rules Table Component */}
      <RuleTable
        rules={rules}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={deleteRule}
        onToggle={toggleRule}
        onCreateNew={handleOpenCreate}
      />

      {/* Create / Edit Rule Modal (Lazy Loaded) */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />
    </div>
  );
}
