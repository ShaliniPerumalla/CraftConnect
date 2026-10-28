/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getProfileCompletionStatus(userData) {
  if (!userData) {
    return false;
  }

  const required = ["phone", "address", "city", "state", "pincode"];

  return required.every((field) => {
    const value = userData?.[field];
    return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
  });
}

function normalizeUser(userData) {
  if (!userData) {
    return null;
  }

  return {
    ...userData,
    role: userData?.role ? String(userData.role).toLowerCase() : userData?.role,
    profile_complete: userData?.profile_complete ?? getProfileCompletionStatus(userData),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("CraftConnect_user");

      if (!storedUser) {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      return normalizeUser(parsedUser);
    } catch {
      localStorage.removeItem("CraftConnect_user");
      return null;
    }
  });
  const loading = false;

  const login = (userData) => {
    const normalizedUser = normalizeUser(userData);

    localStorage.setItem(
      "CraftConnect_user",
      JSON.stringify(normalizedUser)
    );

    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("CraftConnect_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}