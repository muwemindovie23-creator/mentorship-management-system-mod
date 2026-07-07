import { PageHeader } from "@/components/layout/page-header";
import { MessagesClient } from "@/components/messages/messages-client";

export const metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader
        title="Messages"
        description="Chat with your mentor, mentees and programme admins."
      />
      <MessagesClient />
    </>
  );
}
