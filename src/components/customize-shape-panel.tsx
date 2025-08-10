
"use client";

import React from "react";
import type { ShapeElement } from "@/types";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface CustomizeShapePanelProps {
    element: ShapeElement;
    onUpdate: (updatedElement: ShapeElement) => void;
}

const NumberInputWithSteppers = ({ value, onChange, min, max, step = 1 }: { value: number, onChange: (val: number) => void, min?: number, max?: number, step?: number }) => {
    const handleChange = (newValue: number) => {
        let finalValue = isNaN(newValue) ? 0 : newValue;
        if (min !== undefined) finalValue = Math.max(min, finalValue);
        if (max !== undefined) finalValue = Math.min(max, finalValue);
        onChange(finalValue);
    }
    return (
        <div className="flex items-center gap-1">
            <Input type="number" value={value} onChange={(e) => handleChange(parseInt(e.target.value, 10))} className="w-16 h-8 text-center" />
            <div className="flex flex-col">
                <button onClick={() => handleChange(value + step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black border rounded-sm">+</button>
                <button onClick={() => handleChange(value - step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black border rounded-sm">-</button>
            </div>
        </div>
    )
}

export default function CustomizeShapePanel({ element, onUpdate }: CustomizeShapePanelProps) {
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Line Thickness</Label>
                    <NumberInputWithSteppers value={element.strokeWidth} onChange={(val) => onUpdate({...element, strokeWidth: val})} min={0} max={50} />
                </div>
                <Slider
                    value={[element.strokeWidth]}
                    onValueChange={([value]) => onUpdate({...element, strokeWidth: value})}
                    min={0} max={50} step={1}
                />
            </div>

             <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Line Color</Label>
                    <div className="flex items-center gap-2 border rounded-md p-1 pl-2">
                        <Input
                            type="text"
                            value={element.strokeColor}
                            onChange={(e) => onUpdate({...element, strokeColor: e.target.value})}
                            className="w-24 h-8"
                        />
                        <Input
                            type="color"
                            value={element.strokeColor}
                            onChange={(e) => onUpdate({...element, strokeColor: e.target.value})}
                            className="p-0 h-8 w-8 border-none"
                        />
                    </div>
                </div>
            </div>
            
            {element.type !== 'line' && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Fill Color</Label>
                        <div className="flex items-center gap-2 border rounded-md p-1 pl-2">
                            <Input
                                type="text"
                                value={element.fillColor}
                                onChange={(e) => onUpdate({...element, fillColor: e.target.value})}
                                className="w-24 h-8"
                            />
                            <Input
                                type="color"
                                value={element.fillColor}
                                onChange={(e) => onUpdate({...element, fillColor: e.target.value})}
                                className="p-0 h-8 w-8 border-none"
                            />
                        </div>
                    </div>
                </div>
            )}
            
            <Separator/>

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
                    <NumberInputWithSteppers value={Math.round(element.rotation || 0)} onChange={(val) => onUpdate({...element, rotation: val})} min={0} max={360} />
                </div>
                <Slider
                    value={[element.rotation || 0]}
                    onValueChange={([value]) => onUpdate({...element, rotation: val})}
                    min={0} max={360} step={1}
                />
            </div>

            <Separator/>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex justify-between items-center">
                    <Label className="w-4">W</Label>
                    <NumberInputWithSteppers value={Math.round(element.width)} onChange={v => onUpdate({...element, width: v})} />
                </div>
                 <div className="space-y-2 flex justify-between items-center">
                    <Label className="w-4">H</Label>
                    <NumberInputWithSteppers value={Math.round(element.height)} onChange={v => onUpdate({...element, height: v})} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex justify-between items-center">
                    <Label className="w-4">X</Label>
                    <NumberInputWithSteppers value={Math.round(element.x)} onChange={v => onUpdate({...element, x: v})} />
                </div>
                 <div className="space-y-2 flex justify-between items-center">
                    <Label className="w-4">Y</Label>
                    <NumberInputWithSteppers value={Math.round(element.y)} onChange={v => onUpdate({...element, y: v})} />
                </div>
            </div>
        </div>
    );
}
