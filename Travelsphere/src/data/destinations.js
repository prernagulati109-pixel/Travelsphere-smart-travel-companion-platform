const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

export const destinationsData = {
  "paris": {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    heroImage: "https://static.vecteezy.com/system/resources/previews/027/002/084/large_2x/aerial-view-of-the-eiffel-tower-at-sunset-paris-france-aerial-panoramic-view-of-paris-with-eiffel-tower-at-sunset-france-ai-generated-free-photo.jpg",
    tagline: "The City of Light",
    description: "The City of Light, known for its art, fashion, gastronomy and culture.",
    about: "Paris, the capital of France, is one of the most iconic and romantic cities in the world. Known as the 'City of Light,' Paris enchants visitors with its breathtaking architecture, world-class museums, exquisite cuisine, and vibrant cultural scene. From the Eiffel Tower to the Louvre, from Montmartre to the Seine, every corner of Paris tells a story.",
    rating: 4.8,
    reviewsCount: "15K",
    gallery: [
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
    ],
    quickInfo: {
      bestTime: "April to June",
      timezone: "UTC+1",
      weather: "12°C - 22°C",
      airport: "Charles de Gaulle",
      currency: "Euro (€)",
      dailyCost: "₹8,000 - ₹12,000",
      language: "French",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 1, name: "Eiffel Tower", category: "Landmarks", price: 2500, rating: 4.8, reviews: "15K", time: "2-3 hrs", badge: "Popular", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80" },
      { id: 2, name: "Louvre Museum", category: "Museums", price: 1200, rating: 4.7, reviews: "12K", time: "3-4 hrs", badge: "Bestseller", image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80" },
      { id: 3, name: "Notre-Dame Cathedral", category: "Landmarks", price: 2000, rating: 4.7, reviews: "8K", time: "1-2 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  "kyoto": {
    name: "Kyoto",
    country: "Japan",
    flag: "🇯🇵",
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80",
    tagline: "Ancient Tradition",
    description: "Ancient capital of Japan, famous for its numerous classical Buddhist temples and gardens.",
    about: "Kyoto, once the capital of Japan for over a thousand years, is a city where ancient traditions beautifully coexist with modern life. With over 2,000 temples and shrines, stunning bamboo groves, traditional tea houses, and geisha districts, Kyoto offers an unparalleled journey into Japanese culture.",
    rating: 4.7,
    reviewsCount: "1.2K",
    gallery: [
      "https://images.unsplash.com/photo-1545562083-a600704fa487?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80"
    ],
    quickInfo: {
      bestTime: "March to May",
      timezone: "UTC+9",
      weather: "10°C - 25°C",
      airport: "Kansai Intl.",
      currency: "Japanese Yen (¥)",
      dailyCost: "₹6,000 - ₹10,000",
      language: "Japanese",
      voltage: "100V, 50/60Hz"
    },
    places: [
      { id: 101, name: "Fushimi Inari-taisha", category: "Landmarks", price: 0, rating: 4.9, reviews: "20K", time: "2-3 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80" },
      { id: 102, name: "Arashiyama Bamboo Grove", category: "Adventure", price: 0, rating: 4.7, reviews: "15K", time: "1-2 hrs", badge: "Must Visit", image: "https://images.unsplash.com/photo-1552423814-2485230ca32c?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  "maldives": {
    name: "Maldives",
    country: "Maldives",
    flag: "🇲🇻",
    heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
    tagline: "Tropical Paradise",
    description: "A tropical paradise with over 1,000 coral islands, perfect for relaxation.",
    about: "The Maldives is a tropical paradise like no other. Comprising over 1,000 coral islands grouped in 26 atolls, this Indian Ocean nation is renowned for its stunning turquoise lagoons, pristine white-sand beaches, and vibrant coral reefs teeming with marine life.",
    rating: 4.9,
    reviewsCount: "5K",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80"
    ],
    quickInfo: {
      bestTime: "November to April",
      timezone: "UTC+5",
      weather: "25°C - 31°C",
      airport: "Velana Intl.",
      currency: "Maldivian Rufiyaa (MVR)",
      dailyCost: "₹15,000 - ₹25,000",
      language: "Dhivehi",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 201, name: "Male Atoll", category: "Adventure", price: 5000, rating: 4.8, reviews: "2K", time: "Full day", badge: "Water Sports", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  "new-york": {
    name: "New York",
    country: "USA",
    flag: "🇺🇸",
    heroImage: "https://wallpaperaccess.com/full/1523519.jpg",
    tagline: "The Big Apple",
    description: "The city that never sleeps, known for its iconic skyline and vibrant energy.",
    about: "New York City is a global hub of culture, fashion, and finance. From the bright lights of Times Square to the serene paths of Central Park, the city offers an endless array of experiences that cater to every kind of traveler.",
    rating: 4.8,
    reviewsCount: "10K",
    gallery: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "April to June",
      timezone: "UTC-5",
      weather: "10°C - 25°C",
      airport: "JFK Intl.",
      currency: "US Dollar ($)",
      dailyCost: "₹10,000 - ₹18,000",
      language: "English",
      voltage: "120V, 60Hz"
    },
    places: [
      { id: 301, name: "Statue of Liberty", category: "Landmarks", price: 2000, rating: 4.8, reviews: "25K", time: "3 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80" },
      { id: 302, name: "Central Park", category: "Adventure", price: 0, rating: 4.9, reviews: "50K", time: "2-4 hrs", badge: "Must Visit", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "tokyo": {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    heroImage: "https://wallpaperaccess.com/full/19076.jpg",
    tagline: "Modern Metropolis",
    description: "Modern Metropolis",
    about: "Tokyo, Japan's bustling capital, is a mesmerizing blend of ultramodern technology and centuries-old tradition. Neon-lit skyscrapers tower over serene temples, anime culture collides with ancient arts, and Michelin-starred restaurants sit alongside humble ramen shops.",
    rating: 4.9,
    reviewsCount: "12K",
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "March to May",
      timezone: "UTC+9",
      weather: "15°C - 28°C",
      airport: "Narita / Haneda",
      currency: "Japanese Yen (¥)",
      dailyCost: "₹8,000 - ₹15,000",
      language: "Japanese",
      voltage: "100V, 50/60Hz"
    },
    places: [
      { id: 501, name: "Shibuya Crossing", category: "Landmarks", price: 0, rating: 4.9, reviews: "30K", time: "1 hr", badge: "Iconic", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "bali": {
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    heroImage: "https://wallpapers.com/images/hd/popular-bali-indonesia-temple-tourist-spot-xrfg2u77kvpyb1e5.jpg",
    tagline: "Island Heaven",
    description: "Island Heaven",
    about: "Bali, the famed 'Island of the Gods,' is Indonesia's most popular destination and a true tropical wonderland. From the terraced rice paddies of Ubud to the surf breaks of Uluwatu, Bali blends natural beauty with deep spiritual culture.",
    rating: 4.8,
    reviewsCount: "20K",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "April to October",
      timezone: "UTC+8",
      weather: "26°C - 32°C",
      airport: "Ngurah Rai Intl.",
      currency: "Indonesian Rupiah (IDR)",
      dailyCost: "₹3,000 - ₹7,000",
      language: "Indonesian / Balinese",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 601, name: "Ubud Rice Terraces", category: "Landmarks", price: 500, rating: 4.8, reviews: "15K", time: "2-3 hrs", badge: "Natural", image: "https://images.unsplash.com/photo-1521342475957-512a9dd573f2?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "rome": {
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
    tagline: "The Eternal City",
    description: "The Eternal City",
    about: "Rome, the Eternal City, is a sprawling open-air museum where ancient ruins stand alongside Renaissance masterpieces and vibrant modern life. Every cobblestone street tells a story spanning nearly 3,000 years.",
    rating: 4.9,
    reviewsCount: "18K",
    gallery: [
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "April to June",
      timezone: "UTC+2",
      weather: "15°C - 30°C",
      airport: "Fiumicino (FCO)",
      currency: "Euro (€)",
      dailyCost: "₹9,000 - ₹14,000",
      language: "Italian",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 701, name: "Colosseum", category: "Landmarks", price: 1800, rating: 4.9, reviews: "40K", time: "3 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "santorini": {
    name: "Santorini",
    country: "Greece",
    flag: "🇬🇷",
    heroImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    tagline: "Blue & White Beauty",
    description: "Blue & White Beauty",
    about: "Santorini is the jewel of the Aegean Sea. Perched on dramatic cliffs overlooking a submerged volcanic caldera, the villages of Oia and Fira offer postcard-perfect views at every turn.",
    rating: 4.9,
    reviewsCount: "10K",
    gallery: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "June to September",
      timezone: "UTC+3",
      weather: "22°C - 32°C",
      airport: "Santorini Intl.",
      currency: "Euro (€)",
      dailyCost: "₹12,000 - ₹20,000",
      language: "Greek",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 801, name: "Oia Village", category: "Landmarks", price: 0, rating: 4.9, reviews: "25K", time: "2-4 hrs", badge: "Must Visit", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "dubai": {
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    tagline: "City of Gold",
    description: "City of Gold",
    about: "Dubai is a city of superlatives — home to the world's tallest building, the largest shopping mall, and the most luxurious hotels. It's a futuristic metropolis rising from the desert.",
    rating: 4.8,
    reviewsCount: "15K",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "November to March",
      timezone: "UTC+4",
      weather: "20°C - 35°C",
      airport: "Dubai Intl. (DXB)",
      currency: "UAE Dirham (AED)",
      dailyCost: "₹10,000 - ₹20,000",
      language: "Arabic / English",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 901, name: "Burj Khalifa", category: "Landmarks", price: 3500, rating: 4.9, reviews: "50K", time: "2-3 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "london": {
    name: "London",
    country: "UK",
    flag: "🇬🇧",
    heroImage: "https://wallup.net/wp-content/uploads/2019/09/349171-united-kingdom-rivers-bridges-houses-sky-london-big-ben-cities.jpg",
    tagline: "The Royal Capital",
    description: "The Royal Capital",
    about: "London, the capital of England and the UK, is a city where centuries of history meet cutting-edge modernity. From Buckingham Palace to the trendy markets of Camden.",
    rating: 4.7,
    reviewsCount: "25K",
    gallery: [
      "https://wallup.net/wp-content/uploads/2019/09/349171-united-kingdom-rivers-bridges-houses-sky-london-big-ben-cities.jpg",
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "May to September",
      timezone: "UTC+0",
      weather: "10°C - 25°C",
      airport: "Heathrow (LHR)",
      currency: "Pound Sterling (£)",
      dailyCost: "₹12,000 - ₹22,000",
      language: "English",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 1001, name: "Big Ben", category: "Landmarks", price: 0, rating: 4.8, reviews: "40K", time: "1 hr", badge: "Classic", image: "https://wallup.net/wp-content/uploads/2019/09/349171-united-kingdom-rivers-bridges-houses-sky-london-big-ben-cities.jpg" }
    ]
  },
  "sydney": {
    name: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80",
    tagline: "Harbour City",
    description: "Harbour City",
    about: "Sydney, Australia's largest city, is a sun-soaked metropolis that perfectly blends urban sophistication with natural wonder. Home to the iconic Opera House.",
    rating: 4.8,
    reviewsCount: "12K",
    gallery: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "September to November",
      timezone: "UTC+11",
      weather: "18°C - 28°C",
      airport: "Sydney Kingsford Smith",
      currency: "Australian Dollar (AUD)",
      dailyCost: "₹12,000 - ₹25,000",
      language: "English",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 1101, name: "Sydney Opera House", category: "Landmarks", price: 2000, rating: 4.9, reviews: "30K", time: "2 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "bangkok": {
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    heroImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
    tagline: "Temple City",
    description: "Temple City",
    about: "Bangkok, the pulsating capital of Thailand, is a city that assaults the senses. Gleaming golden temples sit beside modern skyscrapers and aromatic street food stalls.",
    rating: 4.7,
    reviewsCount: "30K",
    gallery: [
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "November to February",
      timezone: "UTC+7",
      weather: "25°C - 35°C",
      airport: "Suvarnabhumi (BKK)",
      currency: "Thai Baht (฿)",
      dailyCost: "₹2,000 - ₹5,000",
      language: "Thai",
      voltage: "220V, 50Hz"
    },
    places: [
      { id: 1201, name: "Grand Palace", category: "Landmarks", price: 1200, rating: 4.9, reviews: "25K", time: "3 hrs", badge: "Royal", image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "istanbul": {
    name: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    heroImage: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
    tagline: "Where East Meets West",
    description: "Where East Meets West",
    about: "Istanbul is the only city in the world that spans two continents. It's a captivating fusion of ancient and modern, bridging Europe and Asia.",
    rating: 4.8,
    reviewsCount: "15K",
    gallery: [
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "April to May",
      timezone: "UTC+3",
      weather: "15°C - 28°C",
      airport: "Istanbul Airport (IST)",
      currency: "Turkish Lira (₺)",
      dailyCost: "₹4,000 - ₹8,000",
      language: "Turkish",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 1301, name: "Hagia Sophia", category: "Landmarks", price: 0, rating: 4.9, reviews: "45K", time: "2 hrs", badge: "Iconic", image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=80" }
    ]
  },
  "barcelona": {
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    heroImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80",
    tagline: "Gaudí's Masterpiece",
    description: "Gaudí's Masterpiece",
    about: "Barcelona, the capital of Catalonia, is a city that dances to its own rhythm. Famous for Antoni Gaudí's fantastical architecture and golden Mediterranean beaches.",
    rating: 4.8,
    reviewsCount: "22K",
    gallery: [
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=900&q=80"
    ],
    quickInfo: {
      bestTime: "May to June",
      timezone: "UTC+2",
      weather: "18°C - 28°C",
      airport: "Barcelona-El Prat (BCN)",
      currency: "Euro (€)",
      dailyCost: "₹9,000 - ₹15,000",
      language: "Spanish / Catalan",
      voltage: "230V, 50Hz"
    },
    places: [
      { id: 1401, name: "Sagrada Família", category: "Landmarks", price: 2500, rating: 4.9, reviews: "60K", time: "3 hrs", badge: "Must See", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80" }
    ]
  }
};
