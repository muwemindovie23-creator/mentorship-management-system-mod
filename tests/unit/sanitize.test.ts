import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  normalizeEmail,
  sanitizeMultiline,
  sanitizeText,
} from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("trims and collapses whitespace", () => {
    expect(sanitizeText("  hello    world  ")).toBe("hello world");
  });

  it("strips control characters", () => {
    expect(sanitizeText("he\u0000llo\u0007")).toBe("hello");
  });
});

describe("sanitizeMultiline", () => {
  it("preserves single newlines", () => {
    expect(sanitizeMultiline("line1\nline2")).toBe("line1\nline2");
  });

  it("collapses runs of blank lines", () => {
    expect(sanitizeMultiline("a\n\n\n\n\nb")).toBe("a\n\nb");
  });
});

describe("escapeHtml", () => {
  it("escapes all dangerous characters", () => {
    expect(escapeHtml(`<script>alert("x&y'")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&amp;y&#39;&quot;)&lt;/script&gt;"
    );
  });
});

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
  });
});
