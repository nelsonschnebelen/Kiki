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

export const siteContent = {
  brand: {
    name: "KIKI",
    subtitle: "On the Miami River",
    tagline: "Eat · Drink · Dance",
    description:
      "KIKI on the River is a Greek-inspired waterfront restaurant in Miami. Bright lunches, long dinners, and nights that turn into dancing.",
  },

  /** Set NEXT_PUBLIC_RESERVATION_URL in .env.local to point the Reserve buttons anywhere. */
  reservationUrl:
    process.env.NEXT_PUBLIC_RESERVATION_URL ?? "https://www.kikiontheriver.com/reservations",
  privateEventsUrl:
    process.env.NEXT_PUBLIC_PRIVATE_EVENTS_URL ?? "https://www.kikiontheriver.com/private-events",

  /** Retained for future use. Per client direction the hero renders no navigation links. */
  navigation: {
    left: [
      { label: "Menu", href: "/menu" },
      { label: "Experience", href: "/experience" },
      { label: "Private Events", href: "/private-events" },
    ],
    right: [
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },

  hero: {
    image: "/images/hero.jpg",
    alt: "Guests at long white tables under bougainvillea on the Miami River at KIKI",
    /** Ambient loop generated from the hero still. Falls back to the image until it can play. */
    video: {
      desktop: "/video/hero.mp4",
      mobile: "/video/hero-mobile.mp4",
      poster: "/images/hero.jpg",
    } satisfies VideoSource,
    reserveLabel: "Reserve",
    scrollHint: "Scroll",
    note: ["Good Food", "Brighter Days"],
  },

  letters: [
    {
      id: "k1",
      char: "K",
      label: "A chef pouring rosé at the table",
      focus: "50% 18%",
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
      focus: "50% 45%",
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

  wheel: {
    topArc: "DAY TURNS INTO NIGHT",
    bottomArc: "KIKI ON THE MIAMI RIVER",
    center: "EAT • DRINK • DANCE",
    /** Square image: left half is day, right half is night. */
    centerImage: "/images/wheel-center.jpg",
    centerAlt: "The KIKI terrace by day on the left, and the same terrace at night on the right",
    heading: ["Your table.", "Your night."],
    ctas: [
      { label: "VIP Reservations", href: "reservation" as const, variant: "primary" as const },
      { label: "Plan a Private Event", href: "privateEvents" as const, variant: "ghost" as const },
    ],
    note: ["Greek Soul", "Miami Vibes"],
    accentImage: "/images/vase.jpg",
    accentAlt: "Blue and white Greek ceramic vase",
  },

  meet: {
    eyebrow: "Meet me at KIKI",
    lines: ["Private moments.", "Unforgettable nights."],
    heart: { src: "/images/heart.jpg", alt: "A heart of pink roses with a neon sign reading Meet me at KIKI" },
    table: { src: "/images/long-table.jpg", alt: "A long white table set under bougainvillea beside the river" },
    champagne: { src: "/images/champagne.jpg", alt: "Champagne bottles chilling in silver buckets at sunset" },
  },

  footer: {
    image: "/images/nightlife.jpg",
    alt: "Guests dancing with white napkins in the air under bougainvillea at night",
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
