"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Pencil, Plus, Search, X } from "lucide-react";
import { useApiAction } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CatalogItem {
  id: string;
  name: string;
  isActive: boolean;
}

type CatalogType = "department" | "programme" | "interest" | "module";

const CATALOG_TYPES: {
  value: CatalogType;
  label: string;
  singular: string;
  apiBase: string;
}[] = [
  { value: "department", label: "Departments", singular: "department", apiBase: "/api/admin/departments" },
  { value: "programme", label: "Programmes", singular: "programme", apiBase: "/api/admin/programmes" },
  { value: "interest", label: "Interests", singular: "interest", apiBase: "/api/admin/interests" },
  { value: "module", label: "Strong modules", singular: "strong module", apiBase: "/api/admin/strong-modules" },
];

interface CatalogManagerProps {
  departments: CatalogItem[];
  programmes: CatalogItem[];
  interests: CatalogItem[];
  strongModules: CatalogItem[];
}

export function CatalogManager({
  departments,
  programmes,
  interests,
  strongModules,
}: CatalogManagerProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const [type, setType] = useState<CatalogType>("department");
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const config = CATALOG_TYPES.find((t) => t.value === type)!;

  const items: CatalogItem[] =
    type === "department"
      ? departments
      : type === "programme"
        ? programmes
        : type === "interest"
          ? interests
          : strongModules;

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [items, search]
  );

  const switchType = (next: CatalogType) => {
    setType(next);
    setSearch("");
    setNewName("");
    setEditingId(null);
  };

  const add = async () => {
    if (!newName.trim()) return;
    await run(config.apiBase, {
      method: "POST",
      body: JSON.stringify({ name: newName }),
      successMessage: "Added",
    });
    setNewName("");
    router.refresh();
  };

  const toggleActive = async (item: CatalogItem) => {
    await run(`${config.apiBase}/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !item.isActive }),
      successMessage: item.isActive ? "Deactivated" : "Activated",
    });
    router.refresh();
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    await run(`${config.apiBase}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: editValue }),
      successMessage: "Renamed",
    });
    setEditingId(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:w-64">
        <Select value={type} onValueChange={(v) => switchType(v as CatalogType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATALOG_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}…`}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={`Add a new ${config.singular}…`}
                className="sm:w-64"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void add();
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => void add()}
                disabled={pending || !newName.trim()}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {items.length === 0
                      ? `No ${config.label.toLowerCase()} yet.`
                      : "No matches for your search."}
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 max-w-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void saveEdit(item.id);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "success" : "secondary"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={pending}
                            onClick={() => void saveEdit(item.id)}
                            aria-label="Save"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            aria-label="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditValue(item.name);
                            }}
                            aria-label={`Rename ${item.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={pending}
                            onClick={() => void toggleActive(item)}
                            aria-label={
                              item.isActive
                                ? `Deactivate ${item.name}`
                                : `Activate ${item.name}`
                            }
                          >
                            {item.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
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
