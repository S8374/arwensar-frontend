/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/vendor/tabs/DocumentsTab.tsx
import { useState } from "react";
import {
  FileText, ExternalLink, MessageSquare, X,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  useGetDocumetByUserIdQuery,
  useReviewDocumentMutation,
  useDeleteDocumentMutation,
} from "@/redux/features/document/document.api";
import { toast } from "sonner";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";

const getDocumentStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED": return "success";
    case "PENDING": return "default";
    case "UNDER_REVIEW": return "warning";
    case "REJECTED": case "EXPIRED": return "destructive";
    default: return "secondary";
  }
};

type Props = { supplierId: string };

export default function DocumentsTab({ supplierId }: Props) {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const {
    data: docsResponse,
    isLoading,
    refetch,
  } = useGetDocumetByUserIdQuery(supplierId);

  const [reviewDocument, { isLoading: reviewing }] = useReviewDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const documents = docsResponse?.data || [];

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    if (!selectedDoc) return;
    try {
      await reviewDocument({
        documentId: selectedDoc.id,
        payload: { status, reviewNotes: reviewNotes.trim() || undefined }
      }).unwrap();
      toast.success(`Document ${status.toLowerCase()} successfully`);
      setSelectedDoc(null);
      setReviewNotes("");
      refetch();
    } catch {
      toast.error("Failed to review document");
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document permanently?")) return;
    try {
      await deleteDocument(docId).unwrap();
      toast.success("Document deleted");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-32 w-full mb-4 rounded-xl" /><Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-24" /></CardContent></Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="border-dashed py-16 text-center">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Documents Uploaded</h3>
        <p className="text-muted-foreground">This supplier has not uploaded any documents yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc: any) => {
        const expired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
        const expiringSoon = doc.expiryDate && !expired && new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const canReview = ["PENDING", "UNDER_REVIEW"].includes(doc.status);

        return (
          <Card key={doc.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            <CardContent className="pt-6">
              {(expired || expiringSoon) && (
                <Badge variant={expired ? "destructive" : "default"} className="absolute top-4 right-4 text-xs z-10">
                  {expired ? "EXPIRED" : "EXPIRING SOON"}
                </Badge>
              )}

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg line-clamp-2">{doc.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{doc.type || "Document"}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><Badge variant="outline">{doc.category || "General"}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="font-mono">{formatFileSize(doc.fileSize)}</span></div>
                {doc.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry</span>
                    <span className={expired ? "text-destructive font-medium" : ""}>{formatDate(doc.expiryDate)}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={getDocumentStatusVariant(doc.status)}>{doc.status.replace("_", " ")}</Badge></div>
              </div>

              <Separator className="my-5" />

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" />View</a>
                </Button>

                {canReview && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => { setSelectedDoc(doc); setReviewNotes(""); }}>
                        <MessageSquare className="w-4 h-4 mr-1" />Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Review Document</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div><h4 className="font-medium mb-2">{doc.name}</h4></div>
                        <div className="space-y-2">
                          <Label>Review Notes (optional)</Label>
                          <Textarea placeholder="Add comments..." value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={4} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedDoc(null)} disabled={reviewing}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleReview("REJECTED")} disabled={reviewing}><X className="w-4 h-4 mr-1" />Reject</Button>
                        <Button onClick={() => handleReview("APPROVED")} disabled={reviewing}><Check className="w-4 h-4 mr-1" />{reviewing ? "Approving..." : "Approve"}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}><X className="w-4 h-4 text-red-600" /></Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}