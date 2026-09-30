import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Restaurant from "../models/restaurant.model";
import User from "../models/user.model";
import Review from "../models/review.model";

const IMG = {
  Ethiopian: [
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
  ],
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
  FineDining: [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80",
  ],
  Cafes: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
  ],
};

const DEMO_USERS = [
  {
    name: "Abebe Bikila",
    email: "abebe@tastetrack.com",
    password: "password123",
    bio: "Addis food enthusiast and coffee lover.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Selamawit Haile",
    email: "selam@tastetrack.com",
    password: "password123",
    bio: "Traditional Ethiopian cuisine blogger.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Samuelsson",
    email: "marcus@tastetrack.com",
    password: "password123",
    bio: "International chef & gastronomy explorer.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Bethlehem Tadesse",
    email: "betty@tastetrack.com",
    password: "password123",
    bio: "Cafe hunter & pastry critic in Addis Ababa.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Dawit Kassa",
    email: "dawit@tastetrack.com",
    password: "password123",
    bio: "Barbecue connoisseur & local guide.",
    profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Helen Berhane",
    email: "helen@tastetrack.com",
    password: "password123",
    bio: "Plant-based dining advocate.",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
  },
];

const RESTAURANTS = [
  // ---------- Ethiopian Traditional ----------
  {
    name: "Yod Abyssinia Cultural Restaurant",
    description:
      "World-famous cultural restaurant offering traditional Ethiopian banquets including Doro Wat, Special Kitfo, and Beyaynetu, accompanied by live traditional music and dance performances.",
    address: "Bole Medhanialem, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$$",
    images: IMG.Ethiopian,
    contact: "+251 11 661 2176",
    openingHours: "Mon-Sun 10:00 AM - 11:30 PM",
    latitude: 8.995804,
    longitude: 38.784651,
  },
  {
    name: "Kategna Ethiopian Restaurant",
    description:
      "Renowned for authentic Ethiopian gastronomy. Famous for sizzling Shekla Tibs, slow-cooked Shiro Tegabino, and traditional coffee ceremonies served on fresh injera.",
    address: "Bole Road, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$",
    images: IMG.Ethiopian,
    contact: "+251 11 662 7272",
    openingHours: "Mon-Sun 8:00 AM - 11:00 PM",
    latitude: 8.998124,
    longitude: 38.775412,
  },
  {
    name: "Habesha Cultural Restaurant",
    description:
      "Authentic Ethiopian dining experience with thatched-roof decor, traditional woven tables (Mesob), honey wine (Tej), and flavorful feast platters.",
    address: "Bole Atlas, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Ethiopian Traditional",
    priceRange: "$$$",
    images: IMG.Ethiopian,
    contact: "+251 11 662 2548",
    openingHours: "Mon-Sun 11:00 AM - 11:00 PM",
    latitude: 9.001245,
    longitude: 38.782104,
  },
  {
    name: "Fitsum Shiro Bet",
    description:
      "Fully vegan Ethiopian fasting food spot. Famous for piping hot shiro with fresh injera, vegan tsom tibs, and lentils at very affordable prices.",
    address: "Beside Helzer, Addis Ababa, Ethiopia",
    category: "Vegan",
    cuisine: "Ethiopian Vegan",
    priceRange: "$",
    images: IMG.Vegan,
    contact: "+251 91 191 0671",
    openingHours: "Mon-Sun 8:00 AM - 9:00 PM",
    latitude: 8.9995488,
    longitude: 38.7862196,
  },
  {
    name: "Tomoca Coffee (Black Gold)",
    description:
      "The historic first specialty coffee roastery in Addis Ababa, established in 1953. Famous for rich, dark-roasted Arabica macchiatos and espresso.",
    address: "Wavel St, Piassa, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Ethiopian Coffee",
    priceRange: "$",
    images: IMG.Cafes,
    contact: "+251 11 111 2222",
    openingHours: "Mon-Sun 6:30 AM - 8:30 PM",
    latitude: 9.030512,
    longitude: 38.751842,
  },

  // ---------- International & Fusion ----------
  {
    name: "Le Basilic Addis",
    description:
      "Italian bistro and cafe serving hand-rolled pasta, wood-fired pizza, and gourmet lasagna, running from breakfast through late dinner.",
    address: "Gabon St, Addis Ababa, Ethiopia",
    category: "Italian",
    cuisine: "Italian",
    priceRange: "$$",
    images: IMG.Italian,
    contact: "+251 90 560 4444",
    openingHours: "Mon-Sun 8:30 AM - 10:00 PM",
    latitude: 8.995234,
    longitude: 38.7674019,
  },
  {
    name: "Matsuki Japanese Restaurant",
    description:
      "Upscale Japanese restaurant offering fresh sushi omakase, craft cocktails, and an intimate, elegant dining atmosphere.",
    address: "Kman Guesthouse, Addis Ababa, Ethiopia",
    category: "Japanese",
    cuisine: "Japanese Sushi",
    priceRange: "$$$$",
    images: IMG.Japanese,
    contact: "+251 90 117 1819",
    openingHours: "Tue-Sun 12:00 PM - 11:00 PM",
    latitude: 8.9920451,
    longitude: 38.7669652,
  },
  {
    name: "Chanoly Carnivore BBQ",
    description:
      "Grill-focused smokehouse serving Texas-style barbecue with smoked beef ribs, brisket combo platters, and house spicy sauces.",
    address: "Bole Japan St, Addis Ababa, Ethiopia",
    category: "BBQ",
    cuisine: "Texas BBQ",
    priceRange: "$$$$",
    images: IMG.BBQ,
    contact: "+251 98 609 1656",
    openingHours: "Mon-Sun 9:00 AM - 11:00 PM",
    latitude: 8.9910009,
    longitude: 38.7788992,
  },
  {
    name: "The Alchemist Dine & Wine",
    description:
      "Fine-dining restaurant led by an award-winning chef, known for its creative multi-course tasting menu and international wine pairings.",
    address: "African Avenue, Japan Street, Addis Ababa, Ethiopia",
    category: "Fine Dining",
    cuisine: "Contemporary International",
    priceRange: "$$$$",
    images: IMG.FineDining,
    contact: "+251 98 898 0102",
    openingHours: "Mon-Sun 12:00 PM - 10:30 PM",
    latitude: 8.9919165,
    longitude: 38.779167,
  },
  {
    name: "YeGesha Specialty Cafe & Roastery",
    description:
      "Specialty coffee shop serving single-origin Gesha coffee beans, fresh crepes, and artisanal pastries in a lush garden setting.",
    address: "Rwanda St, Addis Ababa, Ethiopia",
    category: "Cafes",
    cuisine: "Specialty Coffee",
    priceRange: "$$",
    images: IMG.Cafes,
    contact: "+251 98 412 1212",
    openingHours: "Mon-Sun 7:00 AM - 10:00 PM",
    latitude: 8.9874188,
    longitude: 38.7767951,
  },
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
  console.log("Seeding demo users, restaurants, and reviews...");

  // 1. Seed Demo Users
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
          role: "user",
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
    if (userDoc) userMap[u.email] = userDoc._id as mongoose.Types.ObjectId;
  }

  // 2. Seed Restaurants
  const restMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const r of RESTAURANTS) {
    const restDoc = await Restaurant.findOneAndUpdate(
      { name: r.name },
      { $set: r },
      { upsert: true, returnDocument: 'after' }
    );
    if (restDoc) restMap[r.name] = restDoc._id as mongoose.Types.ObjectId;
  }

  // 3. Seed Reviews
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

  console.log("Database successfully seeded with demo data! 🚀");
}

export async function autoSeedIfEmpty() {
  try {
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log("Empty database detected on startup. Running auto-seed...");
      await seedAll();
    }
  } catch (err) {
    console.error("Auto-seed check error:", err);
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