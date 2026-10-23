import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login/", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register/", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch("/auth/me/", profileData);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.delete("/auth/me/");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password/", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
  const response = await api.post(
    `/auth/reset-password/${token}/`,
    { password, confirm_password: confirmPassword }
  );
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}/`);
  return response.data;
};