/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useState } from "react";

import {
  useGetProblemByIdQuery,
  useCreateProblemMessageMutation,
  type CreateMessagePayload,
} from "@/redux/features/problem/problem.api";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

const statusColors: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  RESOLVED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-red-100 text-red-800",
  URGENT: "bg-red-600 text-white",
};

export default function ProblemDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([]);

  const { data, isLoading } = useGetProblemByIdQuery(problemId!, {
    pollingInterval: 1000,
  });

  const [createMessage] = useCreateProblemMessageMutation();
  const problem = data?.data;

  const { register, handleSubmit, reset } = useForm();

  // 🔽 Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [problem?.messages]);

  // 📩 Send message
  const onSendMessage = async (formData: any) => {
    if (!formData.message?.trim()) return;

    setSending(true);

    const tempId = `temp-${Date.now()}`;

    // ⚡ Optimistic message
    const optimisticMsg = {
      id: tempId,
      content: formData.message?.trim() || "",
      attachments: [],
      createdAt: new Date().toISOString(),
      sender: {
        email: "You",
        role: "VENDOR",
      },
      optimistic: true,
    };

    setOptimisticMessages((prev) => [...prev, optimisticMsg]);
    reset();

    try {
      await createMessage({
        problemId: problemId!,
        body: {
          content: optimisticMsg.content,
          attachments: [],
        } as unknown as CreateMessagePayload,
      }).unwrap();

      // ✅ Remove optimistic message after success
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== tempId)
      );
    } catch (err) {
      // ❌ Remove optimistic message on error
      setOptimisticMessages((prev) =>
        prev.filter((msg) => msg.id !== tempId)
      );
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="space-y-6 mx-auto">
      {/* 🧾 Problem Header */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge className={priorityColors[problem.priority]}>
                {problem.priority}
              </Badge>
              <Badge className={statusColors[problem.status]}>
                {problem.status.replace("_", " ")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Reported {format(new Date(problem.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          {problem.supplier && (
            <div className="text-sm text-muted-foreground">
              Supplier:{" "}
              <strong>
                {problem.supplier.name} ({problem.supplier.email})
              </strong>
            </div>
          )}
        </CardHeader>

        <CardContent>
          <p className="text-lg">{problem.description}</p>
        </CardContent>
      </Card>

      {/* 💬 Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="max-h-[500px] overflow-y-auto space-y-4 px-2">
            {[...(problem.messages || []), ...optimisticMessages].map(
              (msg: any) => {
                const isVendor = msg.sender.role === "VENDOR";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isVendor ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col max-w-lg ${
                        isVendor ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mb-1">
                        {msg.sender.email} •{" "}
                        {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
                      </span>

                      <div
                        className={`p-4 rounded-xl ${
                          isVendor
                            ? "bg-blue-50 text-blue-900 rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
            <div ref={scrollRef} />
          </div>

          {/* ✉️ Send Message */}
          <form
            onSubmit={handleSubmit(onSendMessage)}
            className="flex flex-col md:flex-row gap-2 items-end"
          >
            <Textarea
              {...register("message")}
              placeholder="Type your message..."
              className="flex-1 min-h-[80px]"
            />

            <Button type="submit" className="flex gap-2">
              <Send className="w-4 h-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
