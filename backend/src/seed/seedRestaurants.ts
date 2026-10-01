import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Restaurant from "../models/restaurant.model";
import User from "../models/user.model";
import Review from "../models/review.model";

const DEMO_USERS = [
  {
<<<<<<< HEAD
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
=======
    name: "Admin User",
    email: "admin@tastetrack.com",
    password: "admin123",
    role: "admin",
    bio: "TasteTrack System Administrator.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Abebe Bikila",
    email: "abebe@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "Addis food enthusiast and coffee lover.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Selamawit Haile",
    email: "selam@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "Traditional Ethiopian cuisine blogger.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Samuelsson",
    email: "marcus@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "International chef & gastronomy explorer.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Bethlehem Tadesse",
    email: "betty@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "Cafe hunter & pastry critic in Addis Ababa.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Dawit Kassa",
    email: "dawit@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "Barbecue connoisseur & local guide.",
    profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Helen Berhane",
    email: "helen@tastetrack.com",
    password: "password123",
    role: "user",
    bio: "Plant-based dining advocate.",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  },
];

const RESTAURANTS = [
  // 1. Yod Abyssinia
  {
    name: "Yod Abyssinia Cultural Restaurant",
    description:
      "World-famous cultural restaurant offering traditional Ethiopian banquets including Doro Wat, Special Kitfo, and Beyaynetu, accompanied by live traditional music and dance performances.",
    address: "Bole Medhanialem, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$$",
    images: [
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 11 661 2176",
    openingHours: "Mon-Sun 10:00 AM - 11:30 PM",
    latitude: 8.995804,
    longitude: 38.784651,
>>>>>>> main
  },

  // 2. Kategna
  {
<<<<<<< HEAD
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
=======
    name: "Kategna Ethiopian Restaurant",
    description:
      "Renowned for authentic Ethiopian gastronomy. Famous for sizzling Shekla Tibs, slow-cooked Shiro Tegabino, and traditional coffee ceremonies served on fresh injera.",
    address: "Bole Road, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 11 662 7272",
    openingHours: "Mon-Sun 8:00 AM - 11:00 PM",
    latitude: 8.998124,
    longitude: 38.775412,
>>>>>>> main
  },

  // 3. Habesha Cultural
  {
<<<<<<< HEAD
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
=======
    name: "Habesha Cultural Restaurant",
    description:
      "Authentic Ethiopian dining experience with thatched-roof decor, traditional woven tables (Mesob), honey wine (Tej), and flavorful feast platters.",
    address: "Bole Atlas, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$$",
    images: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 11 662 2548",
    openingHours: "Mon-Sun 11:00 AM - 11:00 PM",
    latitude: 9.001245,
    longitude: 38.782104,
>>>>>>> main
  },

  // 4. Fitsum Shiro Bet
  {
    name: "Fitsum Shiro Bet",
    description:
      "Fully vegan Ethiopian fasting food spot. Famous for piping hot shiro with fresh injera, vegan tsom tibs, and lentils at very affordable prices.",
    address: "Beside Helzer, Addis Ababa, Ethiopia",
    category: "Vegan",
    cuisine: "Ethiopian Vegan",
    priceRange: "$",
<<<<<<< HEAD
    images: IMG.Vegan,
    contact: { phone: "+251 91 191 0671" },
=======
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 91 191 0671",
>>>>>>> main
    openingHours: "Mon-Sun 8:00 AM - 9:00 PM",
    latitude: 8.9995488,
    longitude: 38.7862196,
  },

  // 5. Tomoca Coffee
  {
    name: "Tomoca Coffee (Black Gold)",
    description:
      "The historic first specialty coffee roastery in Addis Ababa, established in 1953. Famous for rich, dark-roasted Arabica macchiatos and espresso.",
    address: "Wavel St, Piassa, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Ethiopian Coffee",
    priceRange: "$",
<<<<<<< HEAD
    images: IMG.Vegan,
    contact: { phone: "" },
    openingHours: "Mon-Sun 7:00 AM - 9:30 PM",
    latitude: 8.9995429,
    longitude: 38.7848235,
=======
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 11 111 2222",
    openingHours: "Mon-Sun 6:30 AM - 8:30 PM",
    latitude: 9.030512,
    longitude: 38.751842,
>>>>>>> main
  },

  // 6. Le Basilic Addis
  {
    name: "Le Basilic Addis",
    description:
      "Italian bistro and cafe serving hand-rolled pasta, wood-fired pizza, and gourmet lasagna, running from breakfast through late dinner.",
    address: "Gabon St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621996346565-e3d5d6281256?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 90 560 4444",
    openingHours: "Mon-Sun 8:30 AM - 10:00 PM",
    latitude: 8.995234,
    longitude: 38.7674019,
  },

  // 7. Matsuki Japanese Restaurant
  {
    name: "Matsuki Japanese Restaurant",
    description:
      "Upscale Japanese restaurant offering fresh sushi omakase, craft cocktails, and an intimate, elegant dining atmosphere.",
    address: "Kman Guesthouse, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese Sushi",
    priceRange: "$$$$",
<<<<<<< HEAD
    images: IMG["Fine Dining"],
    contact: { phone: "+251 92 944 6238" },
    openingHours: "Mon-Sun 12:00-3:00 PM & 6:00-10:00 PM",
    latitude: 8.9944837,
    longitude: 38.7852396,
=======
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 90 117 1819",
    openingHours: "Tue-Sun 12:00 PM - 11:00 PM",
    latitude: 8.9920451,
    longitude: 38.7669652,
>>>>>>> main
  },

  // 8. Chanoly Carnivore BBQ
  {
    name: "Chanoly Carnivore BBQ",
    description:
<<<<<<< HEAD
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
=======
      "Grill-focused smokehouse serving Texas-style barbecue with smoked beef ribs, brisket combo platters, and house spicy sauces.",
    address: "Bole Japan St, Addis Ababa, Ethiopia",
    category: "BBQ",
    cuisine: "Texas BBQ",
    priceRange: "$$$$",
    images: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 98 609 1656",
    openingHours: "Mon-Sun 9:00 AM - 11:00 PM",
    latitude: 8.9910009,
    longitude: 38.7788992,
>>>>>>> main
  },

  // 9. The Alchemist Dine & Wine
  {
    name: "The Alchemist Dine & Wine",
    description:
      "Fine-dining restaurant led by an award-winning chef, known for its creative multi-course tasting menu and international wine pairings.",
    address: "African Avenue, Japan Street, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Contemporary International",
    priceRange: "$$$$",
<<<<<<< HEAD
    images: IMG["Fine Dining"],
    contact: { phone: "+251 98 989 0102" },
    openingHours: "Mon-Tue, Thu-Sun 12:00 PM - 10:30 PM (Closed Wed)",
=======
    images: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 98 898 0102",
    openingHours: "Mon-Sun 12:00 PM - 10:30 PM",
>>>>>>> main
    latitude: 8.9919165,
    longitude: 38.779167,
  },

  // 10. YeGesha Specialty Cafe
  {
    name: "YeGesha Specialty Cafe & Roastery",
    description:
      "Specialty coffee shop serving single-origin Gesha coffee beans, fresh crepes, and artisanal pastries in a lush garden setting.",
    address: "Rwanda St, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Specialty Coffee",
    priceRange: "$$",
<<<<<<< HEAD
    images: IMG.Cafes,
    contact: { phone: "+251 98 412 1212" },
=======
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    ],
    contact: "+251 98 412 1212",
>>>>>>> main
    openingHours: "Mon-Sun 7:00 AM - 10:00 PM",
    latitude: 8.9874188,
    longitude: 38.7767951,
  },
<<<<<<< HEAD
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
=======
];

