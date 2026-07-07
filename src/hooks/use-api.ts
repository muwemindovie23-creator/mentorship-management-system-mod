"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

/**
 * Small helper for JSON API mutations with toast feedback and a
 * pending flag. Throws on non-2xx so callers can abort follow-ups.
 */
export function useApiAction() {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async <T = unknown>(
      input: RequestInfo,
      init?: RequestInit & { successMessage?: string }
    ): Promise<T> => {
      setPending(true);
      try {
        const res = await fetch(input, {
          headers: { "Content-Type": "application/json" },
          ...init,
        });
        const data = (await res.json().catch(() => ({}))) as T & {
          error?: string;
          message?: string;
        };
        if (!res.ok) {
          throw new Error(data.error ?? "Request failed");
        }
        if (init?.successMessage ?? data.message) {
          toast.success(init?.successMessage ?? data.message);
        }
        return data;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Request failed");
        throw error;
      } finally {
        setPending(false);
      }
    },
    []
  );

  return { run, pending };
}
