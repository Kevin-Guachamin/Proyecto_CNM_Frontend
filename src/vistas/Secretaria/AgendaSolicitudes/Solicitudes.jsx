import React, { useState, useEffect } from 'react'
import './Solicitudes.css'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje'
import Swal from 'sweetalert2'
ErrorMessage
function Solicitudes({ solicitudes }) {
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([])
  const [solicitudesAceptadas, setSolicitudesAceptadas] = useState([])
  const [solicitudesRechazadas, setSolicitudesRechazadas] = useState([])
  const [vistaActual, setVistaActual] = useState("pendientes");
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token")
  useEffect(() => {
    filtrarSolicitudes();
  }, [solicitudes]);

  const filtrarSolicitudes = () => {
    const pendientes = solicitudes.filter(s => s.estado === "Pendiente");
    const aceptadas = solicitudes.filter(s => s.estado === "Aceptada");
    const rechazadas = solicitudes.filter(s => s.estado === "Rechazada");

    setSolicitudesPendientes(pendientes);
    setSolicitudesAceptadas(aceptadas);
    setSolicitudesRechazadas(rechazadas);
  };
  const handleActualizarEstado = async (id, nuevoEstado) => {
    try {
      const solicitud = solicitudesPendientes.find((s) => s.id === id);
      if (!solicitud) return;
      solicitud.estado = nuevoEstado
      // Actualizamos el estado local (y podrías también enviar al backend si quieres)
      const nuevaSolicitud = await axios.put(`${API_URL}/solicitud/editar/${id}`, solicitud
        , {
          headers: { Authorization: `Bearer ${token}` },
        })

      // Quitar de pendientes
      const nuevasPendientes = solicitudesPendientes.filter((s) => s.id !== id);
      setSolicitudesPendientes(nuevasPendientes);

      // Agregar al estado correspondiente
      if (nuevoEstado === "aceptada") {
        setSolicitudesAceptadas((prev) => [...prev, nuevaSolicitud]);
      } else if (nuevoEstado === "rechazada") {
        setSolicitudesRechazadas((prev) => [...prev, nuevaSolicitud]);
      }
    } catch (error) {
      ErrorMessage(error)
    }

  };
  const handleEliminarSolicitud = (id) => {
    // Aquí puedes hacer una petición al backend o simplemente filtrar del estado
    axios.delete(`${API_URL}/solicitud/eliminar/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      Swal.fire({
        icon: "success",
        title: "Eliminado!",
        text: `La solicitud de ${res.data.Docente.primer_nombre} ${res.data.Docente.primer_apellido} ha sido eliminada.`,
        iconColor: "#218838",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#003F89",
      }
      );
      if (vistaActual === "aceptadas") {
        setSolicitudesAceptadas(prev => prev.filter(s => s.id !== id));
      } else if (vistaActual === "rechazadas") {
        setSolicitudesRechazadas(prev => prev.filter(s => s.id !== id));
      }
    })
    .catch(err=>{
      ErrorMessage(err)
    })

  };
  const renderizarLista = () => {
    let lista = [];
    if (vistaActual === "pendientes") lista = solicitudesPendientes;
    else if (vistaActual === "aceptadas") lista = solicitudesAceptadas;
    else lista = solicitudesRechazadas;

    if (lista.length === 0) {
      return <p className="mensaje-vacio">No hay solicitudes {vistaActual}.</p>;
    }

    return (
      <ul className="lista-solicitudes">
        {lista.map((s) => (
          <li key={s.id} className="item-solicitud">
            <span><strong>Profesor:</strong> {s.profesor}</span>
            <span><strong>Motivo:</strong> {s.motivo}</span>
            <span><strong>Fecha:</strong> {s.fecha}</span>

            {vistaActual === "pendientes" ? (
              <div className="acciones-solicitud">
                <button onClick={() => handleActualizarEstado(s.id, "aceptada")} className="btn-aceptar">Aceptar</button>
                <button onClick={() => handleActualizarEstado(s.id, "rechazada")} className="btn-rechazar">Rechazar</button>
              </div>
            ) : (
              <div className="acciones-solicitud">
                <button onClick={() => handleEliminarSolicitud(s.id)} className="btn-eliminar">Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };


  return (
    <div className="contenedor-solicitudes">
      <h2 className="titulo">Gestión de Solicitudes</h2>

      <div className="botones-filtro">
        <button onClick={() => setVistaActual("pendientes")} className={vistaActual === "pendientes" ? "activo" : ""}>
          Pendientes ({solicitudesPendientes.length})
        </button>
        <button onClick={() => setVistaActual("aceptadas")} className={vistaActual === "aceptadas" ? "activo" : ""}>
          Aceptadas ({solicitudesAceptadas.length})
        </button>
        <button onClick={() => setVistaActual("rechazadas")} className={vistaActual === "rechazadas" ? "activo" : ""}>
          Rechazadas ({solicitudesRechazadas.length})
        </button>
      </div>

      <div className="contenedor-lista">
        {renderizarLista()}
      </div>
    </div>
  );

}

export default Solicitudes