const REVIEWS_DATA: Record<string, Array<{ userEmail: string; rating: number; title: string; comment: string }>> = {
  "Yod Abyssinia Cultural Restaurant": [
    {
      userEmail: "marcus@tastetrack.com",
      rating: 5,
      title: "An unforgettable cultural feast!",
      comment: "The Doro Wat here is unmatched — rich, complex berbere spices paired with perfectly fermented injera. The live music and dance performance make this the ultimate Ethiopian dining destination.",
    },
    {
      userEmail: "selam@tastetrack.com",
      rating: 5,
      title: "Best authentic Kitfo in Addis",
      comment: "Ordered the special Kitfo with Ayib and Gomen. Melt-in-your-mouth tender, perfectly spiced with mitmita and niter kibbeh. Highly recommended for special dinners.",
    },
    {
      userEmail: "dawit@tastetrack.com",
      rating: 4,
      title: "Great food and lively atmosphere",
      comment: "Vibrant atmosphere and fantastic Beyaynetu platter. Great place to bring visiting friends and family.",
    },
  ],
  "Kategna Ethiopian Restaurant": [
    {
      userEmail: "selam@tastetrack.com",
      rating: 5,
      title: "Sizzling Shekla Tibs perfection!",
      comment: "Kategna never disappoints. The Shekla Tibs arrives sizzling hot at your table, packed with rosemary and green chilies. Pure perfection.",
    },
    {
      userEmail: "abebe@tastetrack.com",
      rating: 5,
      title: "Creamy Shiro Tegabino",
      comment: "Best Shiro in town! Clay pot serving keeps it bubbling until the last bite. Pair it with their fresh berbere sauce and homemade Tej.",
    },
  ],
  "Habesha Cultural Restaurant": [
    {
      userEmail: "marcus@tastetrack.com",
      rating: 5,
      title: "Top-tier hospitality and honey wine",
      comment: "Sitting around the traditional Mesob with authentic honey Tej and freshly prepared Agelgil platter is an experience every foodie must try.",
    },
    {
      userEmail: "helen@tastetrack.com",
      rating: 4,
      title: "Delightful vegetarian fasting spread",
      comment: "Their Beyaynetu features 10 different lentil and vegetable dishes. Very fresh ingredients and warm hospitality.",
    },
  ],
  "Fitsum Shiro Bet": [
    {
      userEmail: "helen@tastetrack.com",
      rating: 5,
      title: "Heaven for plant-based foodies!",
      comment: "The thickest, most flavorful Shiro in Addis at unbeatable prices. Always packed with locals, which tells you everything you need to know!",
    },
    {
      userEmail: "abebe@tastetrack.com",
      rating: 4,
      title: "Fast service and delicious Shiro",
      comment: "Simple, honest, comforting Ethiopian food. Piping hot Shiro served straight out of the clay pot.",
    },
  ],
  "Tomoca Coffee (Black Gold)": [
    {
      userEmail: "betty@tastetrack.com",
      rating: 5,
      title: "The birthplace of legendary coffee!",
      comment: "Stepping into Tomoca is like stepping into coffee history. Their Macchiato has thick velvet foam and a bold, smoky Arabica body.",
    },
    {
      userEmail: "abebe@tastetrack.com",
      rating: 5,
      title: "Unrivaled espresso roast",
      comment: "I buy my whole bean coffee here every week. The smell of freshly roasted Ethiopian beans inside the store is intoxicating.",
    },
  ],
  "Le Basilic Addis": [
    {
      userEmail: "betty@tastetrack.com",
      rating: 4,
      title: "Authentic Italian wood-fired pizza",
      comment: "Thin crust with crispy edges and melted mozzarella. The truffle mushroom pasta is also fantastic!",
    },
  ],
  "Matsuki Japanese Restaurant": [
    {
      userEmail: "marcus@tastetrack.com",
      rating: 5,
      title: "Exquisite Japanese fine dining",
      comment: "Fresh sashimi cuts, artfully plated nigiri, and elegant cocktails. A true hidden gem for Japanese cuisine in East Africa.",
    },
  ],
  "Chanoly Carnivore BBQ": [
    {
      userEmail: "dawit@tastetrack.com",
      rating: 5,
      title: "Smoky ribs & generous platters",
      comment: "The beef ribs fall right off the bone with a beautiful dark bark and smoky flavor. Outstanding sauce selection!",
    },
  ],
  "The Alchemist Dine & Wine": [
    {
      userEmail: "marcus@tastetrack.com",
      rating: 5,
      title: "Masterclass gastronomy experience",
      comment: "Each course of the tasting menu is a work of culinary art. The wine pairings elevate every dish beautifully.",
    },
  ],
  "YeGesha Specialty Cafe & Roastery": [
    {
      userEmail: "betty@tastetrack.com",
      rating: 5,
      title: "Smooth Gesha pour-over coffee",
      comment: "A tranquil garden oasis serving floral, tea-like Gesha pour-overs. Perfect place to relax or get work done.",
    },
  ],
};

