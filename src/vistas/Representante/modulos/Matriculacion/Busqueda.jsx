import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import Horarios from './Horarios';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Busqueda.css';
import { IoEyeOutline } from "react-icons/io5";

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
    const token=localStorage.getItem("token")
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

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

        axios.get(`${API_URL}/asignacion/obtener/materias/${periodo.ID}/${encodeURIComponent(estudiante.nivel)}/${asignatura}/${estudiante.jornada}`,{
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
                setMatricula(newMatricula)
            }
        } catch (error) {
            ErrorMessage(error)
        }

    }
    const obtenerAsignaciones = async () => {
        try {
            const response = await axios.get(`${API_URL}/asignacion/obtener/matricula/${matricula.ID}`,{
                headers: { Authorization: `Bearer ${token}` },
              })
            console.log("este es el response, ", response)
            setInscripciones(response.data)

        } catch (error) {
            ErrorMessage(error)
        }

    }
    const tienenDiasSolapados = (dias1, dias2) => {
        return dias1.some(dia => dias2.includes(dia));
    }

    const tienenHorariosSolapados = (horaInicioA, horaFinA, horaInicioB, horaFinB) => {
        return horaInicioA < horaFinB && horaFinA > horaInicioB;
    }
    const Inscribir = async (asignacion) => {
        try {
            // Primero, verifica si hay conflicto de días + horarios
            const conflicto = inscripciones.some(asig => {
                const hayDiasSolapados = tienenDiasSolapados(asig.dias, asignacion.dias);
                const hayHorarioSolapado = tienenHorariosSolapados(
                    asignacion.horaInicio,
                    asignacion.horaFin,
                    asig.horaInicio,
                    asig.horaFin
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
            obtenerAsignaciones()
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
                                            className="bi bi-pencil-square icono-matricula"
                                            onClick={() => handleEstudianteSeleccionado(estudiante)}
                                            title="Empezar matrícula"
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
                    <label htmlFor="">Ingrese el nombre de la Materia: </label>
                    <input type="text" value={asignatura} onChange={(e) => setAsignatura(e.target.value)} />
                    <button className="btn-buscar-asignaturas" onClick={HandleBuscarAsignaturas}>Buscar</button>
                </div>
                <div className="contenedor-tabla-matricula-asignaciones">
                    {buscarAsignacion ? (
                        asignaciones.length === 0 ? (
                            <p className="sin-registros-matricula">No se encontraron coincidencias</p>
                        ) : (
                            <div className="scroll-tabla-matricula-asignaciones">
                                <table className="tabla-matricula-asignaciones">
                                    <thead>
                                        <tr>
                                            <th className="encabezado-tabla-matricula-asignaciones">Nivel</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Paralelo</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Docente</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Materia</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Días</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Hora Inicio</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Hora Fin</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Cupos disponibles</th>
                                            <th className="encabezado-tabla-matricula-asignaciones">Seleccionar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asignaciones.map((item, index) => (
                                            <tr key={index}>
                                                <td className="celda-tabla-matricula-asignaciones">{item.Materia.nivel}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{item.paralelo}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{`${item.Docente.primer_nombre} ${item.Docente.primer_apellido}`}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{item.Materia.nombre}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{`${item.dias[0]}${item.dias[1] ? `-${item.dias[1]}` : ''}`}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{item.horaInicio}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{item.horaFin}</td>
                                                <td className="celda-tabla-matricula-asignaciones">{item.cupos}</td>
                                                <td className="acciones-tabla-matricula-asignaciones">
                                                    <i 
                                                        className="bi bi-clipboard2-check icono-inscribir"
                                                        onClick={() => Inscribir(item)}
                                                        title="Inscribir"
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : null}
                </div>
            </div>)}
            {inscripciones.length > 0 && (<Horarios asignaciones={inscripciones} />)}

        </div>
    )
}

export default Busqueda