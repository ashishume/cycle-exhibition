import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminAuth") === "true";
  });
  const navigate = useNavigate();

  // Persist auth state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminAuth", isAuthenticated.toString());
  }, [isAuthenticated]);

  const login = (username: string, password: string) => {
    if (username === "superAdminUser" && password === "AdminXuser123@@@") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};
