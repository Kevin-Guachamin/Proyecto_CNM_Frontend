import React from 'react'
import Login from '../components/Login.jsx';
import { Routes, Route } from 'react-router-dom';
import Inicio from '../vistas/Inicio.jsx';
import Admin from '../vistas/Admin/Index.jsx'

function Rutas() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path='/admin' element= {<Admin/>}/>
    </Routes>
  )
}

export default Rutas