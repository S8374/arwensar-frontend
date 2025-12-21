// src/components/pages/dashboard/supplier/EvidenceUploadPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function EvidenceUploadPage() {
  const [date, setDate] = useState<Date>();

  const documents = [
    {
      name: "ISO 27001 Certificate",
      type: "PDF",
      category: "certificate",
      uploaded: "2025-05-15",
      expiry: "2025-02-20",
      status: "accepted",
    },
    {
      name: "Privacy Policy",
      type: "DOCX",
      category: "policy",
      uploaded: "2025-01-15",
      expiry: null,
      status: "pending",
    },
    {
      name: "Risk Assessment Report",
      type: "PDF",
      category: "report",
      uploaded: "2025-01-15",
      expiry: "2025-02-20",
      status: "accepted",
    },
    {
      name: "Security Certificate",
      type: "PDF",
      category: "certificate",
      uploaded: "2024-11-05",
      expiry: "2025-02-10",
      status: "expired",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-background text-green border">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-background text-destructive border">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-destructive/10 text-destructive border">
            <XCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-foreground">Upload Evidence</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your compliance documents and certificates
          </p>
        </div>
      </div>

      <div className=" mx-auto px-6 py-10">
        {/* Upload Area */}
        <Card className="border-dashed border-2  bg-background">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center">
              <Upload className="w-10 h-10 text-chart-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Upload New Evidence</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Drag and drop files here, or click to browse
              </p>
            </div>
            <Button className="bg-chart-6 hover:bg-chart-6/90">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, XLSX, PNG, JPG, JPEG (Max 10MB)
            </p>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8 items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="certificate">Certificates</SelectItem>
              <SelectItem value="policy">Policies</SelectItem>
              <SelectItem value="report">Reports</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Documents Table */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.name} className="">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-foreground" />
                        {doc.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{doc.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.uploaded}
                    </TableCell>
                    <TableCell className="text-sm">
                      {doc.expiry ? (
                        <span className={cn(
                          doc.status === "expired" ? "text-destructive font-medium" : "text-foreground"
                        )}>
                          {doc.expiry}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="outline" size="sm">Replace</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}