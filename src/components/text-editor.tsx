
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Type, AlignLeft, User, PenSquare, Bookmark, MoreHorizontal, HelpCircle } from "lucide-react";
import type { TextElement } from "@/types";

interface TextEditorProps {
  textElements: TextElement[];
  setTextElements: Dispatch<SetStateAction<TextElement[]>>;
}

const OptionButton = ({ icon: Icon, label, onClick, fullWidth = false }: { icon: React.ElementType, label: string, onClick?: () => void, fullWidth?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center w-full p-4 space-x-2 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      ${fullWidth ? 'col-span-2' : ''}
    `}
  >
    <Icon className="w-6 h-6 text-gray-600" />
    <span className="font-medium text-gray-800">{label}</span>
  </button>
);

const VariableOptionButton = ({ icon: Icon, label, onClick, fullWidth = false }: { icon: React.ElementType, label: string, onClick?: () => void, fullWidth?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full p-3 space-y-1 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      ${fullWidth ? 'col-span-2' : ''}
    `}
  >
    <Icon className="w-6 h-6 text-gray-600" />
    <span className="text-sm font-medium text-gray-800">{label}</span>
  </button>
);


export default function TextEditor({ textElements, setTextElements }: TextEditorProps) {
  const addTextElement = (content: string) => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      content: content,
      x: 50,
      y: 50,
      fontSize: 16,
      fontFamily: "Open Sans",
      fontWeight: 400,
      color: "#000000",
    };
    setTextElements([...textElements, newElement]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3">Static Text</h3>
        <div className="grid grid-cols-2 gap-4">
            <OptionButton icon={Type} label="Single Line" onClick={() => addTextElement("Single Line")} />
            <OptionButton icon={AlignLeft} label="Multi Line Text" onClick={() => addTextElement("Multi\nLine")} />
        </div>
      </div>
      <div>
        <div className="flex items-center mb-3">
            <h3 className="text-md font-semibold text-gray-800">Variable Text</h3>
            <HelpCircle className="w-4 h-4 text-gray-400 ml-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <VariableOptionButton icon={User} label="Full Name" onClick={() => addTextElement("{{fullName}}")} />
            <VariableOptionButton icon={PenSquare} label="First Name" onClick={() => addTextElement("{{firstName}}")} />
            <VariableOptionButton icon={PenSquare} label="Last Name" onClick={() => addTextElement("{{lastName}}")} />
            <VariableOptionButton icon={Bookmark} label="Title" onClick={() => addTextElement("{{title}}")} />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex flex-col items-center justify-center w-full p-3 space-y-1 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
                        <MoreHorizontal className="w-6 h-6 text-gray-600" />
                        <span className="text-sm font-medium text-gray-800">More</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                <DropdownMenuItem onSelect={() => addTextElement("{{department}}")}>
                    Department
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => addTextElement("{{employeeId}}")}>
                    Employee ID
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
