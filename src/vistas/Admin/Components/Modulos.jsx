import { GraduationCap, Book, Clipboard, Users, UserRoundPen } from "lucide-react";
import { FaBuilding } from "react-icons/fa";

export const modules = [
  { name: "Periodos académicos", icon: <GraduationCap size={20} /> },
  { name: "Asignaturas", icon: <Book size={20} /> },
  { name: "Cursos", icon: <FaBuilding size={20} /> },
  { name: "Docentes", icon: <UserRoundPen size={20}/>},
  { name: "Estudiantes", icon: <Users size={20} /> },
  { name: "Calificaciones", icon: <Clipboard size={20}/> }
];