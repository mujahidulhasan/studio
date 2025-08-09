"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Template, ImageElement, TextElement, ShapeElement, SlotPunch } from "@/types";

interface IdCardPreviewProps {
  template: Template;
  image: ImageElement;
  textElements: TextElement[];
  shapeElements: ShapeElement[];
  slotPunch: SlotPunch;
  isBackside: boolean;
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


const IdCardPreview = forwardRef<HTMLDivElement, IdCardPreviewProps>(
  ({ template, image, textElements, shapeElements, slotPunch, isBackside }, ref) => {
    return (
      <div
        ref={ref}
        id="id-card-preview"
        className="relative shadow-lg rounded-lg overflow-hidden bg-white"
        style={{
          width: `${template.width}px`,
          height: `${template.height}px`,
        }}
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
                    className="absolute"
                     style={{
                        top: `${image.y}%`,
                        left: `${image.x}%`,
                        width: '150px',
                        height: '150px',
                        transform: `translate(-50%, -50%) scale(${image.scale / 100}) rotate(${image.rotation}deg)`,
                        transformOrigin: 'center center',
                    }}
                >
                    <Image
                        src={image.src}
                        alt="User photo"
                        layout="fill"
                        objectFit="contain"
                    />
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
