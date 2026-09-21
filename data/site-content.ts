/**
 * Single source of truth for copy, links and media paths.
 * Replace images/videos by dropping files into /public and updating the paths here.
 */

export type LetterId = "k1" | "i1" | "k2" | "i2";

export interface VideoSource {
  /** Desktop MP4 (H.264, ~1280px on the long edge). */
  desktop: string;
  /** Mobile MP4 (H.264, ~720px on the long edge). */
  mobile: string;
  /** Poster image shown before the video can play, and as the reduced-motion fallback. */
  poster: string;
}

export interface LetterContent {
  id: LetterId;
  char: "K" | "I";
  /** Accessible description of what plays inside the letter. */
  label: string;
  /** CSS object-position for the poster and video inside the letter, e.g. "50% 20%". */
  focus: string;
  video: VideoSource;
}

/** Set NEXT_PUBLIC_RESERVATION_URL in .env.local to point the Reserve buttons anywhere. */
const RESERVATION_URL = process.env.NEXT_PUBLIC_RESERVATION_URL ?? "https://www.kikiontheriver.com/reservations";
const PRIVATE_EVENTS_URL = process.env.NEXT_PUBLIC_PRIVATE_EVENTS_URL ?? "https://www.kikiontheriver.com/private-events";

export const siteContent = {
  brand: {
    name: "KIKI",
    subtitle: "On the River",
    tagline: "Eat · Drink · Dance",
    description:
      "KIKI on the River is a Greek-inspired waterfront restaurant in Miami. Bright lunches, long dinners, and nights that turn into dancing.",
  },

  reservationUrl: RESERVATION_URL,
  privateEventsUrl: PRIVATE_EVENTS_URL,

  /** Header links, as laid out in the mock. Anchors point at sections on this page. */
  navigation: [
    { label: "Menu", href: "https://www.kikiontheriver.com/menu" },
    { label: "Experience", href: "#experience" },
    { label: "Private Events", href: "#meet" },
    { label: "VIP", href: RESERVATION_URL },
  ],

  hero: {
    /** Poster frame of the hero film (written by scripts/cut-hero.mjs). */
    image: "/images/hero-night.jpg",
    /** Pre-blurred poster used for the scroll transition (same script). */
    blurImage: "/images/hero-night-blur.jpg",
    alt: "Three scenes of KIKI at night: dancing, champagne toasts and samba dancers under magenta light",
    /**
     * Nightlife film cut from KIKI's own reel by scripts/cut-hero.mjs: a three-panel
     * triptych for desktop, a single vertical edit for mobile. No title text.
     */
    video: {
      desktop: "/video/hero.mp4",
      mobile: "/video/hero-mobile.mp4",
      poster: "/images/hero-night.jpg",
    } satisfies VideoSource,
    reserveLabel: "Reserve",
    note: ["Good Food", "Brighter Days"],
  },

  letters: [
    {
      id: "k1",
      char: "K",
      label: "A chef pouring rosé at the table",
      focus: "50% 26%",
      video: {
        desktop: "/video/letters/k1.mp4",
        mobile: "/video/letters/k1-mobile.mp4",
        poster: "/images/letters/k1.jpg",
      },
    },
    {
      id: "i1",
      char: "I",
      label: "Guests enjoying a Mediterranean lunch on the water",
      focus: "50% 50%",
      video: {
        desktop: "/video/letters/i1.mp4",
        mobile: "/video/letters/i1-mobile.mp4",
        poster: "/images/letters/i1.jpg",
      },
    },
    {
      id: "k2",
      char: "K",
      label: "A champagne celebration with sparklers",
      focus: "50% 30%",
      video: {
        desktop: "/video/letters/k2.mp4",
        mobile: "/video/letters/k2-mobile.mp4",
        poster: "/images/letters/k2.jpg",
      },
    },
    {
      id: "i2",
      char: "I",
      label: "Glamorous dancing as day turns into night",
      focus: "50% 30%",
      video: {
        desktop: "/video/letters/i2.mp4",
        mobile: "/video/letters/i2-mobile.mp4",
        poster: "/images/letters/i2.jpg",
      },
    },
  ] satisfies LetterContent[],

  sequenceNote: ["Same Table", "Different Magic"],

  /** KIKI's watercolour corner florals (from their site). Replace with local files in /public/brand to self-host. */
  florals: {
    top: "https://www.kikiontheriver.com/wp-content/uploads/2026/03/Flower-top.webp",
    down: "https://www.kikiontheriver.com/wp-content/uploads/2026/03/Flower-down.webp",
  },

  wheel: {
    topArc: "DAY TURNS INTO NIGHT",
    bottomArc: "KIKI ON THE RIVER",
    center: "EAT • DRINK • DANCE",
    /** Square images. The wheel starts on day and turns to night as you scroll. */
    dayImage: "/images/wheel-day.jpg",
    nightImage: "/images/wheel-night.jpg",
    /** Split composite (left day, right night) shown when motion is reduced. */
    centerImage: "/images/wheel-center.jpg",
    centerAlt: "The KIKI terrace by day on the left, and the same terrace at night on the right",
    heading: ["Your table.", "Your night."],
    ctas: [
      { label: "VIP Reservations", href: "reservation" as const, variant: "primary" as const },
      { label: "Plan a Private Event", href: "privateEvents" as const, variant: "ghost" as const },
    ],
    note: ["Greek Soul", "Miami Vibes"],
    accentImage: "/images/marina.jpg",
    accentAlt: "Bougainvillea, striped mooring posts and yachts on the sunlit Miami River",
  },

  meet: {
    eyebrow: "Meet me at KIKI",
    lines: ["Private moments.", "Unforgettable nights."],
    heart: { src: "/images/heart.jpg", alt: "A heart of pink roses with a neon sign reading Meet me at KIKI" },
    table: { src: "/images/long-table.jpg", alt: "A long white table set under bougainvillea beside the river" },
    champagne: { src: "/images/champagne.jpg", alt: "Champagne bottles chilling in silver buckets at sunset" },
  },

  footer: {
    /** Poster frame of the footer film (written by scripts/cut-footer.mjs). */
    image: "/images/footer-poster.jpg",
    /**
     * Four vertical panels cut from KIKI's own reels by scripts/cut-footer.mjs, one for
     * every letter: the room at night, the party, the yacht by day, the party.
     * Set to null to fall back to the still, which then drifts gently instead.
     */
    video: {
      desktop: "/video/footer.mp4",
      mobile: "/video/footer-mobile.mp4",
      poster: "/images/footer-poster.jpg",
    } as VideoSource | null,
    alt: "Four scenes of KIKI: the restaurant at night, a celebration at the table, lunch on the yacht, and dancing",
    note: ["Food", "Friends", "Dancing", "Always"],
    address: "450 NW North River Dr, Miami, FL 33128",
    instagram: { label: "@kikiontheriver", href: "https://www.instagram.com/kikiontheriver" },
    links: [
      { label: "Reservations", href: "reservation" as const },
      { label: "Private Events", href: "privateEvents" as const },
    ],
  },
} as const;

export type SiteContent = typeof siteContent;

/** Resolves a named link key from site content to a URL. */
export function resolveHref(key: "reservation" | "privateEvents"): string {
  return key === "reservation" ? siteContent.reservationUrl : siteContent.privateEventsUrl;
}
