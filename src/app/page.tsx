
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
import Toolbar from "@/components/toolbar";
import { useHistoryState } from "@/hooks/use-history-state";
import { ScrollArea } from "@/components/ui/scroll-area";


const toolConfig = [
    { id: "template", icon: LayoutTemplate, label: "Templates" },
    { id: "text", icon: Type, label: "Text" },
    { id: "photo", icon: ImageIcon, label: "Images" },
    { id: "shapes", icon: Shapes, label: "Shapes" },
    { id: "security", icon: Shield, label: "Security", disabled: true },
    { id: "accessories", icon: Badge, label: "Accessories", disabled: true },
];

export default function Home() {
  const [template, setTemplate, templateHistory] = useHistoryState<Template>(templates[0]);
  const [image, setImage, imageHistory] = useHistoryState<ImageElement>({
    id: "image",
    src: "https://placehold.co/150x150.png",
    x: 50,
    y: 50,
    width: 30, // Default width as percentage of card width
    height: 40, // Default height as percentage of card height
    scale: 1,
    rotation: 0,
    transparency: 0,
    borderSize: 0,
    borderColor: "#000000",
    isLocked: false,
  });
  const [textElements, setTextElements, textHistory] = useHistoryState<TextElement[]>([
    {
      id: "text-name",
      content: "Jane Doe",
      x: 50,
      y: 70,
      fontSize: 20,
      fontFamily: "Open Sans",
      fontWeight: 700,
      color: "#000000",
      rotation: 0,
      transparency: 0,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      align: 'center',
      isLocked: false,
    },
    {
      id: "text-title",
      content: "Software Engineer",
      x: 50,
      y: 80,
      fontSize: 14,
      fontFamily: "Open Sans",
      fontWeight: 400,
      color: "#333333",
      rotation: 0,
      transparency: 0,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      align: 'center',
      isLocked: false,
    },
  ]);
  const [shapeElements, setShapeElements, shapeHistory] = useHistoryState<ShapeElement[]>([]);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string | null>('template');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isCustomizePanelOpen, setIsCustomizePanelOpen] = useState(false);
  const [userClosedCustomizePanel, setUserClosedCustomizePanel] = useState(false);
  const [isBackside, setIsBackside] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const history = {
      undo: () => {
          templateHistory.undo();
          imageHistory.undo();
          textHistory.undo();
          shapeHistory.undo();
      },
      redo: () => {
          templateHistory.redo();
          imageHistory.redo();
          textHistory.redo();
          shapeHistory.redo();
      },
      canUndo: templateHistory.canUndo || imageHistory.canUndo || textHistory.canUndo || shapeHistory.canUndo,
      canRedo: templateHistory.canRedo || imageHistory.canRedo || textHistory.canRedo || shapeHistory.canRedo
  }

  useEffect(() => {
    // Open customize panel automatically when a new element is selected,
    // but only if the user hasn't manually closed it for this element.
    if (selectedElement && !userClosedCustomizePanel) {
        setActiveTool(null);
        setIsCustomizePanelOpen(true);
    }
  }, [selectedElement, userClosedCustomizePanel]);

  useEffect(() => {
    if (activeTool) {
        setSelectedElement(null);
        setIsCustomizePanelOpen(false);
    }
  }, [activeTool]);


  const handleDownload = useCallback(async () => {
    if (idCardRef.current) {
      await downloadAsSvg(template, image, textElements, shapeElements);
    }
  }, [template, image, textElements, shapeElements]);

  const handleSelectElement = (elementId: string | null) => {
    if (elementId === selectedElement) return;
    
    setUserClosedCustomizePanel(false); // Reset when new element is selected
    
    if (elementId) {
        const element = getElementById(elementId);
        if (element) {
          setSelectedElement(elementId);
        }
    } else {
        setSelectedElement(null);
    }
  }

  const getElementById = (id: string) => {
    if (id === 'image') return image;
    if (id.startsWith('text-')) return textElements.find(el => el.id === id);
    if (id.startsWith('shape-')) return shapeElements.find(el => el.id === id);
    return null;
  }

  const handleDeleteSelected = () => {
    if (!selectedElement) return;

    if (selectedElement.startsWith('text-')) {
        setTextElements(prev => prev.filter(el => el.id !== selectedElement));
    } else if (selectedElement.startsWith('shape-')) {
        setShapeElements(prev => prev.filter(el => el.id !== selectedElement));
    } else if (selectedElement === 'image') {
        // We can't delete the main image, but we can clear it
        setImage(prev => ({...prev, src: null}));
    }
    setSelectedElement(null);
  }

  const handleDuplicateSelected = () => {
    if (!selectedElement) return;
    const newId = `${selectedElement.split('-')[0]}-${Date.now()}`;

    if (selectedElement.startsWith('text-')) {
        const el = textElements.find(e => e.id === selectedElement);
        if (el) setTextElements(prev => [...prev, {...el, id: newId, y: el.y + 5}]);
    } else if (selectedElement.startsWith('shape-')) {
        const el = shapeElements.find(e => e.id === selectedElement);
        if (el) setShapeElements(prev => [...prev, {...el, id: newId, y: el.y + 5}]);
    } else if (selectedElement === 'image') {
       // Cannot duplicate the primary image element
    }
  }

  const handleLayerChange = (direction: 'forward' | 'backward') => {
      if (!selectedElement) return;

      const move = (arr: any[], index: number, offset: number) => {
          const newIndex = index + offset;
          if (newIndex < 0 || newIndex >= arr.length) return arr;
          const newArr = [...arr];
          const [item] = newArr.splice(index, 1);
          newArr.splice(newIndex, 0, item);
          return newArr;
      }

      if (selectedElement.startsWith('text-')) {
          const index = textElements.findIndex(e => e.id === selectedElement);
          if (index > -1) {
              const offset = direction === 'forward' ? 1 : -1;
              setTextElements(move(textElements, index, offset));
          }
      } else if (selectedElement.startsWith('shape-')) {
          const index = shapeElements.findIndex(e => e.id === selectedElement);
          if (index > -1) {
              const offset = direction === 'forward' ? 1 : -1;
              setShapeElements(move(shapeElements, index, offset));
          }
      }
  }

  const handleLockSelected = () => {
    if (!selectedElement) return;
    const element = getElementById(selectedElement);
    if (!element) return;

    const toggleLock = (el: any) => ({ ...el, isLocked: !el.isLocked });

    if (selectedElement === 'image') {
        setImage(toggleLock);
    } else if (selectedElement.startsWith('text-')) {
        setTextElements(prev => prev.map(el => el.id === selectedElement ? toggleLock(el) : el));
    } else if (selectedElement.startsWith('shape-')) {
        setShapeElements(prev => prev.map(el => el.id === selectedElement ? toggleLock(el) : el));
    }
  }

  const closeCustomizePanel = () => {
    setIsCustomizePanelOpen(false);
    setUserClosedCustomizePanel(true);
  }

  const handleDeselectAll = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('#id-card-preview-container') || target.closest('#customize-panel') || target.closest('#icon-strip') || target.closest('[data-radix-popper-content-wrapper]') || target.closest('#toolbar')) {
        const cardPreview = (target.closest('#id-card-preview-container') || target.id === 'id-card-preview-container');
        const clickedOnElement = target.closest('[data-element-id]');
        if (cardPreview && !clickedOnElement) {
             handleSelectElement(null);
        }
        return;
    }
    handleSelectElement(null);
  }

  const currentToolConfig = toolConfig.find(t => t.id === activeTool);

  const isElementLocked = selectedElement ? getElementById(selectedElement)?.isLocked : false;


  return (
    <div className="flex flex-col min-h-screen bg-background font-body" onClick={handleDeselectAll}>
      <Header />
       <Toolbar
          onUndo={history.undo}
          onRedo={history.redo}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onToggleGrid={() => setShowGrid(!showGrid)}
          isGridVisible={showGrid}
          onDownload={handleDownload}
          selectedElementId={selectedElement}
          onDelete={handleDeleteSelected}
          onDuplicate={handleDuplicateSelected}
          onLayerChange={handleLayerChange}
          onLock={handleLockSelected}
          isElementLocked={isElementLocked}
        />
      <div className="flex flex-1">
        {/* Icon Strip */}
        <div id="icon-strip" className="w-20 bg-card border-r z-20">
            <div className="flex flex-col items-center py-4 space-y-1">
              {toolConfig.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(activeTool === tool.id && !tool.disabled ? null : tool.id);
                    setSelectedElement(null);
                  }}
                  disabled={tool.disabled}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    activeTool === tool.id ? "bg-primary text-primary-foreground" : "hover:bg-accent/50"
                  )}
                >
                  <tool.icon className="w-6 h-6" />
                  <span className="text-xs mt-1 text-center">{tool.label}</span>
                </button>
              ))}
               <button
                  key="customize"
                   onClick={() => {
                    if (selectedElement) {
                        setIsCustomizePanelOpen(!isCustomizePanelOpen);
                         if (isCustomizePanelOpen) {
                            setUserClosedCustomizePanel(true);
                        } else {
                            setUserClosedCustomizePanel(false);
                        }
                    }
                  }}
                  disabled={!selectedElement || isElementLocked}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg w-16 h-16 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    isCustomizePanelOpen && selectedElement ? "bg-primary text-primary-foreground" : "hover:bg-accent/50"
                  )}
                >
                  <Wand2 className="w-6 h-6" />
                  <span className="text-xs mt-1">Customize</span>
                </button>
              </div>
        </div>
        
        <div className="relative flex-1 flex flex-col">
            {/* Tool Panel */}
            <div className={cn(
                "absolute top-0 left-0 h-full bg-card border-r transition-transform duration-300 ease-in-out overflow-y-auto z-10",
                activeTool ? "translate-x-0 w-80" : "-translate-x-full w-80"
            )}>
                {activeTool && (
                     <div className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{currentToolConfig?.label}</h2>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveTool(null)}>
                                <X className="w-4 h-4"/>
                            </Button>
                        </div>
                         <div className="border-t -mx-4 mb-4"></div>
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
            <div id="customize-panel" className={cn(
                "absolute top-0 left-0 h-full bg-card border-r transition-transform duration-300 ease-in-out overflow-y-auto z-10",
                isCustomizePanelOpen && selectedElement ? "translate-x-0 w-80" : "-translate-x-full w-80"
            )}>
                {isCustomizePanelOpen && selectedElement && (
                     <CustomizePanel
                        selectedElement={selectedElement}
                        image={image}
                        setImage={setImage}
                        textElements={textElements}
                        setTextElements={setTextElements}
                        shapeElements={shapeElements}
                        setShapeElements={setShapeElements}
                        onClose={closeCustomizePanel}
                     />
                )}
            </div>

            {/* Workspace */}
            <main className="w-full h-full flex flex-col items-center justify-start gap-6 bg-muted/40 pt-8">
                
                <div className="flex-1 flex flex-col justify-center items-center pb-8">
                    <IdCardPreview
                        ref={idCardRef}
                        template={template}
                        image={image}
                        setImage={setImage}
                        textElements={textElements}
                        setTextElements={setTextElements}
                        shapeElements={shapeElements}
                        setShapeElements={setShapeElements}
                        slotPunch={'none'}
                        isBackside={isBackside}
                        selectedElement={selectedElement}
                        onSelectElement={handleSelectElement}
                        showGrid={showGrid}
                    />
                    <div className="flex items-center gap-4 mt-6">
                       <div className="flex items-center bg-muted rounded-lg p-1">
                            <Button onClick={() => setIsBackside(false)} size="sm" className={cn(!isBackside ? 'bg-background shadow' : 'bg-transparent text-muted-foreground')}>Front</Button>
                            <Button onClick={() => setIsBackside(true)} size="sm" className={cn(isBackside ? 'bg-background shadow' : 'bg-transparent text-muted-foreground')}>Back</Button>
                       </div>
                    </div>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
