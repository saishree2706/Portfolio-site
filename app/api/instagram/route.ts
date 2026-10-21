import { NextResponse } from "next/server";

export interface InstagramMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  video_views: number;
}

export interface ReelsApiResponse {
  configured: boolean;
  topByViews: InstagramMedia[];
  latestByDate: InstagramMedia[];
  totalViews: number;
  videoCount: number;
  error?: string;
}

/** Instagram CDN links carry a hex `oe` expiry timestamp; past it they return 403. */
function cdnUrlExpired(url: string | undefined): boolean {
  if (!url) return true;
  try {
    const oe = new URL(url).searchParams.get("oe");
    return oe ? parseInt(oe, 16) * 1000 < Date.now() : false;
  } catch {
    return true;
  }
}

async function fetchViewCount(mediaId: string, token: string): Promise<number> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/${mediaId}/insights?metric=views&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const json = await res.json();
    const val = json.data?.[0]?.values?.[0]?.value;
    return typeof val === "number" ? val : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const empty: ReelsApiResponse = {
    configured: false, topByViews: [], latestByDate: [], totalViews: 0, videoCount: 0,
  };

  if (!token) return NextResponse.json(empty);

  try {
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count";
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=24&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!mediaRes.ok) {
      console.error("Instagram media fetch failed:", mediaRes.status, await mediaRes.text().catch(() => ""));
      return NextResponse.json({ ...empty, configured: true, error: "media_fetch_failed" });
    }

    const mediaJson = await mediaRes.json();
    const videos = ((mediaJson.data ?? []) as InstagramMedia[]).filter(
      (m) => m.media_type === "VIDEO" || m.media_type === "CAROUSEL_ALBUM"
    );

    // When the token expires, Next serves the last cached response — whose image
    // links have long expired. Drop dead thumbnails so the UI falls back cleanly.
    if (videos.length > 0 && videos.every((m) => cdnUrlExpired(m.thumbnail_url ?? m.media_url))) {
      console.warn("Instagram data is stale (thumbnail links expired) — the access token likely needs refreshing.");
    }
    for (const m of videos) {
      if (cdnUrlExpired(m.thumbnail_url ?? m.media_url)) {
        m.thumbnail_url = undefined;
        m.media_url = "";
      }
    }

    // Fetch view counts in parallel (all individually cached for 1 h)
    const viewCounts = await Promise.all(videos.map((v) => fetchViewCount(v.id, token)));

    const withViews: InstagramMedia[] = videos.map((v, i) => ({
      ...v,
      video_views: viewCounts[i],
    }));

    const totalViews = withViews.reduce((sum, v) => sum + v.video_views, 0);
    const videoCount = withViews.length;

    // Row 1 — highest views first, then by date as tiebreaker
    const sortedByViews = [...withViews].sort(
      (a, b) => b.video_views - a.video_views || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const topByViews = sortedByViews.slice(0, 4);
    const topIds = new Set(topByViews.map((v) => v.id));

    // Row 2 — latest, excluding items already in row 1
    const latestByDate = withViews
      .filter((v) => !topIds.has(v.id))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 4);

    return NextResponse.json({ configured: true, topByViews, latestByDate, totalViews, videoCount });
  } catch (err) {
    console.error("Instagram route exception:", err);
    return NextResponse.json({ ...empty, configured: true, error: "exception" });
  }
}
