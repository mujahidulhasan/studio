"use client";

import type { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelector from "@/components/template-selector";
import ImageEditor from "@/components/image-editor";
import TextEditor from "@/components/text-editor";
import ShapeEditor from "@/components/shape-editor";
import type { Template, ImageElement, TextElement, ShapeElement } from "@/types";
import { LayoutTemplate, ImageIcon, Type, Square } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { state } = useSidebar();
  return (
    <Tabs defaultValue="template" className="w-full h-full flex flex-col">
       <TabsList className="grid w-full grid-cols-4 group-data-[collapsible=icon]:grid-cols-1 group-data-[collapsible=icon]:h-full">
        <TabsTrigger value="template">
          <LayoutTemplate /> <span>Template</span>
        </TabsTrigger>
        <TabsTrigger value="photo">
          <ImageIcon /> <span>Photo</span>
        </TabsTrigger>
        <TabsTrigger value="text">
          <Type /> <span>Text</span>
        </TabsTrigger>
        <TabsTrigger value="shapes">
          <Square /> <span>Shapes</span>
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-y-auto p-6 group-data-[collapsible=icon]:hidden">
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
      </div>
    </Tabs>
  );
}
