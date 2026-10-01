import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Restaurant from "../models/restaurant.model";
import Review from "../models/review.model";
import User from "../models/user.model";

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
    name: "COOK Studio",
    description:
      "Small, clean Italian restaurant known for fresh pasta and excellent burgers, with friendly service and a complimentary starter.",
    address: "Guinea Conakry St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$$",
    images: IMG.Italian,
    contact: { phone: "+251 93 133 1155" },
    openingHours: "Mon-Sun 11:30 AM - 9:00 PM",
    latitude: 9.0139659,
    longitude: 38.7690653,
  },
  {
    name: "Sale e Pepe",
    description:
      "Italian restaurant set in a charming old Ethiopian house with a garden, serving wood-fired pizza, carbonara and handmade pasta.",
    address: "Queen Elizabeth II St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$$",
    images: IMG.Italian,
    contact: {
      phone: "+251 94 333 9933",
      website: "https://instagram.com/sale_e_pepe_addis",
    },
    openingHours:
      "Tue-Sat 12:00-3:00 PM & 6:00-10:00 PM; Sun 12:00-5:00 PM (Closed Mon)",
    latitude: 9.0330196,
    longitude: 38.7760447,
  },
  {
    name: "Bella Pasta and Pizza (Jackros)",
    description:
      "Long-running Italian restaurant chain in Addis, known for its signature pasta sauce, lasagna, pizza and combo menus in a family-friendly setting.",
    address: "Jackros, Bole, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: IMG.Italian,
    contact: {
      phone: "+251 93 655 6552",
      website: "https://bellapastaandpizza.com/",
    },
    openingHours: "Mon-Sun 9:00 AM - 9:00 PM",
    latitude: 8.9955134,
    longitude: 38.7909554,
  },
  {
    name: "Ethio-Italy",
    description:
      "Simple family restaurant open around the clock, loved for its cheesy lasagna, spaghetti and warm handmade bread with a spicy dip.",
    address: "Zimbabwe St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: IMG.Italian,
    contact: { phone: "+251 99 800 7839" },
    openingHours: "Open 24 hours",
    latitude: 8.9896775,
    longitude: 38.7828058,
  },

  // ---------- Japanese ----------
  {
    name: "Kokoro Addis",
    description:
      "Japanese restaurant and wine bar in Bole with sushi, ramen and steak dishes, and a chef-owner who often greets guests at their table.",
    address: "Namibia St, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese Sushi & Ramen",
    priceRange: "$$$",
    images: IMG.Japanese,
    contact: {
      phone: "+251 98 502 2222",
      website: "http://www.kokoroaddis.com/",
    },
    openingHours:
      "Mon, Wed-Fri 9:00 AM-3:00 PM & 5:00-10:00 PM; Tue 9:00 AM-2:30 PM & 5:00-10:00 PM; Sat 9:00 AM-10:00 PM; Sun 9:30 AM-10:00 PM",
    latitude: 9.0001339,
    longitude: 38.7829554,
  },
  {
    name: "HOTTO",
    description:
      "Upscale Asian fusion restaurant with a strong sushi menu, along with lamb chops, sea bass and premium steaks, popular for celebrations.",
    address: "The Place Building, 1st Floor, Cape Verde St, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Asian Fusion & Sushi",
    priceRange: "$$$$",
    images: IMG.Japanese,
    contact: {
      phone: "+251 90 347 5477",
      website: "https://hottoaddis.com/",
    },
    openingHours:
      "Mon-Fri 12:00-4:00 PM & 5:30 PM-12:00 AM; Sat-Sun 12:00 PM-12:00 AM",
    latitude: 9.0018168,
    longitude: 38.7795922,
  },

  // ---------- BBQ ----------
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

