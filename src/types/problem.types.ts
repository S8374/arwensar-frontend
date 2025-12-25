// src/types/problem.types.ts
export interface Problem {
  id: string;
  title: string;
  description: string;
  type: 'QUALITY_ISSUE' | 'DELIVERY_DELAY' | 'COMMUNICATION' | 'CONTRACT_VIOLATION' | 'PAYMENT_ISSUE' | 'COMPLIANCE' | 'TECHNICAL' | 'OTHER';
  direction: 'VENDOR_TO_SUPPLIER' | 'SUPPLIER_TO_VENDOR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
  reportedById: string;
  reportedBy: {
    id: string;
    email: string;
    role: 'ADMIN' | 'VENDOR' | 'SUPPLIER';
  };
  assignedToId?: string;
  assignedTo?: {
    id: string;
    email: string;
  };
  vendorId: string;
  supplierId: string;
  supplier: {
    id: string;
    name: string;
    email: string;
  };
  resolutionNotes?: string;
  resolvedAt?: string;
  dueDate?: string;
  slaBreached: boolean;
  firstResponseAt?: string;
  attachments: string[];
  internalNotes?: string;
  supplierNotes?: string;
  createdAt: string;
  updatedAt: string;
  lastUpdatedAt: string;
  messages: ProblemMessage[];
  _count?: {
    messages: number;
  };
}

export interface ProblemMessage {
  id: string;
  content: string;
  isInternal: boolean;
  attachments: string[];
  problemId: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    role: 'ADMIN' | 'VENDOR' | 'SUPPLIER';
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProblemStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byType: Record<string, number>;
  overdue: number;
  recentlyResolved: number;
}

export interface CreateProblemData {
  title: string;
  description: string;
  type: Problem['type'];
  direction: Problem['direction'];
  priority: Problem['priority'];
  supplierId: string;
  dueDate?: string;
  attachments?: string[];
  initialMessage?: string;
  isInternal?: boolean;
}

export interface UpdateProblemData {
  title?: string;
  description?: string;
  type?: Problem['type'];
  priority?: Problem['priority'];
  status?: Problem['status'];
  resolutionNotes?: string;
  assignedToId?: string;
  internalNotes?: string;
  supplierNotes?: string;
  dueDate?: string;
}

export interface CreateMessageData {
  content: string;
  isInternal?: boolean;
  attachments?: string[];
}