import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetAllAssainmentQuery, useGetSubmissionByIdQuery } from "@/redux/features/vendor/vendor.api";

interface Assessment {
  id: string;
  examId: string;
  title: string;
  description: string;
  isActive: boolean;
  _count: { submissions: number };
  updatedAt: string;
}

export default function ComplianceTable() {
  const { data: userData } = useUserInfoQuery(undefined);
  const { data: assainmentData, isLoading: isLoadingAss } = useGetAllAssainmentQuery(undefined);

  // Use supplierId from userData to fetch submissions
  const supplierId = userData?.data?.supplier?.id;
  const { data: mySubmissions, isLoading: isLoadingSub } = useGetSubmissionByIdQuery(
    supplierId || "",
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const navigate = useNavigate();

  if (isLoadingAss || isLoadingSub) return <p>Loading assessments...</p>;

  // Helper to get the user’s submission for a given assessment
  const getUserSubmission = (assessmentId: string) => {
    return mySubmissions?.data?.find((sub: any) => sub.assessmentId === assessmentId);
  };

  const getStatusBadge = (submission: any) => {
    if (!submission) return <Badge variant="secondary" className="bg-muted border-2 text-foreground">Not Started</Badge>;
    if (submission.progress > 0 && submission.progress < 100) return <Badge className="border">In Progress</Badge>;
    if (submission.progress === 100) return <Badge className="text-background border bg-green/80">Completed</Badge>;
    return <Badge variant="secondary" className="bg-muted border-2 text-foreground">Not Started</Badge>;
  };

  const getProgressValue = (submission: any) => {
    if (!submission) return 0;
    return Math.floor((submission.answeredQuestions / submission.totalQuestions) * 100);
  };
  console.log("assainmentData", assainmentData)
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <h2 className="text-xl font-semibold text-foreground">Compliance Progress</h2>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-0">
              <TableHead className="text-muted-foreground text-xs font-medium">Assessment Name</TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">Progress</TableHead>
              <TableHead className="text-muted-foreground text-xs font-medium">Last Updated</TableHead>
              <TableHead className="text-right text-muted-foreground text-xs font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assainmentData?.data?.data?.map((item: Assessment) => {
              const submission = getUserSubmission(item.id);
              const progress = getProgressValue(submission);

              return (
                <TableRow key={item.id} className="border-t border">
                  <TableCell className="font-medium text-foreground py-5">{item.title}</TableCell>
                  <TableCell>{getStatusBadge(submission)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={progress}
                        className={cn("w-20 h-4 bg-ring")}
                      />
                      <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{submission ? new Date(submission.updatedAt).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/supplier/assessments/${item.examId}/review`)}
                        className="text-chart-6 hover:bg-chart-6/20"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-chart-6 hover:bg-chart-6/90 text-background"
                        onClick={() => navigate(`/supplier/assessments/${item.id}`)}
                      >
                        {submission ? "Continue" : "Start"}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


















// // src/components/pages/dashboard/supplier/ComplianceTable.tsx
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Eye, ArrowRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import { useGetAllAssainmentQuery } from "@/redux/features/vendor/vendor.api";

// interface Assessment {
//   name: string;
//   type: "Full" | "Initial";
//   status: "In Progress" | "Completed" | "Not Started";
//   progress: number;
//   score: number | null;
//   lastUpdated: string;
// }

// const assessments: Assessment[] = [
//   { name: "Data Security Assessment", type: "Full", status: "In Progress", progress: 65, score: null, lastUpdated: "2 days ago" },
//   { name: "HR Policy Compliance", type: "Initial", status: "Completed", progress: 100, score: 92, lastUpdated: "1 week ago" },
//   { name: "Risk Management Framework", type: "Full", status: "In Progress", progress: 40, score: 0, lastUpdated: "3 days ago" },
//   { name: "Environmental Standards", type: "Initial", status: "Not Started", progress: 0, score: 30, lastUpdated: "Never" },
// ];

// export default function ComplianceTable() {

//   const { data: userData, isLoading: userLoading } = useUserInfoQuery(undefined);
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "In Progress":
//         return <Badge className=" border ">In Progress</Badge>;
//       case "Completed":
//         return <Badge className="text-background border bg-green/80">Completed</Badge>;
//       case "Not Started":
//         return <Badge variant="secondary" className="bg-muted border-2 text-foreground">Not Started</Badge>;
//       default:
//         return null;
//     }
//   };

//   const getProgressColor = (progress: number) => {
//     if (progress === 100) return "bg-ring";
//     if (progress > 0) return "bg-ring";
//     return "bg-ring";
//   };
//   const navigate = useNavigate();
//   const {data: assainmentData} = useGetAllAssainmentQuery(undefined) ;

//   console.log("userData.....................", userData , assainmentData);
//   return (
//     <Card className="border-0 shadow-sm">
//       <CardHeader className="pb-4">
//         <h2 className="text-xl font-semibold text-foreground">Compliance Progress</h2>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Table>
//           <TableHeader>
//             <TableRow className="border-0">
//               <TableHead className="text-muted-foreground text-xs font-medium">Assessment Name</TableHead>
//               <TableHead className="text-muted-foreground text-xs font-medium">Type</TableHead>
//               <TableHead className="text-muted-foreground text-xs font-medium">Status</TableHead>
//               <TableHead className="text-muted-foreground text-xs font-medium">Progress</TableHead>
//               <TableHead className="text-muted-foreground text-xs font-medium">Score</TableHead>
//               <TableHead className="text-muted-foreground text-xs font-medium">Last Updated</TableHead>
//               <TableHead className="text-right text-muted-foreground text-xs font-medium">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {assessments.map((item) => (
//               <TableRow key={item.name} className="border-t border">
//                 <TableCell className="font-medium text-foreground py-5">
//                   {item.name}
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="text-xs">
//                     {item.type}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>{getStatusBadge(item.status)}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <Progress
//                       value={item.progress}
//                       className={cn("w-20 h-4", getProgressColor(item.progress))}
//                     />
//                     <span className={cn(
//                       "text-sm font-medium",
//                       item.progress === 100 ? "text-foreground" : "text-muted-foreground"
//                     )}>
//                       {item.progress}%
//                     </span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   {item.score !== null ? (
//                     <span className="inline-flex items-center justify-center w-12 h-8 rounded-full bg-background text-green font-bold text-sm">
//                       {item.score}%
//                     </span>
//                   ) : (
//                     <span className="text-muted-foreground">—</span>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-muted-foreground text-sm">
//                   {item.lastUpdated}
//                 </TableCell>
//                 <TableCell className="text-right py-4">
//                   <div className="flex items-center justify-end gap-3">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate("/supplier/assessments/data-security/review")}
//                       className="text-chart-6 hover:bg-chart-6/20"
//                     >
//                       <Eye className="w-4 h-4 mr-1" />
//                       View
//                     </Button>
//                     <Button
//                       size="sm"
//                       className="bg-chart-6 hover:bg-chart-6/90 text-background"
//                       onClick={() => navigate("/supplier/assessments/data-security")}  // Add this
//                     >
//                       {item.name === "Data Security Assessment" ? "Continue" : "Start"}
//                       <ArrowRight className="w-4 h-4 ml-1" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// } 