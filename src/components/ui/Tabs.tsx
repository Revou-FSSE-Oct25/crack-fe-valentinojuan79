import React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  items: { label: string; value: string }[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeTab, onChange, className }) => (
  <div className={cn("flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit", className)}>
    {items.map((item) => (
      <button
        key={item.value}
        onClick={() => onChange(item.value)}
        className={cn(
          "px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
          activeTab === item.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);