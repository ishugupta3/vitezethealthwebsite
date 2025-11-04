# TODO: Update Register Page to Use Direct Registration API

## Tasks
- [x] Update `frontend/src/utils/authApi.js`: Modify `registerUser` function to match new API body format (user_name, user_email, user_gender, mobile_number, device_id), remove OTP from payload, set device_id default to "register user"
- [x] Update `frontend/src/pages/Register.jsx`: Change `handleRegister` to call `registerUser` directly, update form state to set device_id default to "register user", remove OTP sending logic and navigation to OTP verify page

## Followup Steps
- [ ] Test the registration flow to ensure it works with the new API
- [ ] Handle any API response errors appropriately

# TODO: Fix Drawer Backdrop to Show Home Page Behind

## Tasks
- [x] Update `frontend/src/components/Drawer.jsx`: Change the backdrop div's className from "absolute inset-0 bg-white bg-opacity-50" to "absolute inset-0" to make it transparent and allow the home page to show through.

## Followup Steps
- [ ] Run the development server to test the drawer behavior
