import React from 'react'
import Login from '../components/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../vistas/Inicio.jsx';
import Periodos_Academicos from '../vistas/Admin/PeriodosAcedémicos/Index.jsx'
import Calificaciones from '../vistas/Docente/Calificaciones.jsx';
import Asignaguras from "../vistas/Admin/Asignaturas/Index.jsx"
import Docentes from "../vistas/Admin/Docentes/Index.jsx"
import Representante from '../vistas/Representante/index.jsx'
import Representantes from '../vistas/Admin/Representantes/Index.jsx'


function Rutas() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/admin/periodos" element= {<Periodos_Academicos/>}/>
        <Route path="/admin/asignaturas" element= {<Asignaguras/>}/>
        <Route path="/admin/docentes" element= {<Docentes/>}/>
        <Route path="/admin/representantes" element= {<Representantes/>}/>
        <Route path="/calificaciones" element={<Calificaciones/>} />
        <Route path="/representante" element={<Representante/>} />
    </Routes>
  )
}

export default Rutas;