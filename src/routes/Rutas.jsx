import React from 'react'
import Login from '../components/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../vistas/Inicio.jsx';
import Admin from '../vistas/Admin/Index.jsx'
import Calificaciones from '../vistas/Calificaciones.jsx';
import Representante from '../vistas/Representante/index.jsx'

function Rutas() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/admin" element= {<Admin/>}/>
        <Route path="/calificaciones" element={<Calificaciones/>} />
        <Route path="/representante" element={<Representante/>} />
    </Routes>
  )
}

export default Rutas;