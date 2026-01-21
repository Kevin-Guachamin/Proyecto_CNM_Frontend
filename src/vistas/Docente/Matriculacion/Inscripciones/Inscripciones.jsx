import React, { useState, useEffect, useRef } from 'react'
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

    // Refs para el manejo responsivo
    const wrapRef = useRef(null);
    const footerRef = useRef(null);
    const isInitialLoad = useRef(true);

    // Cálculo de altura para el contenedor principal
    useEffect(() => {
        const setMatricHeight = () => {
            const wrap = wrapRef.current;
            if (!wrap) return;

            const rect = wrap.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const availableHeight = viewportHeight - rect.top;
            const minHeight = window.innerWidth <= 768 ? 200 : 300;
            const finalHeight = Math.max(availableHeight - 20, minHeight);
            
            document.documentElement.style.setProperty('--matric-h', `${finalHeight}px`);
        };

        const timeout1 = setTimeout(setMatricHeight, 50);
        const timeout2 = setTimeout(setMatricHeight, 200);

        const onResize = () => {
            clearTimeout(window.matricResizeTimeout);
            window.matricResizeTimeout = setTimeout(() => {
                setMatricHeight();
            }, 100);
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, { passive: true });

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(window.matricResizeTimeout);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onResize);
        };
    }, [asignaciones, inscripciones]);

    // Calcular altura del footer para reservar espacio
    useEffect(() => {
        const setFooterHeight = () => {
            const h = footerRef.current ? footerRef.current.offsetHeight : 0;
            const paddedHeight = h > 0 ? h + 16 : 0;
            document.documentElement.style.setProperty('--footer-h', `${paddedHeight}px`);
        };
        
        const timeout = setTimeout(setFooterHeight, 50);

        const ro = new ResizeObserver(() => {
            clearTimeout(window.footerResizeTimeout);
            window.footerResizeTimeout = setTimeout(setFooterHeight, 100);
        });
        
        if (footerRef.current) ro.observe(footerRef.current);

        return () => {
            clearTimeout(timeout);
            clearTimeout(window.footerResizeTimeout);
            ro.disconnect();
        };
    }, [inscripciones]);

    // Asegurar que el botón sea visible cuando se agregue una nueva inscripción
    useEffect(() => {
        // Solo hacer scroll si se agregó una inscripción recientemente
        // No hacer scroll en la carga inicial
        if (inscripciones.length > 0 && footerRef.current && wrapRef.current) {
            if (!isInitialLoad.current) {
                // Si no es la carga inicial, hacer scroll hacia abajo para mostrar el botón
                setTimeout(() => {
                    const wrapper = wrapRef.current;
                    if (wrapper) {
                        wrapper.scrollTop = wrapper.scrollHeight;
                    }
                }, 200);
            } else {
                // Marcar que ya pasó la carga inicial
                isInitialLoad.current = false;
            }
        }
    }, [inscripciones.length]); // Cambiar dependencia a solo la longitud

    // Asegurar que al cargar el componente siempre empiece arriba
    useEffect(() => {
        if (wrapRef.current) {
            wrapRef.current.scrollTop = 0;
        }
    }, []); // Solo en mount

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
        Swal.fire({
                    icon: "success",
                    title: `Matricula con exitosa`,
                    iconColor: "#218838",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#003F89",
                });
        navigate("/profesor/matricula")
    }
    const handleCrearAsignacion =(asignacion)=>{
        console.log("esta es la asignacion a crear",asignacion)
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
        <div ref={wrapRef} className="matric-wrapper">
            <div className="matric-content">
                {/* Botones de control */}
                <div className="matric-filtros">
                    <div className='container_btn-finalizar'>
                        <button className='boton-add' onClick={toggleModal}>Crear Curso</button>
                    </div>
                </div>

                {isModalOpen && <CrearCursoIndividual onCancel={toggleModal} onSave={handleCrearAsignacion} docente={docente} periodo={periodo.ID}/>}
                
                {/* Resultados (cards) */}
                <div className="matric-cards">
                    {asignaciones.length === 0 ? (
                        <p className="no-registros">No existen cursos libres para este docente</p>
                    ) : (
                        <Row xs={1} md={2} lg={5} className="g-2">
                            {asignaciones.map((asig) => {
                                console.log("esta es la asignacion", asig)
                                const nombreCompletoDocente = `${asig.Docente?.primer_nombre}  ${asig.Docente?.primer_apellido} `.trim();
                                return (
                                    <Col key={asig.ID} className="d-flex justify-content-center p-1">
                                        <Card style={{ maxWidth: 300, cursor: "pointer", backgroundColor: "#CFD8DC" }} onClick={() => Inscribir(asig)}>
                                            <Card.Body>
                                                <Card.Title>{asig.Materia?.nombre}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    Paralelo:  {asig.paralelo} || Cupos: {asig.cupos}
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    <strong>Nivel:</strong> {asig.Materia.nivel} <br />
                                                    <strong>Horario día 1:</strong> {asig.horaInicio} - {asig.horaFin} <br />
                                                    <strong>Horario día 2:</strong> {asig.hora1} - {asig.hora2} <br />
                                                    <strong>Días:</strong> {asig.dias.join(", ")} <br />
                                                    <strong>Docente:</strong> {nombreCompletoDocente}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>

                {/* Horario (con scroll horizontal cuando haga falta) */}
                <div className="matric-horario">
                    {inscripciones.length > 0 && (
                        <Horario 
                            materiasSeleccionadas={inscripciones} 
                            setMateriasSeleccionadas={setInscripciones} 
                            jornada={estudiante.jornada}
                            nivel={estudiante.nivel}
                        />
                    )}
                </div>
            </div>

            {/* Botón final - ahora sticky */}
            {inscripciones.length > 0 && (
                <div ref={footerRef} className='matric-footer'>
                    <button className="btn-finalizar" onClick={FinalizarMatriculas}>Finalizar</button>
                </div>
            )}
        </div>
    )
}

export default Inscripciones