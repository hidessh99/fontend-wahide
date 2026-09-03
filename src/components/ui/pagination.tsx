import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex w-full items-center justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1 sm:gap-1.5", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  size?: "default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon-sm",
  href,
  onClick,
  children,
  ...props
}: PaginationLinkProps) {
  const activeClass = isActive
    ? "bg-wise-green text-dark-green font-black shadow-xs hover:bg-pastel-green dark:bg-wise-green dark:text-dark-green border-transparent"
    : "border-border hover:bg-muted text-foreground-secondary hover:text-foreground";

  if (href) {
    return (
      <Button
        variant={isActive ? "primaryPill" : "outline"}
        size={size}
        className={cn("size-8.5 rounded-full text-xs font-bold transition", activeClass, className)}
        nativeButton={false}
        render={
          <a
            href={href}
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        }
      />
    );
  }

  return (
    <Button
      type="button"
      variant={isActive ? "primaryPill" : "outline"}
      size={size}
      disabled={disabled}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "size-8.5 cursor-pointer rounded-full text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40",
        activeClass,
        className
      )}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = "Sebelumnya",
  disabled,
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Halaman Sebelumnya"
      size="sm"
      disabled={disabled}
      className={cn(
        "h-8.5 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold sm:px-3.5",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-3.5" />
      <span className="hidden sm:inline">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Berikutnya",
  disabled,
  ...props
}: PaginationLinkProps & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Halaman Berikutnya"
      size="sm"
      disabled={disabled}
      className={cn(
        "h-8.5 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold sm:px-3.5",
        className
      )}
      {...props}
    >
      <span className="hidden sm:inline">{text}</span>
      <ChevronRightIcon className="size-3.5" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "text-foreground-muted flex size-8 items-center justify-center select-none",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Halaman lainnya</span>
    </span>
  );
}

export interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  prevText?: string;
  nextText?: string;
  showPageNumbers?: boolean;
  className?: string;
}

/**
 * Reusable Minimal Table Pagination Component: [ < Sebelumnya ] [ Berikutnya > ]
 */
export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  onPrevPage,
  onNextPage,
  prevText = "Sebelumnya",
  nextText = "Berikutnya",
  className,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => {
          if (page > 1) {
            if (onPrevPage) onPrevPage();
            else if (onPageChange) onPageChange(page - 1);
          }
        }}
        className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeftIcon className="size-3.5" />
        <span>{prevText}</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => {
          if (page < totalPages) {
            if (onNextPage) onNextPage();
            else if (onPageChange) onPageChange(page + 1);
          }
        }}
        className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40"
      >
        <span>{nextText}</span>
        <ChevronRightIcon className="size-3.5" />
      </Button>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
