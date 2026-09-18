/**
 * Seeded bougainvillea petal configuration.
 * Everything here is deterministic so server and client render identical markup
 * (no hydration warnings), and petals keep their positions across re-renders.
 *
 * Sprites are real bracts and leaves cut from the floral wordmark
 * (scripts/extract-petals.mjs), so the falling flowers match the logo exactly.
 */
import { PETAL_SPRITES, type PetalSprite } from "./petal-sprites";

export type PetalTier = "base" | "transition";

export interface PetalConfig {
  id: number;
  /** "base" petals are visible on load; "transition" petals fade in during the KIKI scale-up. */
  tier: PetalTier;
  /** Rendered in front of the typography (true) or behind it (false). */
  front: boolean;
  sprite: PetalSprite;
  /** Horizontal position in vw. */
  x: number;
  /** Rendered width in px. */
  width: number;
  /** Initial rotation in degrees. */
  rotation: number;
  /** Degrees of Z rotation per fall cycle (a slow spin); sign gives direction. */
  spin: number;
  /** Horizontal sway amplitude in px. */
  sway: number;
  /** Seconds per sway cycle. */
  swayDuration: number;
  /** Seconds for one full top-to-bottom fall. */
  fallDuration: number;
  /** Seconds per tumble cycle about the X axis. */
  tumbleDuration: number;
  /** Full 360° flips (true) or a rocking tumble of ±tumbleAmplitude (false). */
  flip: boolean;
  /** Degrees of rock for non-flipping petals. */
  tumbleAmplitude: number;
  /** Amplitude of the Y-axis flutter, degrees. */
  flutter: number;
  /** Seconds per flutter cycle. */
  flutterDuration: number;
  /** 0-1 phase offset so petals start mid-fall instead of all at the top. */
  phase: number;
  /** 0.25 (far) to 1 (near). Drives parallax distance and size. */
  depth: number;
  /** Static blur in px, applied to far petals for depth of field. */
  blur: number;
  /** Resting opacity. */
  opacity: number;
}

export const PETAL_COUNT = 36;
export const PETAL_SEED = 20260917;
/** Petals with an id at or above this limit are hidden below the md breakpoint. */
export const MOBILE_PETAL_LIMIT = 16;
/** Number of petals visible before scrolling. */
export const BASE_PETAL_COUNT = 7;
/** Longest edge in px for the farthest and nearest petals. Matches a single bract in the logo. */
export const PETAL_SIZE = { far: 16, near: 32 } as const;

/** Small, fast, deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const round = (v: number, d = 2) => Number(v.toFixed(d));

export function createPetals(count = PETAL_COUNT, seed = PETAL_SEED): PetalConfig[] {
  const rand = mulberry32(seed);
  const bracts = PETAL_SPRITES.filter((s) => s.kind === "bract");
  const buds = PETAL_SPRITES.filter((s) => s.kind === "bud");
  const leaves = PETAL_SPRITES.filter((s) => s.kind === "leaf");
  const petals: PetalConfig[] = [];

  for (let i = 0; i < count; i++) {
    const depth = lerp(0.25, 1, rand());
    const front = i % 3 === 1;
    // Mostly single bracts, with the odd bud or leaf.
    const pick = rand();
    const pool = pick < 0.1 && leaves.length ? leaves : pick < 0.2 && buds.length ? buds : bracts;
    const sprite = pool[Math.floor(rand() * pool.length)];
    // Sized to a single flower in the logo: about 16px far away, 32px up close (longest edge).
    const longest = lerp(PETAL_SIZE.far, PETAL_SIZE.near, depth) * lerp(0.9, 1.1, rand());
    const width = Math.max(10, Math.round((longest * sprite.w) / Math.max(sprite.w, sprite.h)));
    const sign = rand() < 0.5 ? -1 : 1;
    petals.push({
      id: i,
      tier: i < BASE_PETAL_COUNT ? "base" : "transition",
      front,
      sprite,
      x: round(lerp(2, 98, rand())),
      width,
      rotation: Math.round(lerp(-180, 180, rand())),
      spin: Math.round(lerp(40, 160, rand())) * sign,
      sway: Math.round(lerp(18, 70, rand()) * lerp(0.7, 1.2, depth)),
      swayDuration: round(lerp(3.2, 6.8, rand())),
      fallDuration: round(lerp(13, 26, rand()) * (1.35 - depth * 0.5)),
      tumbleDuration: round(lerp(3.2, 7.5, rand())),
      flip: rand() < 0.28,
      tumbleAmplitude: Math.round(lerp(38, 70, rand())),
      flutter: Math.round(lerp(28, 62, rand())),
      flutterDuration: round(lerp(1.6, 3.4, rand())),
      phase: round(rand(), 3),
      depth: round(depth, 3),
      blur: front ? 0 : round(lerp(0, 0.9, 1 - depth)),
      opacity: round(lerp(0.82, 1, rand())),
    });
  }
  return petals;
}

export const PETALS: readonly PetalConfig[] = createPetals();
