import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Builds a wa.me deep link for a phone number, or null when the number
 * is missing/unusable. WhatsApp requires digits only, no leading zeros
 * or "+" sign.
 */
export function buildWhatsAppLink(
  phone: string | null | undefined,
  text?: string
): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "").replace(/^0+/, "");
  if (digits.length < 7) return null;
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
