"use client";

import React, { useState, useRef, useCallback } from "react";
import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";
import { templates } from "@/components/template-selector";
import Header from "@/components/header";
import EditorPanel from "@/components/editor-panel";
import IdCardPreview from "@/components/id-card-preview";
import CustomizePanel from "@/components/customize-panel";
import { Button } from "@/components/ui/button";
import { Download, PanelLeft, LayoutTemplate, Image as ImageIcon, Type, Shapes, Shield, Badge, Wand2, X } from "lucide-react";
import { downloadAsSvg } from "@/lib/download";
import { cn } from "@/lib/utils";


const toolConfig = [
    { id: "template", icon: LayoutTemplate, label: "Card Options" },
    { id: "text", icon: Type, label: "Text" },
    { id: "photo", icon: ImageIcon, label: "Images" },
    { id: "shapes", icon: Shapes, label: "Shapes" },
    { id: "security", icon: Shield, label: "Security", disabled: true },
    { id: "accessories", icon: Badge, label: "Accessories", disabled: true },
];

export default function Home() {
  const [template, setTemplate] = useState<Template>(templates[0]);
  const [image, setImage] = useState<ImageElement>({
    src: "https://placehold.co/150x150.png",
    x: 50,
    y: 50,
    width: 30, // Default width as percentage of card width
    height: 40, // Default height as percentage of card height
    scale: 100,
    rotation: 0,
    transparency: 0,
    borderSize: 0,
    borderColor: "#000000"
  });
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "name",
      content: "Jane Doe",
      x: 50,
      y: 70,
      fontSize: 20,
      fontFamily: "Open Sans",
      fontWeight: 700,
      color: "#000000",
    },
    {
      id: "title",
      content: "Software Engineer",
      x: 50,
      y: 80,
      fontSize: 14,
      fontFamily: "Open Sans",
      fontWeight: 400,
      color: "#333333",
    },
  ]);
  const [shapeElements, setShapeElements] = useState<ShapeElement[]>([]);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string | null>('template');
  const [selectedElement, setSelectedElement] = useState<string | null>('image');
  const [isBackside, setIsBackside] = useState(false);


  const handleDownload = useCallback(async () => {
    if (idCardRef.current) {
      await downloadAsSvg(template, image, textElements, shapeElements);
    }
  }, [template, image, textElements, shapeElements]);

  const currentToolConfig = toolConfig.find(t => t.id === activeTool);
  const isCustomizePanelOpen = !!selectedElement;

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Icon Strip */}
        <div className="w-16 h-full bg-card flex flex-col items-center py-4 space-y-1 border-r z-20">
          {toolConfig.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(activeTool === tool.id && !tool.disabled ? null : tool.id)
                setSelectedElement(null)
              }}
              disabled={tool.disabled}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg w-14 h-14 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                activeTool === tool.id && !isCustomizePanelOpen ? "bg-primary/20 text-primary" : "hover:bg-accent/50"
              )}
            >
              <tool.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{tool.label}</span>
            </button>
          ))}
           <button
              key="customize"
              onClick={() => {
                setActiveTool(null)
                setSelectedElement(selectedElement ? null : 'image' /* default to image for now */)
              }}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg w-14 h-14 transition-colors",
                isCustomizePanelOpen ? "bg-green-600 text-white" : "hover:bg-accent/50"
              )}
            >
              <Wand2 className="w-6 h-6" />
              <span className="text-xs mt-1">Customize</span>
            </button>
        </div>
        
        <div className="relative flex-1">
            {/* Tool Panel */}
            <div className={cn(
                "absolute top-0 left-0 h-full bg-card border-r transition-transform duration-300 ease-in-out overflow-y-auto z-10",
                activeTool && !isCustomizePanelOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"
            )}>
                {activeTool && !isCustomizePanelOpen && (
                     <div className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{currentToolConfig?.label}</h2>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveTool(null)}>
                                <X className="w-4 h-4"/>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <EditorPanel
                                activeTab={activeTool}
                                template={template}
                                setTemplate={setTemplate}
                                image={image}
                                setImage={setImage}
                                textElements={textElements}
                                setTextElements={setTextElements}
                                shapeElements={shapeElements}
                                setShapeElements={setShapeElements}
                            />
                        </div>
                     </div>
                )}
            </div>

            {/* Customize Panel */}
            <div className={cn(
                "absolute top-0 left-0 h-full bg-card border-r transition-transform duration-300 ease-in-out overflow-y-auto z-10",
                isCustomizePanelOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"
            )}>
                {isCustomizePanelOpen && (
                     <CustomizePanel
                        selectedElement={selectedElement}
                        image={image}
                        setImage={setImage}
                        onClose={() => setSelectedElement(null)}
                     />
                )}
            </div>

            {/* Workspace */}
            <main className="w-full h-full flex flex-col items-center justify-center gap-6 p-4 md:p-8 bg-muted/40">
                <IdCardPreview
                    ref={idCardRef}
                    template={template}
                    image={image}
                    setImage={setImage}
                    textElements={textElements}
                    shapeElements={shapeElements}
                    slotPunch={'none'}
                    isBackside={isBackside}
                    onImageSelect={() => {
                        setActiveTool(null);
                        setSelectedElement('image');
                    }}
                />
                <div className="flex items-center gap-4">
                   <div className="flex items-center bg-muted rounded-lg p-1">
                        <Button onClick={() => setIsBackside(false)} size="sm" className={cn(!isBackside ? 'bg-background shadow' : 'bg-transparent text-muted-foreground')}>Front Side</Button>
                        <Button onClick={() => setIsBackside(true)} size="sm" className={cn(isBackside ? 'bg-background shadow' : 'bg-transparent text-muted-foreground')}>Back Side</Button>
                   </div>
                    <Button onClick={handleDownload} size="lg">
                        <Download className="mr-2 h-5 w-5" />
                        Download ID
                    </Button>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
