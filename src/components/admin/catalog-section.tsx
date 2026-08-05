"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Pencil, Plus, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface CatalogItem {
  id: string;
  name: string;
  isActive: boolean;
}

interface CatalogSectionProps {
  title: string;
  description: string;
  addPlaceholder: string;
  apiBase: string;
  items: CatalogItem[];
}

export function CatalogSection({
  title,
  description,
  addPlaceholder,
  apiBase,
  items,
}: CatalogSectionProps) {
  const router = useRouter();
  const { run, pending } = useApiAction();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const add = async () => {
    if (!newName.trim()) return;
    await run(apiBase, {
      method: "POST",
      body: JSON.stringify({ name: newName }),
      successMessage: "Added",
    });
    setNewName("");
    router.refresh();
  };

  const toggleActive = async (item: CatalogItem) => {
    await run(`${apiBase}/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !item.isActive }),
      successMessage: item.isActive ? "Deactivated" : "Activated",
    });
    router.refresh();
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim()) return;
    await run(`${apiBase}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: editValue }),
      successMessage: "Renamed",
    });
    setEditingId(null);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={addPlaceholder}
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

        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing here yet.</p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-md border p-2"
            >
              {editingId === item.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="h-8 flex-1"
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
                <span className="flex-1 truncate text-sm">{item.name}</span>
              )}
              <div className="flex shrink-0 items-center gap-1">
                <Badge variant={item.isActive ? "success" : "secondary"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
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
                        item.isActive ? `Deactivate ${item.name}` : `Activate ${item.name}`
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
