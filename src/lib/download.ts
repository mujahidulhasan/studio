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

      return `<text x="${x}" y="${y}" font-family="${text.fontFamily}, sans-serif" font-size="${text.fontSize}" font-weight="${text.fontWeight}" fill="${text.color}" text-anchor="middle" dominant-baseline="middle">${sanitizedContent}</text>`;
    })
    .join("");

  const shapeElementsSvg = shapes.map(shape => {
    const x = (template.width * shape.x) / 100;
    const y = (template.height * shape.y) / 100;
    const width = (template.width * shape.width) / 100;
    const height = (template.height * shape.height) / 100;
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${shape.color}" />`
  }).join("");

    let imageSvg = "";
    if (imageBase64) {
        // These values are hardcoded in preview, so we do the same here for consistency
        const photoWidth = 100;
        const photoHeight = 120;
        const photoX = 20;
        const photoY = 50;

        const scale = image.scale / 100;
        const imgWidth = photoWidth * scale;
        const imgHeight = photoHeight * scale;
        const imgX = photoX + (photoWidth - imgWidth) * (image.x / 100);
        const imgY = photoY + (photoHeight - imgHeight) * (image.y / 100);


        imageSvg = `
          <defs>
            <clipPath id="photoClip">
              <rect x="${photoX}" y="${photoY}" width="${photoWidth}" height="${photoHeight}" />
            </clipPath>
          </defs>
          <image href="${imageBase64}" x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" clip-path="url(#photoClip)" />
        `;
    }

  const svgContent = `
    <svg width="${template.width}" height="${template.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <style>
        /* Embedding font, might not work on all viewers but good for browsers */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
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
