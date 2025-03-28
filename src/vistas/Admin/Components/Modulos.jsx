import { GraduationCap, Book, Home} from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { ImUserTie } from "react-icons/im";

export const modulesSettings = [
  {name: "Inicio",icon: <Home size={20}/>, path: "/admin"},
  { name: "Periodos académicos", icon: <GraduationCap size={20} />, path: "/admin/periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, path: "/admin/asignaturas" },
  { name: "Docentes", icon: <ImUserTie size={20} />, path: "/admin/docentes" },
  { name: "Cursos", icon: <FaBuilding size={20}/>, path: "/admin/cursos"}
];

export const modulesMatricula = [
  { name: "Cursos"}
]

export const modulesEstudiates=[
  { name: "Estudiantes", icon: <BiMaleFemale size={24} />, path: "/admin/estudiantes" },
]