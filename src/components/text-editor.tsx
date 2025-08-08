"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import type { TextElement } from "@/types";

interface TextEditorProps {
  textElements: TextElement[];
  setTextElements: Dispatch<SetStateAction<TextElement[]>>;
}

export default function TextEditor({ textElements, setTextElements }: TextEditorProps) {
  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      content: "New Text",
      x: 50,
      y: 50,
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: 400,
      color: "#000000",
    };
    setTextElements([...textElements, newElement]);
  };

  const updateTextElement = (id: string, newProps: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const removeTextElement = (id: string) => {
    setTextElements(textElements.filter((el) => el.id !== id));
  };

  return (
    <div className="space-y-6">
      <Button onClick={addTextElement} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Text Field
      </Button>
      <Accordion type="multiple" className="w-full space-y-2">
        {textElements.map((element, index) => (
          <AccordionItem key={element.id} value={element.id} className="border rounded-md px-4 bg-background">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              Text Field {index + 1}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor={`content-${element.id}`}>Content</Label>
                <Input
                  id={`content-${element.id}`}
                  value={element.content}
                  onChange={(e) => updateTextElement(element.id, { content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`color-${element.id}`}>Color</Label>
                  <Input
                    id={`color-${element.id}`}
                    type="color"
                    value={element.color}
                    onChange={(e) => updateTextElement(element.id, { color: e.target.value })}
                    className="p-1 h-10"
                  />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor={`font-weight-${element.id}`}>Weight</Label>
                    <Select
                        value={String(element.fontWeight)}
                        onValueChange={(value) => updateTextElement(element.id, { fontWeight: Number(value) })}
                    >
                        <SelectTrigger id={`font-weight-${element.id}`}>
                            <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="400">Regular</SelectItem>
                            <SelectItem value="700">Bold</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
              </div>
              <div className="space-y-2">
                <Label>Font Size: {element.fontSize}px</Label>
                <Slider
                  value={[element.fontSize]}
                  onValueChange={([value]) => updateTextElement(element.id, { fontSize: value })}
                  min={8} max={72} step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Position (X, Y)</Label>
                <div className="space-y-2">
                   <Slider value={[element.x]} onValueChange={([value]) => updateTextElement(element.id, { x: value })} />
                   <Slider value={[element.y]} onValueChange={([value]) => updateTextElement(element.id, { y: value })} />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => removeTextElement(element.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
