# Content Update Guide

**All site content lives in one file: [`data/site.ts`](data/site.ts).**
Open it, change the values, save — the site updates.

| What | Where in `data/site.ts` |
|------|-------------------------|
| Name, email, location, CV, photo | `PROFILE` |
| GitHub / LinkedIn / Instagram / YouTube links | `SOCIALS` |
| Travel photos (marquee, About, fallbacks) | `TRAVEL_PHOTOS` |
| Passion hero headline, intro, badge, places | `PASSION` |
| YouTube videos (when no API key) | `YOUTUBE_VIDEOS` |
| Reels shown when Instagram isn't connected | `REELS_FALLBACK` |
| India map labels | `MAP_STOPS` |
| Profession hero, stats, about text, interests | `PROFESSION` |
| Projects | `PROJECTS` |
| Skills | `SKILLS` |

Photos go in `/public` and are referenced as `"/filename.jpg"`.

---

## Secrets — `.env.local`

API keys never go in `site.ts`. Put them in `.env.local` (and in Vercel → Settings → Environment Variables when deploying).

| Variable | Used for |
|----------|----------|
| `RESEND_API_KEY` | Sending contact-form emails |
| `CONTACT_EMAIL` | Where contact-form emails are delivered |
| `INSTAGRAM_ACCESS_TOKEN` | Live reels, thumbnails and view counts |
| `YOUTUBE_API_KEY` | Auto-fetching your latest uploads |

---

## Instagram token expires every 60 days

Long-lived Instagram tokens last **60 days**. When one expires, the Reels section falls back to `REELS_FALLBACK` automatically, but the live thumbnails and view counts disappear.

**Refresh it before it expires** (any time after it's 24 hours old):

```bash
curl "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_CURRENT_TOKEN"
```

Paste the new `access_token` from the response into `.env.local` and restart `npm run dev`.

**If it has already expired**, refreshing won't work — generate a new token from the Meta developer dashboard (see `.env.local.example`).

---

## YouTube videos — automatic

Your latest uploads load automatically from YouTube's public feed — **no API key needed**. It refreshes every hour.

- Long videos fill the **Travel** section (newest 5).
- Shorts appear in the **YouTube Shorts** tab of the Reels section (newest 4).
- The channel is set by `SOCIALS.youtubeChannelId` in `site.ts`.

`YOUTUBE_VIDEOS` in `site.ts` is only a backup used if YouTube can't be reached. `YOUTUBE_API_KEY` is optional; it's tried only when the feed fails.
