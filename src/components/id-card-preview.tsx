"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Template, ImageElement, TextElement, ShapeElement, SlotPunch } from "@/types";
import { Move, Repeat, maximize, Minimize, Maximize } from "lucide-react";


interface IdCardPreviewProps {
  template: Template;
  image: ImageElement;
  setImage: React.Dispatch<React.SetStateAction<ImageElement>>;
  textElements: TextElement[];
  shapeElements: ShapeElement[];
  slotPunch: SlotPunch;
  isBackside: boolean;
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

type InteractionMode = 'none' | 'dragging' | 'resizing' | 'rotating';

const IdCardPreview = forwardRef<HTMLDivElement, IdCardPreviewProps>(
  ({ template, image, setImage, textElements, shapeElements, slotPunch, isBackside, onImageSelect }, ref) => {
    const [interaction, setInteraction] = useState<InteractionMode>('none');
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);


    const handleInteractionStart = (e: React.MouseEvent<HTMLDivElement>, mode: InteractionMode) => {
        e.preventDefault();
        e.stopPropagation();
        onImageSelect();
        setInteraction(mode);

        const cardRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
        if (!cardRect) return;

        const startX = e.clientX - cardRect.left;
        const startY = e.clientY - cardRect.top;

        if (mode === 'dragging') {
             // The offset between the mouse click and the image's top-left corner (in pixels)
            const imageXInPixels = (image.x / 100) * cardRect.width;
            const imageYInPixels = (image.y / 100) * cardRect.height;
            setStartPoint({ x: startX - imageXInPixels, y: startY - imageYInPixels });
        } else {
            setStartPoint({ x: startX, y: startY });
        }
    }

    const handleInteractionMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (interaction === 'none') return;
        e.preventDefault();
        e.stopPropagation();

        const cardRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
        if (!cardRect) return;

        const currentX = e.clientX - cardRect.left;
        const currentY = e.clientY - cardRect.top;

        const imageXInPixels = (image.x / 100) * cardRect.width;
        const imageYInPixels = (image.y / 100) * cardRect.height;
        
        switch (interaction) {
            case 'dragging': {
                setImage(prev => ({
                    ...prev,
                    x: ((currentX - startPoint.x) / cardRect.width) * 100,
                    y: ((currentY - startPoint.y) / cardRect.height) * 100,
                }));
                break;
            }
            case 'resizing': {
                const centerX = imageXInPixels;
                const centerY = imageYInPixels;
                
                const startDist = Math.sqrt(Math.pow(startPoint.x - centerX, 2) + Math.pow(startPoint.y - centerY, 2));
                const currentDist = Math.sqrt(Math.pow(currentX - centerX, 2) + Math.pow(currentY - centerY, 2));
                
                const scaleDelta = currentDist / startDist;

                setImage(prev => {
                    const newScale = prev.scale * scaleDelta;
                    return {...prev, scale: Math.max(10, Math.min(newScale, 300))}; // Clamp scale
                });

                // Update start point for continuous scaling
                setStartPoint({ x: currentX, y: currentY });
                break;
            }
            case 'rotating': {
                const centerX = imageXInPixels;
                const centerY = imageYInPixels;
                
                const startAngle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX) * (180 / Math.PI);
                const currentAngle = Math.atan2(currentY - centerY, currentX - centerX) * (180 / Math.PI);

                const angleDelta = currentAngle - startAngle;

                setImage(prev => {
                    let newRotation = (prev.rotation + angleDelta) % 360;
                    if (newRotation < 0) newRotation += 360;
                    return {...prev, rotation: newRotation};
                });
                
                // Update start point for continuous rotation
                setStartPoint({ x: currentX, y: currentY });
                break;
            }
        }
    };

    const handleInteractionEnd = () => {
        setInteraction('none');
    };
    
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
                        transform: `translate(-50%, -50%)`,
                        transformOrigin: 'center center',
                        opacity: 1 - image.transparency / 100
                    }}
                >
                    <div className={cn(
                        "relative w-full h-full",
                         interaction === 'dragging' ? "cursor-grabbing" : "cursor-grab"
                    )}
                     style={{
                        transform: `scale(${image.scale / 100}) rotate(${image.rotation}deg)`,
                        border: `${image.borderSize}px solid ${image.borderColor}`,
                        borderRadius: '2px',
                        boxSizing: 'border-box'
                     }}
                     onMouseDown={(e) => handleInteractionStart(e, 'dragging')}
                    >
                        <Image
                            src={image.src}
                            alt="User photo"
                            layout="fill"
                            objectFit="cover"
                            className="pointer-events-none"
                        />
                         <div className="absolute inset-0 border-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>

                     {/* Resize Handle */}
                    <div
                        className="absolute -right-2 -bottom-2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onMouseDown={(e) => handleInteractionStart(e, 'resizing')}
                    >
                      <Maximize className="w-3 h-3 text-primary" />
                    </div>


                    {/* Rotate Handle */}
                    <div
                        className="absolute -top-2 -right-2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-alias opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onMouseDown={(e) => handleInteractionStart(e, 'rotating')}
                    >
                      <Repeat className="w-3 h-3 text-primary" />
                    </div>
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
