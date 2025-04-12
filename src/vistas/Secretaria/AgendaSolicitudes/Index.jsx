import React, { useState, useEffect } from 'react'
import Solicitudes from './Solicitudes.jsx'
import { useNavigate } from 'react-router-dom';
import Layout from '../../../layout/Layout.jsx';
import Header from '../../../components/Header.jsx';
import { Home } from "lucide-react";
import NotificacionesIcon from './NotificacionesIcon.jsx';
import { ObtenerTodo } from '../../../Utils/CRUD/ObjetenerTodo.jsx';
import Loading from '../../../components/Loading.jsx';

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const navigate = useNavigate()
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Secretaria") {
      navigate("/")
    }
    setUsuario(parsedUser);
  }, [API_URL, navigate]);
  useEffect(() => {
    ObtenerTodo(setSolicitudes, `${API_URL}/solicitud/obtener`, setLoading)
  }, [])
  
  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={[
        { name: "Inicio", icon: <Home size={20} />, path: "/inicio" },
        { name: "Solicitudes", icon: <NotificacionesIcon />, path: "/secretaria/solicitudes" },

      ]}>
        {loading ? <Loading /> : <Solicitudes solicitudes={solicitudes} />}

      </Layout>
    </div>
  )
}

export default Index