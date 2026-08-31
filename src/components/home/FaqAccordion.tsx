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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <HelpCircle className="size-3.5" />
          <span>{t("common.landing.faq.badge")}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
          {t("common.landing.faq.title")}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-xl mx-auto">
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
              className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden transition shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-dark-green dark:hover:text-wise-green transition"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`size-4 text-foreground-muted shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-dark-green dark:text-wise-green" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed border-t border-border/60 pt-4 animate-in fade-in duration-200">
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
