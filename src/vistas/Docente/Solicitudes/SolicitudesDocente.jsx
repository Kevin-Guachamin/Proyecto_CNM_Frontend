import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje'
import BotonAdd from '../../../components/BotonAdd'
import CrearSolicitud from './CrearSolicitud'
import { Card, Row, Col } from "react-bootstrap";

function SolicitudesDocente({ usuario, solicitudes, setSolicitudes }) {
    const [solicitudesPendientes, setSolicitudesPendientes] = useState([])
    const [solicitudesAceptadas, setSolicitudesAceptadas] = useState([])
    const [solicitudesRechazadas, setSolicitudesRechazadas] = useState([])
    const [vistaActual, setVistaActual] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token")

    useEffect(() => {
        filtrarSolicitudes();
    }, [solicitudes]);
    function formatearFechaLegible(fechaISO) {
        const fecha = new Date(fechaISO);

        return fecha.toLocaleString("es-EC", {
            weekday: "long",     // sábado
            year: "numeric",     // 2025
            month: "long",       // abril
            day: "numeric",      // 12
            hour: "2-digit",     // 14
            minute: "2-digit",   // 58
            hour12: false,       // formato 24h
        });
    }
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);

    };
    const SaveSolicitud = (solicitud) => {
        axios.post(`${API_URL}/solicitud/crear`, solicitud, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res => {
                setIsModalOpen(false)
                setSolicitudes((prevData) => [...prevData, res.data]);
                Swal.fire({
                    icon: "success",
                    title: "Solicitud creada con éxito",
                    iconColor: "#218838",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#003F89",
                });
            }))
            .catch(err => {
                ErrorMessage(err)
            })

    }
    const filtrarSolicitudes = () => {
        const pendientes = solicitudes.filter(s => s.estado === "Pendiente");
        const aceptadas = solicitudes.filter(s => s.estado === "Aceptada");
        const rechazadas = solicitudes.filter(s => s.estado === "Rechazada");

        setSolicitudesPendientes(pendientes);
        setSolicitudesAceptadas(aceptadas);
        setSolicitudesRechazadas(rechazadas);
    };

    const handleEliminarSolicitud = (id) => {
        // Aquí puedes hacer una petición al backend o simplemente filtrar del estado
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Si la elimina no podra cambiar notas`,
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
            return <p className="mensaje-vacio">No hay solicitudes.</p>;
        }

        return (
            <Row xs={1} md={2} lg={5} className="solicitudes-card">
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

                                        <div className="acciones-solicitud">
                                            <button onClick={() => handleEliminarSolicitud(s.ID)} className="btn-eliminar">Eliminar</button>
                                        </div>

                                    </Card.Text>
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
            {isModalOpen && <CrearSolicitud nroCedula={usuario.nroCedula} onSave={SaveSolicitud} onCancel={toggleModal} />}

            <div className="contenedor-lista">
                {renderizarLista()}
            </div>
            <div className='boton-crear-solicitud'>
                <BotonAdd onClick={toggleModal} />
            </div>
        </div>
    );
}

export default SolicitudesDocente