"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Trash2, UserPlus } from "lucide-react";
import { useApiAction } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate } from "@/lib/utils";

interface PairingRow {
  id: string;
  mentorName: string;
  menteeName: string;
  menteeEmail: string;
  mentorDepartment: string;
  menteeDepartment: string;
  matchScore: number;
  meetings: number;
  createdAt: string;
}

interface MentorOption {
  id: string;
  name: string;
  department: string;
  capacity: number;
  active: number;
}

interface WaitlistedMentee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface PairingsManagerProps {
  pairings: PairingRow[];
  mentors: MentorOption[];
  waitlisted: WaitlistedMentee[];
}

export function PairingsManager({
  pairings,
  mentors,
  waitlisted,
}: PairingsManagerProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const [reassignFor, setReassignFor] = useState<PairingRow | null>(null);
  const [assignFor, setAssignFor] = useState<WaitlistedMentee | null>(null);
  const [selectedMentor, setSelectedMentor] = useState("");

  const availableMentors = mentors.filter((m) => m.active < m.capacity);

  const reassign = async () => {
    if (!reassignFor || !selectedMentor) return;
    await run(`/api/admin/pairings/${reassignFor.id}`, {
      method: "PATCH",
      body: JSON.stringify({ mentorProfileId: selectedMentor }),
      successMessage: "Mentee reassigned",
    });
    setReassignFor(null);
    setSelectedMentor("");
    router.refresh();
  };

  const assign = async () => {
    if (!assignFor || !selectedMentor) return;
    await run("/api/admin/pairings", {
      method: "POST",
      body: JSON.stringify({
        menteeProfileId: assignFor.id,
        mentorProfileId: selectedMentor,
      }),
      successMessage: "Pairing created",
    });
    setAssignFor(null);
    setSelectedMentor("");
    router.refresh();
  };

  const endPairing = async (id: string) => {
    await run(`/api/admin/pairings/${id}`, {
      method: "DELETE",
      successMessage: "Pairing ended",
    });
    router.refresh();
  };

  const mentorPicker = (
    <Select value={selectedMentor} onValueChange={setSelectedMentor}>
      <SelectTrigger>
        <SelectValue placeholder="Choose a mentor with free capacity" />
      </SelectTrigger>
      <SelectContent>
        {availableMentors.map((mentor) => (
          <SelectItem key={mentor.id} value={mentor.id}>
            {mentor.name} · {mentor.department} ({mentor.active}/
            {mentor.capacity})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-6">
      {waitlisted.length > 0 && (
        <Card className="border-warning">
          <CardHeader>
            <CardTitle>Waitlisted mentees ({waitlisted.length})</CardTitle>
            <CardDescription>
              No mentor with free capacity was found for these mentees. Assign
            one manually or wait for automatic retry when a mentor frees up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {waitlisted.map((mentee) => (
              <div
                key={mentee.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{mentee.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {mentee.department} · {mentee.email}
                  </p>
                </div>
                <Dialog
                  open={assignFor?.id === mentee.id}
                  onOpenChange={(open) => {
                    setAssignFor(open ? mentee : null);
                    setSelectedMentor("");
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4" /> Assign mentor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign a mentor to {mentee.name}</DialogTitle>
                      <DialogDescription>
                        Capacity limits are enforced — full mentors are hidden.
                      </DialogDescription>
                    </DialogHeader>
                    {mentorPicker}
                    <DialogFooter>
                      <Button
                        onClick={assign}
                        disabled={pending || !selectedMentor}
                      >
                        Create pairing
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active pairings ({pairings.length})</CardTitle>
          <CardDescription>
            Reassign a mentee to a different mentor or end a pairing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentee</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead className="hidden md:table-cell">Match</TableHead>
                <TableHead className="hidden md:table-cell">Meetings</TableHead>
                <TableHead className="hidden lg:table-cell">Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pairings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No active pairings yet.
                  </TableCell>
                </TableRow>
              )}
              {pairings.map((pairing) => (
                <TableRow key={pairing.id}>
                  <TableCell>
                    <div className="font-medium">{pairing.menteeName}</div>
                    <div className="text-xs text-muted-foreground">
                      {pairing.menteeDepartment}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{pairing.mentorName}</div>
                    <div className="text-xs text-muted-foreground">
                      {pairing.mentorDepartment}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{pairing.matchScore}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {pairing.meetings}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(pairing.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog
                        open={reassignFor?.id === pairing.id}
                        onOpenChange={(open) => {
                          setReassignFor(open ? pairing : null);
                          setSelectedMentor("");
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <ArrowLeftRight className="h-4 w-4" />
                            <span className="hidden sm:inline">Reassign</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Reassign {pairing.menteeName}
                            </DialogTitle>
                            <DialogDescription>
                              The current pairing with {pairing.mentorName}{" "}
                              will be ended and both parties notified.
                            </DialogDescription>
                          </DialogHeader>
                          {mentorPicker}
                          <DialogFooter>
                            <Button
                              onClick={reassign}
                              disabled={pending || !selectedMentor}
                            >
                              Reassign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <ConfirmDialog
                        trigger={
                          <Button
                            size="sm"
                            variant="outline"
                            aria-label="End pairing"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        title={`End pairing for ${pairing.menteeName}?`}
                        description="The mentee will be placed back on the waitlist."
                        confirmLabel="End pairing"
                        destructive
                        onConfirm={() => endPairing(pairing.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
