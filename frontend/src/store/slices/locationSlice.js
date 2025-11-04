import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Available cities and their sub-locations
const AVAILABLE_CITIES = {
  delhi: {
    name: 'Delhi',
    image: '/assets/images/delhi.jpg',
    subLocations: ['Delhi', 'Gurgaon', 'Noida', 'Greater Noida', 'Gaziabad', 'Faridabad']
  },
  mumbai: {
    name: 'Mumbai',
    image: '/assets/images/mumbai.jpg',
    subLocations: ['Mumbai West', 'Mumbai South', 'Mumbai Central', 'Navi Mumbai', 'Thane']
  },
  bangalore: {
    name: 'Bangalore',
    image: '/assets/images/bangalore.jpg',
    subLocations: ['Bangalore North', 'Bangalore South', 'Bangalore East', 'Bangalore West', 'Electronic City']
  },
  hyderabad: {
    name: 'Hyderabad',
    image: '/assets/images/hyderabad.jpg',
    subLocations: ['Hyderabad Central', 'Secunderabad', 'Gachibowli', 'Kukatpally', 'Hitech City']
  },
  odisha: {
    name: 'Odisha',
    image: '/assets/images/odisha.jpg',
    subLocations: ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Berhampur']
  }
};

// Async thunk for detecting location
export const detectLocation = createAsyncThunk(
  'location/detectLocation',
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(rejectWithValue('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding using a free API (you might want to use a paid service for production)
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            const city = data.city || data.locality || '';
            const state = data.principalSubdivision || '';

            // Check if the detected city is in our service areas
            const normalizedCity = city.toLowerCase().replace(/\s+/g, '');
            const isServiceAvailable = Object.keys(AVAILABLE_CITIES).some(key =>
              normalizedCity.includes(key) || key.includes(normalizedCity)
            );

            resolve({
              latitude,
              longitude,
              city,
              state,
              isServiceAvailable,
              detected: true
            });
          } catch (error) {
            reject(rejectWithValue('Failed to get location details'));
          }
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(rejectWithValue(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
);

// Initial state
const initialState = {
  selectedLocation: null, // { city: 'delhi', subLocation: 'Delhi', name: 'Delhi' }
  availableCities: AVAILABLE_CITIES,
  detectedLocation: null, // { latitude, longitude, city, state, isServiceAvailable, detected }
  loading: false,
  error: null,
  locationRequired: true // Flag to control if location selection is required
};

// Location slice
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      const { cityKey, subLocation } = action.payload;
      const cityData = state.availableCities[cityKey];
      if (cityData) {
        state.selectedLocation = {
          city: cityKey,
          subLocation: subLocation || cityData.subLocations[0],
          name: cityData.name,
          displayName: subLocation ? `${subLocation}, ${cityData.name}` : cityData.name
        };
        state.error = null;
        // Persist to localStorage
        localStorage.setItem('selectedLocation', JSON.stringify(state.selectedLocation));
      }
    },
    setManualLocation: (state, action) => {
      const { location } = action.payload;
      state.selectedLocation = {
        city: 'manual',
        subLocation: location,
        name: location,
        displayName: location
      };
      state.error = null;
      localStorage.setItem('selectedLocation', JSON.stringify(state.selectedLocation));
    },
    clearLocation: (state) => {
      state.selectedLocation = null;
      state.detectedLocation = null;
      state.error = null;
      localStorage.removeItem('selectedLocation');
    },
    setLocationRequired: (state, action) => {
      state.locationRequired = action.payload;
    },
    loadPersistedLocation: (state) => {
      const persisted = localStorage.getItem('selectedLocation');
      if (persisted) {
        try {
          state.selectedLocation = JSON.parse(persisted);
        } catch (error) {
          console.error('Failed to parse persisted location:', error);
        }
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.detectedLocation = action.payload;
        if (action.payload.isServiceAvailable) {
          // Automatically set the location if service is available
          state.selectedLocation = {
            city: 'manual',
            subLocation: action.payload.city,
            name: action.payload.city,
            displayName: action.payload.city
          };
          state.error = null;
          // Persist to localStorage
          localStorage.setItem('selectedLocation', JSON.stringify(state.selectedLocation));
        } else {
          state.error = 'Service is not available in your current location';
        }
      })
      .addCase(detectLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLocation,
  setManualLocation,
  clearLocation,
  setLocationRequired,
  loadPersistedLocation,
  setError,
  clearError
} = locationSlice.actions;

export default locationSlice.reducer;
