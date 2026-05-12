import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconClick, fullWidth, className, ...props }, ref) => (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      {label && (
        <label className="text-[13px] font-medium text-[#3D342D]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-4 text-[#C2B9AF] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-white border rounded-xl text-[14px] text-[#1A1410] placeholder:text-[#C2B9AF] transition-all duration-200 outline-none",
            "focus:ring-2 focus:ring-[#B07D3E]/20 focus:border-[#B07D3E]",
            error
              ? "border-red-400 focus:ring-red-400/20 focus:border-red-400"
              : "border-[#DDD7CF] hover:border-[#C2B9AF]",
            leftIcon ? "pl-11" : "pl-4",
            rightIcon ? "pr-11" : "pr-4",
            "py-3",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div
            className={cn(
              "absolute right-4 text-[#C2B9AF] flex items-center justify-center",
              onRightIconClick && "cursor-pointer hover:text-[#7A6E64] transition-colors"
            )}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[12px] text-red-500 font-medium mt-0.5">{error}</p>}
      {hint && !error && <p className="text-[12px] text-[#7A6E64] mt-0.5">{hint}</p>}
    </div>
  )
);
Input.displayName = "Input";
