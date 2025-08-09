"use client";

import { cn } from "@/lib/utils";
import type { Template } from "@/types";
import { Separator } from "@/components/ui/separator";

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
      <div className="space-y-3">
        <div className="font-bold text-base text-black">Orientation</div>
        <div className="flex items-center gap-2">
            <div
                onClick={() => handleOrientationChange('horizontal')}
                className={cn(
                    "flex w-[80px] cursor-pointer flex-col items-center rounded-lg p-2 transition-colors",
                    !isVertical ? "bg-white text-[#4bb058]" : "bg-transparent text-gray-700 hover:bg-white/50"
                )}
            >
                <div className={cn(
                    "mb-1.5 h-[30px] w-[38px] rounded-md border-[3px]",
                     !isVertical ? "border-[#4bb058]" : "border-gray-400"
                )}></div>
                <span className="text-sm font-bold">Horizontal</span>
            </div>
            <div
                onClick={() => handleOrientationChange('vertical')}
                className={cn(
                  "flex w-[80px] cursor-pointer flex-col items-center rounded-lg p-2 transition-colors",
                  isVertical ? "bg-white text-[#4bb058]" : "bg-transparent text-gray-700 hover:bg-white/50"
                )}
            >
                 <div className={cn(
                    "mb-1.5 h-[38px] w-[24px] rounded-md border-[3px]",
                    isVertical ? "border-[#4bb058]" : "border-gray-400"
                )}></div>
                <span className="text-sm font-bold">Vertical</span>
            </div>
        </div>
      </div>
    </div>
  );
}
