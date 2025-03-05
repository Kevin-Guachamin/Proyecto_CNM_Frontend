import React, { useState, useEffect } from "react";
import axios from "axios"; // Importar Axios cuando conectes al backend
import Modulo from "../components/Modulo";
import Header from "../components/Header";

const Inicio = () => {
  const [modulos, setModulos] = useState([
    { id: 1, titulo: "Información Estudiantil", icono: "📄" },
    { id: 2, titulo: "Matriculación", icono: "✏️" },
    { id: 3, titulo: "Calificaciones", icono: "📊" }, // Alternativa: 🎯, ⭐, 🎓
  ]);

  // Estado para almacenar la información del usuario conectado
  const [usuario, setUsuario] = useState(null);

  // Simulación de usuario ficticio mientras se conecta con el backend
  // Cuando se conecte al backend, este estado será actualizado con los datos reales
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

  return (
    <div>
      {/* Mostramos el header solo si hay un usuario autenticado */}
      {usuario && <Header isAuthenticated={true} usuario={usuario} />}
      <h2 style={{ textAlign: "left", marginLeft: "20px" }}>Módulos</h2>
      <Modulo modulos={modulos} />
    </div>
  );
};

export default Inicio;
