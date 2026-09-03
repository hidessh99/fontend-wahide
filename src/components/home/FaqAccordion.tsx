"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { HelpCircle, ChevronDown } from "lucide-react";

export function FaqAccordion() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: t("common.landing.faq.q1"),
      a: t("common.landing.faq.a1"),
    },
    {
      q: t("common.landing.faq.q2"),
      a: t("common.landing.faq.a2"),
    },
    {
      q: t("common.landing.faq.q3"),
      a: t("common.landing.faq.a3"),
    },
    {
      q: t("common.landing.faq.q4"),
      a: t("common.landing.faq.a4"),
    },
    {
      q: t("common.landing.faq.q5"),
      a: t("common.landing.faq.a5"),
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Section Header */}
      <div className="space-y-2 text-center">
        <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
          <HelpCircle className="size-3.5" />
          <span>{t("common.landing.faq.badge")}</span>
        </div>
        <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-4xl">
          {t("common.landing.faq.title")}
        </h2>
        <p className="text-foreground-secondary mx-auto max-w-xl text-xs font-semibold sm:text-sm">
          {t("common.landing.faq.subtitle")}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border-border bg-surface overflow-hidden rounded-md border shadow-xs transition dark:bg-[#161715]"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="text-foreground hover:text-dark-green dark:hover:text-wise-green flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold transition sm:p-6 sm:text-base"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`text-foreground-muted size-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "text-dark-green dark:text-wise-green rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="text-foreground-secondary border-border/60 animate-in fade-in border-t px-5 pt-4 pb-6 text-xs leading-relaxed font-semibold duration-200 sm:px-6 sm:text-sm">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
