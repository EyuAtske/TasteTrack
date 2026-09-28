export const INITIAL_RESTAURANTS = [
  {
    _id: '1',
    name: 'Trattoria Bella Vista',
    description: 'Authentic wood-fired Neapolitan pizzas and hand-rolled pasta made fresh daily using imported Italian ingredients and organic basil from our rooftop garden.',
    address: '458 Via Italia, Little Italy, NY 10013',
    category: 'Italian',
    cuisine: 'Italian',
    priceRange: '$$$',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (212) 555-0192',
      email: 'ciao@bellavista.com',
      website: 'https://bellavista.example.com'
    },
    openingHours: 'Mon-Sun: 11:30 AM - 10:30 PM',
    averageRating: 4.8,
    reviewCount: 142,
    latitude: 40.7192,
    longitude: -73.9967,
    featured: true
  },
  {
    _id: '2',
    name: 'Sakura Omakase & Bar',
    description: 'An intimate 12-seat Japanese sushi bar offering a seasonal 16-course chef’s tasting menu featuring wild-caught fish flown in directly from Toyosu Market in Tokyo.',
    address: '88 Cherry Blossom Lane, Midtown West, NY 10019',
    category: 'Japanese',
    cuisine: 'Japanese',
    priceRange: '$$$$',
    images: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (212) 555-0843',
      email: 'reservations@sakuraomakase.com',
      website: 'https://sakuraomakase.example.com'
    },
    openingHours: 'Tue-Sat: 5:00 PM - 11:00 PM',
    averageRating: 4.9,
    reviewCount: 98,
    latitude: 40.7614,
    longitude: -73.9845,
    featured: true
  },
  {
    _id: '3',
    name: 'Smokey Oak BBQ & Brewhouse',
    description: 'Low and slow hickory-smoked Texas style brisket, pulled pork, and award-winning St. Louis baby back ribs served alongside 24 local craft beers on tap.',
    address: '102 Craft Ale Way, Brooklyn, NY 11211',
    category: 'BBQ',
    cuisine: 'American',
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (718) 555-3321',
      email: 'hello@smokeyoakbbq.com',
      website: 'https://smokeyoak.example.com'
    },
    openingHours: 'Mon-Sun: 12:00 PM - 11:00 PM',
    averageRating: 4.6,
    reviewCount: 215,
    latitude: 40.7142,
    longitude: -73.9614,
    featured: true
  },
  {
    _id: '4',
    name: 'El Jardín Vegan Bistro',
    description: 'Vibrant plant-based Mexican cuisine featuring handmade heirloom corn tortillas, cashew queso, jackfruit carnitas, and refreshing hibiscus mezcal cocktails.',
    address: '312 Green Street, East Village, NY 10009',
    category: 'Vegan',
    cuisine: 'Mexican',
    priceRange: '$$',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (212) 555-9812',
      email: 'hola@eljardinvegan.com',
      website: 'https://eljardin.example.com'
    },
    openingHours: 'Wed-Mon: 11:00 AM - 10:00 PM',
    averageRating: 4.7,
    reviewCount: 89,
    latitude: 40.7265,
    longitude: -73.9818,
    featured: false
  },
  {
    _id: '5',
    name: 'L’Aromate French Brasserie',
    description: 'Classic Parisian bistro dining with a modern twist. Indulge in duck confit, steak frites, escargots à la bordelaise, and curated French wines.',
    address: '74 Boulevard Saint-Germain, SoHo, NY 10012',
    category: 'Fine Dining',
    cuisine: 'French',
    priceRange: '$$$$',
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (212) 555-7744',
      email: 'contact@laromate.com',
      website: 'https://laromate.example.com'
    },
    openingHours: 'Mon-Sun: 5:00 PM - 12:00 AM',
    averageRating: 4.8,
    reviewCount: 167,
    latitude: 40.7241,
    longitude: -73.9991,
    featured: false
  },
  {
    _id: '6',
    name: 'Artisan Roast & Bakery',
    description: 'Specialty coffee roastery and bakery specializing in sourdough pastries, flaky almond croissants, avocado toast, and pour-over single-origin coffees.',
    address: '15 Bleecker Street, Greenwich Village, NY 10012',
    category: 'Cafes',
    cuisine: 'Bakery',
    priceRange: '$',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
    ],
    contact: {
      phone: '+1 (212) 555-2041',
      email: 'hello@artisanroast.com',
      website: 'https://artisanroast.example.com'
    },
    openingHours: 'Mon-Sun: 7:00 AM - 6:00 PM',
    averageRating: 4.9,
    reviewCount: 310,
    latitude: 40.7258,
    longitude: -73.9934,
    featured: false
  }
];

export const INITIAL_REVIEWS = [
  {
    _id: 'rev_1',
    restaurant: '1',
    user: {
      _id: 'u1',
      name: 'Elena Rostova',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    rating: 5,
    title: 'Unbelievable Truffle Tagliatelle!',
    comment: 'The atmosphere at Trattoria Bella Vista is intoxicating! The homemade pasta melts in your mouth and the wine pairing was perfection.',
    createdAt: '2026-09-20T14:32:00Z'
  },
  {
    _id: 'rev_2',
    restaurant: '1',
    user: {
      _id: 'u2',
      name: 'Marcus Chen',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    rating: 4.5,
    title: 'Top notch Neapolitan pizza',
    comment: 'Crust was light and airy with the perfect leopard spots. Service was super attentive despite being packed on a Saturday evening.',
    createdAt: '2026-09-18T19:15:00Z'
  },
  {
    _id: 'rev_3',
    restaurant: '2',
    user: {
      _id: 'u3',
      name: 'Sarah Jenkins',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    rating: 5,
    title: 'Best Omakase in New York hands down',
    comment: 'Chef Kenji takes sushi to an art form. The uni and otoro melted in my mouth. Worth every single penny!',
    createdAt: '2026-09-24T20:00:00Z'
  }
];
