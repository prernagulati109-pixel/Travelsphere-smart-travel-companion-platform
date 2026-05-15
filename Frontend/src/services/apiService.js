const RAPID_API_KEY = ''; // USER: Add your RapidAPI Key here
const RAPID_API_HOST = 'tripadvisor16.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': RAPID_API_KEY,
  'X-RapidAPI-Host': RAPID_API_HOST,
};

export const apiService = {
  /**
   * Search for locations (cities, regions, etc.)
   */
  async searchLocations(query) {
    if (!RAPID_API_KEY) return null;

    try {
      const response = await fetch(
        `https://${RAPID_API_HOST}/api/v1/hotels/searchLocation?query=${encodeURIComponent(query)}`,
        { method: 'GET', headers }
      );
      const data = await response.json();
      return data.data; // Array of locations
    } catch (error) {
      console.error('Error searching locations:', error);
      return null;
    }
  },

  /**
   * Get hotels for a specific location
   */
  async getHotels(locationId, checkIn = '2026-05-01', checkOut = '2026-05-05') {
    if (!RAPID_API_KEY) return null;

    try {
      const response = await fetch(
        `https://${RAPID_API_HOST}/api/v1/hotels/searchHotels?locationId=${locationId}&checkIn=${checkIn}&checkOut=${checkOut}&pageNumber=1&currencyCode=INR`,
        { method: 'GET', headers }
      );
      const data = await response.json();
      return data.data.data; // Array of hotels
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return null;
    }
  },

  /**
   * Get detailed information for a specific hotel
   */
  async getHotelDetails(hotelId, checkIn = '2026-05-01', checkOut = '2026-05-05') {
    if (!RAPID_API_KEY) return null;

    try {
      const response = await fetch(
        `https://${RAPID_API_HOST}/api/v1/hotels/getHotelDetails?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}&currencyCode=INR`,
        { method: 'GET', headers }
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching hotel details:', error);
      return null;
    }
  },

  /**
   * Get attractions for a location
   */
  async getAttractions(locationId) {
    if (!RAPID_API_KEY) return null;

    try {
      // Note: Using a different endpoint if available or simulating with search
      const response = await fetch(
        `https://${RAPID_API_HOST}/api/v1/attractions/searchAttractions?locationId=${locationId}`,
        { method: 'GET', headers }
      );
      const data = await response.json();
      return data.data.data;
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return null;
    }
  },

  /**
   * Get detailed information for a specific attraction
   */
  async getAttractionDetails(attractionId) {
    if (!RAPID_API_KEY) return null;

    try {
      const response = await fetch(
        `https://${RAPID_API_HOST}/api/v1/attractions/getAttractionDetails?attractionId=${attractionId}`,
        { method: 'GET', headers }
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching attraction details:', error);
      return null;
    }
  }
};
