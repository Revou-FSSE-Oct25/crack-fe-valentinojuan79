"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Card: React.FC<{ children: React.ReactNode; className?: string; hoverable?: boolean }> = ({
  children, className, hoverable
}) => (
  <div className={cn(
    "bg-white border border-[#EDE9E4] rounded-2xl p-8 transition-all duration-400",
    hoverable && "hover:shadow-[0_12px_40px_rgb(26,20,16,0.08)] hover:-translate-y-0.5 hover:border-[#C2B9AF]",
    className
  )}>
    {children}
  </div>
);
