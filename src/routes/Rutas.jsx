import React from 'react'
import Login from '../vistas/Login/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../vistas/Inicio.jsx';
import Periodos_Academicos from '../vistas/Admin/Modules/Configuration/PeriodosAcedémicos/Index.jsx'
import Calificaciones from '../vistas/Docente/Calificaciones.jsx';
import Asignaguras from "../vistas/Admin/Modules/Configuration/Asignaturas/Index.jsx"
import Docentes from "../vistas/Admin/Modules/Configuration/Docentes/Index.jsx"
import Representante from '../vistas/Representante/index.jsx'
import Estudiantes from '../vistas/Admin/Modules/Estudiantil/Estudiantes/Index.jsx'
import PanelCursos from '../vistas/Docente/PanelCursos.jsx';
import ListaEstudiantes from '../vistas/Representante/modulos/listaEstudiantes.jsx';
import VerDatosRepresentante from '../vistas/Representante/modulos/VerDatosRepresentante.jsx';
import VerDatosEstudiante from '../vistas/Representante/modulos/VerDatosEstudiante.jsx';
import Admin from '../vistas/Admin/inicio.jsx'
import Cursos from '../vistas/Admin/Modules/Configuration/Cursos/Index.jsx'
import Busqueda from '../vistas/Admin/Modules/Matriculacion/MatriculacionGrupal/Index.jsx';
import Horarios from '../vistas/Admin/Modules/Matriculacion/MatriculacionGrupal/Horarios.jsx'
import Inscripcion from '../vistas/Admin/Modules/Estudiantil/Registro/Index.jsx'
import Representantes from '../vistas/Admin/Modules/Estudiantil/Representantes/Index.jsx'
import AgregarFechas from '../vistas/Vicerrector/AgregarFechas.jsx';
import ChangePassword_Representante from '../vistas/Representante/modulos/ChangePassword/Index.jsx';
import ChangePassword_Admin from '../vistas/Admin/Modules/ChangePassword/Index.jsx';
import GestionEscolar from '../vistas/Secretaria/GestionEscolar.jsx';
import MateriasPorPeriodo from '../vistas/Secretaria/MateriasPorPeriodo.jsx';
import ListadoCursos from '../vistas/Secretaria/ListadoCursos.jsx';
import ChangePassword_Profesor from '../vistas/Docente/ChangePassword/Index.jsx';
import ChangePassword_Secretaria from '../vistas/Secretaria/ChangePassword/Index.jsx';
import ChangePassword_Vicerrector from '../vistas/Vicerrector/ChangePassword/Index.jsx';

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />

      {/*RUTAS DEL ADMINISTRADOR*/}
      <Route path='/admin' element={<Admin />} />
      <Route path="/admin/periodos" element={<Periodos_Academicos />} />
      <Route path="/admin/asignaturas" element={<Asignaguras />} />
      <Route path="/admin/docentes" element={<Docentes />} />
      <Route path="/admin/estudiantes" element={<Estudiantes />} />
      <Route path='/admin/cursos' element={<Cursos />} />
      <Route path='/admin/matriculacion' element={<Busqueda />} />
      <Route path='/admin/horarios' element={<Horarios />} />
      <Route path='/admin/inscripcion' element={<Inscripcion />} />
      <Route path='/admin/representantes' element={<Representantes />} />
      <Route path="/admin/password" element={<ChangePassword_Admin />} />
      
      {/*RUTAS DEL DOCENTE-Profesor*/}
      <Route path="/profesor/panelcursos/calificaciones" element={<Calificaciones />} />
      <Route path="/profesor/panelcursos" element={<PanelCursos />} />
      <Route path ="/profesor/password" element={<ChangePassword_Profesor />} />

      {/*Rutas DEL REPRESENTANTE*/}
      <Route path="/representante" element={<Representante />} />
      <Route path="/representante/estudiantes" element={<ListaEstudiantes />} />
      <Route path="/representante/perfil" element={<VerDatosRepresentante />} />
      <Route path="/representante/password" element={<ChangePassword_Representante />} />
      <Route path="/estudiante/perfil" element={<VerDatosEstudiante />} />
      
      {/*RUTAS DEL DOCENTE-Vicerrector*/}
      <Route path="/vicerrector/reportes" element={<AgregarFechas />} />
      <Route path="/vicerrector/password" element={<ChangePassword_Vicerrector />} />

      {/*RUTAS DEL DOCENTE-Secretaria*/}
      <Route path="/secretaria/administracion-escolar" element={<GestionEscolar />} />
      <Route path="/secretaria/periodo/materias/:idPeriodo" element={<MateriasPorPeriodo />} />
      <Route path="/secretaria/periodo/materias/estudiantes/:id_asignacion" element={<ListadoCursos />} />
      <Route path="/secretaria/calificaciones/asignacion/:asigId" element={<Calificaciones />} />
      <Route path="/secretaria/password" element={<ChangePassword_Secretaria />} />
    </Routes>
  )
}

export default Rutas;