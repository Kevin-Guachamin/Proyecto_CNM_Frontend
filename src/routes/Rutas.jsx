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
import PanelCursos from '../vistas/PanelCursos.jsx';
import ListaEstudiantes from '../vistas/Representante/modulos/listaEstudiantes.jsx';
import VerDatosRepresentante from '../vistas/Representante/modulos/VerDatosRepresentante.jsx';
import VerDatosEstudiante from '../vistas/Representante/modulos/VerDatosEstudiante.jsx';
import Admin from '../vistas/Admin/inicio.jsx'
import Cursos from '../vistas/Admin/Modules/Configuration/Cursos/Index.jsx'
import Busqueda from '../vistas/Admin/Modules/Matriculacion/MatriculacionGrupal/Index.jsx';
import Horarios from '../vistas/Admin/Modules/Matriculacion/MatriculacionGrupal/Horarios.jsx'
import Inscripcion from '../vistas/Admin/Modules/Estudiantil/Inscripcion/Index.jsx'
import Representantes from '../vistas/Admin/Modules/Estudiantil/Representantes/Index.jsx'
import AgregarFechas from '../vistas/Vicerrector/AgregarFechas.jsx';
import ChangePassword from '../vistas/Representante/modulos/ChangePassword/Index.jsx';


function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
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
      <Route path="/calificaciones" element={<Calificaciones />} />
      <Route path="/panelcursos" element={<PanelCursos />} />
      <Route path="/representante" element={<Representante />} />
      <Route path="/representante/estudiantes" element={<ListaEstudiantes />} />
      <Route path="/representante/perfil" element={<VerDatosRepresentante />} />
      <Route path="/representante/password" element={<ChangePassword />} />
      <Route path="/estudiante/perfil" element={<VerDatosEstudiante />} />
      <Route path="/reportes" element={<AgregarFechas />} />

    </Routes>
  )
}

export default Rutas;