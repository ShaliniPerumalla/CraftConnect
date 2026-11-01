import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("makermatch_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem("makermatch_user");
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const serverUser = await getCurrentUser();
      if (serverUser && serverUser.id) {
        setUser((prev) => {
          const merged = { ...prev, ...serverUser };
          localStorage.setItem("makermatch_user", JSON.stringify(merged));
          return merged;
        });
        return serverUser;
      }
    } catch (err) {
      console.warn("Could not refresh authenticated user:", err?.response?.status || err.message);
      if (err?.response?.status === 401 && !localStorage.getItem("refresh_token")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (userData, accessToken = null, refreshToken = null) => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    localStorage.setItem("makermatch_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("makermatch_user");
    localStorage.removeItem("craftconnect_user");
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
        refreshUser,
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