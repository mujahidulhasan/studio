"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Template } from "@/types";

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

interface TemplateSelectorProps {
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Choose a Template</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={cn(
              "cursor-pointer rounded-lg border-2 p-1 transition-all",
              selectedTemplate.id === template.id
                ? "border-primary ring-2 ring-primary"
                : "border-transparent hover:border-primary/50"
            )}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={template.previewUrl}
                  alt={template.name}
                  width={150}
                  height={94}
                  className="w-full h-auto object-cover"
                  data-ai-hint={template.dataAiHint}
                />
              </CardContent>
            </Card>
            <p className="text-center text-sm mt-2 font-medium">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
