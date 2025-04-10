import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Tabla from '../Representante/components/Tabla_Representante';
import Header from "../../components/Header";
import Modulo from "../../components/Modulo";
import Layout from "../../layout/Layout"; // antes "../../layout/components/Layout"
import { RiLockPasswordFill } from "react-icons/ri";

const Index = () => {
  const  navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modulos] = useState([
    { id: 1, titulo: "Información representante", icono: "📄", link: "/representante/perfil" },
    { id: 2, titulo: "Información estudiantil", icono: "✏️", link: "/representante/estudiantes" },
    { id: 3, titulo: "Cambiar contraseña", icono: <RiLockPasswordFill  size={40}/>, link: "/representante/password"},
    { id: 4, titulo: "Matriculación", icono: "📝",  link: ""}
  ]);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } 
  }, []);
  
  const handleModuloClick = (modulo) => {
    setLoading(true);
    setTimeout(() => {
      navigate(modulo.link, {
        state: { nroCedula: usuario.nroCedula}
      }); // accedes a la propiedad link del objeto
    }, 800);
  };

  return(
    <div>
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout showSidebar={false}> 
        <Modulo modulos={modulos} onModuloClick={handleModuloClick} />
      </Layout>
    
    </div> 
  );
};

export default Index;
