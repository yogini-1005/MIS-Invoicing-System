import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        if (isMounted) setUser(res.data);
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

 return (
  <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
    {children}
  </UserContext.Provider>
);

};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
