"use client";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-white/[0.06] text-white/70",
  success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border border-red-500/20",
  info: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  outline: "bg-transparent border border-white/[0.12] text-white/60",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = "default", className = "", dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success"
              ? "bg-emerald-400"
              : variant === "warning"
              ? "bg-amber-400"
              : variant === "error"
              ? "bg-red-400"
              : variant === "info"
              ? "bg-indigo-400"
              : "bg-white/50"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    pending_approval: { label: "Pending Approval", variant: "warning" },
    approved: { label: "Approved", variant: "info" },
    executed: { label: "Executed", variant: "success" },
    rejected: { label: "Rejected", variant: "error" },
    cancelled: { label: "Cancelled", variant: "outline" },
  };

  const { label, variant } = config[status] || { label: status, variant: "default" as BadgeVariant };

  return (
    <Badge variant={variant} dot>
      {label}
    </Badge>
  );
}
