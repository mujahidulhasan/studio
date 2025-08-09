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
        <div className="flex rounded-md border border-input">
            <Button 
                onClick={() => handleOrientationChange('horizontal')}
                variant={!isVertical ? 'secondary' : 'ghost'}
                className="flex-1 rounded-r-none border-r"
            >
                <div className="w-8 h-5 bg-foreground/20 rounded-sm mr-2"/>
                Horizontal
            </Button>
            <Button
                onClick={() => handleOrientationChange('vertical')}
                variant={isVertical ? 'secondary' : 'ghost'}
                className="flex-1 rounded-l-none"
            >
                <div className="w-5 h-8 bg-foreground/20 rounded-sm mr-2"/>
                Vertical
            </Button>
        </div>
      </div>
    </div>
  );
}
