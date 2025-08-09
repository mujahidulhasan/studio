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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Orientation</Label>
        <div className="flex rounded-md border border-input bg-background p-1 group">
            <Button
                onClick={() => handleOrientationChange('horizontal')}
                variant={!isVertical ? 'secondary' : 'ghost'}
                className="flex-1 flex flex-col items-center h-auto py-2 text-gray-500 hover:bg-white [&>svg]:hover:stroke-[#4bb058] hover:text-[#4bb058]"
            >
                <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-10 stroke-[#c0c5ca] transition-colors">
                    <rect x="2" y="2" width="36" height="24" rx="2" strokeWidth="6"/>
                </svg>
                <span className="text-xs">Horizontal</span>
            </Button>
            <Button
                onClick={() => handleOrientationChange('vertical')}
                variant={isVertical ? 'secondary' : 'ghost'}
                className="flex-1 flex flex-col items-center h-auto py-2 text-gray-500 hover:bg-white [&>svg]:hover:stroke-[#4bb058] hover:text-[#4bb058]"
            >
                <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-10 stroke-[#c0c5ca] transition-colors">
                     <rect x="2" y="2" width="24" height="36" rx="2" strokeWidth="6"/>
                </svg>
                <span className="text-xs">Vertical</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
