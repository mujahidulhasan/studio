"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { Template } from "@/types";
import { Button } from "./ui/button";

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    width: 338,
    height: 213,
    previewUrl: "https://placehold.co/150x94.png",
    dataAiHint: "modern id card"
  },
  {
    id: "classic",
    name: "Classic",
    width: 338,
    height: 213,
    previewUrl: "https://placehold.co/150x94.png",
    dataAiHint: "classic id card"
  },
  {
    id: "vertical",
    name: "Vertical",
    width: 213,
    height: 338,
    previewUrl: "https://placehold.co/94x150.png",
    dataAiHint: "vertical id card"
  },
];

const horizontalTemplate = templates[0];
const verticalTemplate = templates[2];

interface TemplateSelectorProps {
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const isVertical = selectedTemplate.width < selectedTemplate.height;

  const handleOrientationChange = (orientation: 'horizontal' | 'vertical') => {
      onSelectTemplate(orientation === 'vertical' ? verticalTemplate : horizontalTemplate);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Orientation</Label>
        <div className="flex rounded-md border border-input bg-background p-1 group text-gray-500">
            <Button
                onClick={() => handleOrientationChange('horizontal')}
                variant={!isVertical ? 'secondary' : 'ghost'}
                className={cn("flex-1 flex flex-col items-center h-auto py-2 hover:bg-white [&>svg]:hover:stroke-[#4bb058] hover:text-[#4bb058]",
                    !isVertical && "bg-white text-[#4bb058] [&>svg]:stroke-[#4bb058]"
                )}
            >
                <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-8 stroke-[#c0c5ca] transition-colors">
                    <rect x="2" y="2" width="28" height="18" rx="2" strokeWidth="4"/>
                </svg>
                <span className="text-xs font-bold">Horizontal</span>
            </Button>
            <Button
                onClick={() => handleOrientationChange('vertical')}
                variant={isVertical ? 'secondary' : 'ghost'}
                className={cn("flex-1 flex flex-col items-center h-auto py-2 hover:bg-white [&>svg]:hover:stroke-[#4bb058] hover:text-[#4bb058]",
                    isVertical && "bg-white text-[#4bb058] [&>svg]:stroke-[#4bb058]"
                )}
            >
                <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-8 stroke-[#c0c5ca] transition-colors">
                     <rect x="2" y="2" width="18" height="28" rx="2" strokeWidth="4"/>
                </svg>
                <span className="text-xs font-bold">Vertical</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