// Restaurants that are deleted from the database when the seed runs:
// the earlier fictional demo seed, plus real ones we replaced.
const OLD_FICTIONAL_NAMES = [
  "Le Basilic Addis",
  "Little Italy (Bole Dembel)",
  "Bettucci Ristorante & Pizzeria",
  "Matsuki",
  "KAZ Sushi & Japanese Fusion",
  "Sakura Japanese Restaurant (Bole Rwanda)",
  "Chanoly Carnivore",
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

// ---------------------------------------------------------------------------
// Your own photos live in  backend/seed-images/
// Name each restaurant's photos with the prefix below, e.g.
//   toro.webp, toro 2.webp, toro 3.webp        (also accepts toro-2 / toro_2)
// jpg, jpeg, png and webp all work; upper/lower case does not matter.
// The seed copies them to uploads/seed/ (served at /uploads) with clean names
// and uses them. Restaurants with no photos keep the generic category images.
// ---------------------------------------------------------------------------
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
  "COOK Studio": "cook",
  "Sale e Pepe": "sale",
  "Bella Pasta and Pizza (Jackros)": "bella",
  "Ethio-Italy": "ethioitaly", // matches your file names (ethioitaly*)
  "Kokoro Addis": "kokoro",
  "HOTTO": "hotto",
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

// Core seeding logic. Assumes mongoose is already connected.
export async function runSeed() {
  const removed = await Restaurant.deleteMany({
    name: { $in: OLD_FICTIONAL_NAMES },
  });
  if (removed.deletedCount) {
    console.log(`Removed ${removed.deletedCount} old restaurants.`);
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

// Deletes every restaurant that is NOT in the seed list above, together with its
// reviews, and removes it from users' favorites (so nothing is left pointing at it).
export async function pruneExtras() {
  const keep = restaurants.map((r) => r.name);
  const extras = await Restaurant.find({ name: { $nin: keep } }).select("_id name");

  if (extras.length === 0) {
    console.log("No extra restaurants to remove.");
    return;
  }

  const ids = extras.map((e) => e._id);
  const reviews = await Review.deleteMany({ restaurant: { $in: ids } });
  await User.updateMany({ favorites: { $in: ids } }, { $pull: { favorites: { $in: ids } } });
  await Restaurant.deleteMany({ _id: { $in: ids } });

  console.log(
    `Removed ${extras.length} extra restaurants (and ${reviews.deletedCount} reviews): ` +
      extras.map((e) => e.name).join(", ")
  );
}

// Re-creates uploads/seed/* from seed-images/. Hosts with an ephemeral disk (e.g. Render
// free tier) wipe uploads/ on every deploy, but the database keeps pointing at those files.
export function syncSeedPhotos() {
  let copied = 0;
  for (const r of restaurants) copied += localImagesFor(r.name).length;
  console.log(`Seed photos synced: ${copied} files in uploads/seed.`);
}

// Call from server.ts AFTER the database is connected:
//   await autoSeedOrSync();
// - always restores the seed photo files
// - seeds the restaurants only when the collection is empty (never overwrites admin edits)
// - set FORCE_SEED=true once to re-run the full seed (e.g. after fixing PUBLIC_URL)
export async function autoSeedOrSync() {
  try {
    syncSeedPhotos();

    const force = process.env.FORCE_SEED === "true";
    const count = await Restaurant.estimatedDocumentCount();

    if (force || count === 0) {
      console.log(force ? "FORCE_SEED=true: running full seed." : "No restaurants found: seeding.");
      await runSeed();
    } else {
      console.log(`Restaurants already present (${count}). Skipping seed.`);
    }
  } catch (err) {
    // never stop the API from starting because seeding failed
    console.error("Auto-seed failed:", err);
  }
}

// Command-line usage:
//   npm run seed:restaurants                 seed / refresh the restaurants
//   npm run seed:restaurants -- --if-empty   seed only an empty database
//   npm run seed:restaurants -- --prune      also delete restaurants that are not in the seed list
async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing required environment variable: MONGO_URI");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  if (process.argv.includes("--if-empty")) {
    const existing = await Restaurant.estimatedDocumentCount();
    if (existing > 0) {
      console.log(`Restaurants already present (${existing}). Skipping seed.`);
      return;
    }
  }

  await runSeed();

  if (process.argv.includes("--prune")) {
    await pruneExtras();
  }
}

// Only run when executed directly, NOT when server.ts imports this file.
if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}