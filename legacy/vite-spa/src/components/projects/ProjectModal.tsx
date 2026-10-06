import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  description: string;
  children: React.ReactNode;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] md:w-[90vw] max-h-[92vh] flex flex-col p-0 overflow-hidden border-border/80 shadow-2xl bg-background/95 backdrop-blur-md">
        <DialogHeader className="p-5 md:p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {category && (
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold border-primary/30 text-primary">
                {category}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">Interaktiv Showcase</span>
          </div>
          <DialogTitle className="text-xl md:text-2xl font-bold font-display text-foreground tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm text-muted-foreground mt-1 max-w-3xl">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
