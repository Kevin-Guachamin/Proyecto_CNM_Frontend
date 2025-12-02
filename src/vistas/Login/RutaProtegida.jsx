import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RutaProtegida = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  // 1. Si no hay token → de vuelta al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Determinar ruta de cambio de contraseña según rol/subRol
  let passwordRoute = null;
  if (usuario.rol === "representante") {
    passwordRoute = "/representante/password";
  } else if (usuario.rol === "docente") {
    switch (usuario.subRol) {
      case "Administrador":
        passwordRoute = "/admin/password";
        break;
      case "Profesor":
        passwordRoute = "/profesor/password";
        break;
      case "Vicerrector":
        passwordRoute = "/vicerrector/password";
        break;
      case "Secretaria":
        passwordRoute = "/secretaria/password";
        break;
      default:
        passwordRoute = null;
    }
  }

  // 3. Si debe cambiar contraseña y NO está en su ruta de cambio → redirigirlo sí o sí
  if (
    usuario.debeCambiarPassword &&
    passwordRoute &&
    location.pathname !== passwordRoute
  ) {
    return <Navigate to={passwordRoute} replace />;
  }

  // 4. Todo OK → renderizar la ruta hija
  return <Outlet />;
};

export default RutaProtegida;
