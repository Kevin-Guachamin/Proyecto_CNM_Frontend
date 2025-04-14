import { GraduationCap, Book, Home,NotebookPen} from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { ImUserTie } from "react-icons/im";
import { FaUsersLine } from "react-icons/fa6";


export const modulesSettings = [
  {name: "Inicio",icon: <Home size={20}/>, path: "/inicio"},
  { name: "Periodos académicos", icon: <GraduationCap size={20} />, path: "/admin/periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, path: "/admin/asignaturas" },
  { name: "Docentes", icon: <ImUserTie size={20} />, path: "/admin/docentes" },
  { name: "Cursos", icon: <FaBuilding size={20}/>, path: "/admin/cursos"}
];

export const modulesMatricula = [
  {name: "Inicio",icon: <Home size={20}/>, path: "/inicio"},
  { name: "Matriculación",icon: <NotebookPen size={20}/>, path: "/admin/matriculacion"},
 
]

export const modulesEstudiates=[
  {name: "Inicio",icon: <Home size={20}/>, path: "/inicio"},
  {name: "Registro",icon: <NotebookPen size={20}/>, path: "/admin/inscripcion"},
  {name: "Estudiantes", icon: <LuUsers size={20}/>, path: "/admin/estudiantes"},
  {name: "Representantes", icon: <FaUsersLine size={25}/>, path: "/admin/representantes"},
]