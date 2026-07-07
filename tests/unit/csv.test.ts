import { describe, expect, it } from "vitest";
import { parseCsv, parseCsvRecords, toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("writes a header and rows", () => {
    const csv = toCsv(["a", "b"], [["1", "2"]]);
    expect(csv).toBe("a,b\r\n1,2\r\n");
  });

  it("escapes commas, quotes and newlines", () => {
    const csv = toCsv(["field"], [['He said "hi", twice\nend']]);
    expect(csv).toContain('"He said ""hi"", twice\nend"');
  });

  it("renders null/undefined as empty strings", () => {
    const csv = toCsv(["a", "b"], [[null, undefined]]);
    expect(csv).toBe("a,b\r\n,\r\n");
  });
});

describe("parseCsv", () => {
  it("parses simple rows", () => {
    expect(parseCsv("a,b\n1,2\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("handles quoted fields with commas and escaped quotes", () => {
    const rows = parseCsv('name,quote\r\nJo,"a ""b"", c"\r\n');
    expect(rows[1]).toEqual(["Jo", 'a "b", c']);
  });

  it("handles newlines inside quoted fields", () => {
    const rows = parseCsv('a\n"line1\nline2"\n');
    expect(rows[1]).toEqual(["line1\nline2"]);
  });

  it("drops fully empty rows", () => {
    expect(parseCsv("a,b\n\n1,2\n\n")).toHaveLength(2);
  });
});

describe("parseCsvRecords", () => {
  it("maps rows to header keys", () => {
    const records = parseCsvRecords("name,email\nJo,jo@x.com\n");
    expect(records).toEqual([{ name: "Jo", email: "jo@x.com" }]);
  });

  it("returns empty for header-only input", () => {
    expect(parseCsvRecords("name,email\n")).toEqual([]);
  });

  it("fills missing trailing cells with empty strings", () => {
    const records = parseCsvRecords("a,b,c\n1,2\n");
    expect(records[0]).toEqual({ a: "1", b: "2", c: "" });
  });
});

describe("round trip", () => {
  it("parses what it writes", () => {
    const headers = ["name", "notes"];
    const rows = [["Ada, PhD", 'said "hello"\nbye']];
    const parsed = parseCsv(toCsv(headers, rows));
    expect(parsed).toEqual([headers, rows[0]]);
  });
});
