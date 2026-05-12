import React from "react";
import { cn } from "@/lib/utils";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, fullWidth, className, ...props }, ref) => (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-white border border-gray-200 rounded-xl text-sm py-2.5 px-4 outline-none transition-all duration-150 min-h-[100px] resize-y",
          "focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
          error ? "border-red-500" : "border-gray-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  )
);

TextArea.displayName = "TextArea";