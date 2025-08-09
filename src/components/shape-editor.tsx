
"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import type { ShapeElement } from "@/types";
import { Square, Circle, Triangle, Minus } from "lucide-react";

interface ShapeEditorProps {
  shapeElements: ShapeElement[];
  setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
}

const ShapeButton = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full p-4 space-y-2 text-center bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
    >
      <Icon className="w-8 h-8 text-gray-600" />
      <span className="text-sm font-medium text-gray-800">{label}</span>
    </button>
);


export default function ShapeEditor({ shapeElements, setShapeElements }: ShapeEditorProps) {
  const addShapeElement = (type: ShapeElement['type']) => {
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
    };
    setShapeElements([...shapeElements, newElement]);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 gap-4">
            <ShapeButton icon={Square} label="Square" onClick={() => addShapeElement("rectangle")} />
            <ShapeButton icon={Circle} label="Circle" onClick={() => addShapeElement("circle")} />
            <ShapeButton icon={Triangle} label="Triangle" onClick={() => addShapeElement("triangle")} />
            <ShapeButton icon={Minus} label="Line" onClick={() => addShapeElement("line")} />
       </div>
    </div>
  );
}
