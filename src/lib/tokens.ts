import crypto from "crypto";

const TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface GeneratedToken {
  /** Raw token sent to the user by email — never stored. */
  token: string;
  /** SHA-256 digest of the token, safe to persist. */
  tokenHash: string;
  expiresAt: Date;
}

/** Hash a raw token for lookup/storage (tokens are never stored in plaintext). */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(ttlMs: number): GeneratedToken {
  const token = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + ttlMs),
  };
}

export function generateResetToken(): GeneratedToken {
  return generateToken(RESET_TOKEN_TTL_MS);
}

export function generateVerificationToken(): GeneratedToken {
  return generateToken(VERIFICATION_TOKEN_TTL_MS);
}
