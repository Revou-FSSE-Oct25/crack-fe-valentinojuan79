import React from "react";
import { cn } from "@/lib/utils";

export const Badge: React.FC<{ children: React.ReactNode; className?: string; variant?: "default" | "accent" }> = ({
  children, className, variant = "default"
}) => (
  <span className={cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.09em]",
    variant === "default" && "bg-stone-100 text-stone-500",
    variant === "accent"  && "bg-accent-50 text-accent-500 border border-accent-200",
    className
  )}>
    {variant === "accent" && <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />}
    {children}
  </span>
);
