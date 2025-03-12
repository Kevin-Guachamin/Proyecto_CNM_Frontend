import { GraduationCap, Book, Clipboard, Users, UserRoundPen } from "lucide-react";
import { FaBuilding } from "react-icons/fa";

export const modules = [
  { name: "Periodos académicos", icon: <GraduationCap size={20}/>, path: "/admin/periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, path: "/admin/asignaturas" },
  { name: "Docentes", icon: <UserRoundPen size={20}/>, path:"/admin/docentes"},
  { name: "Cursos", icon: <FaBuilding size={20} />, path: "/admin/cursos" },
  { name: "Estudiantes", icon: <Users size={20} />, path: "/admin/estudiantes" },
  { name: "Calificaciones", icon: <Clipboard size={20}/>, path:"/admin/calificaciones" }
];