import React, { useState, useEffect } from 'react'
import Solicitudes from './Solicitudes.jsx'
import { useNavigate } from 'react-router-dom';
import Layout from '../../../layout/Layout.jsx';
import Header from '../../../components/Header.jsx';
import { ObtenerTodo } from '../../../Utils/CRUD/ObjetenerTodo.jsx';
import Loading from '../../../components/Loading.jsx';
import { getModulos, transformModulesForLayout } from '../../getModulos.jsx';
import { useAuth } from '../../../Utils/useAuth';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';

function Index() {
  // Protección de ruta para Vicerrector
  const auth = useAuth("Vicerrector");
  
  // Si no está autenticado, mostrar mensaje de error
  if (!auth.isAuthenticated) {
    return <ErrorMessage message="No tienes permisos para acceder a esta página" />;
  }

  const [usuario, setUsuario] = useState(null);
  const [modules, setModules] = useState([]);
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const navigate = useNavigate()
  
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser || parsedUser.subRol !== "Vicerrector") {
      navigate("/")
    }
    setUsuario(parsedUser);
    // Configurar módulos del Vicerrector
    setModules(transformModulesForLayout(getModulos(parsedUser.subRol, true)));
  }, [API_URL, navigate]);
  
  useEffect(() => {
    ObtenerTodo(setSolicitudes, `${API_URL}/solicitud/obtener`, setLoading)
  }, [])
  const pendientes = solicitudes.filter(s => s.estado === "Pendiente");
  
  const handleSidebarNavigation = (path) => {
    setLoading(true);
    setTimeout(() => navigate(path), 800);
  };

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>
      <Layout modules={modules} onNavigate={handleSidebarNavigation}>
        {loading ? <Loading /> : <Solicitudes solicitudes={solicitudes} setSolicitudes={setSolicitudes} />}
      </Layout>
    </div>
  )
}

export default Index