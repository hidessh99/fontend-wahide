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
    <div className="space-y-6 pb-12">
      {/* Top Header & Ecosystem Navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            {t("autoreply.title")}
          </h1>
          <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl">
            {t("autoreply.subtitle")}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex items-center gap-2 border-b pb-3 overflow-x-auto">
          <Link
            href="/autoreply"
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-sm whitespace-nowrap"
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

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-sm">
          <div>
            <p className="text-foreground-muted text-xs font-medium">Total Aturan</p>
            <p className="text-foreground text-xl font-black mt-0.5">{total}</p>
          </div>
          <div className="rounded-xl bg-muted p-2.5 text-foreground-muted">
            <Bot className="size-5" />
          </div>
        </div>
        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-sm">
          <div>
            <p className="text-foreground-muted text-xs font-medium">Aturan Aktif</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-xl font-black mt-0.5">
              {activeCount}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-sm">
          <div>
            <p className="text-foreground-muted text-xs font-medium">Aturan Nonaktif</p>
            <p className="text-foreground-muted text-xl font-black mt-0.5">
              {inactiveCount}
            </p>
          </div>
          <div className="rounded-xl bg-muted p-2.5 text-foreground-muted">
            <XCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Action Toolbar & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search */}
          <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2">
            <Search className="size-3.5 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("autoreply.rules.searchPlaceholder")}
              className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
            />
          </div>

          {/* Channel Filter */}
          <select
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            className="border-border bg-surface text-foreground rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none"
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
            className="border-border bg-surface text-foreground rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none max-w-[200px] truncate"
          >
            <option value="">{t("autoreply.rules.filterDevice")}</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name || d.phone || d.id}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchRules()}
            className="border-border bg-surface text-foreground-secondary hover:bg-muted rounded-xl border p-2 transition-colors cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Create Rule Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="bg-wise-green text-dark-green hover:brightness-105 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
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
