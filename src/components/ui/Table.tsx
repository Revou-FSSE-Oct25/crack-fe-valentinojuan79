import React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
    <table className={cn("w-full text-left text-sm", className)}>{children}</table>
  </div>
);

export const Thead = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <thead className={cn("bg-gray-50 border-b border-gray-100 text-gray-500 font-medium", className)}>{children}</thead>
);

export const Tbody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tbody className={cn("divide-y divide-gray-50 bg-white", className)}>{children}</tbody>
);

export const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("px-6 py-4 font-semibold text-gray-900", className)}>{children}</th>
);

export const Td = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("px-6 py-4 text-gray-600", className)}>{children}</td>
);