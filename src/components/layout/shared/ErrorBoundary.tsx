"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception to console or observability pipeline
    console.error("[ErrorBoundary Caught Exception]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="animate-in fade-in my-3 space-y-3 rounded-md border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-foreground text-sm font-black">
              {this.props.fallbackTitle || "Terjadi Kendala Memuat Modul"}
            </h3>
            <p className="text-foreground-secondary mx-auto max-w-md truncate font-mono text-xs">
              {this.state.error?.message || "Kesalahan runtime JavaScript tidak terduga"}
            </p>
          </div>

          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <RefreshCw className="dark:text-wise-green size-3.5 text-emerald-700" />
              <span>Coba Pulihkan Modul</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
