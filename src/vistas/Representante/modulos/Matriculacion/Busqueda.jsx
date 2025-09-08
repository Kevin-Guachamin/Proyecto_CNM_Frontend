import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import Horarios from './Horarios';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Busqueda.css';
import { IoEyeOutline } from "react-icons/io5";
import { Card, Row, Col } from 'react-bootstrap';

function Busqueda({usuario}) {
    const [periodo, setPeriodo] = useState("")
    const [cedula, setCedula] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const [asignaciones, setAsignaciones] = useState([])
    const [asignatura, setAsignatura] = useState(null)
    const [matricula, setMatricula] = useState("")
    const [inscripciones, setInscripciones] = useState([])
    const [buscarAsignacion, setBucarAsignacion] = useState(false);
    const [estudiantesRepresentante, setEstudiantesRepresentante] = useState(null)
    const [periodoMatriculaActivo, setPeriodoMatriculaActivo] = useState(true)
    const [mensajePeriodo, setMensajePeriodo] = useState("")
    const [fechasMatricula, setFechasMatricula] = useState({ inicio: null, fin: null })
    const token=localStorage.getItem("token")
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

    // Función para formatear fechas evitando problemas de zona horaria
    const formatearFecha = (fechaIso) => {
        if (!fechaIso) return '';
        const fecha = new Date(`${fechaIso}T00:00:00`); // evita desfase por zona horaria
        return fecha.toLocaleDateString('es-EC', {
            day: '2-digit',
            month: '2-digit',  
            year: 'numeric'
        });
    };

    // Verificar período de matrícula al cargar el componente
    useEffect(() => {
        const verificarPeriodoMatricula = async () => {
            try {
                const response = await axios.get(`${API_URL}/fechas_procesos/matricula`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPeriodoMatriculaActivo(response.data.periodoActivo);
                setMensajePeriodo(response.data.mensaje);
                
                // Guardar las fechas del período
                if (response.data.fechaInicioPeriodo && response.data.fechaFinPeriodo) {
                    setFechasMatricula({
                        inicio: response.data.fechaInicioPeriodo,
                        fin: response.data.fechaFinPeriodo
                    });
                }
            } catch (error) {
                console.log('Error al verificar período de matrícula:', error);
                setPeriodoMatriculaActivo(false);
                setMensajePeriodo('No se pudo verificar el período de matrícula');
            }
        };
        verificarPeriodoMatricula();
    }, []);

    useEffect(() => {

        axios.get(`${API_URL}/periodo_academico/activo`,{
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(response => {
                setPeriodo(response.data);
            })
            .catch(error => {
                ErrorMessage(error)

            });
    }, [API_URL,token]);



    function calcularEdad(fechaNacimiento) {

        let fechaNac = fechaNacimiento; // Convertir la fecha a objeto Date
        let hoy = new Date();

        let edad = hoy.getFullYear() - fechaNac.getFullYear(); // Restar años

        // Ajustar si aún no ha pasado el cumpleaños este año
        let mesActual = hoy.getMonth();
        let diaActual = hoy.getDate();
        let mesNac = fechaNac.getMonth();
        let diaNac = fechaNac.getDate();

        if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
            edad--;
        }

        return edad;
    }
    const convertirFecha = (fecha) => {
        if (!fecha) return null;
        const [dia, mes, año] = fecha.split('/');
        return new Date(`${año}-${mes}-${dia}`); // Convertir a formato ISO (yyyy-mm-dd)
    };
    const handlenroCedulaChange = (e) => {
        // Remover caracteres no numéricos
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        // Permitir solo hasta 10 dígitos
        if (onlyNumbers.length <= 10) {
            setCedula(onlyNumbers);
        }
    };

    const HandleBuscarEstudiante = async () => {
        setBuscado(true)
        setEstudiante(null)
        setMatricula(null)
        try {
            if (!cedula) {
                return
            }
            const response = await axios.get(`${API_URL}/estudiante/obtener/${cedula}`,{
                headers: { Authorization: `Bearer ${token}` },
              });
            setEstudiante(response.data)


        } catch (error) {
            ErrorMessage(error);

        }
    }
    const HandleBuscarAsignaturas = () => {
        setBucarAsignacion(true)

        // Si no se ingresa nada, enviar 'all' para obtener todas las materias
        const busquedaMateria = asignatura && asignatura.trim() !== '' ? asignatura : 'all';

        axios.get(`${API_URL}/asignacion/obtener/materias/${periodo.ID}/${encodeURIComponent(estudiante.nivel)}/${busquedaMateria}/${estudiante.jornada}`,{
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => {
                setAsignaciones(response.data)
            })
            .catch((error) => {
                ErrorMessage(error)
            }
            )
    }
    const HandleMatricular = async (estudiante) => {

        try {
            const response = await axios.get(`${API_URL}/matricula/estudiante/periodo/${estudiante.ID}/${periodo.ID}`,{
                headers: { Authorization: `Bearer ${token}` },
              })
            console.log("este es el response, ", response)
            setMatricula(response.data)
            if (!response.data) {
                const newMatricula = await axios.post(`${API_URL}/matricula/crear`, { nivel: estudiante.nivel, estado: "En curso", ID_estudiante: estudiante.ID, ID_periodo_academico: periodo.ID },{
                    headers: { Authorization: `Bearer ${token}` },
                  })
                setMatricula(newMatricula.data)
                // Limpiar inscripciones para nueva matrícula
                setInscripciones([])
            } else {
                // Cargar inscripciones existentes
                await obtenerInscripciones(response.data.ID)
            }
        } catch (error) {
            ErrorMessage(error)
        }

    }

    const obtenerInscripciones = async (matriculaId) => {
        try {
            const response = await axios.get(`${API_URL}/inscripcion/obtener/matricula/${matriculaId}`,{
                headers: { Authorization: `Bearer ${token}` },
            })
            setInscripciones(response.data)
        } catch (error) {
            ErrorMessage(error)
        }
    }

    const retirarInscripcion = async (asignacion) => {
        try {
            // Buscar la inscripción correspondiente
            const inscripcionARetirar = inscripciones.find(inscripcion => 
                inscripcion.Asignacion && inscripcion.Asignacion.ID === asignacion.ID
            );

            if (!inscripcionARetirar) {
                throw new Error("No se encontró la inscripción a retirar");
            }

            await axios.delete(`${API_URL}/inscripcion/eliminar/${inscripcionARetirar.ID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire({
                icon: "success",
                title: "Inscripción retirada",
                text: `Se ha retirado la inscripción de ${asignacion.Materia?.nombre}`,
                iconColor: "#28a745",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#003F89",
            });

            // Recargar inscripciones y materias disponibles
            await obtenerInscripciones(matricula.ID);
            HandleBuscarAsignaturas();
        } catch (error) {
            ErrorMessage(error);
        }
    };
    const tienenDiasSolapados = (dias1, dias2) => {
        // Asegurar que ambos arrays existen y no están vacíos
        if (!dias1 || !dias2 || !Array.isArray(dias1) || !Array.isArray(dias2)) {
            return false;
        }
        
        return dias1.some(dia => dias2.includes(dia));
    }

    const tienenHorariosSolapados = (horaInicioA, horaFinA, horaInicioB, horaFinB) => {
        // Convertir horarios a formato comparable (asumiendo formato HH:MM)
        const convertirHora = (hora) => {
            if (typeof hora === 'string') {
                const [horas, minutos] = hora.split(':').map(Number);
                return horas * 60 + minutos; // Convertir a minutos
            }
            return 0;
        };
        
        const inicioA = convertirHora(horaInicioA);
        const finA = convertirHora(horaFinA);
        const inicioB = convertirHora(horaInicioB);
        const finB = convertirHora(horaFinB);
        
        return inicioA < finB && finA > inicioB;
    }

    const Inscribir = async (asignacion) => {
        // Verificar si el período de matrícula está activo
        if (!periodoMatriculaActivo) {
            Swal.fire({
                icon: "warning",
                title: "Período de matrícula inactivo",
                text: mensajePeriodo,
                iconColor: "#f39c12",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#3085d6"
            });
            return;
        }

        try {
            // Primero, verificar si ya está inscrito en esta misma asignación
            const yaInscrito = inscripciones.some(inscripcion => {
                const asignacionExistente = inscripcion.Asignacion;
                return asignacionExistente && asignacionExistente.ID === asignacion.ID;
            });

            if (yaInscrito) {
                Swal.fire({
                    icon: "warning",
                    title: "Ya inscrito",
                    text: "El estudiante ya está inscrito en esta materia",
                    iconColor: "#f39c12",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#003F89",
                });
                return;
            }
            
            // Luego, verifica si hay conflicto de días + horarios con OTRAS asignaciones
            const conflicto = inscripciones.some(inscripcion => {
                // Acceder a los datos de la asignación dentro de la inscripción
                const asignacionExistente = inscripcion.Asignacion;
                if (!asignacionExistente || asignacionExistente.ID === asignacion.ID) return false;
                
                const hayDiasSolapados = tienenDiasSolapados(asignacionExistente.dias, asignacion.dias);
                const hayHorarioSolapado = tienenHorariosSolapados(
                    asignacion.horaInicio,
                    asignacion.horaFin,
                    asignacionExistente.horaInicio,
                    asignacionExistente.horaFin
                );

                return hayDiasSolapados && hayHorarioSolapado;
            });

            if (conflicto) {
                throw new Error("Inscripcion no valida por cruze de horarios")
            }
            await axios.post(`${API_URL}/inscripcion/crear`, {
                ID_matricula: matricula.ID,
                ID_asignacion: asignacion.ID
            },{
                headers: { Authorization: `Bearer ${token}` },
              });
            Swal.fire({
                icon: "success",
                title: "Inscripción exitosa",
                iconColor: "#218838",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#003F89",
            });
            // Recargar inscripciones y materias disponibles
            await obtenerInscripciones(matricula.ID)
            HandleBuscarAsignaturas()
        } catch (error) {
            ErrorMessage(error);
        }
    }

    const getEstudiantesRepresentante = async () => {
        try {
            const { data: respuestaEstudiantes } = await axios.get(`${API_URL}/api/representantes/${usuario.nroCedula}/estudiantes`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setEstudiantesRepresentante(respuestaEstudiantes);
        } catch (error) {
            console.log("No se pudo obtener los estudiantes a cargo del representante", error);
        }
    };

    const handleEstudianteSeleccionado = (estudiante) => {
        setEstudiante(estudiante);
        HandleMatricular(estudiante);
    }

    const handleVolverModulos = () => {
        navigate('/representante'); // Usa el navigate ya definido
    }

    useEffect(() => {
        if (!usuario) {
            return;
        }
        getEstudiantesRepresentante();
    }, [usuario]);



    return (
        <div className='contenedor-busqueda'>
            <h1 className='periodo-title'>{`Periodo académico activo ${periodo.descripcion}`}</h1>
            
            {/* Alerta general de período inactivo */}
            {!periodoMatriculaActivo && (
                <div className="alerta-periodo-global">
                    <div className="alerta-header">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <h3>Matrícula no disponible</h3>
                    </div>
                    <div className="alerta-content">
                        <p className="mensaje-principal">{mensajePeriodo}</p>
                        {fechasMatricula.inicio && fechasMatricula.fin && (
                            <p className="fechas-periodo">
                                <strong>Período de matrícula:</strong> {formatearFecha(fechasMatricula.inicio)} - {formatearFecha(fechasMatricula.fin)}
                            </p>
                        )}
                        <p className="instrucciones">Para realizar matrículas, contacte con la administración del conservatorio.</p>
                    </div>
                </div>
            )}
            <div className="contenedor-tabla-matricula-estudiantes">
                {!estudiantesRepresentante && (
                    <p className="sin-registros-matricula">No se encontraron estudiantes.</p>
                )}

                {estudiantesRepresentante && (
                    <div className="scroll-tabla-matricula-estudiantes">
                        <table className="tabla-matricula-estudiantes">
                            <thead>
                                <tr>
                                    <th className="encabezado-tabla-matricula-estudiantes">Cédula</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Primer nombre</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Primer apellido</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Edad</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Género</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Jornada</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Nivel</th>
                                    <th className="encabezado-tabla-matricula-estudiantes">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                               {estudiantesRepresentante.map((estudiante, index) => (
                                    <tr key={index}>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.nroCedula}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.primer_nombre}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.primer_apellido}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{calcularEdad(convertirFecha(estudiante.fecha_nacimiento))}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.genero}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.jornada}</td>
                                    <td className="celda-tabla-matricula-estudiantes">{estudiante.nivel}</td>
                                    <td className="acciones-tabla-matricula-estudiantes">
                                        <i 
                                            className={`bi bi-pencil-square ${periodoMatriculaActivo ? 'icono-matricula' : 'icono-matricula-deshabilitado'}`}
                                            onClick={() => periodoMatriculaActivo && handleEstudianteSeleccionado(estudiante)}
                                            title={periodoMatriculaActivo ? "Empezar matrícula" : "Período de matrícula inactivo"}
                                        ></i>
                                    </td>
                                </tr>
                               ))} 
                            </tbody>
                        </table>
                    </div>

                )}
            </div>
            {matricula && (<div>
                <div className='contenedor-busqueda-asignaturas'>
                    <label htmlFor="">Ingrese el nombre de la Materia (opcional - dejar vacío para ver todas): </label>
                    <input 
                        type="text" 
                        value={asignatura || ''} 
                        onChange={(e) => setAsignatura(e.target.value)} 
                        placeholder="Ej: Piano, Violín, etc. (opcional)"
                    />
                    <button 
                        className="btn-buscar-asignaturas" 
                        onClick={HandleBuscarAsignaturas}
                        disabled={!periodoMatriculaActivo}
                        title={!periodoMatriculaActivo ? "Período de matrícula inactivo" : "Buscar materias"}
                    >
                        Buscar
                    </button>
                </div>
                
                {/* Mensaje sobre el estado del período de matrícula */}
                {!periodoMatriculaActivo && (
                    <div className="alerta-periodo-matricula">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div className="mensaje-periodo">
                            <span className="mensaje-principal">{mensajePeriodo}</span>
                            {fechasMatricula.inicio && fechasMatricula.fin && (
                                <span className="fechas-periodo">
                                    Período de matrícula: {formatearFecha(fechasMatricula.inicio)} - {formatearFecha(fechasMatricula.fin)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="matric-cards">
                    {buscarAsignacion ? (
                        asignaciones.length === 0 ? (
                            <p className="no-registros">No se encontraron coincidencias</p>
                        ) : (
                            <Row xs={1} md={2} lg={5} className="g-2">
                                {asignaciones.map((asig) => {
                                    const nombreDoc = `${asig.Docente?.primer_nombre || ''} ${asig.Docente?.primer_apellido || ''}`.trim();
                                    return (
                                        <Col key={asig.ID} className="d-flex justify-content-center p-1">
                                            <Card
                                                style={{ 
                                                    maxWidth: 300, 
                                                    cursor: periodoMatriculaActivo ? "pointer" : "not-allowed", 
                                                    backgroundColor: periodoMatriculaActivo ? "#CFD8DC" : "#f0f0f0",
                                                    opacity: periodoMatriculaActivo ? 1 : 0.6
                                                }}
                                                onClick={() => periodoMatriculaActivo && Inscribir(asig)}
                                            >
                                                <Card.Body>
                                                    <Card.Title>{asig.Materia?.nombre}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        Paralelo: {asig.paralelo} || Cupos: {asig.cupos}
                                                    </Card.Subtitle>
                                                    <Card.Text>
                                                        <strong>Nivel:</strong> {asig.Materia?.nivel} <br />
                                                        <strong>Horario:</strong> {asig.horaInicio} - {asig.horaFin} <br />
                                                        <strong>Días:</strong> {asig.dias?.join(", ")} <br />
                                                        <strong>Docente:</strong> {nombreDoc}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )
                    ) : null}
                </div>
            </div>)}
            {inscripciones.length > 0 && (
                <Horarios 
                    asignaciones={inscripciones.map(insc => insc.Asignacion).filter(Boolean)} 
                    onRetirarInscripcion={retirarInscripcion}
                />
            )}

        </div>
    )
}

export default Busqueda