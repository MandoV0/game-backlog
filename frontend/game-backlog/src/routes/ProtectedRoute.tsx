import React, { ReactNode } from 'react';
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../helpers/isTokenValid";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to='/login' replace/>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;