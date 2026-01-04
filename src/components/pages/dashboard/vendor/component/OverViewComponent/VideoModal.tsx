// src/components/ui/VideoModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoUrl: string;
}

export default function VideoModal({ open, onOpenChange, videoUrl }: VideoModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90vh]">
                <DialogHeader className="px-6 pt-6 pb-4 flex justify-between items-center">
                    <DialogTitle className="text-xl font-semibold">
                        Demo Video How You Import Multiple Supplier
                    </DialogTitle>

                </DialogHeader>

                <div className="px-6 pb-6">
                    <div className="w-full aspect-video">
                        <iframe
                            src={videoUrl}
                            title="Demo Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full rounded-md"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
