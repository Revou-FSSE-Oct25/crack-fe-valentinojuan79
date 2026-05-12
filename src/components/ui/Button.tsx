import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  isLoading?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   "bg-[#1A1410] text-white border-[#1A1410] hover:bg-[#B07D3E] hover:border-[#B07D3E]",
  secondary: "bg-[#F8F6F3] text-[#1A1410] border-[#DDD7CF] hover:bg-[#EDE9E4]",
  outline:   "bg-transparent text-[#1A1410] border-[#DDD7CF] hover:border-[#1A1410]",
  ghost:     "bg-transparent text-[#7A6E64] border-transparent hover:bg-[#F8F6F3] hover:text-[#1A1410]",
  danger:    "bg-red-600 text-white border-red-600 hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-[13px] gap-1.5",
  md: "px-5 py-2.5 text-[13px] gap-2",
  lg: "px-8 py-3.5 text-[14px] gap-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, leftIcon, rightIcon, fullWidth, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full border transition-all duration-250 cursor-pointer whitespace-nowrap tracking-wide",
        "focus-visible:outline-2 focus-visible:outline-[#B07D3E] focus-visible:outline-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
);
Button.displayName = "Button";
