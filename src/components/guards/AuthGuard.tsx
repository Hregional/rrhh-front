import * as React from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

interface AuthGuardType {
  children: React.ReactNode;
  requiredRoles?: string[] | undefined; // Modifica la definición de requiredRoles
}

// For routes that can only be accessed by authenticated users
function AuthGuard({ children, requiredRoles  }: AuthGuardType) {
  const { isAuthenticated, isInitialized, roles } = useAuth();

  if (isInitialized && !isAuthenticated) {
    return <Navigate to="/auth/sign-in" />;
  }

  if (
    requiredRoles &&
    Array.isArray(roles) &&
    !roles.some((role) => requiredRoles.includes(role))
  ) {
    // Si el usuario no tiene ninguno de los roles requeridos, redirige a una página de acceso no autorizado
    // return <Navigate to="/404" />;
    return <Navigate to="/" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default AuthGuard;
