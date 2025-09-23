import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/utils/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadUser() {
      try {
        const res = await apiClient.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = res.data;
        const normalizedRole = profile.role.toLowerCase();

        setUser(profile); // full profile from backend
        localStorage.setItem("user", JSON.stringify(profile)); // ✅ Save full profile
        localStorage.setItem("role", normalizedRole); // ✅ Save normalized role
        localStorage.setItem("user_id", profile.id); // ✅ Save user ID
      } catch (err) {
        console.error("Failed to restore session:", err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // ✅ New login function
  const login = async (token) => {
    localStorage.setItem("token", token);
    try {
      const res = await apiClient.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = res.data;
      const normalizedRole = profile.role.toLowerCase();

      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      localStorage.setItem("role", normalizedRole);
      localStorage.setItem("user_id", profile.id);
    } catch (err) {
      console.error("Login fetch profile failed:", err);
      logout();
      throw err; // Re-throw the error to be caught by the calling component
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}