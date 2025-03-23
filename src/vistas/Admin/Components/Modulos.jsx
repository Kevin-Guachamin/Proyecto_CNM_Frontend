import { GraduationCap, Book, Clipboard } from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import { BiMaleFemale } from "react-icons/bi";
import { ImUserTie } from "react-icons/im";

export const modulesSettings = [
  { name: "Periodos académicos", icon: <GraduationCap size={20} />, path: "/admin/periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, path: "/admin/asignaturas" },
  { name: "Docentes", icon: <ImUserTie size={20} />, path: "/admin/docentes" },
  { name: "Estudiantes", icon: <BiMaleFemale size={24} />, path: "/admin/estudiantes" },
];

export const modulesMatricula = [
  { name: "Cursos"}
]