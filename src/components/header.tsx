
"use client";

import { LogIn, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const IdCreatorLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-[#4CAF50] text-white font-bold text-xl p-2 rounded-md leading-none">
      ID
    </div>
    <span className="font-semibold text-xl tracking-wider text-gray-700">CREATOR</span>
  </div>
);


export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <IdCreatorLogo />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium text-gray-600">
                      Help <ChevronDown className="w-4 h-4 ml-1"/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Help Center</DropdownMenuItem>
                    <DropdownMenuItem>Contact Us</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button variant="ghost" className="text-sm font-medium text-gray-600">
                <LogIn className="w-4 h-4 mr-2"/> Login
              </Button>
            </div>
        </div>
        <div className="bg-gray-100 border-t border-b">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-4">
                    <a href="#" className="py-3 px-2 text-sm font-medium text-gray-500 hover:text-gray-900">Get Started</a>
                    <a href="#" className="py-3 px-2 text-sm font-medium text-green-600 border-b-2 border-green-600">Card Designer</a>
                    <a href="#" className="py-3 px-2 text-sm font-medium text-gray-500 hover:text-gray-900">My Designs</a>
                    <a href="#" className="py-3 px-2 text-sm font-medium text-gray-500 hover:text-gray-900">My Members</a>
                </nav>
            </div>
        </div>
    </header>
  );
}
