
"use client";

import { LogIn, ChevronDown, BadgePercent, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const IdCreatorLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-primary/20 text-primary p-2 rounded-lg">
      <BadgePercent className="w-5 h-5" />
    </div>
    <span className="font-bold text-xl tracking-tighter text-gray-800">ID MAKER</span>
  </div>
);

const navLinks = [
    { href: "/", label: "Card Designer" },
    { href: "#", label: "My Designs" },
    { href: "#", label: "My Members" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-card border-b sticky top-0 z-30">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center gap-8">
                <IdCreatorLogo />
                 <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            {link.label}
                        </Link>
                    ))}
                 </nav>
              </div>
              <div className="flex items-center gap-2">
                 <div className="hidden md:flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-sm font-medium text-muted-foreground h-9">
                          Help <ChevronDown className="w-4 h-4 ml-1"/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Help Center</DropdownMenuItem>
                        <DropdownMenuItem>Contact Us</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button asChild variant="ghost" className="text-sm font-medium text-muted-foreground h-9">
                       <Link href="/records">
                         <Search className="w-4 h-4 mr-2" /> Record
                       </Link>
                    </Button>
                   
                    <Button>
                      <LogIn className="w-4 h-4 mr-2"/> Login
                    </Button>
                 </div>
                 <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                           <div className="flex flex-col gap-6 pt-8">
                             {navLinks.map((link) => (
                                <Link key={link.label} href={link.href} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                             ))}
                             <Link href="/records" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                                Records
                             </Link>
                           </div>
                        </SheetContent>
                    </Sheet>
                 </div>
              </div>
            </div>
        </div>
    </header>
  );
}
