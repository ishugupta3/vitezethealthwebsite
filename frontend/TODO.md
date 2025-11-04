# Location Selection Feature Implementation

## Overview
Implement a location selection page similar to BookMyShow that appears after login or skip login. Users must select a location before accessing the home page.

## Tasks

### 1. Create Redux Slice for Location State
- [ ] Create `frontend/src/store/slices/locationSlice.js`
- [ ] Add state for selected location, available cities, sub-locations
- [ ] Add actions for setting location, detecting location, clearing location

### 2. Create Location Selection Page
- [ ] Create `frontend/src/pages/LocationSelection.jsx`
- [ ] Add search bar for manual location input
- [ ] Add "Detect My Location" button with geolocation
- [ ] Add popular cities section with images
- [ ] Implement expandable city cards showing sub-locations

### 3. Create Location Card Component
- [ ] Create `frontend/src/components/LocationCard.jsx`
- [ ] Display city image and name
- [ ] Handle click to expand/collapse sub-locations
- [ ] Style similar to BookMyShow

### 4. Add City Images to Assets
- [ ] Add city images to `frontend/src/assets/images/`
- [ ] Delhi, Mumbai, Bangalore, Hyderabad, Odisha images

### 5. Update App.jsx Routing
- [ ] Add `/location` route to App.jsx
- [ ] Ensure proper routing flow

### 6. Modify Authentication Flow
- [ ] Update `frontend/src/store/slices/authSlice.js` to redirect to `/location` after login
- [ ] Update `frontend/src/pages/Login.jsx` skip button to go to `/location`

### 7. Update Home Page
- [ ] Modify `frontend/src/pages/home.jsx` to check for selected location
- [ ] Redirect to `/location` if no location selected
- [ ] Update SearchBar to display selected location

### 8. Update SearchBar Component
- [ ] Modify `frontend/src/components/SearchBar.jsx` to show selected location
- [ ] Add functionality to change location (navigate to /location)

### 9. Implement Geolocation and Reverse Geocoding
- [ ] Add geolocation API usage in LocationSelection.jsx
- [ ] Implement reverse geocoding to get city from coordinates
- [ ] Handle permission denied and errors
- [ ] Check if detected city is in service areas

### 10. Add Location Persistence
- [ ] Store selected location in localStorage
- [ ] Load location on app start
- [ ] Clear location on logout if needed

### 11. Testing and Validation
- [ ] Test location detection on different devices
- [ ] Test manual location search
- [ ] Test city selection and sub-location selection
- [ ] Test default location (Delhi) behavior
- [ ] Test service unavailable message for unsupported locations
