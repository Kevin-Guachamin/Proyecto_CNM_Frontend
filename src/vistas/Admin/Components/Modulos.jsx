import { GraduationCap, Book, Home, NotebookPen } from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { ImUserTie } from "react-icons/im";
import { FaUsersLine } from "react-icons/fa6";

// Modules base sin prefijo
export const modulesEstudiantesBase = [
  { name: "Registro", icon: <NotebookPen size={20} />, route: "inscripcion", informacion: true },
  { name: "Estudiantes", icon: <LuUsers size={20} />, route: "estudiantes", informacion: true },
  { name: "Representantes", icon: <FaUsersLine size={25} />, route: "representantes", informacion: true },
];

export const modulesMatriculaBase = [
  { name: "Matriculación", icon: <NotebookPen size={20} />, route: "matriculacion", informacion: false },
];

export const modulesSettingsBase = [
  { name: "Periodos académicos", icon: <GraduationCap size={20} />, route: "periodos" },
  { name: "Asignaturas", icon: <Book size={20} />, route: "asignaturas" },
  { name: "Docentes", icon: <ImUserTie size={20} />, route: "docentes" },
  { name: "Cursos", icon: <FaBuilding size={20} />, route: "cursos" },
];

// Módulo "Inicio" común
export const moduloInicio = { name: "Inicio", icon: <Home size={20} />, path: "/inicio" };

export const construirModulosConPrefijo = (subrol, modulosBase) => {
  const subrolNormalizado = subrol?.toLowerCase?.();
  let prefijo = "admin";

  if (subrolNormalizado === "secretaria") {
    prefijo = "secretaria";
  }

  return modulosBase.map(modulo => {
    const rutaIntermedia = (subrolNormalizado === "secretaria" && modulo.informacion) ? "/informacion" : "";
    return {
      name: modulo.name,
      icon: modulo.icon,
      path: `/${prefijo}${rutaIntermedia}/${modulo.route}`
    };
  });
};