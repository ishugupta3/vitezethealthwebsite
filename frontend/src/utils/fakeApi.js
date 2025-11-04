export const fakeApi = {
  login: async (mobile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (mobile === "9033152603") {
          resolve({
            status: true,
            token: "xyz123",
            userDetail: { name: "Ishu", mobile },
          });
        } else {
          resolve({ status: false, message: "User does not exist" });
        }
      }, 1000);
    });
  },

  register: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: true, message: "Registration Successful!" });
      }, 1000);
    });
  },

  verifyOtp: async (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === "1234") resolve({ status: true });
        else resolve({ status: false, message: "Invalid OTP" });
      }, 1000);
    });
  },
};
