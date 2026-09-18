/**
 * Seeded bougainvillea petal configuration.
 * Everything here is deterministic so server and client render identical markup
 * (no hydration warnings), and petals keep their positions across re-renders.
 */

export type PetalTier = "base" | "transition";

export interface PetalConfig {
  id: number;
  /** "base" petals are visible on load; "transition" petals fade in during the KIKI scale-up. */
  tier: PetalTier;
  /** Rendered in front of the typography (true) or behind it (false). */
  front: boolean;
  /** Colour variant, see PetalField gradients. */
  variant: 0 | 1 | 2;
  /** Horizontal position in vw. */
  x: number;
  /** Rendered size in px (longest edge). */
  size: number;
  /** Initial rotation in degrees. */
  rotation: number;
  /** Rotation swing over one sway cycle, degrees. */
  rotationDrift: number;
  /** Horizontal sway amplitude in px. */
  sway: number;
  /** Seconds per sway cycle. */
  swayDuration: number;
  /** Seconds for one full top-to-bottom fall. */
  fallDuration: number;
  /** 0-1 phase offset so petals start mid-fall instead of all at the top. */
  phase: number;
  /** 0.25 (far) to 1 (near). Drives parallax distance and size. */
  depth: number;
  /** Static blur in px, applied to far petals for depth of field. */
  blur: number;
  /** Resting opacity. */
  opacity: number;
}

export const PETAL_COUNT = 30;
export const PETAL_SEED = 20260917;
/** Petals with an id at or above this limit are hidden below the md breakpoint. */
export const MOBILE_PETAL_LIMIT = 14;
/** Number of petals visible before scrolling. */
export const BASE_PETAL_COUNT = 6;

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

export function createPetals(count = PETAL_COUNT, seed = PETAL_SEED): PetalConfig[] {
  const rand = mulberry32(seed);
  const petals: PetalConfig[] = [];

  for (let i = 0; i < count; i++) {
    const depth = lerp(0.25, 1, rand());
    const front = i % 3 === 1;
    const sizeMix = depth * 0.7 + rand() * 0.3;
    petals.push({
      id: i,
      tier: i < BASE_PETAL_COUNT ? "base" : "transition",
      front,
      variant: (i % 3) as 0 | 1 | 2,
      x: Number(lerp(3, 97, rand()).toFixed(2)),
      size: Math.round(lerp(16, 58, sizeMix)),
      rotation: Math.round(lerp(-70, 70, rand())),
      rotationDrift: Math.round(lerp(18, 75, rand()) * (rand() < 0.5 ? -1 : 1)),
      sway: Math.round(lerp(14, 64, rand())),
      swayDuration: Number(lerp(3.6, 7.8, rand()).toFixed(2)),
      fallDuration: Number((lerp(24, 48, rand()) * (1.3 - depth * 0.4)).toFixed(2)),
      phase: Number(rand().toFixed(3)),
      depth: Number(depth.toFixed(3)),
      blur: front ? (rand() < 0.3 ? 0.6 : 0) : Number(lerp(0, 1.6, 1 - depth).toFixed(2)),
      opacity: Number(lerp(0.74, 0.96, rand()).toFixed(2)),
    });
  }
  return petals;
}

export const PETALS: readonly PetalConfig[] = createPetals();
