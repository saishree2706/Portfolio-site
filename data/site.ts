/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit everything about the portfolio here.
 * ─────────────────────────────────────────────────────────────
 *  Secrets (API keys, tokens) live in `.env.local`, never here.
 *  Photos live in `/public` — reference them as "/filename.jpg".
 */

/* ── Identity & links ─────────────────────────────────────── */

export const PROFILE = {
  name: "Saishree SV",
  shortName: "Saishree",
  location: "India",
  photo: "/my_photo.jpg",
  email: "your@email.com",
  cv: "/cv.pdf",
  available: true, // shows the "Available for opportunities" chip
};

export const SOCIALS = {
  github: "https://github.com/saishree2706",
  linkedin: "https://www.linkedin.com/in/saishree-sriram/",
  instagram: "https://instagram.com",
  youtube: "https://www.youtube.com/@saishreetony",
  youtubeHandle: "saishreetony",
  // Videos load automatically from this channel — no API key needed.
  // Leave "" to look it up from the handle above.
  youtubeChannelId: "UCfGtY5D74vpuOMM_ZMtntAQ",
};

/* ── Photos ───────────────────────────────────────────────── */

/** Travel photos used in the marquee, About collage, and as fallbacks. */
export const TRAVEL_PHOTOS = [
  "/P1057617.JPG",
  "/P1057644.JPG",
  "/P1057654.JPG",
  "/P1057691.JPG",
  "/P1057790.JPG",
];

/* ── Passion mode ─────────────────────────────────────────── */

export const PASSION = {
  heroLines: [
    // `accent: true` renders the word in gold italics
    [{ text: "I" }, { text: "chase" }, { text: "mountains,", accent: true }],
    [{ text: "build" }, { text: "software,", accent: true }],
    [{ text: "&" }, { text: "tell" }, { text: "stories." }],
  ],
  heroIntro: "Travel creator and software engineer — capturing roads less travelled and building things that matter.",
  badgeText: "TRAVEL CREATOR • ENGINEER • STORYTELLER • ",
  availableFor: ["Brand content", "Travel collabs", "Web development"],
  places: ["Himachal", "Kashmir", "Gujarat", "Arunachal", "Kanyakumari", "Naggar"],
  /** Shown when the Instagram API isn't connected. */
  reelStatsFallback: { views: "75K", count: "25" },
};

/**
 * YouTube videos shown when YOUTUBE_API_KEY isn't set.
 * Get an ID from a URL: youtube.com/watch?v=<THIS PART>
 * Leave id as "" to show a travel photo instead of a thumbnail.
 */
export const YOUTUBE_VIDEOS: { id: string; title: string; tag: string }[] = [
  { id: "", title: "Standing on Top of the World",     tag: "Hiking"  },
  { id: "", title: "Chasing Snow Peaks — Himalayas",   tag: "Travel"  },
  { id: "", title: "Valley Vibes",                     tag: "Vlog"    },
  { id: "", title: "Morning Meditation in the Forest", tag: "Mindful" },
  { id: "", title: "Trail Stories — Himachal Pradesh", tag: "Trek"    },
];

/**
 * Reels shown when INSTAGRAM_ACCESS_TOKEN isn't set or has expired.
 * `href` = the reel's Instagram link; `thumb` = a photo in /public.
 */
export const REELS_FALLBACK: { href: string; thumb: string; caption: string }[] = [
  { href: SOCIALS.instagram, thumb: "/P1057654.JPG", caption: "Mountain trek timelapse" },
  { href: SOCIALS.instagram, thumb: "/P1057617.JPG", caption: "A day in the hills" },
  { href: SOCIALS.instagram, thumb: "/P1057691.JPG", caption: "Forest mornings" },
  { href: SOCIALS.instagram, thumb: "/P1057790.JPG", caption: "Behind the camera" },
];

/** India map route — `at` is how far along the border (0–1) each label sits. */
export const MAP_STOPS = [
  { label: "Kashmir",     at: 0.0,   main: false },
  { label: "Arunachal",   at: 0.286, main: false },
  { label: "Kanyakumari", at: 0.647, main: true  },
  { label: "Gujarat",     at: 0.822, main: false },
];

/* ── Profession mode ──────────────────────────────────────── */

export const PROFESSION = {
  role: "Software Engineer",
  /** Hero headline reads "I design & build <role>" — these rotate. */
  roles: ["full-stack apps.", "developer tools.", "AI workflows.", "creative tech."],
  pitch: "I build scalable software and craft digital experiences — from full-stack apps to creative side projects that work and look great.",
  techBadges: ["React", "TypeScript", "Node.js", "Python", "AWS"],
  stats: [
    { value: "3+", label: "Shipped projects" },
    { value: "117K+", label: "Content views" },
    { value: "200+", label: "Residents served" },
  ],
  about: [
    "Hi! I'm Saishree SV — a software engineer who also happens to be a content creator and travel enthusiast. I believe the best products, like the best experiences, come from genuine care and attention to detail.",
    "I build full-stack web applications and enjoy crafting interfaces that feel intuitive and alive. Outside of code, I create travel content and tell stories through a camera lens.",
    "Beyond work, I give back through community volunteering — managing hostel operations end-to-end and contributing to Adaptive Rural Tourism through tech and content.",
  ],
  facts: [
    { label: "Based in", value: "India" },
    { label: "Focus", value: "Full-stack & creative tech" },
    { label: "Interests", value: "Travel & content creation" },
    { label: "Community", value: "Volunteering & rural dev" },
  ],
  interests: {
    biking: {
      title: "Mountain biking",
      tagline: "Two wheels, endless roads",
      text: "Mountain biking is my meditation. Navigating a technical descent takes the same calm problem-solving I bring to complex codebases.",
      stats: [
        { value: "50+", label: "Routes" },
        { value: "1,000+ km", label: "Ridden" },
        { value: "25,000+ m", label: "Climbed" },
      ],
    },
    travel: {
      title: "Travel",
      tagline: "Collecting perspectives, not just stamps",
      text: "Every new culture, landscape and conversation adds a layer of empathy that makes me a better engineer. The best ideas often arrive somewhere between two destinations.",
      photos: ["/P1057654.JPG", "/P1057617.JPG", "/P1057691.JPG"],
    },
  },
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  /** Optional 3-step flow shown on the featured project card */
  flow?: string[];
};

