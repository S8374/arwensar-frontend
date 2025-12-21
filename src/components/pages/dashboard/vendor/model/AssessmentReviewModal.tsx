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
import { useReviewAssainmentMutation } from "@/redux/features/vendor/vendor.api";
import { useState } from "react";
import { useCloudinaryUpload } from "@/lib/useCloudinaryUpload";

interface Props {
    open: boolean;
    onClose: () => void;
    submissionID: string;
}

export default function DocumentApproveModal({
    open,
    onClose,
    submissionID,
}: Props) {
    const [reviewAssainment, { isLoading }] = useReviewAssainmentMutation();
    const { uploadFile, isUploading, uploadProgress, uploadError, resetUpload } =
        useCloudinaryUpload();

    const [status, setStatus] = useState("");
    const [report, setReport] = useState("");
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    // Handle file selection and upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await uploadFile(file);
            setFileUrl(url); // ✅ Get uploaded file URL
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    const handleSubmit = async () => {
        if (!status) return alert("Please select a status");

        try {
            await reviewAssainment({
                submissionID,
                body: {
                    status,
                    reviewComments: report,
                    reviewerReport: fileUrl,
                },
            }).unwrap();


            alert("Assessment reviewed successfully ✅");
            onClose();
            resetUpload(); // optional: reset hook state
        } catch (err) {
            console.error(err);
            alert("Failed to submit review ❌");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload Document & Report</DialogTitle>
                    <DialogDescription>
                        Simple UI modal with document upload, selection and report input.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label>Document</Label>
                        <Input type="file" className="mt-2" onChange={handleFileChange} />
                        {isUploading && (
                            <p className="text-sm text-muted-foreground mt-1">
                                Uploading: {Math.round(uploadProgress)}%
                            </p>
                        )}
                        {uploadError && (
                            <p className="text-sm text-red-600 mt-1">{uploadError}</p>
                        )}
                        {fileUrl && (
                            <p className="text-sm text-green-600 mt-1">
                                File uploaded successfully
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Status</Label>
                        <Select onValueChange={setStatus}>
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
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || isUploading}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
