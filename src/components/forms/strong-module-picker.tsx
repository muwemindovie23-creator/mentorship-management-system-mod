"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_MODULE_LENGTH = 80;
const MAX_SELECTED = 8;

interface StrongModulePickerProps {
  value: string[];
  onChange: (modules: string[]) => void;
  predefined: string[];
}

/**
 * Multi-select over admin-curated strong modules plus free-text custom
 * ones — any custom module submitted with the registration form is
 * created in the catalog automatically, so it shows up for future
 * mentors too.
 */
export function StrongModulePicker({
  value,
  onChange,
  predefined,
}: StrongModulePickerProps) {
  const [custom, setCustom] = useState("");

  const toggle = (module: string) => {
    if (value.includes(module)) {
      onChange(value.filter((m) => m !== module));
    } else if (value.length < MAX_SELECTED) {
      onChange([...value, module]);
    }
  };

  const addCustom = () => {
    const cleaned = custom.trim().slice(0, MAX_MODULE_LENGTH);
    if (!cleaned) return;
    const exists = value.some(
      (m) => m.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists && value.length < MAX_SELECTED) {
      onChange([...value, cleaned]);
    }
    setCustom("");
  };

  const customSelected = value.filter(
    (m) => !predefined.some((p) => p.toLowerCase() === m.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {predefined.map((module) => {
          const selected = value.includes(module);
          return (
            <button
              key={module}
              type="button"
              onClick={() => toggle(module)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
              aria-pressed={selected}
            >
              {module}
            </button>
          );
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customSelected.map((module) => (
            <Badge key={module} variant="secondary" className="gap-1">
              {module}
              <button
                type="button"
                onClick={() => toggle(module)}
                aria-label={`Remove ${module}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="Add a module you're strong in…"
          maxLength={MAX_MODULE_LENGTH}
        />
        <Button type="button" variant="outline" size="icon" onClick={addCustom}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add module</span>
        </Button>
      </div>
    </div>
  );
}
