
"use client";

import React from "react";
import type { ShapeElement } from "@/types";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface CustomizeShapePanelProps {
    element: ShapeElement;
    onUpdate: (updatedElement: ShapeElement) => void;
}

const NumberInputWithSteppers = ({ value, onChange, min, max, step = 1 }: { value: number, onChange: (val: number) => void, min?: number, max?: number, step?: number }) => {
    const handleChange = (newValue: number) => {
        let finalValue = newValue;
        if (min !== undefined) finalValue = Math.max(min, finalValue);
        if (max !== undefined) finalValue = Math.min(max, finalValue);
        onChange(finalValue);
    }
    return (
        <div className="flex items-center gap-1">
            <Input type="number" value={value} onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)} className="w-20 text-center" />
            <div className="flex flex-col">
                <button onClick={() => handleChange(value + step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black">+</button>
                <button onClick={() => handleChange(value - step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black">-</button>
            </div>
        </div>
    )
}

export default function CustomizeShapePanel({ element, onUpdate }: CustomizeShapePanelProps) {
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2 border rounded-md p-1">
                     <Input
                        type="color"
                        value={element.color}
                        onChange={(e) => onUpdate({...element, color: e.target.value})}
                        className="p-0 h-8 w-8 border-none"
                     />
                     <span>{element.color}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Transparency</Label>
                    <NumberInputWithSteppers value={element.transparency || 0} onChange={(val) => onUpdate({...element, transparency: val})} min={0} max={100} />
                </div>
                <Slider
                    value={[element.transparency || 0]}
                    onValueChange={([value]) => onUpdate({...element, transparency: value})}
                    min={0} max={100} step={1}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Rotation</Label>
                    <NumberInputWithSteppers value={element.rotation || 0} onChange={(val) => onUpdate({...element, rotation: val})} min={0} max={360} />
                </div>
                <Slider
                    value={[element.rotation || 0]}
                    onValueChange={([value]) => onUpdate({...element, rotation: val})}
                    min={0} max={360} step={1}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>W</Label>
                    <NumberInputWithSteppers value={Math.round(element.width)} onChange={v => onUpdate({...element, width: v})} />
                </div>
                 <div className="space-y-2">
                    <Label>H</Label>
                    <NumberInputWithSteppers value={Math.round(element.height)} onChange={v => onUpdate({...element, height: v})} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>X</Label>
                    <NumberInputWithSteppers value={Math.round(element.x)} onChange={v => onUpdate({...element, x: v})} />
                </div>
                 <div className="space-y-2">
                    <Label>Y</Label>
                    <NumberInputWithSteppers value={Math.round(element.y)} onChange={v => onUpdate({...element, y: v})} />
                </div>
            </div>
        </div>
    );
}
