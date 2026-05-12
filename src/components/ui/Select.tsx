import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth, className, children, ...props }, ref) => (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full bg-white border border-gray-200 rounded-xl text-sm py-2.5 pl-4 pr-10 outline-none transition-all duration-150 appearance-none",
            "focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
            error ? "border-red-500" : "border-gray-200",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  )
);

Select.displayName = "Select";