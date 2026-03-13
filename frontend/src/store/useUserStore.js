import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  user: {
    name: 'Arjun Mehra',
    email: 'arjun.mehra@example.com',
    role: 'citizen',
    joined: 'January 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcSooiWL5QJfcdvtCF5pXx7Rc-7f2WYGLJI7HXEAicDBhcfQLs1ulmlkuNyIIC4dhW4vuYUyHtnlGta_twTWhWzzvHbryg_kpmQVU94RYrrBAV6sZjdjR-UrYr6wPxo70oxs0OAVUywhYqYNwvWiUP9R54mpGwNOzTQ6MQeLZwfPV0YaPpdambOaQKYOOQLHRFZQ4A8CNw9tNOsD6eyD-OxTR9RnqXWdVqZHv8wphYU7e8WRnD2Htr4NoPLifdjBUGJq0s2U9nohw',
    impactScore: 450,
  },
  
  userLocation: null,
  focusLocation: { name: 'India', lat: 22.5937, lng: 78.9629 },
  
  locationLoading: false,
  locationError: null,

  setFocusLocation: (loc) => set({ focusLocation: loc }),
  
  detectLocation: (callback = null) => {
    if (!navigator.geolocation) {
      set({ locationError: "Geolocation not supported" });
      return;
    }

    set({ locationLoading: true });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocode for specific major cities, fallback to coordinates
        let cityName = "Detected Location";
        if (latitude > 18 && latitude < 20 && longitude > 72 && longitude < 74) cityName = "Mumbai";
        else if (latitude > 28 && latitude < 29 && longitude > 76 && longitude < 78) cityName = "Delhi";
        else if (latitude > 12 && latitude < 14 && longitude > 77 && longitude < 78) cityName = "Bangalore";
        else cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

        const newLoc = { lat: latitude, lng: longitude, city: cityName };
        
        set({ 
          userLocation: newLoc, 
          focusLocation: { name: cityName, lat: latitude, lng: longitude },
          locationLoading: false 
        });

        if (callback) callback(newLoc);
      },
      (error) => {
        set({ locationError: error.message, locationLoading: false });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  },

  logout: () => set({ user: null }),
}));
