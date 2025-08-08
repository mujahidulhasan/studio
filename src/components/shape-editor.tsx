"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import type { ShapeElement } from "@/types";

interface ShapeEditorProps {
  shapeElements: ShapeElement[];
  setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
}

export default function ShapeEditor({ shapeElements, setShapeElements }: ShapeEditorProps) {
  const addShapeElement = () => {
    const newElement: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: "rectangle",
      x: 25,
      y: 25,
      width: 50,
      height: 25,
      color: "#3B82F6",
    };
    setShapeElements([...shapeElements, newElement]);
  };

  const updateShapeElement = (id: string, newProps: Partial<ShapeElement>) => {
    setShapeElements(
      shapeElements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const removeShapeElement = (id: string) => {
    setShapeElements(shapeElements.filter((el) => el.id !== id));
  };

  return (
    <div className="space-y-6">
      <Button onClick={addShapeElement} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Rectangle
      </Button>
      <Accordion type="multiple" className="w-full space-y-2">
        {shapeElements.map((element, index) => (
          <AccordionItem key={element.id} value={element.id} className="border rounded-md px-4 bg-background">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              Rectangle {index + 1}
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor={`color-${element.id}`}>Color</Label>
                <Input
                  id={`color-${element.id}`}
                  type="color"
                  value={element.color}
                  onChange={(e) => updateShapeElement(element.id, { color: e.target.value })}
                  className="p-1 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Width: {element.width}%</Label>
                <Slider
                  value={[element.width]}
                  onValueChange={([value]) => updateShapeElement(element.id, { width: value })}
                  min={1} max={100} step={1}
                />
              </div>
               <div className="space-y-2">
                <Label>Height: {element.height}%</Label>
                <Slider
                  value={[element.height]}
                  onValueChange={([value]) => updateShapeElement(element.id, { height: value })}
                  min={1} max={100} step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Position (X, Y)</Label>
                <div className="space-y-2">
                   <Slider value={[element.x]} onValueChange={([value]) => updateShapeElement(element.id, { x: value })} />
                   <Slider value={[element.y]} onValueChange={([value]) => updateShapeElement(element.id, { y: value })} />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => removeShapeElement(element.id)}
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
