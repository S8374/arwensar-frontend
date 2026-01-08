/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/pages/dashboard/shared/ProblemDetail.tsx
// import { useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { format } from "date-fns";
// import {
//   useGetProblemByIdQuery,
//   useCreateProblemMessageMutation,
//   type CreateMessagePayload,
// } from "@/redux/features/problem/problem.api";
// import { useForm } from "react-hook-form";
// import { Send } from "lucide-react";

// const statusColors: Record<string, string> = {
//   Open: "bg-green-100 text-green-800",
//   Closed: "bg-red-100 text-red-800",
//   Pending: "bg-yellow-100 text-yellow-800",
// };

// const priorityColors: Record<string, string> = {
//   Low: "bg-blue-100 text-blue-800",
//   Medium: "bg-amber-100 text-amber-800",
//   High: "bg-red-100 text-red-800",
// };

// export default function ProblemDetail() {
//   const { problemId } = useParams<{ problemId: string }>();

//   // Fetch problem with polling every 5s for real-time updates
//   const { data, isLoading } = useGetProblemByIdQuery(problemId!, {
//     pollingInterval: 10, // 5 seconds
//   });

//   // Mutation to send messages with optimistic update
//   const [createMessage] = useCreateProblemMessageMutation();

//   const problem = data?.data;

//   const { register, handleSubmit, reset } = useForm();

//   // Send message handler
//   const onSendMessage = async (formData: any) => {
//     if (!formData.message) return;

//     try {
//       await createMessage({
//         problemId: problemId!,
//         body: { content: formData.message } as unknown as CreateMessagePayload, // ✅ force TS to accept it,
//       }).unwrap();
//       reset();
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (!problem) return <div>Problem not found.</div>;

//   return (
//     <div className="space-y-8">
//       {/* Problem Header */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
//               <div className="flex items-center gap-3">
//                 <Badge className={priorityColors[problem.priority] || ""}>
//                   {problem.priority}
//                 </Badge>
//                 <Badge className={statusColors[problem.status] || ""}>
//                   {problem.status}
//                 </Badge>
//                 <span className="text-sm text-muted-foreground">
//                   Reported {format(new Date(problem.createdAt), "MMM dd, yyyy")}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <p className="text-lg">{problem.description}</p>
//           {problem.supplier && (
//             <p className="mt-4 text-muted-foreground">
//               Supplier: <strong>{problem.supplier.name}</strong> ({problem.supplier.email})
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Messages */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Conversation</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
//             {problem.messages?.map((msg: any) => (
//               <div
//                 key={msg.id}
//                 className={`flex gap-3 ${
//                   msg.sender.role === "VENDOR" ? "flex-row-reverse" : ""
//                 }`}
//               >
//                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
//                   <span className="text-sm font-medium">
//                     {msg.sender.email[0].toUpperCase()}
//                   </span>
//                 </div>
//                 <div className={`max-w-lg ${msg.sender.role === "VENDOR" ? "text-right" : ""}`}>
//                   <p className="text-sm text-muted-foreground">
//                     {msg.sender.email} • {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
//                   </p>
//                   <div className="mt-1 p-4 bg-muted rounded-lg">
//                     <p className="whitespace-pre-wrap">{msg.content}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Send Message */}
//           <form onSubmit={handleSubmit(onSendMessage)} className="flex gap-3">
//             <Textarea
//               {...register("message")}
//               placeholder="Type your message..."
//               className="flex-1 min-h-24"
//               required
//             />
//             <Button type="submit" size="lg" className="self-end">
//               <Send className="w-5 h-5" />
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  useGetProblemByIdQuery,
  useCreateProblemMessageMutation,
  type CreateMessagePayload,
} from "@/redux/features/problem/problem.api";
import { useForm } from "react-hook-form";
import { Send, Paperclip } from "lucide-react";
import { useMinioUpload } from "@/lib/useMinioUpload";

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

  const { data, isLoading } = useGetProblemByIdQuery(problemId!, { pollingInterval: 5000 });
  const [createMessage] = useCreateProblemMessageMutation();
  const problem = data?.data;

  const { register, handleSubmit, reset, setValue } = useForm();
  const { uploadFile, isUploading, uploadProgress, resetUpload } = useMinioUpload();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [problem?.messages]);

  const onSendMessage = async (formData: any) => {
    if (!formData.message && !formData.file) return;

    let fileUrl: string | undefined;
    if (formData.file && formData.file.length > 0) {
      fileUrl = await uploadFile(formData.file[0]);
    }

    try {
      await createMessage({
        problemId: problemId!,
        body: { content: formData.message || "", attachment: fileUrl } as unknown as CreateMessagePayload,
      }).unwrap();
      reset();
      resetUpload();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!problem) return <div>Problem not found.</div>;

  return (
    <div className="space-y-6  mx-auto">
      {/* Problem Header */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={priorityColors[problem.priority]}>{problem.priority}</Badge>
              <Badge className={statusColors[problem.status]}>{problem.status.replace("_", " ")}</Badge>
              <span className="text-sm text-muted-foreground">
                Reported {format(new Date(problem.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
          {problem.supplier && (
            <div className="text-right text-sm text-muted-foreground mt-2 md:mt-0">
              Supplier: <strong>{problem.supplier.name}</strong> ({problem.supplier.email})
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-lg">{problem.description}</p>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="overflow-y-auto max-h-[500px] space-y-4 px-2">
            {problem.messages?.map((msg: any) => {
              const isVendor = msg.sender.role === "VENDOR";
              return (
                <div key={msg.id} className={`flex ${isVendor ? "justify-end" : "justify-start"}`}>
                  <div className={`flex flex-col max-w-lg ${isVendor ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isVendor ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {msg.sender.email[0].toUpperCase()}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {msg.sender.email} • {format(new Date(msg.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-xl ${
                        isVendor ? "bg-blue-50 text-blue-900 rounded-br-none" : "bg-gray-100 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.attachment && (
                        <a
                          href={msg.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-blue-600 hover:underline"
                        >
                          <Paperclip className="w-4 h-4 mr-1" />
                          View Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Send Message */}
          <form onSubmit={handleSubmit(onSendMessage)} className="flex flex-col md:flex-row gap-2 items-end mt-2">
            <Textarea
              {...register("message")}
              placeholder="Type your message..."
              className="flex-1 min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <input
                type="file"
                {...register("file")}
                className="file-input file-input-bordered w-full md:w-auto"
              />
              <Button type="submit" size="lg" disabled={isUploading} className="flex items-center gap-2">
                <Send className="w-5 h-5" /> Send
              </Button>
            </div>
          </form>
          {isUploading && (
            <progress className="w-full h-2 rounded bg-gray-200 mt-2" value={uploadProgress} max={100}></progress>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
