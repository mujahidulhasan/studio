"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import type { Template, SlotPunch } from "@/types";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

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

interface OptionCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    selected: boolean;
}

const OptionCard = ({ label, icon, selected, ...props }: OptionCardProps) => (
    <Button
        variant="outline"
        className={cn(
            "h-auto w-full justify-start p-3 flex-col items-center gap-2 text-center",
            "border-2 transition-all",
            selected ? "border-primary ring-2 ring-primary bg-primary/10" : "border-border hover:border-primary/50"
        )}
        {...props}
    >
        {selected && <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />}
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </Button>
)

interface TemplateSelectorProps {
  selectedTemplate: Template;
  onSelectTemplate: (template: Template) => void;
  slotPunch: SlotPunch;
  setSlotPunch: (slotPunch: SlotPunch) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, slotPunch, setSlotPunch }: TemplateSelectorProps) {
  const isVertical = selectedTemplate.width < selectedTemplate.height;

  const handleOrientationChange = (orientation: 'horizontal' | 'vertical') => {
      onSelectTemplate(orientation === 'vertical' ? verticalTemplate : horizontalTemplate);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Orientation</Label>
        <div className="grid grid-cols-2 gap-4">
            <OptionCard 
                label="Horizontal"
                selected={!isVertical}
                onClick={() => handleOrientationChange('horizontal')}
                icon={<div className="w-16 h-10 bg-muted rounded-sm"/>}
            />
            <OptionCard 
                label="Vertical"
                selected={isVertical}
                onClick={() => handleOrientationChange('vertical')}
                icon={<div className="w-10 h-16 bg-muted rounded-sm"/>}
            />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Backside Printing</Label>
        <RadioGroup defaultValue="no-back" className="grid grid-cols-3 gap-2">
            <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="no-back" className="sr-only"/>
                No Back
            </Label>
             <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="bw" className="sr-only"/>
                Black & White
            </Label>
             <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="color" className="sr-only"/>
                Full Color
            </Label>
        </RadioGroup>
        <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="duplicate-front" />
            <label htmlFor="duplicate-front" className="text-sm font-medium leading-none">
                Duplicate front on backside
            </label>
        </div>
      </div>
      
       <div className="space-y-2">
        <Label>Slot Punch</Label>
         <RadioGroup value={slotPunch} onValueChange={(value: SlotPunch) => setSlotPunch(value)} className="grid grid-cols-3 gap-2">
            <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="none" className="sr-only"/>
                None
            </Label>
             <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="short-side" className="sr-only"/>
                Short-Side
            </Label>
             <Label className="flex flex-col items-center justify-center rounded-md border p-3 text-center text-sm hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                <RadioGroupItem value="long-side" className="sr-only"/>
                Long-Side
            </Label>
        </RadioGroup>
      </div>
    </div>
  );
}
