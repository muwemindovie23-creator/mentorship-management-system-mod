"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, Trash2, X } from "lucide-react";
import type { Role, UserStatus } from "@prisma/client";
import { useDebounce } from "@/hooks/use-debounce";
import { useApiAction } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  mentorProfile: { department: string; registrationNumber: string } | null;
  menteeProfile: {
    department: string;
    registrationNumber: string;
    waitlisted: boolean;
  } | null;
}

export function UsersTable() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>(
    searchParams.get("status") ?? "all"
  );
  const [role, setRole] = useState<string>("all");
  const debouncedQuery = useDebounce(query);
  const { run, pending } = useApiAction();

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (role !== "all") params.set("role", role);
    if (debouncedQuery) params.set("q", debouncedQuery);
    params.set("page", String(page));
    try {
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = (await res.json()) as { users: AdminUser[]; total: number };
      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [status, role, debouncedQuery, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (id: string, action: "approve" | "reject") => {
    await run(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action }),
      successMessage: action === "approve" ? "User approved" : "User rejected",
    });
    await load();
  };

  const remove = async (id: string) => {
    await run(`/api/admin/users/${id}`, {
      method: "DELETE",
      successMessage: "User deleted",
    });
    await load();
  };

  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="sm:max-w-xs"
          />
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
              <SelectItem value="MENTOR">Mentors</SelectItem>
              <SelectItem value="MENTEE">Mentees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">
                  Department
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Registered
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No users match your filters.
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => {
                const department =
                  user.mentorProfile?.department ??
                  user.menteeProfile?.department ??
                  "—";
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                      {user.menteeProfile?.waitlisted && (
                        <Badge variant="warning" className="ml-1">
                          Waitlist
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {department}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {user.status === "PENDING" && (
                          <>
                            <ConfirmDialog
                              trigger={
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={pending}
                                  aria-label={`Approve ${user.name}`}
                                >
                                  {pending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4 text-success" />
                                  )}
                                </Button>
                              }
                              title={`Approve ${user.name}?`}
                              description="They will be able to log in immediately. Mentees are auto-paired with a mentor if one is available."
                              confirmLabel="Approve"
                              onConfirm={() => decide(user.id, "approve")}
                            />
                            <ConfirmDialog
                              trigger={
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={pending}
                                  aria-label={`Reject ${user.name}`}
                                >
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              }
                              title={`Reject ${user.name}?`}
                              description="They will be notified by email and will not be able to log in."
                              confirmLabel="Reject"
                              destructive
                              onConfirm={() => decide(user.id, "reject")}
                            />
                          </>
                        )}
                        {user.role !== "ADMIN" && (
                          <ConfirmDialog
                            trigger={
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={pending}
                                aria-label={`Delete ${user.name}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title={`Delete ${user.name}?`}
                            description="This permanently removes the account, profile, pairings and messages. This cannot be undone."
                            confirmLabel="Delete"
                            destructive
                            onConfirm={() => remove(user.id)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {total} user{total === 1 ? "" : "s"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              {page} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
