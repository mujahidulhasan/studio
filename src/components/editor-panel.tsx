"use client";

import type { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelector from "@/components/template-selector";
import ImageEditor from "@/components/image-editor";
import TextEditor from "@/components/text-editor";
import ShapeEditor from "@/components/shape-editor";
import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";
import { LayoutTemplate, ImageIcon, Type, Square, Shield, Database } from "lucide-react";

interface EditorPanelProps {
  template: Template;
  setTemplate: Dispatch<SetStateAction<Template>>;
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
  textElements: TextElement[];
  setTextElements: Dispatch<SetStateAction<TextElement[]>>;
  shapeElements: ShapeElement[];
  setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
}

export default function EditorPanel({
  template,
  setTemplate,
  image,
  setImage,
  textElements,
  setTextElements,
  shapeElements,
  setShapeElements,
}: EditorPanelProps) {
  return (
    <Tabs defaultValue="template" className="w-full h-full flex" orientation="vertical">
       <TabsList className="w-auto h-full p-2 gap-2 bg-transparent">
        <TabsTrigger value="template">
          <LayoutTemplate /> <span>Card</span>
        </TabsTrigger>
        <TabsTrigger value="photo">
          <ImageIcon /> <span>Image</span>
        </TabsTrigger>
        <TabsTrigger value="text">
          <Type /> <span>Text</span>
        </TabsTrigger>
        <TabsTrigger value="shapes">
          <Square /> <span>Shapes</span>
        </TabsTrigger>
        <TabsTrigger value="security" disabled>
          <Shield /> <span>Security</span>
        </TabsTrigger>
        <TabsTrigger value="records" disabled>
          <Database /> <span>Records</span>
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto p-6 group-data-[collapsible=icon]:hidden bg-background">
        <TabsContent value="template">
          <TemplateSelector selectedTemplate={template} onSelectTemplate={setTemplate} />
        </TabsContent>
        <TabsContent value="photo">
          <ImageEditor image={image} setImage={setImage} />
        </TabsContent>
        <TabsContent value="text">
          <TextEditor textElements={textElements} setTextElements={setTextElements} />
        </TabsContent>
        <TabsContent value="shapes">
          <ShapeEditor shapeElements={shapeElements} setShapeElements={setShapeElements} />
        </TabsContent>
         <TabsContent value="security">
            <p>Security features coming soon.</p>
        </TabsContent>
        <TabsContent value="records">
            <p>Record management coming soon.</p>
        </TabsContent>
      </div>
    </Tabs>
  );
}
