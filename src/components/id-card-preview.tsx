
"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Template, ImageElement, TextElement, ShapeElement, SlotPunch } from "@/types";
import { Repeat } from "lucide-react";


interface IdCardPreviewProps {
  template: Template;
  image: ImageElement;
  setImage: React.Dispatch<React.SetStateAction<ImageElement>>;
  textElements: TextElement[];
  shapeElements: ShapeElement[];
  slotPunch: SlotPunch;
  isBackside: boolean;
  isSelected: boolean;
  onImageSelect: () => void;
}

const SlotPunchHole = ({ type, cardWidth, cardHeight }: { type: SlotPunch, cardWidth: number, cardHeight: number }) => {
    if (type === 'none') return null;

    const holeWidth = 14;
    const holeHeight = 3;
    const offset = 10;

    let style: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
    };

    if (type === 'short-side') {
        style.width = `${holeHeight}px`;
        style.height = `${holeWidth}px`;
        style.top = `${(cardHeight - holeWidth) / 2}px`;
        style.left = `${offset}px`;
    } else { // long-side
        style.width = `${holeWidth}px`;
        style.height = `${holeHeight}px`;
        style.top = `${offset}px`;
        style.left = `${(cardWidth - holeWidth) / 2}px`;
    }

    return <div style={style}></div>
}

type InteractionMode =
  | 'none'
  | 'dragging'
  | 'rotating'
  | 'resizing-br'
  | 'resizing-bl'
  | 'resizing-tr'
  | 'resizing-tl'
  | 'resizing-t'
  | 'resizing-b'
  | 'resizing-l'
  | 'resizing-r';

