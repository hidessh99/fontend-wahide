"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { RuleModal } from "../components/RuleModal";
import { AutoreplyRule, CreateRuleInput, UpdateRuleInput } from "../types/autoreply.types";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";

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
      return await updateRule(editingRule.id, input as UpdateRuleInput);
    } else {
      return await createRule(input as CreateRuleInput);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-12">
      {/* Top Header & Ecosystem Navigation Tabs */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
            {t("autoreply.title")}
          </h1>
          <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            {t("autoreply.subtitle")}
          </p>
        </div>

        {/* Tab Navigation with clean touch swipe and hidden scrollbar */}
        <div className="border-border flex items-center gap-1.5 sm:gap-2 border-b pb-2.5 sm:pb-3 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
          <Link
            href="/autoreply"
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-xs whitespace-nowrap shrink-0"
          >
            <Bot className="size-3.5" />
            <span>{t("autoreply.tabs.rules")}</span>
          </Link>
          <Link
            href="/autoreply/flow"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0"
          >
            <Workflow className="size-3.5" />
            <span>{t("autoreply.tabs.flows")}</span>
          </Link>
          <Link
            href="/autoreply/submission"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0"
          >
            <Inbox className="size-3.5" />
            <span>{t("autoreply.tabs.submissions")}</span>
          </Link>
          <Link
            href="/autoreply/spreadsheet"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>{t("autoreply.tabs.spreadsheet")}</span>
          </Link>
        </div>
      </div>

      {/* Responsive Metrics Bar: Compact 3-col on mobile, spacious on desktop */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Total Rules */}
        <div className="border-border bg-surface flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 shadow-xs">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">{t("autoreply.rules.statTotal")}</span>
              <span className="hidden sm:inline">{t("autoreply.rules.totalRules")}</span>
            </p>
            <p className="text-foreground text-lg sm:text-2xl font-black mt-0.5 font-mono">
              {total}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-muted p-2.5 text-foreground-muted shrink-0 ml-2">
            <Bot className="size-5" />
          </div>
        </div>

        {/* Active Rules */}
        <div className="border-border bg-surface flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 shadow-xs">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">{t("autoreply.rules.statActive")}</span>
              <span className="hidden sm:inline">{t("autoreply.rules.activeRules")}</span>
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg sm:text-2xl font-black mt-0.5 font-mono">
              {activeCount}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0 ml-2">
            <CheckCircle2 className="size-5" />
          </div>
        </div>

        {/* Inactive Rules */}
        <div className="border-border bg-surface flex flex-col justify-between sm:flex-row sm:items-center rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 shadow-xs">
          <div className="min-w-0">
            <p className="text-foreground-muted text-[11px] sm:text-xs font-semibold sm:normal-case tracking-tight sm:tracking-normal truncate">
              <span className="sm:hidden">{t("autoreply.rules.statInactive")}</span>
              <span className="hidden sm:inline">{t("autoreply.rules.inactiveRules")}</span>
            </p>
            <p className="text-foreground-muted text-lg sm:text-2xl font-black mt-0.5 font-mono">
              {inactiveCount}
            </p>
          </div>
          <div className="hidden sm:flex rounded-xl bg-muted p-2.5 text-foreground-muted shrink-0 ml-2">
            <XCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Responsive Action Toolbar & Filters */}
      <div className="space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
        {/* Search & Filters Container */}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-1 sm:items-center">
          {/* Row 1 on mobile: Search + Refresh */}
          <div className="flex items-center gap-2 flex-1">
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
            <button
              type="button"
              onClick={() => fetchRules()}
              className="border-border bg-surface text-foreground-secondary hover:bg-muted sm:hidden rounded-xl border p-2.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Muat ulang data"
              aria-label="Muat ulang data"
            >
              <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            </button>
          </div>

          {/* Row 2 on mobile: Equal 2-column Dropdowns (Saluran & Perangkat) */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
            {/* Channel Filter */}
            <select
              value={channelType}
              onChange={(e) => setChannelType(e.target.value)}
              className="border-border bg-surface text-foreground rounded-xl border px-2.5 py-2 text-xs font-semibold focus:outline-none w-full sm:w-auto shadow-2xs cursor-pointer"
            >
              <option value="">{t("autoreply.rules.filterChannel")}</option>
              <option value="whatsapp">{t("autoreply.rules.channelWhatsApp")}</option>
              <option value="telegram">{t("autoreply.rules.channelTelegram")}</option>
              <option value="waba">{t("autoreply.rules.channelWABA")}</option>
            </select>

            {/* Device Filter */}
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="border-border bg-surface text-foreground rounded-xl border px-2.5 py-2 text-xs font-semibold focus:outline-none w-full sm:max-w-[190px] truncate shadow-2xs cursor-pointer"
            >
              <option value="">{t("autoreply.rules.filterDevice")}</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name || d.phone || d.id}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button on Desktop (inline) */}
          <button
            type="button"
            onClick={() => fetchRules()}
            className="border-border bg-surface text-foreground-secondary hover:bg-muted hidden sm:flex rounded-xl border p-2.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Muat ulang data"
            aria-label="Muat ulang data"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Create Rule Button: Full width on mobile, auto on desktop */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-wise-green text-dark-green hover:brightness-105 flex items-center justify-center gap-2 rounded-xl w-full sm:w-auto px-4 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="size-4" />
          <span>{t("autoreply.rules.addRule")}</span>
        </button>
      </div>

      {/* Rules Table */}
      <RuleTable
        rules={rules}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={deleteRule}
        onToggle={toggleRule}
        onCreateNew={handleOpenCreate}
      />

      {/* Create / Edit Rule Modal */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />
    </div>
  );
}
