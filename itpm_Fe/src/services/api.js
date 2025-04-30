// This is a mock API service that could be replaced with actual API calls in the future

/**
 * Get laptop recommendations based on user preferences
 * @param {Object} preferences - User preferences object
 * @param {number} preferences.budget - User's budget
 * @param {string} preferences.usage - Main usage purpose
 * @param {boolean} preferences.travel - Whether travel is important
 * @returns {Promise} - Promise resolving to an array of laptop recommendations
 */
export const getLaptopRecommendations = async (preferences) => {
  // In a real application, this would be a fetch call to your backend
  // For now, we'll simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - in a real application, this would come from the backend
      const laptops = [
        {
          id: 1,
          name: 'Budget Performer',
          price: 35000,
          specs: 'Core i3, 8GB RAM, 256GB SSD',
          useCases: ['browse', 'documents', 'videos'],
          portable: true,
          imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 2,
          name: 'Work Machine Pro',
          price: 55000,
          specs: 'Core i5, 16GB RAM, 512GB SSD',
          useCases: ['browse', 'documents', 'videos', 'development'],
          portable: true,
          imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 3,
          name: 'Creative Studio',
          price: 85000,
          specs: 'Core i7, 16GB RAM, 1TB SSD, Dedicated Graphics',
          useCases: ['videos', 'design', 'development'],
          portable: false,
          imageUrl: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 4,
          name: 'Gaming Beast',
          price: 120000,
          specs: 'Core i7, 32GB RAM, 1TB SSD, RTX Graphics',
          useCases: ['gaming', 'design', 'development', 'videos'],
          portable: false,
          imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 5,
          name: 'Ultraportable Plus',
          price: 75000,
          specs: 'Core i5, 16GB RAM, 512GB SSD, Lightweight',
          useCases: ['browse', 'documents', 'videos'],
          portable: true,
          imageUrl: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 6,
          name: 'Developer Workstation',
          price: 95000,
          specs: 'Core i7, 32GB RAM, 1TB SSD, Multiple Ports',
          useCases: ['development', 'design'],
          portable: false,
          imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
        }
      ];

      // Filter the laptops based on user preferences
      let filtered = [...laptops];
      
      // Filter by budget (consider laptops up to 20% above budget)
      if (preferences.budget) {
        filtered = filtered.filter(laptop => laptop.price <= preferences.budget * 1.2);
      }
      
      // Filter by usage if available
      if (preferences.usage) {
        filtered = filtered.filter(laptop => 
          laptop.useCases.includes(preferences.usage)
        );
      }
      
      // Filter by portability if important
      if (preferences.travel) {
        filtered = filtered.filter(laptop => laptop.portable);
      }
      
      // Sort by best match (closer to budget)
      filtered.sort((a, b) => {
        const aDiff = Math.abs(a.price - preferences.budget);
        const bDiff = Math.abs(b.price - preferences.budget);
        return aDiff - bDiff;
      });
      
      // Return top 3 matches
      resolve(filtered.slice(0, 3));
    }, 1000); // Simulate network delay
  });
};

/**
 * Submit a user inquiry for further contact
 * @param {Object} inquiry - User contact information
 * @returns {Promise} - Promise resolving to a success message
 */
export const submitInquiry = async (inquiry) => {
  // In a real application, this would be a fetch call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        message: 'Thank you for your inquiry! Our team will contact you shortly.' 
      });
    }, 500);
  });
};

/**
 * Get additional details for a specific laptop
 * @param {number} laptopId - The ID of the laptop
 * @returns {Promise} - Promise resolving to detailed laptop information
 */
export const getLaptopDetails = async (laptopId) => {
  // In a real application, this would be a fetch call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data for a single laptop with more details
      resolve({
        id: laptopId,
        name: 'Laptop Model X',
        price: 75000,
        specs: {
          processor: 'Intel Core i7 11th Gen',
          ram: '16GB DDR4',
          storage: '512GB NVMe SSD',
          display: '15.6" Full HD IPS',
          graphics: 'Integrated Intel Iris Xe',
          battery: '8 hours',
          weight: '1.8 kg',
          ports: ['USB-C', 'HDMI', 'USB 3.0 (3)', 'SD Card Reader']
        },
        features: [
          'Backlit keyboard',
          'Fingerprint reader',
          'HD webcam',
          'Wi-Fi 6',
          'Bluetooth 5.0'
        ],
        warranty: '1 year',
        rating: 4.5,
        reviews: 128
      });
    }, 800);
  });
}; 