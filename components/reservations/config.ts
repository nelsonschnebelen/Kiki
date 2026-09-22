/**
 * KIKI on the River, as configured in Dishio (restaurant, spaces, add-ons,
 * valet, occasions). Images point at this site's /public; swap the paths when
 * dropping the folder into the Dishio project.
 */

export interface Space { id: string; name: string; img: string; blurb: string }
export interface AddOn { id: string; title: string; desc: string; price: number; icon: string; img: string; perGuest?: boolean }
export interface Table { id: string; label: string; zone: string; seats: number; x: number; y: number; shape: "round" | "rect"; taken?: boolean }

export const RESTAURANT = {
  name: "KIKI on the River",
  brandLine: "On the River",
  neighborhood: "Miami River",
  cuisine: "Modern Greek",
  priceTier: "$$$$",
  rating: 3.8,
  reviews: 4051,
  address: "450 NW North River Dr, Miami, FL 33128",
  phone: "+1 (786) 502-3243",
  hours: "Lunch 12 – 5 · Dinner 5 – late · Brunch Sat & Sun",
  tagline: "Eat · Drink · Dance",
  cancellation: "Free cancellation up to 24 hours before",
  hero: { image: "/images/letters/i1.jpg", focus: "50% 42%", alt: "Lunch on the KIKI terrace, yachts on the Miami River behind" },
  logo: "/brand/kiki-logo.svg",
  florals: {
    top: "https://www.kikiontheriver.com/wp-content/uploads/2026/03/Flower-top.webp",
    down: "https://www.kikiontheriver.com/wp-content/uploads/2026/03/Flower-down.webp",
  },
  menuUrl: "/menu",
};

export const SPACES: Space[] = [
  { id: "dining", name: "Dining", img: "/images/letters/k1.jpg", blurb: "Blue-and-white columns, lantern light" },
  { id: "vip", name: "VIP Table Service", img: "/images/champagne.jpg", blurb: "Bottle service, the best tables" },
  { id: "private", name: "Private Events", img: "/images/long-table.jpg", blurb: "Long tables under the bougainvillea" },
  { id: "patio", name: "Patio", img: "/images/wheel-day.jpg", blurb: "On the water, in the sun" },
  { id: "sea", name: "KIKI at Sea", img: "/images/marina.jpg", blurb: "Dinner while cruising Biscayne Bay" },
];

export const OCCASIONS = ["None", "Birthday", "Anniversary", "Date Night", "Business", "Celebration"];

export const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "11+"] as const;

export const ADDONS: AddOn[] = [
  { id: "mezze", title: "Greek Mezze Tasting", desc: "Chef's curated selection of traditional Greek small plates", price: 185, icon: "🫒", img: "/images/long-table.jpg" },
  { id: "wine", title: "Wine Pairing", desc: "Sommelier-curated Greek wines for your dinner", price: 85, icon: "🍷", img: "/images/letters/k1.jpg" },
  { id: "bday", title: "Birthday Setup", desc: "Candle, dessert plate, and a personalized card", price: 25, icon: "🎂", img: "/images/wheel-night.jpg" },
  { id: "flowers", title: "Table Flowers", desc: "Seasonal arrangement at your table on arrival", price: 45, icon: "🌷", img: "/images/heart.jpg" },
  { id: "champagne", title: "Champagne on Arrival", desc: "A bottle of house Champagne, chilled and ready", price: 120, icon: "🍾", img: "/images/champagne.jpg" },
  { id: "valet", title: "Valet Service", desc: "Skip the parking. We'll handle it.", price: 20, icon: "🚗", img: "/images/nightlife.jpg" },
];

/** Times offered, by service. */
export const TIMES = {
  lunch: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"],
  dinner: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"],
};

export const ZONES = ["Terrace", "Dining Room", "Bar", "Patio"];

/** An illustrative plan: the river runs along the top, the terrace is on the water. Coordinates are in a 400 × 520 box. */
export const TABLES: Table[] = [
  ...[1, 2, 3, 4, 5, 6].map((n, i) => ({ id: `T${n}`, label: `Terrace ${n}`, zone: "Terrace", seats: i % 3 === 2 ? 6 : 4, x: 44 + i * 62, y: 118, shape: "round" as const, taken: n === 3 })),
  ...[7, 8, 9, 10, 11, 12].map((n, i) => ({ id: `T${n}`, label: `Terrace ${n}`, zone: "Terrace", seats: i % 2 ? 2 : 4, x: 44 + i * 62, y: 176, shape: "round" as const, taken: n === 10 })),
  { id: "L1", label: "The Long Table", zone: "Terrace", seats: 12, x: 200, y: 240, shape: "rect", taken: false },
  ...[1, 2, 3, 4].map((n, i) => ({ id: `D${n}`, label: `Dining ${n}`, zone: "Dining Room", seats: 4, x: 52 + i * 64, y: 330, shape: "rect" as const, taken: n === 2 })),
  ...[5, 6, 7, 8].map((n, i) => ({ id: `D${n}`, label: `Dining ${n}`, zone: "Dining Room", seats: n === 8 ? 8 : 4, x: 52 + i * 64, y: 388, shape: "rect" as const })),
  ...[1, 2, 3, 4].map((n, i) => ({ id: `B${n}`, label: `Bar ${n}`, zone: "Bar", seats: 2, x: 326 + (i % 2) * 40, y: 318 + Math.floor(i / 2) * 44, shape: "round" as const, taken: n === 1 })),
  ...[1, 2, 3, 4, 5].map((n, i) => ({ id: `P${n}`, label: `Patio ${n}`, zone: "Patio", seats: i === 4 ? 6 : 4, x: 48 + i * 76, y: 468, shape: "round" as const, taken: n === 4 })),
];

export const DISHIO = { name: "Dishio", url: "https://get.dish.io/" };
