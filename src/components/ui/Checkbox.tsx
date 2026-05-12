import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className="inline-flex items-start gap-3 cursor-pointer select-none group">
      <div className="relative flex items-center mt-0.5 shrink-0">
        <input
          ref={ref}
          type="checkbox"
          className={cn("sr-only peer", className)}
          {...props}
        />
        {/* Custom box */}
        <div className="w-4 h-4 rounded-[5px] border border-[#DDD7CF] bg-white transition-all duration-150 peer-checked:bg-[#1A1410] peer-checked:border-[#1A1410] group-hover:border-[#B07D3E] peer-focus-visible:ring-2 peer-focus-visible:ring-[#B07D3E]/30">
          {/* Checkmark — always rendered, opacity toggled via peer */}
          <svg className="w-full h-full p-[2.5px] text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {label && (
        <span className="text-[13px] text-[#7A6E64] leading-relaxed group-hover:text-[#3D342D] transition-colors">
          {label}
        </span>
      )}
    </label>
  )
);
Checkbox.displayName = "Checkbox";
