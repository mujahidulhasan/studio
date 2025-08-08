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
  scale: number; // percentage
}

export interface Template {
  id: string;
  name: string;
  width: number;
  height: number;
  previewUrl: string;
  dataAiHint: string;
}
