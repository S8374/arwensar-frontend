/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMinioUpload } from "@/lib/useMinioUpload";
import { useRemoveEvidenceMutation } from "@/redux/features/assainment/assainment.api";
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  Loader2, 
  Save, 
  Trash2, 
  Upload,
  Check,
  Clock,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

export default function QuestionCard({
    question,
    index,
    initialValue,
    isEditable,
    onSave,
    onDirty,
}: any) {
    // Store last saved data for comparison
    const lastSavedRef = useRef<any>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const [state, setState] = useState<{
        answer: string;
        comments: string;
        evidence: string | null;
        isDirty: boolean;
    }>({
        answer: '',
        comments: '',
        evidence: null,
        isDirty: false,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const { uploadFile } = useMinioUpload();
    const [removeEvidence, { isLoading: removing }] = useRemoveEvidenceMutation();

    // Initialize state from initialValue
    useEffect(() => {
        if (initialValue) {
            const newState = {
                answer: initialValue.answer || '',
                comments: initialValue.comments || '',
                evidence: initialValue.evidence || null,
                isDirty: false,
            };
            setState(newState);
            lastSavedRef.current = { ...newState };
            setSaveStatus('saved');
        } else {
            setState({
                answer: "",
                comments: "",
                evidence: null,
                isDirty: true, // New question is dirty by default
            });
            setSaveStatus('idle');
        }
    }, [initialValue]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    // Check if state has changed from last saved
    const hasChanged = useCallback((currentState: any) => {
        if (!lastSavedRef.current) return true;
        
        const { isDirty, ...currentClean } = currentState;
        const { isDirty: _, ...lastSavedClean } = lastSavedRef.current;
        
        return (
            currentClean.answer !== lastSavedClean.answer ||
            currentClean.comments !== lastSavedClean.comments ||
            currentClean.evidence !== lastSavedClean.evidence
        );
    }, []);

    // Debounced auto-save function
    const autoSave = useCallback(
        debounce(async (questionId: string, currentState: any) => {
            if (!hasChanged(currentState) || !currentState.answer) {
                return;
            }

            setIsSaving(true);
            setSaveStatus('saving');
            
            try {
                await onSave(questionId, {
                    answer: currentState.answer,
                    comments: currentState.comments,
                    evidence: currentState.evidence,
                });
                
                // Update last saved reference
                lastSavedRef.current = { ...currentState };
                
                setSaveStatus('saved');
                setLastSaveTime(new Date());
                setRetryCount(0);
                
                toast.success("Auto-saved successfully", {
                    duration: 2000,
                    position: "bottom-right",
                });
            } catch (error) {
                setSaveStatus('error');
                
                // Retry logic with exponential backoff
                if (retryCount < 3) {
                    setRetryCount(prev => prev + 1);
                    setTimeout(() => {
                        autoSave(questionId, currentState);
                    }, Math.min(1000 * Math.pow(2, retryCount), 10000));
                } else {
                    toast.error("Failed to auto-save. Please save manually.", {
                        duration: 4000,
                    });
                }
            } finally {
                setIsSaving(false);
            }
        }, 2000), // 2 second debounce
        [hasChanged, onSave, retryCount]
    );

    const handleChange = (key: string, value: any) => {
        const newState = { ...state, [key]: value, isDirty: true };
        setState(newState);
        
        // Mark as dirty in parent component
        if (onDirty) {
            onDirty();
        }

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Schedule auto-save if answer is selected
        if (newState.answer) {
            autoSaveTimeoutRef.current = setTimeout(() => {
                autoSave(question.id, newState);
            }, 500); // 500ms delay before auto-save
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!isEditable) return;

        try {
            setIsUploading(true);
            const url = await uploadFile(file, (progress: number) => setUploadProgress(progress));
            
            const newState = { 
                ...state, 
                evidence: url, 
                isDirty: true 
            };
            setState(newState);
            
            if (onDirty) onDirty();
            
            // Trigger auto-save after file upload
            if (state.answer) {
                autoSave(question.id, newState);
            }
            
            toast.success("File uploaded successfully!");
        } catch {
            toast.error("File upload failed");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveEvidence = async (answerId: any) => {
        if (!answerId || !isEditable) {
            toast.error("Cannot remove evidence");
            return;
        }

        try {
            await removeEvidence({ answerId }).unwrap();
            
            const newState = { 
                ...state, 
                evidence: null, 
                isDirty: true 
            };
            setState(newState);
            
            if (onDirty) onDirty();
            
            // Trigger auto-save after removal
            if (state.answer) {
                autoSave(question.id, newState);
            }
            
            toast.success("Evidence removed successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove evidence");
        }
    };

    const handleManualSave = async () => {
        if (!state.answer) {
            toast.error("Please select an answer");
            return;
        }

        setIsSaving(true);
        setSaveStatus('saving');
        
        try {
            await onSave(question.id, {
                answer: state.answer,
                comments: state.comments,
                evidence: state.evidence,
            });
            
            lastSavedRef.current = { ...state };
            setState(prev => ({ ...prev, isDirty: false }));
            setSaveStatus('saved');
            setLastSaveTime(new Date());
            setRetryCount(0);
            
            toast.success("Saved successfully!");
        } catch (error) {
            setSaveStatus('error');
            toast.error("Failed to save. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const getSaveStatusIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
            case 'saved':
                return <Check className="w-4 h-4 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getSaveStatusText = () => {
        switch (saveStatus) {
            case 'saving':
                return "Saving...";
            case 'saved':
                return lastSaveTime 
                    ? `Saved ${formatTimeAgo(lastSaveTime)}`
                    : "Saved";
            case 'error':
                return "Save failed";
            default:
                return state.answer ? "Unsaved changes" : "Not answered";
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        
        if (diffSec < 60) return "just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHour < 24) return `${diffHour}h ago`;
        return "recently";
    };

    const isSaveDisabled = !isEditable || !state.answer || isSaving || isUploading;

    return (
        <Card className={`relative ${state.isDirty ? 'border-orange-300' : 'border-green-200'}`}>
            {/* Status badge */}
            <div className="absolute -top-2 -right-2 z-10">
                <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${
                        saveStatus === 'saving' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                        saveStatus === 'saved' ? 'bg-green-50 text-green-700 border-green-300' :
                        saveStatus === 'error' ? 'bg-red-50 text-red-700 border-red-300' :
                        'bg-orange-50 text-orange-700 border-orange-300'
                    }`}
                >
                    {getSaveStatusIcon()}
                    <span className="text-xs font-medium">{getSaveStatusText()}</span>
                </Badge>
            </div>

            <CardHeader className="flex-col items-start pb-3">
                <div className="flex items-center gap-3 w-full">
                    {state.answer ? (
                        <CheckCircle2 className={`flex-shrink-0 w-6 h-6 ${
                            state.isDirty ? 'text-orange-500' : 'text-green-600'
                        }`} />
                    ) : (
                        <Circle className="text-gray-400 flex-shrink-0 w-6 h-6" />
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
                    disabled={!isEditable || isSaving}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["YES", "PARTIAL", "NO", "NOT_APPLICABLE"].map((opt) => (
                            <Label
                                key={opt}
                                className={`border p-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-all ${
                                    state.answer === opt 
                                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' 
                                        : 'hover:bg-gray-50'
                                } ${!isEditable || isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                <RadioGroupItem value={opt} />
                                <span className="font-medium">{opt.replace("_", " ")}</span>
                            </Label>
                        ))}
                    </div>
                </RadioGroup>

                {/* Input Field */}
                {question.isInputField && (
                    <div className="space-y-2">
                        {question.helpText && (
                            <p className="text-sm text-gray-600">{question.helpText}</p>
                        )}
                        <input
                            type="text"
                            value={state.comments}
                            onChange={(e) => handleChange("comments", e.target.value)}
                            disabled={!isEditable || isSaving}
                            placeholder="Enter your response here..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        />
                    </div>
                )}

                {/* Document Upload */}
                {question.isDocument && (
                    <div className="space-y-4">
                        {!state.evidence ? (
                            <label className={`block border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                                isUploading || isSaving || !isEditable
                                    ? 'opacity-60 cursor-not-allowed bg-gray-50'
                                    : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50'
                            }`}>
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                                        <div className="w-full max-w-xs">
                                            <Progress value={uploadProgress} className="h-2" />
                                            <p className="text-sm font-medium mt-2">
                                                Uploading... {Math.round(uploadProgress)}%
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p className="font-medium">Click to upload evidence</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            PDF, DOC, DOCX, PNG, JPG up to 10MB
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Auto-saves after upload
                                        </p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                    disabled={!isEditable || isUploading || isSaving}
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                />
                            </label>
                        ) : (
                            <div className="flex justify-between items-center p-4 border rounded-lg bg-blue-50">
                                <a
                                    href={state.evidence}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 flex-1 hover:underline"
                                >
                                    <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-blue-900 truncate max-w-md">
                                            {state.evidence.split('/').pop()?.split('?')[0] || "document"}
                                        </p>
                                        <p className="text-sm text-gray-600">Click to view/download</p>
                                    </div>
                                </a>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveEvidence(question.id)}
                                    disabled={removing || !isEditable || isSaving}
                                    className="flex items-center gap-2 ml-4"
                                >
                                    {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Manual Save Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Auto-saves 2 seconds after changes</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {state.isDirty && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Unsaved
                            </Badge>
                        )}
                        
                        <Button
                            onClick={handleManualSave}
                            disabled={isSaveDisabled}
                            variant={state.isDirty ? "default" : "outline"}
                            className={`gap-2 ${
                                state.isDirty 
                                    ? 'bg-orange-600 hover:bg-orange-700' 
                                    : 'border-green-300 text-green-700 hover:bg-green-50'
                            }`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Now
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}