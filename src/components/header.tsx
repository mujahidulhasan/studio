
"use client";

import { LogIn, ChevronDown, BadgePercent } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const IdCreatorLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-primary/20 text-primary p-2 rounded-lg">
      <BadgePercent className="w-5 h-5" />
    </div>
    <span className="font-bold text-xl tracking-tighter text-gray-800">ID MAKER</span>
  </div>
);


export default function Header() {
  return (
    <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <IdCreatorLogo />
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium text-gray-600 h-8">
                      Help <ChevronDown className="w-4 h-4 ml-1"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                    <DropdownMenuItem>Contact Us</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button>
                  <LogIn className="w-4 h-4 mr-2"/> Login
                </Button>
              </div>
            </div>
        </div>
    </header>
  );
}
