# Display User Mobile Number in Account Drawer

## Current Issue
- Login API response includes "user_mobile", stored in Redux state after OTP verification.
- Account drawer profile section shows user name with "(user.number)", but needs to display mobile number below the profile.

## Required Changes

### 1. Update Drawer.jsx Profile Section
- Modify the profile display to show user name on one line.
- Add mobile number below the name using `user.user_mobile` from Redux state.

## Files to Edit
- `frontend/src/components/Drawer.jsx`

## Followup Steps
- Test the drawer display after login.
- Ensure mobile number is correctly fetched from login response.
