import React from 'react'
import Login from '../vistas/Login/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../vistas/Inicio.jsx';
import Periodos_Academicos from '../vistas/Admin/PeriodosAcedémicos/Index.jsx'
import Calificaciones from '../vistas/Docente/Calificaciones.jsx';
import Asignaguras from "../vistas/Admin/Asignaturas/Index.jsx"
import Docentes from "../vistas/Admin/Docentes/Index.jsx"
import Representante from '../vistas/Representante/index.jsx'
import Estudiantes from '../vistas/Admin/Estudiantes/Index.jsx'
import PanelCursos from '../vistas/PanelCursos.jsx';
import Admin from '../vistas/Admin/inicio.jsx'
import Cursos from '../vistas/Admin/Cursos/Index.jsx'
import Busqueda from '../vistas/Admin/Matriculación/Index.jsx';
import Horarios from '../vistas/Admin/Matriculación/Horarios.jsx'
import Inscripcion from '../vistas/Admin/Inscripcion/Index.jsx'
import Representantes from '../vistas/Admin/Representantes/Index.jsx'
import AgregarFechas from '../vistas/Vicerrector/AgregarFechas.jsx';



function Rutas() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path='/admin' element={<Admin/>}/>
        <Route path="/admin/periodos" element= {<Periodos_Academicos/>}/>
        <Route path="/admin/asignaturas" element= {<Asignaguras/>}/>
        <Route path="/admin/docentes" element= {<Docentes/>}/>
        <Route path="/admin/estudiantes" element= {<Estudiantes/>}/>
        <Route path='/admin/cursos' element= {<Cursos/>} />
        <Route path='/admin/matriculacion' element= {<Busqueda/>} />
        <Route path='/admin/horarios' element= {<Horarios/>} />
        <Route path='/admin/inscripcion' element= {<Inscripcion/>} />
        <Route path='/admin/representantes' element= {<Representantes/>} />
        <Route path="/calificaciones" element={<Calificaciones/>} />
        <Route path="/panelcursos" element={<PanelCursos/>} />
        <Route path="/representante" element={<Representante/>} />
        <Route path="/reportes" element={<AgregarFechas/>} />
    </Routes>
  )
}

export default Rutas;