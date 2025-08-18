import { Home, User, Users, Key, BookOpen } from "lucide-react";
import { RiLockPasswordFill } from "react-icons/ri";

// Módulos del representante
export const modulosRepresentante = [
  { 
    name: "Inicio", 
    icon: <Home size={20} />, 
    path: "/representante" 
  },
  { 
    name: "Mi información", 
    icon: <User size={20} />, 
    path: "/representante/perfil" 
  },
  { 
    name: "Mis estudiantes", 
    icon: <Users size={20} />, 
    path: "/representante/estudiantes" 
  },
  { 
    name: "Matriculación", 
    icon: <BookOpen size={20} />, 
    path: "/representante/inscripcion" 
  },
  { 
    name: "Cambiar contraseña", 
    icon: <RiLockPasswordFill size={20} />, 
    path: "/representante/password" 
  }
];

export default modulosRepresentante;
