import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant.model";

// Real Addis Ababa restaurants (name, location, phone and hours taken from
// Google Maps). Descriptions are our own wording. Ratings are NOT copied:
// averageRating starts at 0 and is calculated from reviews made in TasteTrack.
// Please re-check details before publishing; businesses change hours/numbers.

const IMG = {
  Italian: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
  ],
  Japanese: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
  ],
  BBQ: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
  ],
  Vegan: [
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
  ],
  "Fine Dining": [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
  ],
  Cafes: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
  ],
} as const;

const restaurants = [
  // ---------- Italian ----------
  {
    name: "Le Basilic Addis",
    description:
      "Italian restaurant and cafe serving pizza, pasta and lasagna, with a menu that runs from breakfast through dinner.",
    address: "Gabon St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: IMG.Italian,
    contact: { phone: "+251 90 560 4444" },
    openingHours: "Mon-Sun 8:30 AM - 10:00 PM (Wed until 10:30 PM)",
    latitude: 8.995234,
    longitude: 38.7674019,
  },
  {
    name: "Little Italy (Bole Dembel)",
    description:
      "Cozy family-run Italian spot known for its pasta, pizza and ravioli, popular for dinners with family and friends.",
    address: "Bole Dembel, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: IMG.Italian,
    contact: { phone: "+251 98 750 5154" },
    openingHours: "Mon-Fri 12:00 PM - 9:00 PM, Sat-Sun 12:00 PM - 10:00 PM",
    latitude: 9.0043014,
    longitude: 38.7704031,
  },
  {
    name: "Bettucci Ristorante & Pizzeria",
    description:
      "Restaurant and pizzeria with a traditional brick fire oven, garden seating and an art gallery on site.",
    address: "Alem Village, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian Pizza",
    priceRange: "$$$",
    images: IMG.Italian,
    contact: { phone: "+251 99 116 2244" },
    openingHours: "Tue-Sun 12:00 PM - 10:00 PM (Closed Mon)",
    latitude: 8.9985031,
    longitude: 38.7610273,
  },

  // ---------- Japanese ----------
  {
    name: "Matsuki",
    description:
      "Upscale Japanese restaurant with sushi, cocktails and a cozy, luxurious atmosphere, often chosen for special occasions.",
    address: "Ground floor, Kman Guesthouse, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese Sushi",
    priceRange: "$$$$",
    images: IMG.Japanese,
    contact: { phone: "+251 90 117 1819" },
    openingHours:
      "Mon 6:00 PM - 11:00 PM; Tue-Sun 8:00-10:30 AM, 12:00-3:30 PM, 6:00-11:00 PM",
    latitude: 8.9920451,
    longitude: 38.7669652,
  },
  {
    name: "KAZ Sushi & Japanese Fusion",
    description:
      "Sushi and Japanese fusion restaurant with a fine-dining feel, also serving steaks and desserts. Reservations recommended.",
    address: "Rebtek Apartments, Wendamanah St, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese Fusion",
    priceRange: "$$$$",
    images: IMG.Japanese,
    contact: { phone: "+251 98 683 3333" },
    openingHours:
      "Mon 6:00-11:00 PM; Tue-Sat 12:00-3:00 PM & 6:00-11:00 PM; Sun 11:00 AM-3:00 PM & 6:00-11:00 PM",
    latitude: 9.0255248,
    longitude: 38.7575221,
  },
  {
    name: "Sakura Japanese Restaurant (Bole Rwanda)",
    description:
      "Calm Japanese restaurant with a garden setting and a large selection of dishes and drinks, using imported ingredients.",
    address: "Near Rwanda Embassy, Bole Rwanda, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese",
    priceRange: "$$",
    images: IMG.Japanese,
    contact: { phone: "+251 98 487 3551" },
    openingHours: "Mon-Sat 11:00 AM - 2:30 PM & 5:00 PM - 9:00 PM (Closed Sun)",
    latitude: 8.9864932,
    longitude: 38.7757714,
  },

  // ---------- BBQ ----------
  {
    name: "Chanoly Carnivore",
    description:
      "Grill-focused restaurant serving Texas-style barbecue with combo platters, in a spacious indoor and outdoor setting.",
    address: "XQRH+GJG, Addis Ababa, Ethiopia",
    category: "BBQ",
    cuisine: "Texas BBQ",
    priceRange: "$$$$",
    images: IMG.BBQ,
    contact: { phone: "+251 98 609 1656" },
    openingHours: "Mon-Sun 9:00 AM - 11:00 PM",
    latitude: 8.9910009,
    longitude: 38.7788992,
  },
  {
    name: "Korma Grill",
    description:
      "Grill house known for tender beef ribs and generous combo meals with house sauces, in a spacious venue.",
    address: "Bole, Addis Ababa, Ethiopia",
    category: "BBQ",
    cuisine: "Grill",
    priceRange: "$$$",
    images: IMG.BBQ,
    contact: { phone: "+251 90 588 8888" },
    openingHours: "Hours not listed",
    latitude: 9.0029746,
    longitude: 38.7793106,
  },
  {
    name: "Toro Grill and Lounge",
    description:
      "Late-night grill and lounge with combo grill platters, live music and a lively evening atmosphere.",
    address: "XQXF+F5W, Addis Ababa, Ethiopia",
    category: "BBQ",
    cuisine: "Grill & Lounge",
    priceRange: "$$$",
    images: IMG.BBQ,
    contact: { phone: "+251 90 811 1161" },
    openingHours: "Mon-Sun 12:00 PM - 2:30 AM",
    latitude: 8.9990776,
    longitude: 38.7737926,
  },

  // ---------- Vegan ----------
  {
    name: "Fitsum Shiro Bet",
    description:
      "Fully vegan Ethiopian fasting food: shiro with fresh injera, vegan tsom tibs and sandwiches at very affordable prices.",
    address: "Beside Helzer, XQXP+RF9, Addis Ababa, Ethiopia",
    category: "Vegan",
    cuisine: "Ethiopian Vegan",
    priceRange: "$",
    images: IMG.Vegan,
    contact: { phone: "+251 91 191 0671" },
    openingHours: "Mon-Sun 8:00 AM - 9:00 PM",
    latitude: 8.9995488,
    longitude: 38.7862196,
  },
  {
    name: "Bete Aurael",
    description:
      "Vegetarian restaurant and juice bar with salads, sandwiches, fresh juices and delivery service.",
    address: "XQXM+QWW, Addis Ababa, Ethiopia",
    category: "Vegan",
    cuisine: "Vegetarian & Juice Bar",
    priceRange: "$",
    images: IMG.Vegan,
    contact: { phone: "" },
    openingHours: "Mon-Sun 7:00 AM - 9:30 PM",
    latitude: 8.9995429,
    longitude: 38.7848235,
  },

  // ---------- Fine Dining ----------
  {
    name: "The Exclusive Restaurant",
    description:
      "High-end steakhouse and fine dining venue with an elegant atmosphere, including steak cooked at your table.",
    address: "Africa Ave, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Steakhouse",
    priceRange: "$$$$",
    images: IMG["Fine Dining"],
    contact: { phone: "+251 92 944 6238" },
    openingHours: "Mon-Sun 12:00-3:00 PM & 6:00-10:00 PM",
    latitude: 8.9944837,
    longitude: 38.7852396,
  },
  {
    name: "Cprem Gastronomy and Mixology",
    description:
      "Fine dining restaurant offering a creative tasting-style experience with sashimi, steak and craft cocktails.",
    address: "Bole Atlas, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Contemporary Fusion",
    priceRange: "$$$",
    images: IMG["Fine Dining"],
    contact: { phone: "+251 98 355 5556" },
    openingHours: "Mon-Thu 6:00 PM - 12:00 AM, Fri-Sat 6:00 PM - 2:00 AM (Closed Sun)",
    latitude: 9.0008649,
    longitude: 38.7818844,
  },
  {
    name: "The Alchemist Dine & Wine",
    description:
      "Fine-dining restaurant led by a chef-owner, known for its seven-course set menu and wine pairings.",
    address: "African Avenue, Japan Street, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Contemporary International",
    priceRange: "$$$$",
    images: IMG["Fine Dining"],
    contact: { phone: "+251 98 989 0102" },
    openingHours: "Mon-Tue, Thu-Sun 12:00 PM - 10:30 PM (Closed Wed)",
    latitude: 8.9919165,
    longitude: 38.779167,
  },

  // ---------- Cafes ----------
  {
    name: "YeGesha Specialty Cafe & Roastery",
    description:
      "Specialty coffee shop and roastery serving single-origin and Gesha coffee, crepes and pastries, with an outdoor area.",
    address: "Rwanda St, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Specialty Coffee",
    priceRange: "$$",
    images: IMG.Cafes,
    contact: { phone: "+251 98 412 1212" },
    openingHours: "Mon-Sun 7:00 AM - 10:00 PM",
    latitude: 8.9874188,
    longitude: 38.7767951,
  },
  {
    name: "Wild Coffee (Gazebo Square)",
    description:
      "Coffee shop for tasting and buying organic Ethiopian coffees, with staff who guide you through the different varieties.",
    address: "Gazebo Square, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Ethiopian Coffee",
    priceRange: "$",
    images: IMG.Cafes,
    contact: { phone: "+251 96 680 8182" },
    openingHours: "Mon-Sun 7:00 AM - 8:00 PM",
    latitude: 9.0008031,
    longitude: 38.7673735,
  },
  {
    name: "Tomoca Coffee",
    description:
      "Small coffee shop serving and selling authentic Ethiopian coffee at reasonable prices.",
    address: "XQVR+WC9, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Ethiopian Coffee",
    priceRange: "$",
    images: IMG.Cafes,
    contact: { phone: "+251 90 115 2222" },
    openingHours: "Hours not listed",
    latitude: 8.9943212,
    longitude: 38.790897,
  },
];

