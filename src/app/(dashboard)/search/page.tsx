import { PageHeader } from "@/components/layout/page-header";
import { SearchClient } from "@/components/search/search-client";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <>
      <PageHeader
        title="Search"
        description="Find mentors, mentees, meetings, messages and semesters."
      />
      <SearchClient />
    </>
  );
}
