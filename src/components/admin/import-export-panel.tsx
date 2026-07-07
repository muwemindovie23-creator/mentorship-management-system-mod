"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXPORT_TYPES = [
  { value: "mentors", label: "Mentors" },
  { value: "mentees", label: "Mentees" },
  { value: "pairings", label: "Pairings" },
  { value: "meetings", label: "Meeting logs" },
];

export function ImportExportPanel() {
  const [importType, setImportType] = useState("mentees");
  const [importing, setImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", importType);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as {
        created?: number;
        skipped?: number;
        errors?: string[];
        error?: string;
      };

      if (!res.ok) {
        toast.error(data.error ?? "Import failed");
        return;
      }

      toast.success(
        `Imported ${data.created} rows (${data.skipped} skipped, ${data.errors?.length ?? 0} errors)`
      );
      if (data.errors?.length) {
        for (const message of data.errors.slice(0, 5)) {
          toast.warning(message);
        }
      }
    } finally {
      setImporting(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" /> Export CSV
          </CardTitle>
          <CardDescription>
            Download data for the current semester as CSV.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {EXPORT_TYPES.map((type) => (
            <Button key={type.value} variant="outline" asChild>
              <a href={`/api/admin/export?type=${type.value}`} download>
                <Download className="h-4 w-4" /> {type.label}
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Import CSV
          </CardTitle>
          <CardDescription>
            Bulk-create pre-approved mentors or mentees. Use the templates in{" "}
            <code>sample-data/</code>. Interests and modules are
            semicolon-separated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={importType} onValueChange={setImportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentees">Mentees</SelectItem>
              <SelectItem value="mentors">Mentors</SelectItem>
            </SelectContent>
          </Select>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
            }}
          />
          <Button
            onClick={() => fileInput.current?.click()}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Choose CSV file
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
