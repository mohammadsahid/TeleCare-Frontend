import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (!token) {
      console.log("NO TOKEN FOUND");
      setLoading(false);
      return;
    }

    const { data } = await API.get("/auth/me");

    console.log("AUTH ME RESPONSE:", data);

    setUser(data.user);

  } catch (error) {

    console.log("AUTH ERROR:", error);

    localStorage.removeItem("token");

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {
    fetchCurrentUser();
  }, []);

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};