export async function seedAll() {
  console.log("Upserting/synchronizing demo users, unique restaurant photos, and authentic reviews...");

  // 1. Upsert Demo Users & Admin
  const userMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const u of DEMO_USERS) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const userDoc = await User.findOneAndUpdate(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          bio: u.bio,
          profileImage: u.profileImage,
          role: u.role || "user",
        },
      },
      { upsert: true, returnDocument: 'after' }
>>>>>>> main
    );
    if (userDoc) userMap[u.email] = userDoc._id as mongoose.Types.ObjectId;
  }

<<<<<<< HEAD
  console.log(
    `Restaurants seeded: ${created} created, ${updated} already existed (refreshed).`
  );
  console.log(`${withPhotos}/${restaurants.length} restaurants use your own photos from seed-images/.`);
  if (missingPhotos.length > 0) {
    console.log("Using generic category images for: " + missingPhotos.join(", "));
  }
=======
  // 2. Upsert Restaurants (Updates existing records with new images & details)
  const restMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const r of RESTAURANTS) {
    const restDoc = await Restaurant.findOneAndUpdate(
      { name: r.name },
      { $set: r },
      { upsert: true, returnDocument: 'after' }
    );
    if (restDoc) restMap[r.name] = restDoc._id as mongoose.Types.ObjectId;
  }

  // 3. Upsert Reviews
  for (const [restName, reviews] of Object.entries(REVIEWS_DATA)) {
    const restaurantId = restMap[restName];
    if (!restaurantId) continue;

    for (const rev of reviews) {
      const userId = userMap[rev.userEmail];
      if (!userId) continue;

      await Review.findOneAndUpdate(
        { restaurant: restaurantId, user: userId },
        {
          $set: {
            restaurant: restaurantId,
            user: userId,
            rating: rev.rating,
            title: rev.title,
            comment: rev.comment,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
  }

  // 4. Update Restaurant Average Ratings
  for (const [, restId] of Object.entries(restMap)) {
    const stats = await Review.aggregate([
      { $match: { restaurant: restId } },
      {
        $group: {
          _id: "$restaurant",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const avg = stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0;
    await Restaurant.findByIdAndUpdate(restId, { averageRating: avg });
  }

  console.log("Database successfully synchronized with unique restaurant photos & demo data! 🚀");
>>>>>>> main
}

export async function autoSeedOrSync() {
  try {
    console.log("Synchronizing database seed records on startup...");
    await seedAll();
  } catch (err) {
    console.error("Auto-seed/sync error:", err);
  }
}

// Standalone execution check
if (process.argv[1]?.includes("seedRestaurants")) {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in environment.");
    process.exit(1);
  }
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      await seedAll();
      await mongoose.disconnect();
    })
    .catch((err) => {
      console.error("Standalone seed error:", err);
      process.exit(1);
    });
}