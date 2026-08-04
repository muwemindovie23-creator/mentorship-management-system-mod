/**
 * Zoom Server-to-Server OAuth integration for scheduling meeting links.
 *
 * Requires a Server-to-Server OAuth app on the Zoom Marketplace granting
 * meeting:write scope — works on a free/Basic Zoom account since it's
 * scoped to the account owner's own user, not the marketplace.
 *
 * Mirrors the mailer's resilience pattern: never throws, returns null
 * when unconfigured or on failure, so meeting creation never depends on
 * Zoom being reachable.
 */

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    return null;
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const res = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${basicAuth}` },
      }
    );

    if (!res.ok) {
      console.error(`[zoom] Failed to fetch access token: ${res.status}`);
      return null;
    }

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return cachedToken.accessToken;
  } catch (error) {
    console.error("[zoom] Failed to fetch access token", error);
    return null;
  }
}

export interface ZoomMeeting {
  meetingId: string;
  joinUrl: string;
}

export interface CreateZoomMeetingInput {
  topic: string;
  startTime: Date;
  durationMinutes: number;
}

/** Create a scheduled Zoom meeting. Returns null if unconfigured or on failure. */
export async function createZoomMeeting({
  topic,
  startTime,
  durationMinutes,
}: CreateZoomMeetingInput): Promise<ZoomMeeting | null> {
  const token = await getAccessToken();
  if (!token) {
    console.warn("[zoom] Not configured — skipping Zoom meeting creation");
    return null;
  }

  try {
    const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2, // scheduled meeting
        start_time: startTime.toISOString(),
        duration: durationMinutes,
        timezone: "UTC",
        settings: {
          join_before_host: true,
          waiting_room: false,
          approval_type: 2,
        },
      }),
    });

    if (!res.ok) {
      console.error(`[zoom] Failed to create meeting: ${res.status}`);
      return null;
    }

    const data = (await res.json()) as { id: number; join_url: string };
    return { meetingId: String(data.id), joinUrl: data.join_url };
  } catch (error) {
    console.error("[zoom] Failed to create meeting", error);
    return null;
  }
}
