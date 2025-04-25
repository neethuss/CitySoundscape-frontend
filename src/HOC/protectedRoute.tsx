import { ReactNode } from "react";
import { Navigate } from "react-router-dom";


interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  // Function to check if the token is expired
  
  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  };

  // Check if the token is expired
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  return <>{children}</>; 
};

export default ProtectedRoute;
