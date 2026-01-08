/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMinioUpload } from "@/lib/useMinioUpload";
import { useRemoveEvidenceMutation } from "@/redux/features/assainment/assainment.api";
import { CheckCircle2, Circle, FileText, Loader2, Save, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function QuestionCard({
    question,
    index,
    initialValue,
    isEditable,
    onSave,
    onDirty,
}: any) {
    const [state, setState] = useState<{
        answer: string;
        comments: string;
        evidence: string | null;
    }>({
        answer: '',
        comments: '',
        evidence: null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { uploadFile } = useMinioUpload();
    const [removeEvidence, { isLoading: removing }] = useRemoveEvidenceMutation();

    // Initialize state from initialValue
    useEffect(() => {
        if (initialValue) {
            setState(initialValue);
        } else {
            setState({
                answer: "",
                comments: "",
                evidence: null,
            });
        }
    }, [initialValue]);

    const handleChange = (key: string, value: any) => {
        setState((p) => ({ ...p, [key]: value }));
        onDirty();
    };

    const handleFileUpload = async (file: File) => {
        try {
            setIsUploading(true);
            const url = await uploadFile(file, (progress: number) => setUploadProgress(progress));
            setState((p) => ({ ...p, evidence: url }));
            onDirty();
            toast.success("File uploaded successfully!");
        } catch {
            toast.error("File upload failed");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveEvidence = async (answerId: any) => {
        if (!answerId) {
            toast.error("Cannot remove evidence because answer is not saved yet");
            return;
        }
        try {
            await removeEvidence({ answerId }).unwrap();
            setState((prev) => ({ ...prev, evidence: null }));
            onDirty();
            toast.success("Evidence removed successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove evidence");
        }
    };

    const validateBeforeSave = () => {
        if (!state.answer) {
            toast.error("Please select an answer");
            return false;
        }
        return true;
    };

    const fileName = state.evidence;

    return (
        <Card>
            <CardHeader className="flex-col items-start">
                <div className="flex items-center gap-3 w-full">
                    {state.answer ? (
                        <CheckCircle2 className="text-green-600 flex-shrink-0" />
                    ) : (
                        <Circle className="text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <h3 className="font-semibold">
                            {index + 1}. {question.question}
                        </h3>
                        {question.description && (
                            <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Answer Options */}
                <RadioGroup
                    value={state.answer}
                    onValueChange={(v) => handleChange("answer", v)}
                    disabled={!isEditable}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["YES", "PARTIAL", "NO", "NOT_APPLICABLE"].map((opt) => (
                            <Label
                                key={opt}
                                className="border p-3 rounded cursor-pointer flex items-center gap-2 hover:bg-gray-50"
                            >
                                <RadioGroupItem value={opt} />
                                {opt.replace("_", " ")}
                            </Label>
                        ))}
                    </div>
                </RadioGroup>

                {/* Input Field */}
                {question.isInputField && (
                    <div className="space-y-1">
                        {question.helpText && (
                            <p className="text-sm text-gray-600">{question.helpText}</p>
                        )}
                        <input
                            type="text"
                            value={state.comments}
                            onChange={(e) => handleChange("comments", e.target.value)}
                            disabled={!isEditable}
                            placeholder="Enter your response here"
                            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Document Upload */}
                {question.isDocument && (
                    <div className="space-y-2">
                        {!state.evidence ? (
                            <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                {isUploading ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                                        <p>{Math.round(uploadProgress)}%</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p>Click to upload PDF, DOC, or Image</p>
                                        <p className="text-sm text-gray-500 mt-2">Max file size: 10MB</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    disabled={!isEditable || isUploading}
                                    onChange={(e) =>
                                        e.target.files?.[0] && handleFileUpload(e.target.files[0])
                                    }
                                />
                            </label>
                        ) : (
                            <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <span className="text-blue-700 font-medium block">{fileName}</span>
                                        <span className="text-sm text-gray-500">Click to download</span>
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveEvidence(question.id)}
                                    disabled={removing || !isEditable}
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            if (validateBeforeSave()) {
                                onSave(question.id, state);
                            }
                        }}
                        disabled={!isEditable || !state.answer}
                        className="gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Answer
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
