"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Template, ImageElement, TextElement } from "@/types";

interface IdCardPreviewProps {
  template: Template;
  image: ImageElement;
  textElements: TextElement[];
}

const IdCardPreview = forwardRef<HTMLDivElement, IdCardPreviewProps>(
  ({ template, image, textElements }, ref) => {
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
        {/* User Photo */}
        {image.src && (
          <div
            className="absolute overflow-hidden"
            style={{
              // These values should ideally be part of the template definition
              top: '50px',
              left: '20px',
              width: '100px',
              height: '120px',
              clipPath: 'inset(0 0 0 0)',
            }}
          >
            <Image
              src={image.src}
              alt="User photo"
              width={100}
              height={120}
              className="absolute"
              style={{
                transform: `scale(${image.scale / 100})`,
                left: `${image.x - 50}%`,
                top: `${image.y - 50}%`,
                transformOrigin: 'center center',
                objectFit: 'cover',
                width: 'auto',
                height: 'auto',
                minWidth: '100%',
                minHeight: '100%'
              }}
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
      </div>
    );
  }
);

IdCardPreview.displayName = "IdCardPreview";

export default IdCardPreview;
