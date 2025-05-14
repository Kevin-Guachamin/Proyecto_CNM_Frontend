
export const getModulos = (subRol, includeInicio = false) => {
    let baseModules = [];
  
    switch (subRol) {
      case "Profesor":
        baseModules = [
          { id: 1, titulo: "Calificaciones", icono: "📊", link: "/profesor/panelcursos" },
          { id: 2, titulo: "Cambiar contraseña", icono: "🔐", link: "/profesor/password"},
          { id: 3, titulo: "Solicitudes", icono: "📨", link: "/profesor/solicitudes"},
          { id: 4, titulo: "Matriculación", icono: "✏️", link: "/profesor/matricula"},
          { id: 5, titulo: "Materias Individuales", icono: "👥", link: "/profesor/materias"}
        ];
        break;
      case "Vicerrector":
        baseModules = [
          { id: 1, titulo: "Distributivo de Docentes", icono: "🧑‍🏫", link: "/vicerrector/distributivo" },
          { id: 2, titulo: "Fechas para notas", icono: "📅", link: "/vicerrector/reportes" },
          { id: 3, titulo: "Agenda solicitudes", icono: "📝", link: "/vicerrector/solicitudes"},
          { id: 4, titulo: "Cambiar contraseña", icono: "🔐", link: "/vicerrector/password"},
         
        ];
        break;
      case "Secretaria":
        baseModules = [
          { id: 1, titulo: "Administración Escolar", icono: "🗃", link: "/secretaria/administracion-escolar" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/secretaria/matriculacion" },
          { id: 3, titulo: "Información Estudiantil", icono: "📄", link: "/secretaria/informacion" },
          { id: 4, titulo: "Fechas Procesos", icono: "📅", link: "/secretaria/procesos" },
          { id: 5, titulo: "Reportes", icono: "📊", link: "/secretaria/reportes"},
          { id: 6, titulo: "Cambiar contraseña", icono: "🔐", link: "/secretaria/password"}
        ];
        break;
        case "Administrador":
        baseModules=[
          { id: 1, titulo: "Configuración", icono: "⚙️", link: "/admin/periodos" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/admin/matriculacion" },
          { id: 3, titulo: "Estudiantil", icono: "👥", link: "/admin/inscripcion"},
          { id: 4, titulo: "Cambiar contraseña", icono: "🔐", link: "/admin/password"}
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