// Names from the earlier fictional demo seed. Removed so they don't mix with real data.
const OLD_FICTIONAL_NAMES = [
  "Trattoria Bole",
  "La Piazza Piassa",
  "Sakura Kazanchis",
  "Ramen House Sarbet",
  "Tibs & Embers Megenagna",
  "Smokehouse Gerji",
  "Yetsom Garden",
  "Green Bowl Old Airport",
  "The Skyline Terrace",
  "Saba Heritage Dining",
  "Buna Corner Cafe",
  "Merkato Roasters",
];

const IMAGE_PREFIX: Record<string, string> = {
  "The Alchemist Dine & Wine": "alchemist",
  "Bete Aurael": "bete",
  "Cprem Gastronomy and Mixology": "cprem",
  "The Exclusive Restaurant": "exclusive",
  "Fitsum Shiro Bet": "fistum", // matches your file names (fistum*.webp)
  "Korma Grill": "korma",
  "Tomoca Coffee": "tomoca",
  "Toro Grill and Lounge": "toro",
  "Wild Coffee (Gazebo Square)": "wild",
  "YeGesha Specialty Cafe & Roastery": "yegesha",
  // add more as you prepare photos, e.g.  "Matsuki": "matsuki",
};

const SEED_IMAGES_DIR = path.join(process.cwd(), "seed-images");
const UPLOADS_SEED_DIR = path.join(process.cwd(), "uploads", "seed");
const PUBLIC_URL = (process.env.PUBLIC_URL || "http://localhost:5000").replace(/\/$/, "");
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function localImagesFor(name: string): string[] {
  if (!fs.existsSync(SEED_IMAGES_DIR)) return [];

  const prefix = (IMAGE_PREFIX[name] || slugify(name)).toLowerCase();
  // "toro", "toro 2", "toro-2", "toro_2"  (case-insensitive)
  const pattern = new RegExp(`^${escapeRegex(prefix)}(?:[\\s_-]*(\\d+))?$`, "i");

  const matches = fs
    .readdirSync(SEED_IMAGES_DIR)
    .filter((f) => IMAGE_EXT.test(f))
    .map((f) => {
      const m = f.replace(IMAGE_EXT, "").trim().match(pattern);
      return m ? { file: f, order: m[1] ? parseInt(m[1], 10) : 1 } : null;
    })
    .filter((x): x is { file: string; order: number } => x !== null)
    .sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));

  if (matches.length === 0) return [];
  fs.mkdirSync(UPLOADS_SEED_DIR, { recursive: true });

  const restaurantSlug = slugify(name);
  return matches.map(({ file }, i) => {
    // clean, URL-safe file name (no spaces / capitals): <restaurant-slug>-<n>.<ext>
    const ext = path.extname(file).toLowerCase();
    const cleanName = `${restaurantSlug}-${i + 1}${ext}`;
    fs.copyFileSync(path.join(SEED_IMAGES_DIR, file), path.join(UPLOADS_SEED_DIR, cleanName));
    return `${PUBLIC_URL}/uploads/seed/${cleanName}`;
  });
}

