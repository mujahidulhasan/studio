
import React from "react";
import type { Dispatch, SetStateAction } from "react";
import CustomizeImagePanel from "@/components/customize-image-panel";
import CustomizeTextPanel from "@/components/customize-text-panel";
import CustomizeShapePanel from "@/components/customize-shape-panel";
import type { ImageElement, TextElement, ShapeElement } from "@/types";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface CustomizePanelProps {
    selectedElement: string | null;
    image: ImageElement;
    setImage: Dispatch<SetStateAction<ImageElement>>;
    textElements: TextElement[];
    setTextElements: Dispatch<SetStateAction<TextElement[]>>;
    shapeElements: ShapeElement[];
    setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
    onClose: () => void;
}

export default function CustomizePanel({ selectedElement, image, setImage, textElements, setTextElements, shapeElements, setShapeElements, onClose }: CustomizePanelProps) {
    
    const getPanelTitle = () => {
        if (!selectedElement) return "";
        if (selectedElement.startsWith('image')) return "Customize Image";
        if (selectedElement.startsWith('text')) return "Customize Text";
        if (selectedElement.startsWith('shape')) return "Customize Shape";
        return "Customize";
    }

    const selectedTextElement = selectedElement && selectedElement.startsWith('text-')
        ? textElements.find(el => el.id === selectedElement)
        : null;

    const selectedShapeElement = selectedElement && selectedElement.startsWith('shape-')
        ? shapeElements.find(el => el.id === selectedElement)
        : null;

    const handleUpdateText = (updatedElement: TextElement) => {
        setTextElements(prev => prev.map(el => el.id === updatedElement.id ? updatedElement : el));
    }

    const handleUpdateShape = (updatedElement: ShapeElement) => {
        setShapeElements(prev => prev.map(el => el.id === updatedElement.id ? updatedElement : el));
    }
    
    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{getPanelTitle()}</h2>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                    <X className="w-4 h-4"/>
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {selectedElement === 'image' && (
                    <CustomizeImagePanel image={image} setImage={setImage} />
                )}
                {selectedTextElement && (
                    <CustomizeTextPanel
                        element={selectedTextElement}
                        onUpdate={handleUpdateText}
                    />
                )}
                {selectedShapeElement && (
                    <CustomizeShapePanel
                        element={selectedShapeElement}
                        onUpdate={handleUpdateShape}
                    />
                )}
            </div>
        </div>
    );
}
