
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Undo2, Redo2, Grid3x3, Download, Share2, Save, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onToggleGrid: () => void;
    isGridVisible: boolean;
    onDownload: () => void;
}

const ToolbarButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  isActive,
}: {
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
  isActive?: boolean;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className="h-9 w-9"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function Toolbar({ onUndo, onRedo, canUndo, canRedo, onToggleGrid, isGridVisible, onDownload }: ToolbarProps) {
  return (
    <div id="toolbar" className="w-full bg-white border-b">
        <div className="container mx-auto px-4">
            <div className="flex items-center h-14 gap-2">
                <ToolbarButton onClick={onUndo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
                    <Undo2 className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton onClick={onRedo} disabled={!canRedo} tooltip="Redo (Ctrl+Y)">
                    <Redo2 className="w-5 h-5" />
                </ToolbarButton>
                <Separator orientation="vertical" className="h-6" />
                <ToolbarButton onClick={onToggleGrid} tooltip={isGridVisible ? "Hide Grid" : "Show Grid"} isActive={isGridVisible}>
                    {isGridVisible ? <X className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
                </ToolbarButton>
                <ToolbarButton onClick={onDownload} tooltip="Download">
                    <Download className="w-5 h-5" />
                </ToolbarButton>
                <ToolbarButton onClick={() => {}} tooltip="Share">
                    <Share2 className="w-5 h-5" />
                </ToolbarButton>
                <div className="flex-grow" />
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                </Button>
            </div>
        </div>
    </div>
  );
}
