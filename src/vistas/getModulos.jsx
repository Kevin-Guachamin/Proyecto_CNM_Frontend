// src/utils/getModulos.js
export const getModulos = (subRol, includeInicio = false) => {
    let baseModules = [];
  
    switch (subRol) {
      case "Profesor":
        baseModules = [
          { id: 1, titulo: "Información Estudiantil", icono: "📄", link: "/informacion" },
          { id: 2, titulo: "Matriculación", icono: "✏️", link: "/matriculacion" },
          { id: 3, titulo: "Calificaciones", icono: "📊", link: "/panelcursos" },
        ];
        break;
      case "Vicerrector":
        baseModules = [
          { id: 1, titulo: "Gestión Académica", icono: "🏫", link: "/gestion-academica" },
          { id: 2, titulo: "Fechas para notas", icono: "📅", link: "/reportes" },
        ];
        break;
      case "Secretaria":
        baseModules = [
          { id: 1, titulo: "Administración Escolar", icono: "🗃", link: "/administracion-escolar" },
          { id: 2, titulo: "Agenda de Citas", icono: "📅", link: "/agenda-citas" },
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
  