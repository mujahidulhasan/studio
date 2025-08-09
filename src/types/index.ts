export interface TextElement {
  id: string;
  content: string;
  x: number; // percentage
  y: number; // percentage
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
}

export interface ImageElement {
  src: string | null;
  x: number; // percentage for positioning within its frame
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  scale: number; // percentage
  rotation: number; // degrees
  transparency: number; // percentage
  borderSize: number; // pixels
  borderColor: string;
}

export interface ShapeElement {
  id: string;
  type: 'rectangle';
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  color: string;
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
