import { NextResponse } from "next/server";
import { SOCIALS } from "@/data/site";

export const revalidate = 3600;

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  views: number;
  isShort: boolean;
}

export interface YouTubeApiResponse {
  configured: boolean;
  /** Long-form uploads, newest first */
  videos: YouTubeVideo[];
  /** YouTube Shorts, newest first */
  shorts: YouTubeVideo[];
  error?: string;
}

const UA = { "User-Agent": "Mozilla/5.0 (portfolio feed reader)", "Accept-Language": "en" };

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** Resolve the channel ID: config wins, otherwise read it off the public @handle page (cached). */
async function resolveChannelId(): Promise<string | null> {
  if (SOCIALS.youtubeChannelId) return SOCIALS.youtubeChannelId;
  const res = await fetch(`https://www.youtube.com/@${SOCIALS.youtubeHandle}`, { headers: UA, next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const html = await res.text();
  return html.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ?? html.match(/channel_id=(UC[\w-]{22})/)?.[1] ?? null;
}

/** /shorts/<id> answers 200 for Shorts and redirects to /watch for regular videos. */
async function isShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: "HEAD",
      redirect: "manual",
      headers: UA,
      next: { revalidate: 86400 * 7 },
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/** Public RSS feed: latest 15 uploads, no API key required. */
async function fromRss(channelId: string): Promise<YouTubeVideo[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const xml = await res.text();

  const entries = xml.split("<entry>").slice(1);
  const parsed = entries.map((e) => {
    const tag = (re: RegExp) => e.match(re)?.[1] ?? "";
    const videoId = tag(/<yt:videoId>([^<]+)/);
    return {
      id: videoId,
      videoId,
      title: decode(tag(/<media:title>([^<]*)/)),
      // maxresdefault exists for every HD upload and looks far crisper than the feed's 480px hqdefault
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: tag(/<published>([^<]+)/),
      description: decode(tag(/<media:description>([^<]*)/)).slice(0, 160),
      views: Number(tag(/<media:statistics views="(\d+)"/)) || 0,
      isShort: false,
    };
  }).filter((v) => v.videoId);

  const shortFlags = await Promise.all(parsed.map((v) => isShort(v.videoId)));
  return parsed.map((v, i) => ({ ...v, isShort: shortFlags[i] }));
}

/** Official Data API — only used when YOUTUBE_API_KEY is set and valid. */
async function fromApi(apiKey: string, channelId: string): Promise<YouTubeVideo[]> {
  const uploads = "UU" + channelId.slice(2);
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=15&key=${apiKey}`,
    { next: { revalidate } }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  type Item = { snippet: { resourceId: { videoId: string }; title: string; publishedAt: string; description: string } };
  const items: Item[] = data.items ?? [];
  const shortFlags = await Promise.all(items.map((it) => isShort(it.snippet.resourceId.videoId)));
  return items.map((it, i) => {
    const videoId = it.snippet.resourceId.videoId;
    return {
      id: videoId,
      videoId,
      title: it.snippet.title,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: it.snippet.publishedAt,
      description: it.snippet.description?.slice(0, 160) ?? "",
      views: 0,
      isShort: shortFlags[i],
    };
  });
}

export async function GET() {
  const empty: YouTubeApiResponse = { configured: false, videos: [], shorts: [] };

  try {
    const channelId = await resolveChannelId();
    if (!channelId) return NextResponse.json({ ...empty, error: "Could not resolve YouTube channel" });

    let all: YouTubeVideo[];
    try {
      all = await fromRss(channelId);
    } catch (rssErr) {
      // RSS is keyless and normally reliable; fall back to the API if a key exists
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) throw rssErr;
      all = await fromApi(apiKey, channelId);
    }

    return NextResponse.json({
      configured: all.length > 0,
      videos: all.filter((v) => !v.isShort),
      shorts: all.filter((v) => v.isShort),
    } satisfies YouTubeApiResponse);
  } catch (err) {
    return NextResponse.json({ ...empty, error: err instanceof Error ? err.message : "Unknown error" });
  }
}
