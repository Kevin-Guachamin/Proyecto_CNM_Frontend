import { RiLockPasswordFill } from "react-icons/ri";
import { FileText } from "lucide-react";
import { Settings,  } from "lucide-react";
import { BiMaleFemale } from "react-icons/bi";

export const getModulos = (subRol, includeInicio = false) => {
    let baseModules = [];
  
    switch (subRol) {
      case "Profesor":
        baseModules = [
          { id: 1, titulo: "Información Estudiantil", icono: "📄", link: "/profesor/informacion" },
          { id: 2, titulo: "Calificaciones", icono: "📊", link: "/profesor/panelcursos" },
          { id: 3, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/profesor/password"},
          { id: 4, titulo: "Solicitudes", icono: <FileText  size={40}/>, link: "/profesor/solicitudes"}
        ];
        break;
      case "Vicerrector":
        baseModules = [
          { id: 1, titulo: "Distributivo de Docentes", icono: "🧑‍🏫", link: "/vicerrector/distributivo" },
          { id: 2, titulo: "Fechas para notas", icono: "📅", link: "/vicerrector/reportes" },
          { id: 3, titulo: "Agenda solicitudes", icono: "📝", link: "/vicerrector/solicitudes"},
          { id: 4, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/vicerrector/password"}
        ];
        break;
      case "Secretaria":
        baseModules = [
          { id: 1, titulo: "Administración Escolar", icono: "🗃", link: "/secretaria/administracion-escolar" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/secretaria/matriculación" },
          { id: 3, titulo: "Información Estudiantil", icono: "📄", link: "/secretaria/informacion" },
          { id: 4, titulo: "Fechas Procesos", icono: "📅", link: "/secretaria/procesos" },
          { id: 5, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/secretaria/password"}

        ];
        break;
        case "Administrador":
        baseModules=[
          { id: 1, titulo: "Configuración", icono: <Settings size={40} className="text-gray-700" />, link: "/admin/periodos" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/admin/matriculacion" },
          { id: 3, titulo: "Estudiantil", icono: <BiMaleFemale size={40}/>, link: "/admin/inscripcion"},
          { id: 4, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/admin/password"}
        ]
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