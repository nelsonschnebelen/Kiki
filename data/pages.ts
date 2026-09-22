/**
 * Copy for the inner pages. Drawn from kikiontheriver.com (about, happenings,
 * private events, KIKI at Sea) and lightly edited; no claims invented.
 */

export const happeningsPage = {
  hero: {
    image: "/images/wheel-day.jpg",
    alt: "The KIKI terrace by day, bougainvillea over white tables on the Miami River",
    eyebrow: "Every week on the river",
    title: "Happenings",
    subtitle: "Brunch · Happy Hour · Nights that turn into dancing",
    note: ["Greek Soul", "Miami Vibes"],
  },
  intro:
    "KIKI on the River brings modern Greek cuisine to the Miami River: a luxurious dining experience that exudes sophistication yet keeps a familial charm. Watch one of Miami’s most famous Mediterranean restaurants transform as the sun goes down.",
  chapters: [
    {
      id: "day",
      kicker: "Noon",
      title: "Lunch on the water",
      body: "Long white tables under the bougainvillea, yachts drifting past, Greek salads and grilled octopus in the sun. Bright, unhurried, very Miami.",
      image: "/images/letters/i1.jpg",
      alt: "Guests enjoying lunch beside the river",
      note: ["Good Food", "Brighter Days"],
      focus: "50% 45%",
    },
    {
      id: "golden",
      kicker: "Golden hour",
      title: "Sunset sips",
      body: "Happy Hour at the bar, weekdays from 5 to 7. Champagne on ice, the skyline turning gold across the river, and the night just beginning.",
      image: "/images/champagne.jpg",
      alt: "Champagne bottles chilling in silver buckets at sunset",
      note: ["Sunset Sips", "Await"],
      focus: "50% 40%",
    },
    {
      id: "night",
      kicker: "After dark",
      title: "The last dance",
      body: "Napkins in the air, samba dancers between the tables, sparklers on the champagne. The same room, a different kind of magic.",
      image: "/images/wheel-night.jpg",
      alt: "Guests dancing with white napkins under the bougainvillea at night",
      note: ["Same Table", "Different Magic"],
      focus: "50% 50%",
    },
  ],
  happenings: {
    title: "This week at KIKI",
    items: [
      { day: "Saturday & Sunday", title: "Brunch", time: "12:30 – 4:30 PM", body: "Brunch meets the Riviera. Mediterranean dishes, flowing champagne and waterfront views, where Miami energy meets Greek island hospitality." },
      { day: "Monday to Friday", title: "Happy Hour", time: "5 – 7 PM · at the bar", body: "Sip, savor, repeat. Sunset sips at the bar on weekdays." },
      { day: "Wednesdays", title: "Midweek at KIKI", time: "Evenings", body: "Dinner with the lights down. Special Wednesday bottle pricing on the list." },
      { day: "Thursdays", title: "Dinner into dancing", time: "Evenings", body: "The long table turns into the dance floor, with live entertainment between courses." },
      { day: "Saturdays", title: "The big night", time: "Late", body: "Samba dancers, sparklers and napkins in the air. Book early." },
    ],
  },
  atSea: {
    kicker: "KIKI at Sea",
    title: "Front row seats to sunsets.",
    body: "KIKI’s famous Greek dishes, served while cruising Biscayne Bay. Half-day routes past Millionaire Row, Star Island and Fisher Island; full-day charters out to Stiltsville.",
    image: "/images/marina.jpg",
    alt: "Yachts moored beside the bougainvillea on the Miami River",
    cta: "Enquire about KIKI at Sea",
  },
};

