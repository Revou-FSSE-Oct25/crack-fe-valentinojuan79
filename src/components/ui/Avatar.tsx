import React from "react";
import { cn } from "@/lib/utils";

export const Avatar: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
  <div className={cn(
    "w-9 h-9 rounded-full bg-[#EDE9E4] flex items-center justify-center text-[#3D342D] text-sm font-semibold",
    className
  )}>
    {name[0]}
  </div>
);
