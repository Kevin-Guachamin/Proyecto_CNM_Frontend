import React, { useState, useEffect } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import Parcial from "./Parcial";
import Quimestral from "./Quimestral";
import Final from "./Final";
import Header from "../components/Header";
import Layout from "../layout/containers/Layout";
import { Home, Users, Settings } from "lucide-react";
import "./Calificaciones.css";

function Calificaciones() {
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
    setUsuario({ nombre: "Juan Pérez", rol: "Estudiante" });
  }, []);

  const modules = [
      { name: "Inicio", icon: <Home size={20} /> },
      { name: "Usuarios", icon: <Users size={20} /> },
      { name: "Configuración", icon: <Settings size={20} /> },
    ];

    return (
      <>
        {/* Encabezado */}
        <div className="container-fluid p-0">
          {usuario && <Header isAuthenticated={true} usuario={usuario} />}
        </div>
    
        {/* Layout */}
        <Layout modules={modules}>
          {/* Contenido Principal */}
          <div className="content-container">
            <Container className="mt-4">
              <h2 className="text-center mb-4">Gestión de Calificaciones</h2>
              <Tabs defaultActiveKey="quimestre1" id="calificaciones-tabs" className="mb-3" fill>
                {/* 🔹 Quimestre 1 */}
                <Tab eventKey="quimestre1" title="Quimestre 1">
                  <Tabs defaultActiveKey="parcial1-quim1" className="mb-3" fill>
                    <Tab eventKey="parcial1-quim1" title="Parcial 1 - Quim 1">
                      <Parcial />
                    </Tab>
                    <Tab eventKey="parcial2-quim1" title="Parcial 2 - Quim 1">
                      <Parcial />
                    </Tab>
                    <Tab eventKey="quimestre1" title="Quimestre 1">
                      <Quimestral />
                    </Tab>
                  </Tabs>
                </Tab>
    
                {/* 🔹 Quimestre 2 */}
                <Tab eventKey="quimestre2" title="Quimestre 2">
                  <Tabs defaultActiveKey="parcial1-quim2" className="mb-3" fill>
                    <Tab eventKey="parcial1-quim2" title="Parcial 1 - Quim 2">
                      <Parcial />
                    </Tab>
                    <Tab eventKey="parcial2-quim2" title="Parcial 2 - Quim 2">
                      <Parcial />
                    </Tab>
                    <Tab eventKey="quimestre2" title="Quimestre 2">
                      <Quimestral />
                    </Tab>
                  </Tabs>
                </Tab>
    
                {/* 🔹 Nota Final */}
                <Tab eventKey="notaFinal" title="Nota Final">
                  <Final />
                </Tab>
              </Tabs>
            </Container>
          </div>
        </Layout>
      </>
    );
  }

export default Calificaciones;