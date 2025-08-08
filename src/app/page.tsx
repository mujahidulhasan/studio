"use client";

import React, { useState, useRef, useCallback } from "react";
import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";
import { templates } from "@/components/template-selector";
import Header from "@/components/header";
import EditorPanel from "@/components/editor-panel";
import IdCardPreview from "@/components/id-card-preview";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadAsSvg } from "@/lib/download";

export default function Home() {
  const [template, setTemplate] = useState<Template>(templates[0]);
  const [image, setImage] = useState<ImageElement>({
    src: null,
    x: 50,
    y: 50,
    scale: 100,
  });
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "name",
      content: "Jane Doe",
      x: 50,
      y: 70,
      fontSize: 20,
      fontFamily: "Inter",
      fontWeight: 700,
      color: "#000000",
    },
    {
      id: "title",
      content: "Software Engineer",
      x: 50,
      y: 80,
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: 400,
      color: "#333333",
    },
  ]);
  const [shapeElements, setShapeElements] = useState<ShapeElement[]>([]);
  const idCardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (idCardRef.current) {
      await downloadAsSvg(template, image, textElements, shapeElements);
    }
  }, [template, image, textElements, shapeElements]);

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 overflow-hidden">
        <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow-sm overflow-y-auto">
          <EditorPanel
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
        <div className="lg:col-span-2 flex flex-col items-center justify-center gap-6">
          <IdCardPreview
            ref={idCardRef}
            template={template}
            image={image}
            textElements={textElements}
            shapeElements={shapeElements}
          />
          <Button onClick={handleDownload} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Download className="mr-2 h-5 w-5" />
            Download ID
          </Button>
        </div>
      </main>
    </div>
  );
}
