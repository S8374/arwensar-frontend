// src/components/pages/dashboard/shared/ProblemDetail.tsx
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useGetProblemByIdQuery, useCreateProblemMessageMutation } from "@/redux/features/problem/problem.api";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

const statusColors = { /* same as above */ };
const priorityColors = { /* same as above */ };

export default function ProblemDetail() {
  const { problemId } = useParams<{ problemId: string }>();
  const { data, isLoading } = useGetProblemByIdQuery(problemId!);
  const [createMessage] = useCreateProblemMessageMutation();

  const problem = data?.data;

  const { register, handleSubmit, reset } = useForm();

  const onSendMessage = async (data: any) => {
    try {
      await createMessage({
        problemId: problemId!,
        body: { content: data.message }
      }).unwrap();
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Problem Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
              <div className="flex items-center gap-3">
                <Badge className={priorityColors[problem.priority]}>{problem.priority}</Badge>
                <Badge className={statusColors[problem.status]}>{problem.status}</Badge>
                <span className="text-sm text-muted-foreground">
                  Reported {format(new Date(problem.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{problem.description}</p>
          {problem.supplier && (
            <p className="mt-4 text-muted-foreground">
              Supplier: <strong>{problem.supplier.name}</strong> ({problem.supplier.email})
            </p>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {problem.messages?.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender.role === 'VENDOR' ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium">{msg.sender.email[0].toUpperCase()}</span>
                </div>
                <div className={`max-w-lg ${msg.sender.role === 'VENDOR' ? 'text-right' : ''}`}>
                  <p className="text-sm text-muted-foreground">
                    {msg.sender.email} • {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
                  </p>
                  <div className="mt-1 p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send Message */}
          <form onSubmit={handleSubmit(onSendMessage)} className="flex gap-3">
            <Textarea
              {...register("message")}
              placeholder="Type your message..."
              className="flex-1 min-h-24"
              required
            />
            <Button type="submit" size="lg" className="self-end">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}