"use client";

import type { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelector from "@/components/template-selector";
import ImageEditor from "@/components/image-editor";
import TextEditor from "@/components/text-editor";
import type { Template, ImageElement, TextElement } from "@/types";
import { LayoutTemplate, ImageIcon, Type } from "lucide-react";

interface EditorPanelProps {
  template: Template;
  setTemplate: Dispatch<SetStateAction<Template>>;
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
  textElements: TextElement[];
  setTextElements: Dispatch<SetStateAction<TextElement[]>>;
}

export default function EditorPanel({
  template,
  setTemplate,
  image,
  setImage,
  textElements,
  setTextElements,
}: EditorPanelProps) {
  return (
    <Tabs defaultValue="template" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="template">
          <LayoutTemplate className="mr-2 h-4 w-4" /> Template
        </TabsTrigger>
        <TabsTrigger value="photo">
          <ImageIcon className="mr-2 h-4 w-4" /> Photo
        </TabsTrigger>
        <TabsTrigger value="text">
          <Type className="mr-2 h-4 w-4" /> Text
        </TabsTrigger>
      </TabsList>
      <TabsContent value="template" className="mt-6">
        <TemplateSelector selectedTemplate={template} onSelectTemplate={setTemplate} />
      </TabsContent>
      <TabsContent value="photo" className="mt-6">
        <ImageEditor image={image} setImage={setImage} />
      </TabsContent>
      <TabsContent value="text" className="mt-6">
        <TextEditor textElements={textElements} setTextElements={setTextElements} />
      </TabsContent>
    </Tabs>
  );
}
