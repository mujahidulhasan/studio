
"use client";

import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


export async function downloadAsSvg(
  template: Template,
  image: ImageElement,
  texts: TextElement[],
  shapes: ShapeElement[]
) {
  let imageBase64 = image.src || "";

  const textElementsSvg = texts
    .map((text) => {
      const x = (template.width * text.x) / 100;
      const y = (template.height * text.y) / 100;
      // Basic sanitization for content
      const sanitizedContent = text.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
      
      const textAnchor = text.align === 'left' ? 'start' : text.align === 'right' ? 'end' : 'middle';

      return `<text x="${x}" y="${y}" font-family="${text.fontFamily}, sans-serif" font-size="${text.fontSize}" font-weight="${text.isBold ? 'bold' : text.fontWeight}" font-style="${text.isItalic ? 'italic' : 'normal'}" text-decoration="${text.isUnderline ? 'underline' : 'none'}" fill="${text.color}" opacity="${1 - (text.transparency || 0) / 100}" text-anchor="${textAnchor}" dominant-baseline="middle" transform="rotate(${text.rotation || 0} ${x} ${y})">${sanitizedContent}</text>`;
    })
    .join("");

    const shapeElementsSvg = shapes.map(shape => {
        const x = (template.width * (shape.x - shape.width / 2)) / 100;
        const y = (template.height * (shape.y - shape.height / 2)) / 100;
        const width = (template.width * shape.width) / 100;
        const height = (template.height * shape.height) / 100;
        const cx = x + width / 2;
        const cy = y + height / 2;

        const commonAttributes = `
            stroke="${shape.strokeColor}"
            stroke-width="${shape.strokeWidth}"
            opacity="${1 - (shape.transparency || 0) / 100}"
            transform="rotate(${shape.rotation || 0} ${cx} ${cy})"
        `;
    
        if (shape.type === 'rectangle') {
            return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${shape.fillColor}" ${commonAttributes} />`;
        }
        if (shape.type === 'circle') {
            return `<ellipse cx="${cx}" cy="${cy}" rx="${width / 2}" ry="${height / 2}" fill="${shape.fillColor}" ${commonAttributes} />`;
        }
        if (shape.type === 'line') {
             return `<line x1="${x}" y1="${cy}" x2="${x + width}" y2="${cy}" stroke="${shape.strokeColor}" stroke-width="${shape.strokeWidth}" opacity="${1-(shape.transparency || 0) / 100}" transform="rotate(${shape.rotation || 0} ${cx} ${cy})" />`;
        }
        if (shape.type === 'triangle') {
             const points = `${cx},${y} ${x + width},${y + height} ${x},${y + height}`;
             return `<polygon points="${points}" fill="${shape.fillColor}" ${commonAttributes} />`;
        }
        return '';
    }).join("");


    let imageSvg = "";
    if (imageBase64) {
        const imgContainerWidth = (template.width * image.width) / 100;
        const imgContainerHeight = (template.height * image.height) / 100;
        const imgContainerX = (template.width * image.x) / 100 - imgContainerWidth/2;
        const imgContainerY = (template.height * image.y) / 100 - imgContainerHeight/2;
       
        imageSvg = `
          <g transform="translate(${imgContainerX + imgContainerWidth/2} ${imgContainerY + imgContainerHeight/2}) rotate(${image.rotation}) translate(-${imgContainerX + imgContainerWidth/2}, -${imgContainerY + imgContainerHeight/2})">
            <image href="${imageBase64}" x="${imgContainerX}" y="${imgContainerY}" width="${imgContainerWidth}" height="${imgContainerHeight}" opacity="${1-image.transparency/100}" />
             ${image.borderSize > 0 ? `<rect x="${imgContainerX}" y="${imgContainerY}" width="${imgContainerWidth}" height="${imgContainerHeight}" fill="none" stroke="${image.borderColor}" stroke-width="${image.borderSize}" />` : ''}
          </g>
        `;
    }

  const svgContent = `
    <svg width="${template.width}" height="${template.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <style>
        /* Embedding font, might not work on all viewers but good for browsers */
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
      </style>
      <rect width="100%" height="100%" fill="white"/>
      
      <!-- Shape Elements -->
      ${shapeElementsSvg}

      <!-- Static Template Elements -->
       ${template.id === 'modern' ? `<rect width="100%" height="16" y="${template.height-16}" fill="#78B0FF" fill-opacity="0.8" />` : ''}
       ${template.id === 'classic' ? `<text x="${template.width - 16}" y="24" text-anchor="end" font-size="10" font-weight="bold" fill="#a0aec0">EMPLOYEE ID</text>` : ''}
       ${template.id === 'vertical' ? `<text x="16" y="24" font-size="14" font-weight="bold" fill="#78B0FF">COMPANY</text>` : ''}
      
      ${imageSvg}
      ${textElementsSvg}
    </svg>
  `;

  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "id-card.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
