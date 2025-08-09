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
        <div className="flex rounded-md border border-input bg-background p-1">
            <Button 
                onClick={() => handleOrientationChange('horizontal')}
                variant={!isVertical ? 'secondary' : 'ghost'}
                className="flex-1 flex flex-col items-center h-auto py-2"
            >
                <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-8">
                    <rect x="1" y="1" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xs">Horizontal</span>
            </Button>
            <Button
                onClick={() => handleOrientationChange('vertical')}
                variant={isVertical ? 'secondary' : 'ghost'}
                className="flex-1 flex flex-col items-center h-auto py-2"
            >
                <svg width="20" height="32" viewBox="0 0 20 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1.5 h-8">
                     <rect x="1" y="1" width="18" height="30" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xs">Vertical</span>
            </Button>
        </div>
      </div>
    </div>
  );
}
