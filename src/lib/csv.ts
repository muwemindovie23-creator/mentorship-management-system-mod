/**
 * Minimal, dependency-free CSV encode/parse (RFC 4180).
 */

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (value: string | number | null | undefined): string => {
    const str = value === null || value === undefined ? "" : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\r\n") + "\r\n";
}

export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (char === "\r") {
      i++;
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += char;
    i++;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully empty trailing rows.
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/** Parse a CSV with a header row into an array of records. */
export function parseCsvRecords(input: string): Record<string, string>[] {
  const rows = parseCsv(input);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, idx) => {
      record[header] = (row[idx] ?? "").trim();
    });
    return record;
  });
}
