import Fuse from 'fuse.js';

export const SEARCH_TYPES = {
  destination: 'Destination',
  hotel: 'Hotel',
  transport: 'Transport',
  activity: 'Activity',
  itinerary: 'Itinerary'
};

export const DEFAULT_SEARCH_ITEMS = [
  { type: SEARCH_TYPES.destination, text: 'Paris', keywords: ['france', 'eiffel tower', 'louvre', 'romantic trip'] },
  { type: SEARCH_TYPES.destination, text: 'Tokyo', keywords: ['japan', 'shibuya', 'temples', 'city trip'] },
  { type: SEARCH_TYPES.destination, text: 'Bali', keywords: ['beach', 'ubud', 'wellness', 'adventure'] },
  { type: SEARCH_TYPES.destination, text: 'Maldives', keywords: ['beach', 'resort', 'honeymoon', 'islands'] },
  { type: SEARCH_TYPES.destination, text: 'Dubai', keywords: ['shopping', 'luxury', 'desert', 'burj khalifa'] },
  { type: SEARCH_TYPES.destination, text: 'Goa', keywords: ['beach', 'nightlife', 'budget', 'weekend'] },
  { type: SEARCH_TYPES.hotel, text: 'Luxury Resorts', keywords: ['five star', 'premium stay', 'spa'] },
  { type: SEARCH_TYPES.hotel, text: 'Budget Hotels', keywords: ['cheap stay', 'affordable', 'deals'] },
  { type: SEARCH_TYPES.hotel, text: 'Family Hotels', keywords: ['kids', 'safe stay', 'pool'] },
  { type: SEARCH_TYPES.transport, text: 'Domestic Flights', keywords: ['flight', 'airport', 'plane'] },
  { type: SEARCH_TYPES.transport, text: 'International Flights', keywords: ['flight abroad', 'airport'] },
  { type: SEARCH_TYPES.transport, text: 'Airport Cabs', keywords: ['taxi', 'pickup', 'drop'] },
  { type: SEARCH_TYPES.transport, text: 'Train Routes', keywords: ['railway', 'train', 'transport'] },
  { type: SEARCH_TYPES.activity, text: 'Food Tour', keywords: ['local food', 'restaurants', 'cuisine'] },
  { type: SEARCH_TYPES.activity, text: 'Museum Visit', keywords: ['art', 'culture', 'history'] },
  { type: SEARCH_TYPES.activity, text: 'Beach Activities', keywords: ['surfing', 'snorkeling', 'sunset'] },
  { type: SEARCH_TYPES.itinerary, text: '3 Day Family Itinerary', keywords: ['family', 'three days', 'plan'] },
  { type: SEARCH_TYPES.itinerary, text: 'Honeymoon Itinerary', keywords: ['couple', 'romantic', 'luxury'] },
  { type: SEARCH_TYPES.itinerary, text: 'Weekend Getaway', keywords: ['short trip', 'two days', 'budget'] }
];

const fuseOptions = {
  keys: [
    { name: 'text', weight: 0.55 },
    { name: 'name', weight: 0.55 },
    { name: 'description', weight: 0.2 },
    { name: 'category', weight: 0.15 },
    { name: 'type', weight: 0.2 },
    { name: 'keywords', weight: 0.25 }
  ],
  threshold: 0.38,
  distance: 120,
  ignoreLocation: true,
  minMatchCharLength: 1
};

export const createFuse = (items) => new Fuse(items, fuseOptions);

export const normalizeSearchItem = (item) => ({
  ...item,
  text: item.text || item.name || '',
  keywords: Array.isArray(item.keywords) ? item.keywords : []
});

export const buildDestinationSearchItems = (destinations = []) => (
  destinations.map((destination) => normalizeSearchItem({
    type: SEARCH_TYPES.destination,
    text: destination.name,
    keywords: [
      destination.description,
      destination.category,
      destination.country,
      destination.price,
      destination.tagline,
      'destination',
      'travel'
    ].filter(Boolean)
  }))
);

export const filterBySearch = (items, query) => {
  const trimmed = query.trim();
  if (!trimmed) return items;

  const searchableItems = items.map((item, index) => ({ ...normalizeSearchItem(item), __index: index }));
  const results = createFuse(searchableItems).search(trimmed);
  return results.map((result) => items[result.item.__index]);
};
