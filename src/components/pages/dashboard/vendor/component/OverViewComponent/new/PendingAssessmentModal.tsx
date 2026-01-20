import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PendingAssessment {
  id: string;
  supplierName: string;
  assessmentTitle: string;
  submittedAt: string;
  score: number | null;
}

interface PendingAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  assessments: PendingAssessment[];
}

export function PendingAssessmentModal({
  open,
  onClose,
  assessments,
}: PendingAssessmentModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pending Assessments</DialogTitle>
          <DialogDescription>
            Details of suppliers with pending assessments
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4 pr-2 space-y-3">
          {assessments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No pending assessments found
            </p>
          ) : (
            assessments.map((a) => (
              <Card key={a.id} className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-900/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">{a.assessmentTitle}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Supplier: <span className="font-medium">{a.supplierName}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(a.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Pending
                    </Badge>
                    {a.score !== null && <Badge variant="outline">Score: {a.score}</Badge>}
                  </div>
                </div>
              </Card>
            ))
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
