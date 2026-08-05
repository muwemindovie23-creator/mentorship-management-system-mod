"use client";

import { useEffect, useState } from "react";

/** Active departments & programmes, admin-managed, fetched for registration forms. */
export function useCatalog() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [programmes, setProgrammes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((res) => (res.ok ? res.json() : { departments: [], programmes: [] }))
      .then((data: { departments?: string[]; programmes?: string[] }) => {
        if (cancelled) return;
        setDepartments(data.departments ?? []);
        setProgrammes(data.programmes ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { departments, programmes, loading };
}
