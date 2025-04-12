import React, { useState, useEffect } from 'react'
import SolicitudesDocente from './SolicitudesDocente.jsx'
import { useNavigate } from 'react-router-dom';
import Layout from '../../../layout/Layout.jsx';
import Header from '../../../components/Header.jsx';
import { Home } from "lucide-react";
import NotificacionesIcon from './NotificationIconDocente.jsx';
import Loading from '../../../components/Loading.jsx';
import axios from 'axios';


function Index() {
  const [usuario, setUsuario] = useState(null);
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token=localStorage.getItem("token")
  const navigate = useNavigate()
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Profesor") {
      navigate("/")
    }
    setUsuario(parsedUser);
  }, [API_URL, navigate]);
  useEffect(() => {
    axios.get(`${API_URL}/solicitud/obtener/docente/`,{
        headers: { Authorization: `Bearer ${token}` },
      })
    .then(res=>{
        setLoading(false)
        setSolicitudes(res.data)
    })
  }, [])
    const aceptadas = solicitudes.filter(s => s.estado === "Aceptada");
    const rechazadas = solicitudes.filter(s => s.estado === "Rechazada");
    const cantidad = (aceptadas?.length || 0) + (rechazadas?.length || 0);
  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={[
        { name: "Inicio", icon: <Home size={20} />, path: "/inicio" },
        { name: "Solicitudes", icon: <NotificacionesIcon cantidad={cantidad} />, path: "/profesor/solicitudes" },

      ]}>
        {loading ? <Loading /> : <SolicitudesDocente usuario={usuario} solicitudes={solicitudes} setSolicitudes={setSolicitudes}/>}

      </Layout>
    </div>
  )
}

export default Index