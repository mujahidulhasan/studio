"use client";

import { IdCard } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm h-16">
      <div className="flex items-center gap-3">
        <IdCard className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          ID Maker
        </h1>
      </div>
    </header>
  );
}
