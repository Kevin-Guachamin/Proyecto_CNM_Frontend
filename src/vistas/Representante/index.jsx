import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Modulo from "../../components/Modulo";
import Layout from "../../layout/containers/Layout";

const Index = () => {
  const  navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modulos] = useState([
    { id: 1, titulo: "Información representante", icono: "📄", link: "/representante/perfil" },
    { id: 2, titulo: "Información estudiantil", icono: "✏️", link: "/representante/estudiantes" },
  ]);

  useEffect(() => {
    setUsuario({primer_nombre: "Maria", primer_apellido: "Rodriguez", rol: "Representante"});
  }, []);
  
  const handleModuloClick = (modulo) => {
    setLoading(true);
    setTimeout(() => {
      navigate(modulo.link, {
        state: { nroCedula: '0102030405'}
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
