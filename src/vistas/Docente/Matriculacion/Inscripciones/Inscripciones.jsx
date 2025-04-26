import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import { useLocation } from 'react-router-dom';
import { Card, Row, Col } from "react-bootstrap";
import Horario from './Horario';
import { useNavigate } from 'react-router-dom';
import CrearCursoIndividual from '../CrearCursoIndividual';

function Inscripciones({asignaciones,docente, periodo,setAsignaciones}) {
    
    const [inscripciones, setInscripciones] = useState([])
    const [isModalOpen,setIsModalOpen]=useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token")
    const { estudiante, matricula } = location.state || {};

    const obtenerInscripciones = async () => {
        try {
            const response = await axios.get(`${API_URL}/inscripcion/obtener/matricula/${matricula}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("este es el response, ", response)
            setInscripciones(response.data)

        } catch (error) {
            ErrorMessage(error)
        }

    }
    useEffect(() => {
        obtenerInscripciones()
    }, [])


    

    const Inscribir = async (asignacion) => {
        try {
            console.log("esta es la matricula", inscripciones)
            // Primero, verifica si hay conflicto de días + horarios

            await axios.post(`${API_URL}/inscripcion/crear`, {
                ID_matricula: matricula,
                ID_asignacion: asignacion.ID
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
                icon: "success",
                title: "Inscripción exitosa",
                iconColor: "#218838",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#003F89",
            });
            obtenerInscripciones()
           
        } catch (error) {
            ErrorMessage(error);
        }
    }
    const FinalizarMatriculas = () => {
        navigate("/admin/matriculacion")
    }
    const handleCrearAsignacion =(asignacion)=>{
        axios.post(`${API_URL}/asignacion/crear`,asignacion,{
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res=>{
            setAsignaciones((prevData) => [...prevData, res.data]);
                        Swal.fire({
                          icon: "success",
                          title: "Datos creados con éxito",
                          iconColor: "#218838",
                          confirmButtonText: "Entendido",
                          confirmButtonColor: "#003F89",
                        });
                        setIsModalOpen(false);
        })
        .catch(error=>{
            ErrorMessage(error)
        })
    }
    const toggleModal=()=>{
        setIsModalOpen((prev) => !prev);
    }
    return (
        <div className='Contenedor-general'>
            <div>
                <button onClick={toggleModal}>Crear Curso</button>
            </div>
            {isModalOpen && <CrearCursoIndividual onCancel={toggleModal} onSave={handleCrearAsignacion} docente={docente} periodo={periodo.ID}/>}
            <div className="Contenedor-tabla">
                {asignaciones.length === 0 ? (
                <p className="no-registros">No existen registros</p>
                ) : (
                <Row xs={1} md={2} lg={5} className="g-2">
                    {asignaciones.map((asig) => {
                        const nombreCompletoDocente = `${asig.Docente?.primer_nombre}  ${asig.Docente?.primer_apellido} `.trim();
                        return (
                            <Col key={asig.ID} className="d-flex justify-content-center p-1">
                                <Card style={{ maxWidth: "300px", cursor: "pointer", backgroundColor: "#CFD8DC" }} onClick={() => Inscribir(asig)}>
                                    <Card.Body>
                                        <Card.Title>{asig.Materia?.nombre}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            Paralelo:  {asig.paralelo} || Cupos: {asig.cupos}<br />
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <strong>Nivel:</strong> {asig.Materia.nivel} <br />
                                            <strong>Horario:</strong> {asig.horaInicio} - {asig.horaFin} <br />
                                            <strong>Días:</strong> {asig.dias.join(", ")} <br />
                                            <strong>Docente:</strong> {nombreCompletoDocente} <br />
                                        </Card.Text>
                                        <div className="d-flex justify-content-between mt-3">
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
                )
            }
            </div>
            {inscripciones.length > 0 && (
                <div>
                    <Horario materiasSeleccionadas={inscripciones} setMateriasSeleccionadas={setInscripciones} jornada={estudiante.jornada} />

                </div>
            )}
            <div className='container btn-finalizar'>
                <button className="btn-finalizar" onClick={FinalizarMatriculas}>Finalizar</button>
            </div>
        </div>
    )
}

export default Inscripciones