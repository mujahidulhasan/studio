
"use client";

import React from "react";
import type { TextElement } from "@/types";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface CustomizeTextPanelProps {
    element: TextElement;
    onUpdate: (updatedElement: TextElement) => void;
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

const fonts = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Open Sans"
]

export default function CustomizeTextPanel({ element, onUpdate }: CustomizeTextPanelProps) {
    
    return (
        <div className="space-y-4">
            <div>
                <Label>Add Text</Label>
                <Textarea 
                    value={element.content} 
                    onChange={(e) => onUpdate({ ...element, content: e.target.value })}
                    placeholder="Enter text here..."
                />
            </div>
             <div>
                <Label>Insert Smart Field</Label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Smart field..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fullName">Full Name</SelectItem>
                        <SelectItem value="firstName">First Name</SelectItem>
                        <SelectItem value="lastName">Last Name</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Text Style</Label>
                <div className="flex items-center gap-2">
                    <Select value={element.fontFamily} onValueChange={v => onUpdate({...element, fontFamily: v})}>
                        <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fonts.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <NumberInputWithSteppers value={element.fontSize} onChange={v => onUpdate({...element, fontSize: v})} min={1}/>
                </div>
                 <div className="flex items-center gap-2 border rounded-md p-1">
                     <Input
                        type="color"
                        value={element.color}
                        onChange={(e) => onUpdate({...element, color: e.target.value})}
                        className="p-0 h-8 w-8 border-none"
                     />
                     <Button variant={element.isBold ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, isBold: !element.isBold})}>
                         <Bold className="h-4 w-4"/>
                     </Button>
                     <Button variant={element.isItalic ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, isItalic: !element.isItalic})}>
                         <Italic className="h-4 w-4"/>
                     </Button>
                     <Button variant={element.isUnderline ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, isUnderline: !element.isUnderline})}>
                         <Underline className="h-4 w-4"/>
                     </Button>
                     <Button variant={element.align === 'left' ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, align: 'left'})}>
                         <AlignLeft className="h-4 w-4"/>
                     </Button>
                     <Button variant={element.align === 'center' ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, align: 'center'})}>
                         <AlignCenter className="h-4 w-4"/>
                     </Button>
                     <Button variant={element.align === 'right' ? "secondary" : "ghost"} size="icon" onClick={() => onUpdate({...element, align: 'right'})}>
                         <AlignRight className="h-4 w-4"/>
                     </Button>
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
                    onValueChange={([value]) => onUpdate({...element, rotation: value})}
                    min={0} max={360} step={1}
                />
            </div>
        </div>
    );
}
