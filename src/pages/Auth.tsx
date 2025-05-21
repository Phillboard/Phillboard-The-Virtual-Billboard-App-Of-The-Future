
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthCard } from "@/components/AuthForms";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { user, loading } = useAuth();
  
  // If user is already logged in, redirect to home page
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <AuthCard />
    </div>
  );
};

export default Auth;
