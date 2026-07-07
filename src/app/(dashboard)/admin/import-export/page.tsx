import { PageHeader } from "@/components/layout/page-header";
import { ImportExportPanel } from "@/components/admin/import-export-panel";

export const metadata = { title: "Import / Export" };

export default function AdminImportExportPage() {
  return (
    <>
      <PageHeader
        title="CSV import & export"
        description="Download programme data or bulk-import mentors and mentees."
      />
      <ImportExportPanel />
    </>
  );
}
