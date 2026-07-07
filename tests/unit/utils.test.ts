import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, getInitials } from "@/lib/utils";

describe("buildWhatsAppLink", () => {
  it("returns null for missing numbers", () => {
    expect(buildWhatsAppLink(null)).toBeNull();
    expect(buildWhatsAppLink(undefined)).toBeNull();
    expect(buildWhatsAppLink("")).toBeNull();
  });

  it("strips formatting and the plus sign", () => {
    expect(buildWhatsAppLink("+254 711-000 001")).toBe(
      "https://wa.me/254711000001"
    );
  });

  it("strips leading zeros", () => {
    expect(buildWhatsAppLink("0711000001")).toBe("https://wa.me/711000001");
  });

  it("rejects numbers that are too short", () => {
    expect(buildWhatsAppLink("12345")).toBeNull();
  });

  it("appends encoded prefill text", () => {
    expect(buildWhatsAppLink("+254711000001", "hi there")).toBe(
      "https://wa.me/254711000001?text=hi%20there"
    );
  });
});

describe("getInitials", () => {
  it("uses the first two name parts", () => {
    expect(getInitials("Alice Wanjiku Kamau")).toBe("AW");
  });

  it("handles single names", () => {
    expect(getInitials("Plato")).toBe("P");
  });
});
