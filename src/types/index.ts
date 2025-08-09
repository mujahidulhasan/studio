
export interface TextElement {
  id: string;
  content: string;
  x: number; // percentage
  y: number; // percentage
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
  rotation: number;
  transparency: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  align: 'left' | 'center' | 'right';
}

export interface ImageElement {
  id: 'image';
  src: string | null;
  x: number; // percentage for positioning within its frame
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  scale: number; 
  rotation: number; // degrees
  transparency: number; // percentage
  borderSize: number; // pixels
  borderColor: string;
}

export interface ShapeElement {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'line';
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  rotation: number;
  transparency: number;
}

export interface Template {
  id: string;
  name: string;
  width: number;
  height: number;
  previewUrl: string;
  dataAiHint: string;
}

export type SlotPunch = 'none' | 'short-side' | 'long-side';
