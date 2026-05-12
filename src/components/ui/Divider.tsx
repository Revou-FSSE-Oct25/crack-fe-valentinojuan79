import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className }) => (
  <div className={cn("flex items-center gap-3 text-gray-400 text-sm", className)}>
    <span className="flex-1 h-px bg-gray-200" />
    {label && (
      <>
        <span className="whitespace-nowrap">{label}</span>
        <span className="flex-1 h-px bg-gray-200" />
      </>
    )}
  </div>
);