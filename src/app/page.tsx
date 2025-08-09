"use client";

import React, { useState, useRef, useCallback } from "react";
import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";
import { templates } from "@/components/template-selector";
import Header from "@/components/header";
import EditorPanel from "@/components/editor-panel";
import IdCardPreview from "@/components/id-card-preview";
import { Button } from "@/components/ui/button";
import { Download, PanelLeft } from "lucide-react";
import { downloadAsSvg } from "@/lib/download";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-background font-body">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsible="icon" className="bg-muted/30">
            <SidebarContent className="p-0">
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
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4 md:p-8">
               <div className="absolute top-4 left-4">
                  <SidebarTrigger />
               </div>
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
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
