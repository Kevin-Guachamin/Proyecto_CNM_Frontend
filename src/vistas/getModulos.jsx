import { RiLockPasswordFill } from "react-icons/ri";

export const getModulos = (subRol, includeInicio = false) => {
    let baseModules = [];
  
    switch (subRol) {
      case "Profesor":
        baseModules = [
          { id: 1, titulo: "Información Estudiantil", icono: "📄", link: "/profesor/informacion" },
          { id: 2, titulo: "Calificaciones", icono: "📊", link: "/profesor/panelcursos" },
          { id: 3, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/profesor/password"}
        ];
        break;
      case "Vicerrector":
        baseModules = [
          { id: 1, titulo: "Distributivo de Docentes", icono: "🧑‍🏫", link: "/vicerrector/gestion-academica" },
          { id: 2, titulo: "Fechas para notas", icono: "📅", link: "/vicerrector/reportes" },
          { id: 3, titulo: "Fechas temporalaes", icono: "📝", link: "/vicerrector/password"},
          { id: 4, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/vicerrector/password"}
        ];
        break;
      case "Secretaria":
        baseModules = [
          { id: 1, titulo: "Administración Escolar", icono: "🗃", link: "/secretaria/administracion-escolar" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/secretaria/agenda-citas" },
          { id: 3, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/secretaria/password"}
        ];
        break;
      default:
        baseModules = [];
    }
  
    if (includeInicio) {
      // Agrega el módulo "Inicio" al inicio del arreglo
      baseModules.unshift({ id: 0, titulo: "Inicio", icono: "🏠", link: "/inicio" });
    }
  
    return baseModules;
  };
  
  // src/utils/transformModulesForLayout.js
export const transformModulesForLayout = (modulosBase) => {
    return modulosBase.map((mod) => ({
      id: mod.id,
      name: mod.titulo,      // Convertimos "titulo" en "name"
      icon: mod.icono,       // Convertimos "icono" en "icon"
      path: mod.link         // Convertimos "link" en "path"
    }));
  };
  