export const privateEventsPage = {
  hero: {
    image: "/images/long-table.jpg",
    alt: "A long white table set for a private event under the bougainvillea beside the river",
    eyebrow: "Private & social events",
    title: "Events",
    subtitle: "Where impeccable hospitality meets visionary cuisine",
    note: ["Meet Me", "At KIKI"],
    focus: "60% 50%",
  },
  intro:
    "Whether you are planning a chic corporate affair, dinner for friends or an extravagant soirée, KIKI on the River turns your event into reality with personalised service, refined cuisine, unique mixology and stunning event spaces.",
  director: { role: "Director of Events", name: "Caroline McDonald" },
  types: [
    { title: "Corporate affairs", quote: "Blend business with unforgettable ambiance.", body: "Riverfront views, vibrant Mediterranean cuisine and a sophisticated setting for business dinners, team celebrations and exclusive company events.", image: "/images/long-table.jpg", focus: "60% 50%" },
    { title: "KIKI Brides", quote: "The unforgettable bachelorette experience.", body: "Your celebration begins with us and doesn’t end here. We’ve partnered with Miami’s most sought-after vendors to curate the weekend of your dreams, from elevated dining and VIP nightlife to wellness escapes and picture-perfect photo ops.", image: "/images/heart.jpg", focus: "40% 50%" },
    { title: "Baby showers", quote: "Where new beginnings are celebrated.", body: "Celebrate a beautiful new beginning surrounded by waterfront views and Mediterranean-inspired cuisine, in a refined setting made for a memorable gathering with family and friends.", image: "/images/wheel-day.jpg", focus: "50% 50%" },
    { title: "Fashion shows", quote: "An iconic setting for an iconic brand moment.", body: "Runway experiences at Miami’s most iconic waterfront setting, including Art Basel Miami Beach and Miami Swim Week.", image: "/images/letters/i2.jpg", focus: "50% 30%" },
    { title: "Brand activations", quote: "Host your next event with us.", body: "World-class service meets curated experiences and one-of-a-kind entertainment, with imaginative mixology and visionary cuisine.", image: "/images/letters/k2.jpg", focus: "50% 30%" },
    { title: "The KIKI Glam experience", quote: "Pretty sips and glam tips.", body: "An afternoon of glamour: a makeup class with champagne and light bites.", image: "/images/champagne.jpg", focus: "50% 40%" },
  ],
  spaces: {
    title: "Our signature spaces",
    items: [
      { name: "The Terrace", body: "Under the bougainvillea, on the water. Long tables for celebrations of every size." },
      { name: "The Dining Room", body: "Blue-and-white columns, lantern light, and the full KIKI menu at your table." },
      { name: "KIKI at Sea", body: "The whole experience on a yacht, from Star Island to Stiltsville." },
      { name: "Full buyout", body: "The restaurant, yours for the night, with entertainment programmed around you." },
    ],
  },
  cta: { label: "Plan your event", note: "Tell us the date, the guest count and the occasion. Our events team replies within a day." },
};

export const vipPage = {
  hero: {
    image: "/images/footer-poster.jpg",
    alt: "KIKI at night: dancing, champagne and the party at the table",
    eyebrow: "After dark",
    title: "VIP",
    subtitle: "Bottle service · the best tables · your night",
    note: ["Food", "Friends", "Dancing", "Always"],
    focus: "50% 50%",
  },
  intro:
    "Dinner turns into dancing at KIKI. Reserve the table you want, with bottle service and a host who knows your name, on the nights the river comes alive.",
  nights: [
    { day: "Wednesday", title: "Midweek at KIKI", body: "Special bottle pricing on Wednesdays. Ask for the Wednesday list when you book." },
    { day: "Thursday", title: "Dinner into dancing", body: "The long table turns into the dance floor. Live entertainment between courses." },
    { day: "Saturday", title: "The big one", body: "Samba dancers, sparklers and napkins in the air. Book early." },
  ],
  perks: {
    title: "What a VIP table comes with",
    items: ["Priority seating at the best tables on the water", "Bottle service with regular, Wednesday and event pricing", "A dedicated host for the night", "Sparkler presentations for celebrations", "Access to KIKI at Sea charters"],
  },
  cta: { label: "Reserve a VIP table", note: "Parties of 11 or more, and full bottle-service packages, go straight to our events team." },
};
