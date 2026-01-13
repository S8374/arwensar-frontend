/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/pages/dashboard/admin/users/user.management.tsx
import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    Download,
    Trash2,
    Edit,
    Shield,
    ShieldOff,
    Mail,
    Eye,
    Check,
    Ban,
    RefreshCw,
} from "lucide-react";
import {
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useToggleUserBlockMutation,
    useBulkDeleteUsersMutation,
    useBulkUpdateUsersMutation,
    useBulkVerifyUsersMutation,
    useExportUsersToCSVMutation,
} from "@/redux/features/admin/admin.api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users2 } from "lucide-react"; // add this

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    const { data: usersData, isLoading, refetch } = useGetAllUsersQuery();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [toggleBlock] = useToggleUserBlockMutation();
    const [bulkDelete] = useBulkDeleteUsersMutation();
    const [bulkUpdate] = useBulkUpdateUsersMutation();
    const [bulkVerify] = useBulkVerifyUsersMutation();
    const [exportCSV] = useExportUsersToCSVMutation();
    console.log("usersData", usersData);
    const users = usersData?.data || [];

    // Filter users
    const filteredUsers = users.filter((user: any) => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || user.status === statusFilter;
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    });

    // Handle user actions
    const handleUpdateUser = async (userId: string, data: any) => {
        try {
            await updateUser({ userId, data }).unwrap();
            toast.success("User updated successfully");
        } catch (error) {
            toast.error("Failed to update user");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId).unwrap();
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleToggleBlock = async (userId: string, currentStatus: string) => {
        const block = currentStatus !== "SUSPENDED"; // true if we want to block

        try {
            await toggleBlock({ userId, block }).unwrap(); // pass object instead of just userId
            toast.success(`User ${block ? "blocked" : "unblocked"} successfully`);
        } catch (error) {
            toast.error(`Failed to ${block ? "block" : "unblock"} user`);
        }
    };

    // Bulk operations
    const handleBulkDelete = async () => {
        if (selectedUsers.length === 0) {
            toast.warning("Please select users to delete");
            return;
        }

        if (
            window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)
        ) {
            try {
                await bulkDelete({ userIds: selectedUsers }).unwrap();
                toast.success(`${selectedUsers.length} users deleted successfully`);
                setSelectedUsers([]);
            } catch (error) {
                toast.error("Failed to delete users");
            }
        }
    };

    const handleBulkVerify = async () => {
        if (selectedUsers.length === 0) {
            toast.warning("Please select users to verify");
            return;
        }

        try {
            await bulkVerify({ userIds: selectedUsers }).unwrap();
            toast.success(`${selectedUsers.length} users verified successfully`);
            setSelectedUsers([]);
        } catch (error) {
            toast.error("Failed to verify users");
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await exportCSV().unwrap();
            const blob = new Blob([response], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Users exported successfully");
        } catch (error) {
            toast.error("Failed to export users");
        }
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map((user: any) => user.id));
        }
    };

    // Toggle single user selection
    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    if (isLoading) {
        return <UsersSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-500">
                        Manage all users, permissions, and access controls
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account with specific role and permissions.
                                </DialogDescription>
                            </DialogHeader>
                            {/* Add user form would go here */}
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button>Create User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters and Actions */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 flex gap-2">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search users by email or phone..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-2 space-y-2">
                                        <div>
                                            <label className="text-sm font-medium">Status</label>
                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                    <SelectItem value="DELETED">Deleted</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Role</label>
                                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Roles</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                    <SelectItem value="VENDOR">Vendor</SelectItem>
                                                    <SelectItem value="SUPPLIER">Supplier</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tabs value={viewMode} onValueChange={setViewMode}>
                                <TabsList>
                                    <TabsTrigger value="table">Table</TabsTrigger>
                                    <TabsTrigger value="card">Cards</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Button variant="outline" size="icon" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedUsers.length > 0 && (
                        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Check className="h-5 w-5 text-amber-600" />
                                    <span className="font-medium">
                                        {selectedUsers.length} user(s) selected
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleBulkVerify}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Verify Selected
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {/* Implement bulk update */ }}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Update Selected
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkDelete}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Selected
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={users.length}
                    icon={Users2}
                    trend="+12%"
                />
                <StatCard
                    title="Active Users"
                    value={users.filter((u: any) => u.status === "ACTIVE").length}
                    icon={Check}
                    trend="+8%"
                />
                <StatCard
                    title="Pending Verification"
                    value={users.filter((u: any) => !u.isVerified).length}
                    icon={Mail}
                    trend="-3%"
                />
                <StatCard
                    title="Suspended Users"
                    value={users.filter((u: any) => u.status === "SUSPENDED").length}
                    icon={Ban}
                    trend="+2%"
                />
            </div>

            {/* Users Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            {filteredUsers.length} users found
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {viewMode === "table" ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedUsers.length === filteredUsers.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => toggleUserSelection(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    {user.profileImage ? (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.email}
                                                            className="h-10 w-10 rounded-full"
                                                        />
                                                    ) : (
                                                        <span className="font-medium">
                                                            {user.email[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.email}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.phoneNumber || "No phone"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.role === "ADMIN" ? "default" :
                                                    user.role === "VENDOR" ? "secondary" :
                                                        "outline"
                                            }>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                user.status === "ACTIVE" ? "default" :
                                                    user.status === "SUSPENDED" ? "destructive" :
                                                        "outline"
                                            }>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isVerified ? "outline" : "secondary"}>
                                                {user.isVerified ? "Verified" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLoginAt
                                                ? new Date(user.lastLoginAt).toLocaleDateString()
                                                : "Never"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleBlock(user.id, user.status)}
                                                    >
                                                        {user.status === "SUSPENDED" ? (
                                                            <>
                                                                <Shield className="h-4 w-4 mr-2" />
                                                                Unblock User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShieldOff className="h-4 w-4 mr-2" />
                                                                Block User
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        // Card View
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredUsers.map((user: any) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onSelect={() => toggleUserSelection(user.id)}
                                    isSelected={selectedUsers.includes(user.id)}
                                    onDelete={() => handleDeleteUser(user.id)}
                                    onToggleBlock={() => handleToggleBlock(user.id, user.status)}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// User Card Component (for card view)
function UserCard({ user, onSelect, isSelected, onDelete, onToggleBlock }: any) {
    return (
        <Card className={`relative ${isSelected ? "ring-2 ring-indigo-500" : ""}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.email}
                                    className="h-12 w-12 rounded-full"
                                />
                            ) : (
                                <span className="font-medium text-lg">
                                    {user.email[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onToggleBlock}>
                                {user.status === "SUSPENDED" ? (
                                    <>
                                        <Shield className="h-4 w-4 mr-2" />
                                        Unblock
                                    </>
                                ) : (
                                    <>
                                        <ShieldOff className="h-4 w-4 mr-2" />
                                        Block
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                    <div>
                        <h3 className="font-semibold">{user.email}</h3>
                        <p className="text-sm text-gray-500">{user.phoneNumber || "No phone"}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={
                            user.role === "ADMIN" ? "default" :
                                user.role === "VENDOR" ? "secondary" :
                                    "outline"
                        }>
                            {user.role}
                        </Badge>
                        <Badge variant={
                            user.status === "ACTIVE" ? "default" :
                                user.status === "SUSPENDED" ? "destructive" :
                                    "outline"
                        }>
                            {user.status}
                        </Badge>
                        <Badge variant={user.isVerified ? "outline" : "secondary"}>
                            {user.isVerified ? "✓ Verified" : "Pending"}
                        </Badge>
                    </div>

                    <div className="text-sm text-gray-500">
                        <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                        <div>
                            Last login:{" "}
                            {user.lastLoginAt
                                ? new Date(user.lastLoginAt).toLocaleDateString()
                                : "Never"}
                        </div>
                    </div>

                    {user.vendorProfile && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Vendor Profile</div>
                            <div>{user.vendorProfile.companyName}</div>
                        </div>
                    )}

                    {user.supplierProfile && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Supplier Profile</div>
                            <div>{user.supplierProfile.name}</div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{title}</p>
                        <h3 className="text-2xl font-bold mt-2">{value}</h3>
                        <div className="flex items-center mt-1">
                            <span className={`text-sm font-medium ${trend.startsWith("+") ? "text-green-600" : "text-red-600"
                                }`}>
                                {trend}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-50">
                        <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function UsersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-24" />
            <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
            <Skeleton className="h-[400px]" />
        </div>
    );
}