async function seedRestaurants() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing required environment variable: MONGO_URI");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  const removed = await Restaurant.deleteMany({
    name: { $in: OLD_FICTIONAL_NAMES },
  });
  if (removed.deletedCount) {
    console.log(`Removed ${removed.deletedCount} old fictional restaurants.`);
  }

  let created = 0;
  let updated = 0;
  let withPhotos = 0;
  const missingPhotos: string[] = [];

  for (const r of restaurants) {
    // Match on name so re-running never creates duplicates.
    // averageRating is not touched, so ratings computed from real reviews are kept.
    const local = localImagesFor(r.name);
    if (local.length > 0) withPhotos++;
    else missingPhotos.push(r.name);

    const result = await Restaurant.updateOne(
      { name: r.name },
      { $set: { ...r, images: local.length > 0 ? local : [...r.images] } },
      { upsert: true }
    );

    if (result.upsertedCount > 0) created++;
    else updated++;
  }

  console.log(
    `Restaurants seeded: ${created} created, ${updated} already existed (refreshed).`
  );
  console.log(`${withPhotos}/${restaurants.length} restaurants use your own photos from seed-images/.`);
  if (missingPhotos.length > 0) {
    console.log("Using generic category images for: " + missingPhotos.join(", "));
  }
}

seedRestaurants()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());