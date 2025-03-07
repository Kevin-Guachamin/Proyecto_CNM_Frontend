import React, { useState, useEffect } from "react";
import Layout from '../../layout/containers/Layout';
import { Home, Users, Settings, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { div } from 'framer-motion/client';
import Header from "../../components/Header";


function Index() {
  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState(null);

  // Simulación de usuario ficticio mientras se conecta con el backend
  useEffect(() => {
    // Aquí se realizará la petición al backend cuando esté disponible
    // axios.get("URL_DEL_BACKEND/usuarioConectado", { headers: { Authorization: `Bearer ${TOKEN}` } })
    //   .then(response => {
    //     setUsuario(response.data); // Guardar la información del usuario en el estado
    //   })
    //   .catch(error => {
    //     console.error("Error al obtener los datos del usuario:", error);
    //   });

    // Mientras no se conecte al backend, dejamos un usuario de prueba
    setUsuario({ nombre: "Maria Pérez", rol: "Representante" });
  }, []);
    
    const modules = [
        { name: "Inicio", icon: <Home size={20} /> },
        { name: "Usuarios", icon: <Users size={20} /> },
        { name: "Configuración", icon: <Settings size={20} /> },
    ];
    return(
        <div>
            {/* Encabezado */}
            <div className="container-fluid p-0">
            {usuario && <Header isAuthenticated={true} usuario={usuario} />}
            </div>

            <Layout modules = {modules}>

            </Layout>
        </div>
    )
}

export default Index