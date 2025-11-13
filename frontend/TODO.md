# TODO: Fix Address List Fetching After Login

## Steps to Complete:
1. Update authSlice.js to store the full login response in sessionStorage after successful OTP verification.
2. Modify apiService.js to retrieve the token from the stored login response instead of a separate sessionStorage item.
3. Update AddressList.jsx to call loadAddresses when isAuthenticated changes, ensuring data fetches after login.
4. Add error handling in AddressList.jsx to show API response messages if fetching fails.

## Status:
- [x] Step 1: Update authSlice.js
- [x] Step 2: Modify apiService.js
- [x] Step 3: Update AddressList.jsx
- [x] Step 4: Add error handling in AddressList.jsx
