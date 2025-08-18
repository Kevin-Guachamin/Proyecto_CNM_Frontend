import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import Layout from '../../../../layout/Layout';
import Loading from "../../../../components/Loading";
import Busqueda from "./Busqueda";
import { useNavigate } from "react-router-dom";
import { modulosRepresentante } from "../../components/ModulosRepresentante";

function Index() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Verificación de autenticación
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
      
    } catch (error) {
      console.log("Error parseando el usuario de localStorage: ", error);
      navigate("/login");
      return; 
    }

    if (!parsedUser) {
      navigate("/login");
      return;
    }

    setUsuario(parsedUser);
    setLoading(false);
  }, [navigate]);

  return (
    <div className="section-container">
      {/* Encabezado */}
      <div className="container-fluid p-0">
        {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      </div>

      <Layout modules={modulosRepresentante}>
        <div className="vista-matriculacion">
          {loading ? (
            <Loading />
          ) : (
            <Busqueda usuario={usuario} />
          )}
        </div>
      </Layout>
    </div>
  )
}

export default Index