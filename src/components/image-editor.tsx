"use client";

import React, { useRef, type Dispatch, type SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadCloud, UserSquare, MoreHorizontal, HelpCircle } from "lucide-react";
import { imageTypes } from "@/lib/image-types";
import type { ImageElement } from "@/types";

interface ImageEditorProps {
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
}

const ImageTypeButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center w-full p-4 space-y-2 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
  >
    <Icon className="w-8 h-8 text-gray-600" />
    <span className="text-sm font-medium text-gray-800">{label}</span>
  </button>
);


export default function ImageEditor({ image, setImage }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImage((prev) => ({ ...prev, src: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-3">Static Images</h3>
        <ImageTypeButton
          icon={UploadCloud}
          label="Upload Image"
          onClick={handleUploadClick}
        />
      </div>

      <div>
        <div className="flex items-center mb-3">
          <h3 className="text-md font-semibold text-gray-800">Variable Images</h3>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ImageTypeButton
            icon={UserSquare}
            label="Headshot"
            onClick={handleUploadClick}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex flex-col items-center justify-center w-full p-4 space-y-2 text-center bg-primary text-primary-foreground border rounded-lg shadow-sm hover:bg-primary/90 cursor-pointer">
                    <MoreHorizontal className="w-8 h-8" />
                    <span className="text-sm font-medium">More Types</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {imageTypes.map((type) => (
                <DropdownMenuItem key={type.id} onSelect={() => console.log('Selected:', type.label)}>
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
