import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("campusconnect_token")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("campusconnect_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });

    localStorage.setItem("campusconnect_token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const register = async (name, email, password) => {
    return await registerUser({
      name,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem("campusconnect_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);