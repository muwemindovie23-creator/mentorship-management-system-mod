"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  Mail,
  MailOpen,
  MessageCircle,
  Phone,
  Search,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppLink, cn, formatDateTime, getInitials } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ConversationSummary {
  otherUser: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
  };
  lastMessage: { id: string; body: string; createdAt: string };
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

interface OtherUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export function MessagesClient() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/messages");
    if (res.ok) {
      const data = (await res.json()) as {
        conversations: ConversationSummary[];
      };
      setConversations(data.conversations);
    }
    setLoadingList(false);
  }, []);

  const loadContacts = useCallback(async () => {
    const res = await fetch("/api/messages/contacts");
    if (res.ok) {
      const data = (await res.json()) as { contacts: Contact[] };
      setContacts(data.contacts);
    }
  }, []);

  const openThread = useCallback(async (userId: string) => {
    setActiveUserId(userId);
    setLoadingThread(true);
    const res = await fetch(`/api/messages?with=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = (await res.json()) as {
        messages: Message[];
        other: OtherUser | null;
      };
      setMessages(data.messages);
      setOtherUser(data.other);
    }
    setLoadingThread(false);
  }, []);

  useEffect(() => {
    void loadConversations();
    void loadContacts();
  }, [loadConversations, loadContacts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!draft.trim() || !activeUserId) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: activeUserId, body: draft }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        toast.error(data.error ?? "Failed to send");
        return;
      }
      setDraft("");
      await openThread(activeUserId);
      await loadConversations();
    } finally {
      setSending(false);
    }
  };

  const toggleRead = async (message: Message) => {
    await fetch(`/api/messages/${message.id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: message.readAt === null }),
    });
    if (activeUserId) await openThread(activeUserId);
    await loadConversations();
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.otherUser.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.body.toLowerCase().includes(search.toLowerCase())
  );

  const whatsapp = buildWhatsAppLink(
    otherUser?.phone,
    "Hi! Reaching out from Menty, the peer mentorship platform."
  );

  return (
    <Card className="grid min-h-[600px] overflow-hidden lg:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <div className="flex flex-col border-r">
        <div className="space-y-2 border-b p-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations…"
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select onValueChange={(v) => void openThread(v)}>
            <SelectTrigger>
              <SelectValue placeholder="New conversation…" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name} ({contact.role.toLowerCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          {!loadingList && filteredConversations.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">
              No conversations yet — start one above.
            </p>
          )}
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.otherUser.id}
              onClick={() => void openThread(conversation.otherUser.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b p-3 text-left transition-colors hover:bg-accent",
                activeUserId === conversation.otherUser.id && "bg-accent"
              )}
            >
              <Avatar>
                <AvatarFallback>
                  {getInitials(conversation.otherUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium">
                    {conversation.otherUser.name}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="ml-2">{conversation.unreadCount}</Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {conversation.lastMessage.body}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex flex-col">
        {!activeUserId ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
            <MessageCircle className="h-10 w-10" />
            <p className="text-sm">Select a conversation to start chatting.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b p-3">
              <div>
                <p className="font-medium">{otherUser?.name ?? "…"}</p>
                <p className="text-xs text-muted-foreground">
                  {otherUser?.email}
                </p>
              </div>
              {/* Quick actions */}
              <div className="flex gap-1">
                {otherUser && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${otherUser.email}`}>
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">Send email</span>
                    </a>
                  </Button>
                )}
                {whatsapp && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingThread && (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-2/3" />
                  <Skeleton className="ml-auto h-10 w-2/3" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              )}
              {!loadingThread &&
                messages.map((message) => {
                  const isMine = message.senderId !== activeUserId;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col gap-1",
                        isMine ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] whitespace-pre-line rounded-lg px-3 py-2 text-sm",
                          isMine
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        {message.body}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                        {!isMine && (
                          <button
                            onClick={() => void toggleRead(message)}
                            className="inline-flex items-center gap-1 hover:text-foreground"
                            title={
                              message.readAt ? "Mark as unread" : "Mark as read"
                            }
                          >
                            {message.readAt ? (
                              <MailOpen className="h-3 w-3" />
                            ) : (
                              <Mail className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 border-t p-3">
              <Textarea
                rows={1}
                placeholder="Write a message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                className="min-h-[40px] resize-none"
              />
              <Button onClick={() => void send()} disabled={sending || !draft.trim()}>
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
