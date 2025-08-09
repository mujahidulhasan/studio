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
        <div className="flex items-end gap-3 rounded-xl bg-gray-200 p-4">
            <div
                onClick={() => handleOrientationChange('horizontal')}
                className={cn(
                    "flex w-[100px] cursor-pointer flex-col items-center rounded-2xl bg-gray-200 p-3 transition-colors",
                    !isVertical && "bg-white text-[#4bb058]"
                )}
            >
                <div className={cn(
                    "mb-2.5 h-12 w-16 rounded-2xl border-4 border-[#999] transition-colors",
                    !isVertical && "border-[#4bb058]"
                )}></div>
                <span className="text-sm font-bold">Horizontal</span>
            </div>
            <div
                onClick={() => handleOrientationChange('vertical')}
                className={cn(
                  "flex w-[100px] cursor-pointer flex-col items-center rounded-2xl bg-gray-200 p-3 transition-colors",
                  isVertical && "bg-white text-[#4bb058]"
                )}
            >
                 <div className={cn(
                    "mb-2.5 h-16 w-12 rounded-2xl border-4 border-[#999] transition-colors",
                    isVertical && "border-[#4bb058]"
                )}></div>
                <span className="text-sm font-bold">Vertical</span>
            </div>
        </div>
      </div>
    </div>
  );
}