const IdCardPreview = forwardRef<HTMLDivElement, IdCardPreviewProps>(
  ({ template, image, setImage, textElements, shapeElements, slotPunch, isBackside, isSelected, onImageSelect }, ref) => {
    const [interaction, setInteraction] = useState<InteractionMode>('none');
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [originalImage, setOriginalImage] = useState<ImageElement | null>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);


    const handleInteractionStart = (e: React.MouseEvent<HTMLDivElement>, mode: InteractionMode) => {
        e.preventDefault();
        e.stopPropagation();
        onImageSelect();
        setInteraction(mode);
        setOriginalImage(image);

        const cardRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
        if (!cardRect) return;

        const startX = e.clientX - cardRect.left;
        const startY = e.clientY - cardRect.top;

        if (mode === 'dragging') {
            const imageXInPixels = (image.x / 100) * cardRect.width;
            const imageYInPixels = (image.y / 100) * cardRect.height;
            setStartPoint({ x: startX - imageXInPixels, y: startY - imageYInPixels });
        } else {
            setStartPoint({ x: startX, y: startY });
        }
    }

    const handleInteractionMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (interaction === 'none' || !originalImage) return;
        e.preventDefault();
        e.stopPropagation();

        const cardRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
        if (!cardRect) return;

        const currentX = e.clientX - cardRect.left;
        const currentY = e.clientY - cardRect.top;
        const dx = (currentX - startPoint.x);
        const dy = (currentY - startPoint.y);

        const rad = (originalImage.rotation * Math.PI) / 180;
        const cos = Math.cos(-rad);
        const sin = Math.sin(-rad);
        const rotDx = dx * cos - dy * sin;
        const rotDy = dx * sin + dy * cos;

        const imageCenterXinPixels = (originalImage.x / 100) * cardRect.width;
        const imageCenterYinPixels = (originalImage.y / 100) * cardRect.height;
        
        switch (interaction) {
            case 'dragging': {
                setImage(prev => ({
                    ...prev,
                    x: ((currentX - startPoint.x) / cardRect.width) * 100,
                    y: ((currentY - startPoint.y) / cardRect.height) * 100,
                }));
                break;
            }
            case 'rotating': {
                const centerX = (image.x / 100) * cardRect.width;
                const centerY = (image.y / 100) * cardRect.height;
                const startAngle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX) * (180 / Math.PI);
                const currentAngle = Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);
                const angleDelta = currentAngle - startAngle;
                let newRotation = (originalImage.rotation + angleDelta);
                setImage(prev => ({...prev, rotation: newRotation}));
                break;
            }
            case 'resizing-br': {
                 setImage(prev => ({
                    ...prev,
                    width: (originalImage.width + (rotDx / cardRect.width) * 100),
                    height: (originalImage.height + (rotDy / cardRect.height) * 100),
                 }));
                 break;
            }
            case 'resizing-bl': {
                 setImage(prev => ({
                    ...prev,
                    width: (originalImage.width - (rotDx / cardRect.width) * 100),
                    height: (originalImage.height + (rotDy / cardRect.height) * 100),
                    x: originalImage.x + (dx/cardRect.width)*50,
                    y: originalImage.y + (dy/cardRect.height)*50,
                 }));
                 break;
            }
            case 'resizing-tr': {
                 setImage(prev => ({
                    ...prev,
                    width: (originalImage.width + (rotDx / cardRect.width) * 100),
                    height: (originalImage.height - (rotDy / cardRect.height) * 100),
                    x: originalImage.x + (dx/cardRect.width)*50,
                    y: originalImage.y + (dy/cardRect.height)*50,
                 }));
                 break;
            }
             case 'resizing-tl': {
                 setImage(prev => ({
                    ...prev,
                    width: (originalImage.width - (rotDx / cardRect.width) * 100),
                    height: (originalImage.height - (rotDy / cardRect.height) * 100),
                    x: originalImage.x + (dx/cardRect.width)*50,
                    y: originalImage.y + (dy/cardRect.height)*50,
                 }));
                 break;
            }
        }
    };

    const handleInteractionEnd = () => {
        setInteraction('none');
        setOriginalImage(null);
    };
    
    const resizeHandles = [
        { top: '-4px', left: '-4px', cursor: 'nwse-resize', mode: 'resizing-tl' },
        { top: '-4px', right: '-4px', cursor: 'nesw-resize', mode: 'resizing-tr' },
        { bottom: '-4px', left: '-4px', cursor: 'nesw-resize', mode: 'resizing-bl' },
        { bottom: '-4px', right: '-4px', cursor: 'nwse-resize', mode: 'resizing-br' },
    ] as const;
    
    return (
      <div
        ref={ref}
        id="id-card-preview"
        className="relative shadow-lg rounded-lg overflow-hidden bg-white"
        style={{
          width: `${template.width}px`,
          height: `${template.height}px`,
        }}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
      >
        {isBackside ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-50">
                Back Side
            </div>
        ) : (
            <>
                {/* Shape Elements */}
                {shapeElements.map((shape) => (
                <div
                    key={shape.id}
                    className="absolute"
                    style={{
                    left: `${shape.x}%`,
                    top: `${shape.y}%`,
                    width: `${shape.width}%`,
                    height: `${shape.height}%`,
                    backgroundColor: shape.color,
                    }}
                />
                ))}

                {/* User Photo */}
                {image.src && (
                <div
                    ref={imageContainerRef}
                    className="absolute group"
                     style={{
                        top: `${image.y}%`,
                        left: `${image.x}%`,
                        width: `${image.width}%`,
                        height: `${image.height}%`,
                        transform: `translate(-50%, -50%) rotate(${image.rotation}deg)`,
                        transformOrigin: 'center center',
                        opacity: 1 - image.transparency / 100,
                        cursor: interaction === 'dragging' ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => handleInteractionStart(e, 'dragging')}
                >
                    <div className={cn(
                        "relative w-full h-full border",
                        isSelected ? "border-blue-500" : "border-transparent"
                    )}
                     style={{
                        borderWidth: isSelected ? '1px' : `${image.borderSize}px`,
                        borderColor: isSelected ? 'rgb(59 130 246)' : image.borderColor,
                        borderRadius: '2px',
                        boxSizing: 'border-box'
                     }}
                    >
                        <Image
                            src={image.src}
                            alt="User photo"
                            layout="fill"
                            objectFit="cover"
                            className="pointer-events-none"
                        />
                    </div>
                    
                    {isSelected && <>
                        {/* Resize Handles */}
                        {resizeHandles.map((style) => (
                             <div
                                key={style.mode}
                                className="absolute w-2 h-2 bg-white border border-blue-500 z-10"
                                style={{ ...style, cursor: style.cursor }}
                                onMouseDown={(e) => handleInteractionStart(e, style.mode)}
                            />
                        ))}

                        {/* Rotate Handle */}
                        <div className="absolute w-px h-4 bg-blue-500 z-10" style={{top: '-20px', left: '50%', transform: 'translateX(-50%)'}}></div>
                        <div
                            className="absolute w-4 h-4 bg-white border border-blue-500 rounded-full z-10"
                            style={{ top: '-28px', left: '50%', transform: 'translateX(-50%)', cursor: 'alias'}}
                            onMouseDown={(e) => handleInteractionStart(e, 'rotating')}
                        >
                        </div>
                    </>}

                </div>
                )}

                {/* Placeholder for Photo */}
                {!image.src && (
                    <div 
                    className="absolute bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center"
                    style={{ top: '50px', left: '20px', width: '100px', height: '120px' }}
                    >
                    Your Photo Here
                    </div>
                )}

                {/* Static Template Elements */}
                <div className="absolute w-full h-full pointer-events-none">
                    {/* Example of template specific static elements */}
                    {template.id === 'modern' && <div className="absolute bottom-0 left-0 w-full h-4 bg-primary/80" />}
                    {template.id === 'classic' && <div className="absolute top-4 right-4 text-xs font-bold text-gray-400">EMPLOYEE ID</div>}
                    {template.id === 'vertical' && <div className="absolute top-4 left-4 text-primary font-bold">COMPANY</div>}
                </div>
                

                {/* Text Elements */}
                {textElements.map((text) => (
                <div
                    key={text.id}
                    className="absolute whitespace-nowrap"
                    style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: `${text.fontSize}px`,
                    fontFamily: text.fontFamily,
                    fontWeight: text.fontWeight,
                    color: text.color,
                    }}
                >
                    {text.content}
                </div>
                ))}
            </>
        )}
        <SlotPunchHole type={slotPunch} cardWidth={template.width} cardHeight={template.height} />
      </div>
    );
  }
);

IdCardPreview.displayName = "IdCardPreview";

export default IdCardPreview;
