"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PREDEFINED_INTERESTS, MAX_CUSTOM_INTEREST_LENGTH } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InterestPickerProps {
  value: string[];
  onChange: (interests: string[]) => void;
}

/**
 * Multi-select over predefined interests plus free-text custom
 * interests, used by both registration forms and profile editing.
 */
export function InterestPicker({ value, onChange }: InterestPickerProps) {
  const [custom, setCustom] = useState("");

  const toggle = (interest: string) => {
    if (value.includes(interest)) {
      onChange(value.filter((i) => i !== interest));
    } else if (value.length < 10) {
      onChange([...value, interest]);
    }
  };

  const addCustom = () => {
    const cleaned = custom.trim().slice(0, MAX_CUSTOM_INTEREST_LENGTH);
    if (!cleaned) return;
    const exists = value.some(
      (i) => i.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists && value.length < 10) {
      onChange([...value, cleaned]);
    }
    setCustom("");
  };

  const customSelected = value.filter(
    (i) => !PREDEFINED_INTERESTS.some((p) => p.toLowerCase() === i.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_INTERESTS.map((interest) => {
          const selected = value.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
              aria-pressed={selected}
            >
              {interest}
            </button>
          );
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customSelected.map((interest) => (
            <Badge key={interest} variant="secondary" className="gap-1">
              {interest}
              <button
                type="button"
                onClick={() => toggle(interest)}
                aria-label={`Remove ${interest}`}
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
          placeholder="Add a custom interest…"
          maxLength={MAX_CUSTOM_INTEREST_LENGTH}
        />
        <Button type="button" variant="outline" size="icon" onClick={addCustom}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add interest</span>
        </Button>
      </div>
    </div>
  );
}
