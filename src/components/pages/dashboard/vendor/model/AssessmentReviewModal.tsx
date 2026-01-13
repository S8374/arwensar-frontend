/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  submissionID: string;
}

export default function DocumentApproveModal({
  open,
  onClose,
}: Props) {
  const [status, setStatus] = useState("");
  const [report, setReport] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Simulate file "upload"
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); // local preview URL
      setIsUploading(false);
    }, 1000); // simulate 1s upload
  };

  const handleSubmit = () => {
    if (!status) return alert("Please select a status");

    // Simulate submitting data

    alert("Assessment reviewed successfully ✅");

    // Reset local state
    setStatus("");
    setReport("");
    setFile(null);
    setFileUrl(null);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document & Report</DialogTitle>
          <DialogDescription>
            Simple UI modal with document upload, selection, and report input.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Document</Label>
            <Input type="file" className="mt-2" onChange={handleFileChange} />
            {isUploading && (
              <p className="text-sm text-muted-foreground mt-1">
                Uploading...
              </p>
            )}
            {fileUrl && (
              <p className="text-sm text-green-600 mt-1">
                File ready: {file?.name}
              </p>
            )}
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                  <SelectItem value="NEEDS_REVISION">NEEDS_REVISION</SelectItem>
                  <SelectItem value="UNDER_REVIEW">UNDER_REVIEW</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Report / Notes</Label>
            <Textarea
              placeholder="Write short report..."
              className="mt-2"
              rows={4}
              value={report}
              onChange={(e) => setReport(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