export const PROJECTS: Project[] = [
  {
    title: "Reel2Short",
    description:
      "Local-first web application that converts Instagram Reels to YouTube Shorts. Features AI-generated titles, descriptions, tags, and viewer insights, plus automatic aspect ratio conversion and direct upload to YouTube.",
    tech: ["Python", "FFmpeg", "YouTube Data API", "AI/LLM"],
    github: "https://github.com/saishree2706/Reel2Short",
    featured: true,
    flow: ["Instagram Reel", "AI metadata", "YouTube Short"],
  },
  {
    title: "Art Village Naggar",
    description:
      "A digital presence for Art Village Naggar — an artist community nestled in the Himachali mountains. Built to showcase local artisans, their work, and attract cultural tourism to this unique creative hub.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/saishree2706/art-village-naggar-main",
  },
  {
    title: "Diffchecker",
    description:
      "A clean, fast web tool that compares two pieces of text and highlights differences line by line. Useful for code reviews, document comparisons, and tracking changes.",
    tech: ["JavaScript", "HTML", "CSS"],
    github: "https://github.com/saishree2706/diffchecker",
  },
];

export const SKILLS: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "Bash"],
  "Frameworks & Libraries": ["React", "Next.js", "Node.js", "Express", "Spring Boot", "GraphQL"],
  "Tools & Platforms": ["Git", "Docker", "Linux", "Postman", "VS Code", "Jira"],
  "Cloud & DevOps": ["AWS", "GCP", "Vercel", "CI/CD", "GitHub Actions", "Nginx"],
};

/* Contact form quick-start snippets — tapping one fills the message box. Keep [brackets] for the visitor to fill in. */
export type EmailSnippet = { label: string; subject: string; body: string };

export const PASSION_SNIPPETS: Record<"content" | "webdev", EmailSnippet[]> = {
  content: [
    {
      label: "Brand reel",
      subject: "Brand reel collaboration",
      body: "Hi Saishree! I'm [name] from [brand]. We'd love a 30–60s Instagram reel showcasing [product/place]. Our timeline is [date] and budget is around [amount]. Would you be up for it?",
    },
    {
      label: "Travel collab",
      subject: "Travel content collaboration",
      body: "Hi Saishree! We host travellers at [stay/experience] in [location] and loved your travel stories. Would you be open to a stay in exchange for reels and a YouTube vlog around [dates]?",
    },
    {
      label: "Mehendi booking",
      subject: "Mehendi booking enquiry",
      body: "Hi Saishree! I'd love to book you for mehendi on [date] in [city] for [number] people. Style I'm looking for: [bridal / minimal / Arabic]. Could you share availability and pricing?",
    },
  ],
  webdev: [
    {
      label: "Portfolio site",
      subject: "Portfolio website project",
      body: "Hi Saishree! I'm looking for a personal portfolio website with [gallery / blog / contact form]. I'd like it live by [date]. Here's a site I like for reference: [link].",
    },
    {
      label: "Small business",
      subject: "Website for my business",
      body: "Hi Saishree! I run [business] in [city] and need a simple website with our services, photos and a booking/contact option. Budget is around [amount]. Can we chat?",
    },
    {
      label: "Redesign",
      subject: "Website redesign",
      body: "Hi Saishree! Our current site ([link]) feels outdated. We'd love a fresh, mobile-friendly redesign. Main goals: [goals]. When would you be free for a quick call?",
    },
  ],
};

export const PROFESSION_SNIPPETS: EmailSnippet[] = [
  {
    label: "Job opportunity",
    subject: "Role at [company]",
    body: "Hi Saishree, I'm [name], [role] at [company]. We're hiring for a [position] and your background looks like a great fit. Would you be open to a quick chat this week?",
  },
  {
    label: "Freelance project",
    subject: "Freelance project enquiry",
    body: "Hi Saishree, I have a [web app / website] project that needs [features]. Timeline is roughly [weeks] and budget is [amount]. Could we set up a call to discuss scope?",
  },
  {
    label: "Collaboration",
    subject: "Open-source / side project collaboration",
    body: "Hi Saishree, I'm building [project] and saw your work on GitHub. I think you'd be a great collaborator on [area]. Interested in hearing more?",
  },
  {
    label: "Just saying hi",
    subject: "Hello from your portfolio",
    body: "Hi Saishree, I came across your portfolio and really liked [project/section]. Just wanted to say hello and connect!",
  },
];
