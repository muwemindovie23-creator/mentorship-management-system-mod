"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MessagesSquare, Search, Users } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

interface SearchResults {
  mentors: { id: string; name: string; email: string; department: string }[];
  mentees: { id: string; name: string; email: string; department: string }[];
  meetings: {
    id: string;
    topics: string;
    date: string;
    mentor: string;
    mentee: string;
  }[];
  messages: {
    id: string;
    body: string;
    createdAt: string;
    from: string;
    to: string;
  }[];
  semesters: { id: string; name: string; isActive: boolean }[];
}

const EMPTY: SearchResults = {
  mentors: [],
  mentees: [],
  meetings: [],
  messages: [],
  semesters: [],
};

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults(EMPTY);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => (res.ok ? res.json() : EMPTY))
      .then((data: SearchResults) => {
        if (!cancelled) setResults({ ...EMPTY, ...data });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const hasResults =
    results.mentors.length +
      results.mentees.length +
      results.meetings.length +
      results.messages.length +
      results.semesters.length >
    0;

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          autoFocus
          className="pl-9"
          placeholder="Type at least two characters…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {!loading && debouncedQuery.length >= 2 && !hasResults && (
        <p className="text-muted-foreground">
          No results for “{debouncedQuery}”.
        </p>
      )}

      {!loading && hasResults && (
        <div className="grid gap-4 lg:grid-cols-2">
          {results.mentors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Mentors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.mentors.map((mentor) => (
                  <div key={mentor.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-muted-foreground">
                      {mentor.email} · {mentor.department}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {results.mentees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Mentees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.mentees.map((mentee) => (
                  <div key={mentee.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{mentee.name}</p>
                    <p className="text-muted-foreground">
                      {mentee.email} · {mentee.department}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {results.meetings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4" /> Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.meetings.map((meeting) => (
                  <div key={meeting.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{meeting.topics}</p>
                    <p className="text-muted-foreground">
                      {meeting.mentor} → {meeting.mentee} ·{" "}
                      {formatDate(meeting.date)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {results.messages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessagesSquare className="h-4 w-4" /> Messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.messages.map((message) => (
                  <div key={message.id} className="rounded-md border p-3 text-sm">
                    <p className="line-clamp-2">{message.body}</p>
                    <p className="text-muted-foreground">
                      {message.from} → {message.to} ·{" "}
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {results.semesters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4" /> Semesters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.semesters.map((semester) => (
                  <div
                    key={semester.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <span className="font-medium">{semester.name}</span>
                    {semester.isActive && <Badge>Active</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
