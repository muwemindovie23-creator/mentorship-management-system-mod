"use client";

import { useEffect, useState } from "react";

/** Active departments, programmes & strong modules, admin-managed, fetched for registration/profile forms. */
export function useCatalog() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [programmes, setProgrammes] = useState<string[]>([]);
  const [strongModules, setStrongModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((res) =>
        res.ok ? res.json() : { departments: [], programmes: [], strongModules: [] }
      )
      .then(
        (data: {
          departments?: string[];
          programmes?: string[];
          strongModules?: string[];
        }) => {
          if (cancelled) return;
          setDepartments(data.departments ?? []);
          setProgrammes(data.programmes ?? []);
          setStrongModules(data.strongModules ?? []);
        }
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { departments, programmes, strongModules, loading };
}
