"use client";

import React, { useState, useRef, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { checkImageSuitability, type CheckImageSuitabilityOutput } from "@/ai/flows/check-image-suitability";
import { Upload, Sparkles, Loader, CheckCircle, XCircle } from "lucide-react";
import type { ImageElement } from "@/types";

interface ImageEditorProps {
  image: ImageElement;
  setImage: Dispatch<SetStateAction<ImageElement>>;
}

export default function ImageEditor({ image, setImage }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckImageSuitabilityOutput | null>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImage((prev) => ({ ...prev, src: result }));
          setCheckResult(null); // Reset check result on new image
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckSuitability = async () => {
    if (!image.src) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setCheckResult(null);
    try {
      const result = await checkImageSuitability({ photoDataUri: image.src });
      setCheckResult(result);
    } catch (error) {
      console.error("Error checking image suitability:", error);
      toast({
        title: "Error",
        description: "Failed to check image suitability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Your Photo</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {image.src ? (
              <Image src={image.src} alt="User photo preview" width={96} height={96} className="object-cover w-full h-full" />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <Button variant="outline" onClick={handleFileSelect}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>
      
      {image.src && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="scale">Zoom</Label>
            <Slider id="scale" value={[image.scale]} onValueChange={([value]) => setImage(prev => ({ ...prev, scale: value }))} max={300} min={100} step={1} />
          </div>
          <div>
            <Label htmlFor="x-pos">Horizontal Position</Label>
            <Slider id="x-pos" value={[image.x]} onValueChange={([value]) => setImage(prev => ({ ...prev, x: value }))} />
          </div>
          <div>
            <Label htmlFor="y-pos">Vertical Position</Label>
            <Slider id="y-pos" value={[image.y]} onValueChange={([value]) => setImage(prev => ({ ...prev, y: value }))} />
          </div>
        </div>
      )}

      <div>
        <Button onClick={handleCheckSuitability} disabled={isChecking || !image.src} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {isChecking ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Check Photo Suitability (AI)
        </Button>
      </div>

      {checkResult && (
        <Alert variant={checkResult.isSuitable ? "default" : "destructive"}>
          {checkResult.isSuitable ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>{checkResult.isSuitable ? "Image is Suitable" : "Image Not Suitable"}</AlertTitle>
          <AlertDescription>{checkResult.suitabilityReport}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Dummy icon for placeholder
const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
)
