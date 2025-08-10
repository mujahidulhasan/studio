
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Undo2, Redo2, Grid3x3, Download, Share2, Save, X, BringToFront, SendToBack, Copy, Trash2, Lock, Unlock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onToggleGrid: () => void;
    isGridVisible: boolean;
    onDownload: () => void;
    selectedElementId: string | null;
    onDelete: () => void;
    onDuplicate: () => void;
    onLayerChange: (direction: 'forward' | 'backward') => void;
    onLock: () => void;
    isElementLocked?: boolean;
}

const ToolbarButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  isActive,
}: {
  onClick?: () => void;
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

export default function Toolbar({ 
    onUndo, 
    onRedo, 
    canUndo, 
    canRedo, 
    onToggleGrid, 
    isGridVisible, 
    onDownload,
    selectedElementId,
    onDelete,
    onDuplicate,
    onLayerChange,
    onLock,
    isElementLocked
}: ToolbarProps) {
  return (
    <div id="toolbar" className="w-full bg-card border-b">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={onUndo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
                        <Undo2 className="w-5 h-5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={onRedo} disabled={!canRedo} tooltip="Redo (Ctrl+Y)">
                        <Redo2 className="w-5 h-5" />
                    </ToolbarButton>
                     <Separator orientation="vertical" className="h-6 mx-2" />
                    <ToolbarButton onClick={onToggleGrid} tooltip={isGridVisible ? "Hide Grid" : "Show Grid"} isActive={isGridVisible}>
                        {isGridVisible ? <X className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
                    </ToolbarButton>
                </div>
                
                <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {selectedElementId && (
                        <>
                           <ToolbarButton onClick={() => onLayerChange('forward')} tooltip="Bring Forward" disabled={isElementLocked}>
                                <BringToFront className="w-5 h-5" />
                            </ToolbarButton>
                           <ToolbarButton onClick={() => onLayerChange('backward')} tooltip="Send Backward" disabled={isElementLocked}>
                                <SendToBack className="w-5 h-5" />
                            </ToolbarButton>
                           <ToolbarButton onClick={onDuplicate} tooltip="Duplicate" disabled={isElementLocked}>
                                <Copy className="w-5 h-5" />
                            </ToolbarButton>
                            <ToolbarButton onClick={onLock} tooltip={isElementLocked ? "Unlock Element" : "Lock Element"}>
                                {isElementLocked ? <Unlock className="w-5 h-5 text-red-500"/> : <Lock className="w-5 h-5" />}
                            </ToolbarButton>
                           <ToolbarButton onClick={onDelete} tooltip="Delete Element" disabled={isElementLocked}>
                                <Trash2 className="w-5 h-5" />
                            </ToolbarButton>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <ToolbarButton onClick={onDownload} tooltip="Download">
                        <Download className="w-5 h-5" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => {}} tooltip="Share">
                        <Share2 className="w-5 h-5" />
                    </ToolbarButton>
                     <Separator orientation="vertical" className="h-6 mx-2" />
                    <Button variant="outline" size="sm" className="h-9">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
