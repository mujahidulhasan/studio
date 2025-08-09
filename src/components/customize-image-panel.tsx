
"use client";

import React, { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, Wand2, Loader2 } from "lucide-react";
import type { ImageElement } from "@/types";
import { checkImageSuitability } from "@/ai/flows/check-image-suitability";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface CustomizeImagePanelProps {
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
}

const NumberInputWithSteppers = ({ value, onChange, min, max, step = 1 }: { value: number, onChange: (val: number) => void, min?: number, max?: number, step?: number }) => {
    const handleChange = (newValue: number) => {
        let finalValue = newValue;
        if (min !== undefined) finalValue = Math.max(min, finalValue);
        if (max !== undefined) finalValue = Math.min(max, finalValue);
        onChange(finalValue);
    }
    return (
        <div className="flex items-center gap-1">
            <Input type="number" value={value} onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)} className="w-20 text-center" />
            <div className="flex flex-col">
                <button onClick={() => handleChange(value + step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black">+</button>
                <button onClick={() => handleChange(value - step)} className="h-4 w-4 flex items-center justify-center text-gray-500 hover:text-black">-</button>
            </div>
        </div>
    )
}

export default function CustomizeImagePanel({ image, setImage }: CustomizeImagePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImage((prev) => ({ ...prev, src: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCheckSuitability = async () => {
    if (!image.src) {
        toast({
            variant: "destructive",
            title: "No Image",
            description: "Please upload an image first.",
        });
        return;
    }
    setIsChecking(true);
    try {
        const result = await checkImageSuitability({ photoDataUri: image.src });
        toast({
            title: result.isSuitable ? "Image is suitable" : "Image may not be suitable",
            description: (
                <Alert variant={result.isSuitable ? "default" : "destructive"}>
                    <AlertTitle>{result.isSuitable ? "Success" : "Warning"}</AlertTitle>
                    <AlertDescription>{result.suitabilityReport}</AlertDescription>
                </Alert>
            ),
            duration: 5000,
        });
    } catch (error) {
        console.error("Error checking image suitability:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not check image suitability.",
        });
    } finally {
        setIsChecking(false);
    }
  }

  return (
    <div className="space-y-4">
       <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="flex items-center gap-2">
        <Button onClick={handleUploadClick} variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Browse New
        </Button>
        <Button onClick={handleCheckSuitability} disabled={isChecking} variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10 hover:text-primary">
            {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Check Suitability
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <Label>Transparency</Label>
            <NumberInputWithSteppers value={image.transparency} onChange={(val) => setImage(prev => ({...prev, transparency: val}))} min={0} max={100} />
        </div>
        <Slider
            value={[image.transparency]}
            onValueChange={([value]) => setImage(prev => ({...prev, transparency: value}))}
            min={0} max={100} step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <Label>Rotation</Label>
             <NumberInputWithSteppers value={Math.round(image.rotation)} onChange={(val) => setImage(prev => ({...prev, rotation: val}))} min={0} max={360} />
        </div>
        <Slider
            value={[image.rotation]}
            onValueChange={([value]) => setImage(prev => ({...prev, rotation: value}))}
            min={0} max={360} step={1}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Border Size</Label>
        <NumberInputWithSteppers value={image.borderSize} onChange={(val) => setImage(prev => ({...prev, borderSize: val}))} min={0} max={50} />
      </div>

      <div className="space-y-2">
        <Label>Border Color</Label>
        <div className="flex items-center gap-2 border rounded-md p-1">
             <Input
                type="color"
                value={image.borderColor}
                onChange={(e) => setImage(prev => ({...prev, borderColor: e.target.value}))}
                className="p-0 h-8 w-8 border-none"
             />
             <span>{image.borderColor}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>W</Label>
            <NumberInputWithSteppers value={Math.round(image.width)} onChange={v => setImage(p => ({...p, width: v}))} />
        </div>
         <div className="space-y-2">
            <Label>H</Label>
            <NumberInputWithSteppers value={Math.round(image.height)} onChange={v => setImage(p => ({...p, height: v}))} />
        </div>
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>X</Label>
            <NumberInputWithSteppers value={Math.round(image.x)} onChange={v => setImage(p => ({...p, x: v}))} />
        </div>
         <div className="space-y-2">
            <Label>Y</Label>
            <NumberInputWithSteppers value={Math.round(image.y)} onChange={v => setImage(p => ({...p, y: v}))} />
        </div>
      </div>


    </div>
  );
}
