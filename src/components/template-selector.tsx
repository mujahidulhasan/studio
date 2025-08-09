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
        <div className="font-medium text-sm text-black">Orientation</div>
        <Separator className="my-2" />
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <div
                onClick={() => handleOrientationChange('horizontal')}
                className={cn(
                    "flex-1 cursor-pointer flex-col items-center rounded-md p-2 transition-colors flex justify-center text-center",
                    !isVertical ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                )}
            >
                <div className={cn(
                    "mb-1.5 h-[30px] w-[38px] rounded-sm border-2 bg-white",
                     !isVertical ? "border-primary" : "border-gray-300"
                )}></div>
                <span className="text-xs font-semibold">Horizontal</span>
            </div>
            <div
                onClick={() => handleOrientationChange('vertical')}
                className={cn(
                  "flex-1 cursor-pointer flex-col items-center rounded-md p-2 transition-colors flex justify-center text-center",
                  isVertical ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:bg-background/50"
                )}
            >
                 <div className={cn(
                    "mb-1.5 h-[38px] w-[24px] rounded-sm border-2 bg-white",
                    isVertical ? "border-primary" : "border-gray-300"
                )}></div>
                <span className="text-xs font-semibold">Vertical</span>
            </div>
        </div>
      </div>
    </div>
  );
}
