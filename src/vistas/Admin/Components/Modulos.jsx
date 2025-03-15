import { GraduationCap, Book, Clipboard, Users, UserRoundPen } from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { ImUserTie } from "react-icons/im";

export const modules = [
  { name: "Periodos académicos", icon: <GraduationCap size={20}/>, path: "/admin/periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, path: "/admin/asignaturas" },
  { name: "Docentes", icon: <ImUserTie size={20}/>, path:"/admin/docentes"},
  { name: "Representantes", icon: <BiMaleFemale size={24}/>, path: "/admin/representantes" },
  { name: "Estudiantes", icon: <Users size={20} />, path: "/admin/estudiantes" },
  { name: "Cursos", icon: <FaBuilding size={20} />, path: "/admin/cursos" },
  { name: "Calificaciones", icon: <Clipboard size={20}/>, path:"/admin/calificaciones" }
];