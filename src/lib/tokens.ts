import crypto from "crypto";

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface ResetToken {
  /** Raw token sent to the user by email — never stored. */
  token: string;
  /** SHA-256 digest of the token, safe to persist. */
  tokenHash: string;
  expiresAt: Date;
}

/** Hash a raw reset token for lookup/storage (tokens are never stored in plaintext). */
export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateResetToken(): ResetToken {
  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
  return {
    token,
    tokenHash: hashResetToken(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  };
}
