"use client";

import type { Dispatch, SetStateAction } from "react";
import TemplateSelector from "@/components/template-selector";
import ImageEditor from "@/components/image-editor";
import TextEditor from "@/components/text-editor";
import ShapeEditor from "@/components/shape-editor";
import type { Template, ImageElement, TextElement, ShapeElement, SlotPunch } from "@/types";

interface EditorPanelProps {
  activeTab: string;
  template: Template;
  setTemplate: Dispatch<SetStateAction<Template>>;
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
  textElements: TextElement[];
  setTextElements: Dispatch<SetStateAction<TextElement[]>>;
  shapeElements: ShapeElement[];
  setShapeElements: Dispatch<SetStateAction<ShapeElement[]>>;
  slotPunch: SlotPunch;
  setSlotPunch: Dispatch<SetStateAction<SlotPunch>>;
}

export default function EditorPanel({
  activeTab,
  template,
  setTemplate,
  image,
  setImage,
  textElements,
  setTextElements,
  shapeElements,
  setShapeElements,
  slotPunch,
  setSlotPunch,
}: EditorPanelProps) {
  return (
    <div>
        {activeTab === 'template' && (
            <TemplateSelector 
                selectedTemplate={template} 
                onSelectTemplate={setTemplate}
                slotPunch={slotPunch}
                setSlotPunch={setSlotPunch}
            />
        )}
        {activeTab === 'photo' && <ImageEditor image={image} setImage={setImage} />}
        {activeTab === 'text' && <TextEditor textElements={textElements} setTextElements={setTextElements} />}
        {activeTab === 'shapes' && <ShapeEditor shapeElements={shapeElements} setShapeElements={setShapeElements} />}
        {activeTab === 'security' && <p>Security features coming soon.</p>}
        {activeTab === 'records' && <p>Record management coming soon.</p>}
    </div>
  );
}
