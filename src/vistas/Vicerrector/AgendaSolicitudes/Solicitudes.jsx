import React, { useState, useEffect } from 'react'
import './Solicitudes.css'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje'
import Swal from 'sweetalert2'
import EstablecerPlazos from './EstablecerPlazos'
import { Card, Row, Col } from "react-bootstrap";

function Solicitudes({ solicitudes }) {
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([])
  const [solicitudesAceptadas, setSolicitudesAceptadas] = useState([])
  const [solicitudesRechazadas, setSolicitudesRechazadas] = useState([])
  const [vistaActual, setVistaActual] = useState("pendientes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setID] = useState("")
  const [estado, setEstado] = useState("")
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token")
  useEffect(() => {
    filtrarSolicitudes();
  }, [solicitudes]);
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);

  };
  function formatearFechaLegible(fechaISO) {
    const [año, mes, dia] = fechaISO.split("-");
    const fecha = new Date(año, mes - 1, dia); // construye fecha en local sin zona horaria UTC
    return fecha.toLocaleDateString("es-EC", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  const handlePlazos = (id, estado) => {
    setID(id)
    setEstado(estado)
    setIsModalOpen(true);
  };
  const filtrarSolicitudes = () => {
    const pendientes = solicitudes.filter(s => s.estado === "Pendiente");
    const aceptadas = solicitudes.filter(s => s.estado === "Aceptada");
    const rechazadas = solicitudes.filter(s => s.estado === "Rechazada");

    setSolicitudesPendientes(pendientes);
    setSolicitudesAceptadas(aceptadas);
    setSolicitudesRechazadas(rechazadas);
  };
  const handleActualizarEstado = async (id, nuevoEstado, fecha_inicio, fecha_fin) => {
    setIsModalOpen(false)
    try {
      const solicitud = solicitudesPendientes.find((s) => s.ID === id);
      console.log("esta es la solicitud", solicitudes)
      if (!solicitud) return;
      if (nuevoEstado === "Aceptada") {
        solicitud.estado = nuevoEstado
        solicitud.fecha_inicio = fecha_inicio
        solicitud.fecha_fin = fecha_fin
      }
      else {
        solicitud.estado = nuevoEstado
      }
      console.log("este es el ID", id)
      // Actualizamos el estado local (y podrías también enviar al backend si quieres)
      const nuevaSolicitud = await axios.put(`${API_URL}/solicitud/editar/${id}`, solicitud
        , {
          headers: { Authorization: `Bearer ${token}` },
        })

      // Quitar de pendientes

      setSolicitudesPendientes((prev) => prev.filter(s => s.ID !== id));

      // Agregar al estado correspondiente
      if (nuevoEstado === "Aceptada") {
        setSolicitudesAceptadas((prev) => [...prev, nuevaSolicitud.data]);
      } else if (nuevoEstado === "Rechazada") {
        setSolicitudesRechazadas((prev) => [...prev, nuevaSolicitud.data]);
      }
    } catch (error) {
      ErrorMessage(error)
    }

  };
  const handleEliminarSolicitud = (id) => {
    // Aquí puedes hacer una petición al backend o simplemente filtrar del estado
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar esta solicitud?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
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
            setSolicitudesAceptadas(prev => prev.filter(s => s.ID !== id));
          } else if (vistaActual === "rechazadas") {
            setSolicitudesRechazadas(prev => prev.filter(s => s.ID !== id));
          }
        })
          .catch(err => {
            ErrorMessage(err)
          })

      };
    })
  }
  const renderizarLista = () => {
    let lista = [];
    if (vistaActual === "pendientes") lista = solicitudesPendientes;
    else if (vistaActual === "aceptadas") lista = solicitudesAceptadas;
    else lista = solicitudesRechazadas;

    if (lista.length === 0) {
      return <p className="mensaje-vacio">No hay solicitudes {vistaActual}.</p>;
    }

    return (
      <Row xs={1} sm={2} md={2} lg={3} xl={4} className="g-4">
        {lista.map((s) => {
          return (
            <Col key={s.ID}>
              <Card>
                <Card.Body>
                  <Card.Title>{`${s.Docente.primer_nombre} ${s.Docente.primer_apellido}`}</Card.Title>

                  <Card.Text className='solicitudes-card-texto'>
                    <strong>Fecha:</strong> {formatearFechaLegible(s.fechaSolicitud)} <br />
                    <strong>Motivo:</strong> {s.motivo} <br />

                    {vistaActual === "aceptadas" && (
                      <>
                        <strong style={{ color: "black" }}>PLAZO ESTABLECIDO</strong> <br />
                        <strong>Fecha inicio:</strong> {s.fecha_inicio} <br />
                        <strong>Fecha fin:</strong> {s.fecha_fin} <br />
                      </>
                    )}
                  </Card.Text>

                  {/* ✅ Este bloque ya no está dentro de un <p> */}
                  <div className="acciones-solicitud">
                    {vistaActual === "pendientes" ? (
                      <>
                        <button onClick={() => handlePlazos(s.ID, "Aceptada")} className="btn-aceptar">Aceptar</button>
                        <button onClick={() => handleActualizarEstado(s.ID, "Rechazada")} className="btn-rechazar">Rechazar</button>
                      </>
                    ) : (
                      <button onClick={() => handleEliminarSolicitud(s.ID)} className="btn-eliminar">Eliminar</button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
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
      {isModalOpen && <EstablecerPlazos onSave={handleActualizarEstado} onCancel={toggleModal} id={id} estado={estado} />}
      <div className="contenedor-lista">
        {renderizarLista()}
      </div>
    </div>
  );

}

export default Solicitudes