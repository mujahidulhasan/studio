
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
  isLocked?: boolean;
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
  isLocked?: boolean;
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
  isLocked?: boolean;
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

export interface Record {
    id: string;
    userId: string;
    studentName: string;
    roll: string;
    registration: string;
    shift: string;
    blood: string;
    phone: string;
    avatarUrl?: string;
    motherName?: string;
    motherPhone?: string;
    fatherName?: string;
    fatherPhone?: string;
    brotherName?: string;
    brotherPhone?: string;
    friendName?: string;
    friendPhone?: string;
    birthDate?: string;
    nidNumber?: string;
    social_facebook?: string;
    social_instagram?: string;
    social_github?: string;
    otherContacts?: { relation: string, number: string }[];
    notes?: string;
    createdAt: any;
}
