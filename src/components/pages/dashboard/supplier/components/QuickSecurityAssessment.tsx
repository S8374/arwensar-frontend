/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, CheckCircle2, Circle } from "lucide-react";

export default function SupplierAssignmentFormDesign() {
  // Dummy static assignment data
  const questions = useMemo(() => [
    {
      questionId: "q-1",
      question: "Does your company have a formal security policy?",
      isInputField: true,
      isDocument: false,
    },
    {
      questionId: "q-2",
      question: "Provide evidence of employee training.",
      isInputField: false,
      isDocument: true,
    },
    {
      questionId: "q-3",
      question: "Are safety protocols updated regularly?",
      isInputField: true,
      isDocument: false,
    },
  ], []);

  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Handlers for static design
  const handleOptionChange = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], answer: value } }));
  };

  const handleTextChange = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], comments: value } }));
  };

  const removeFile = (qId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], evidence: undefined } }));
  };

  const handleFileChange = (qId: string, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file); // just for preview
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], evidence: url } }));
  };

  const answeredCount = Object.values(answers).filter(a => a?.answer).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-10 bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between text-sm mb-2 font-semibold text-gray-700">
            <span>Assessment Progress</span>
            <span className="text-green-600">{answeredCount} / {questions.length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
          {progress === 100 && (
            <p className="text-sm text-green-600 mt-2 font-medium">All questions answered — Ready to submit!</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((q, idx) => {
            const qId = q.questionId;
            const current = answers[qId] || {};
            const isAnswered = !!current.answer;

            return (
              <Card key={qId} className={`border ${isAnswered ? "border-green-300 bg-green-50/30" : "border-gray-200"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {isAnswered ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 mt-1" />
                    )}
                    <div className="flex-1">
                      <Label className="text-lg font-medium">
                        {idx + 1}. {q.question}
                      </Label>

                      {/* Radio Options */}
                      <div className="flex flex-wrap gap-6 mt-5">
                        {["YES", "NO", "PARTIAL"].map(opt => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={qId}
                              checked={current.answer === opt}
                              onChange={() => handleOptionChange(qId, opt)}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className={`font-medium ${current.answer === opt ? "text-blue-600" : "text-gray-700"}`}>
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Comments */}
                      {q.isInputField && (
                        <div className="mt-6">
                          <Label>Comments / Explanation</Label>
                          <Textarea
                            placeholder="Provide details or justification..."
                            className="mt-2 min-h-28"
                            value={current.comments || ""}
                            onChange={e => handleTextChange(qId, e.target.value)}
                          />
                        </div>
                      )}

                      {/* File Upload */}
                      {q.isDocument && (
                        <div className="mt-6">
                          <Label>Supporting Document</Label>
                          {current.evidence ? (
                            <div className="flex items-center gap-4 mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <a
                                href={current.evidence}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                View Uploaded File
                              </a>
                              <Button size="sm" variant="destructive" onClick={() => removeFile(qId)}>
                                <X className="w-4 h-4" /> Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={e => handleFileChange(qId, e.target.files?.[0] || null)}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-12 pb-10">
          <Button size="lg" variant="outline" className="px-8">Save Progress</Button>
          <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700">Submit Final Assessment</Button>
        </div>
      </div>
    </div>
  );
}
