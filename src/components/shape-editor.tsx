
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import type { ShapeElement } from "@/types";
import { Square, Circle, Triangle, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShapeEditorProps {
  shapeElements: ShapeElement[];
  setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
}

const shapeTypes = [
    { type: 'rectangle' as const, label: 'Square', icon: Square },
    { type: 'circle' as const, label: 'Circle', icon: Circle },
    { type: 'triangle' as const, label: 'Triangle', icon: Triangle },
    { type: 'line' as const, label: 'Line', icon: Minus },
]

const ShapeButton = ({ icon: Icon, label, onClick, isActive }: { icon: React.ElementType, label: string, onClick?: () => void, isActive?: boolean }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full p-3 space-y-2 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
        isActive && "bg-primary/20 border-primary"
        )}
    >
      <Icon className="w-8 h-8 text-gray-600" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
);


export default function ShapeEditor({ shapeElements, setShapeElements }: ShapeEditorProps) {
  const [activeShapeType, setActiveShapeType] = useState<ShapeElement['type'] | null>(null);

  const addShapeElement = (type: ShapeElement['type']) => {
    setActiveShapeType(type);
    const newElement: ShapeElement = {
      id: `${type}-${Date.now()}`,
      type: type,
      x: 50,
      y: 50,
      width: type === 'line' ? 50 : 25,
      height: type === 'line' ? 1 : 25,
      fillColor: "#3B82F6",
      strokeColor: "#000000",
      strokeWidth: type === 'line' ? 2 : 0,
      rotation: 0,
      transparency: 0,
      isLocked: false,
    };
    setShapeElements([...shapeElements, newElement]);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 gap-4">
            {shapeTypes.map(shape => (
                 <ShapeButton 
                    key={shape.type}
                    icon={shape.icon} 
                    label={shape.label} 
                    onClick={() => addShapeElement(shape.type)}
                    isActive={activeShapeType === shape.type}
                />
            ))}
       </div>
    </div>
  );
}
