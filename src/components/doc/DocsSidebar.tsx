"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavSection, HttpMethod } from "./types";
import {
  BookOpen,
  Smartphone,
  MessageSquare,
  Users,
  Megaphone,
  ShieldCheck,
  Webhook,
  Send,
  Bot,
  Globe,
  ChevronDown,
} from "lucide-react";

interface DocsSidebarProps {
  sections: NavSection[];
  onItemClick?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Smartphone,
  MessageSquare,
  Users,
  Megaphone,
  ShieldCheck,
  Webhook,
  Send,
  Bot,
  Globe,
};

function getSectionTotalItems(section: NavSection): number {
  let count = section.items?.length || 0;
  if (section.groups) {
    for (const g of section.groups) {
      count += g.items.length;
    }
  }
  return count;
}

function hasSectionActiveChild(section: NavSection, pathname: string): boolean {
  if (section.items?.some((item) => item.path === pathname)) return true;
  if (
    section.groups?.some((g) =>
      g.items.some((item) => item.path === pathname),
    )
  ) {
    return true;
  }
  return false;
}

export function DocsSidebar({ sections, onItemClick }: DocsSidebarProps) {
  const pathname = usePathname();

  // Initialize open sections: Auto-open the section containing current pathname and Getting Started
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      sections.forEach((section) => {
        const hasActive = hasSectionActiveChild(section, pathname);
        initial[section.id] = hasActive || section.id === "getting-started";
      });
      return initial;
    },
  );

  // Context-Aware Auto-Expansion: Keep active section open whenever pathname changes
  useEffect(() => {
    const activeSection = sections.find((section) =>
      hasSectionActiveChild(section, pathname),
    );
    if (activeSection) {
      setOpenSections((prev) => ({
        ...prev,
        [activeSection.id]: true,
      }));
    }
  }, [pathname, sections]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allOpen = useMemo(() => {
    return sections.length > 0 && sections.every((s) => !!openSections[s.id]);
  }, [sections, openSections]);

  const toggleAll = () => {
    const nextState = !allOpen;
    const updated: Record<string, boolean> = {};
    sections.forEach((s) => {
      updated[s.id] = nextState;
    });
    setOpenSections(updated);
  };

  const getMethodBadge = (method?: HttpMethod) => {
    if (!method) return null;
    switch (method) {
      case "GET":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 shrink-0">
            GET
          </span>
        );
      case "POST":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-800 dark:text-blue-300 shrink-0">
            POST
          </span>
        );
      case "DELETE":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-800 dark:text-rose-300 shrink-0">
            DEL
          </span>
        );
      case "PUT":
      case "PATCH":
        return (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 shrink-0">
            PUT
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-full space-y-4 text-sm">
      {/* Quick Action Toggle (Expand / Collapse All) */}
      <div className="flex items-center justify-between px-2 pb-2 border-b border-border/50 text-[11px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground/70">
          API Categories
        </span>
        <button
          type="button"
          onClick={toggleAll}
          className="hover:text-foreground transition-colors cursor-pointer text-[10px] font-medium text-emerald-800 dark:text-wise-green hover:underline"
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const IconComponent = section.icon ? ICON_MAP[section.icon] : null;
          const isOpen = !!openSections[section.id];
          const hasActiveChild = hasSectionActiveChild(section, pathname);
          const totalItems = getSectionTotalItems(section);

          return (
            <div key={section.id} className="space-y-1">
              {/* Interactive Section Accordion Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer group select-none ${
                  hasActiveChild
                    ? "text-foreground bg-muted/30"
                    : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/40"
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2 truncate">
                  {IconComponent && (
                    <IconComponent
                      className={`size-3.5 shrink-0 transition-colors ${
                        hasActiveChild
                          ? "text-emerald-800 dark:text-wise-green"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    />
                  )}
                  <span className="truncate">{section.title}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isOpen && totalItems > 0 && (
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-muted/80 text-muted-foreground border border-border/60">
                      {totalItems}
                    </span>
                  )}
                  <ChevronDown
                    className={`size-3.5 text-muted-foreground/70 group-hover:text-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </div>
              </button>

              {/* Collapsible Items Container with Smooth Grid Transition */}
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  {/* Case 1: Flat items list */}
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-0.5 border-l border-border/60 ml-4 pl-2 py-0.5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                          <li key={item.id}>
                            <Link
                              href={item.path}
                              onClick={onItemClick}
                              className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive
                                  ? "bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-950 dark:text-foreground font-semibold border-l-2 border-emerald-600 dark:border-wise-green -ml-2.25"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                              }`}
                            >
                              <span className="truncate">{item.title}</span>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {getMethodBadge(item.method)}
                                {item.badge && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-secondary-foreground border border-border">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Case 2: Grouped sub-sections */}
                  {section.groups && section.groups.length > 0 && (
                    <div className="space-y-3 pt-1 pb-1">
                      {section.groups.map((group) => (
                        <div key={group.id} className="space-y-1">
                          <div className="px-3 pt-1.5 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                            <span className="size-1 rounded-full bg-emerald-500/60 dark:bg-wise-green/70" />
                            <span className="truncate">{group.title}</span>
                          </div>
                          <ul className="space-y-0.5 border-l border-border/60 ml-4 pl-2 py-0.5">
                            {group.items.map((item) => {
                              const isActive = pathname === item.path;

                              return (
                                <li key={item.id}>
                                  <Link
                                    href={item.path}
                                    onClick={onItemClick}
                                    className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                      isActive
                                        ? "bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-950 dark:text-foreground font-semibold border-l-2 border-emerald-600 dark:border-wise-green -ml-2.25"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {item.title}
                                    </span>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {getMethodBadge(item.method)}
                                      {item.badge && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-secondary text-secondary-foreground border border-border">
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
