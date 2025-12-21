import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, X, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ViewContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl: string | null;
  title?: string;
  documentName?: string;
  downloadButton?: boolean;
  className?: string;
}

export default function ViewContractModal({
  open,
  onOpenChange,
  documentUrl,
  title = "Contract Document",
  documentName = "contract.pdf",
  downloadButton = true,
  className,
}: ViewContractModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleDownload = () => {
    if (!documentUrl) return;
    
    const link = document.createElement("a");
    link.href = documentUrl;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!documentUrl) return;
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-6xl h-[95vh] p-0 overflow-hidden bg-background",
          className
        )}
        onInteractOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-semibold leading-none">
                {title}
              </DialogTitle>
              {documentName && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {documentName}
                </DialogDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {downloadButton && documentUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            )}
            
            {documentUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-muted/50">
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Failed to load document</h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                The document could not be loaded. Please try downloading it or opening in a new tab.
              </p>
              <div className="flex gap-3">
                {downloadButton && documentUrl && (
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
                <Button onClick={handleOpenInNewTab} disabled={!documentUrl}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          ) : documentUrl ? (
            <iframe
              src={documentUrl}
              title={title}
              className="w-full h-full border-0"
              frameBorder="0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No document available</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                The requested document is not available or has been removed.
              </p>
            </div>
          )}
        </div>

        {/* Footer with additional info */}
        <div className="px-6 py-3 border-t bg-card/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {documentUrl && !hasError ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Document loaded successfully
                </span>
              ) : (
                <span>No document loaded</span>
              )}
            </div>
            {documentUrl && (
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {new URL(documentUrl).hostname}
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}