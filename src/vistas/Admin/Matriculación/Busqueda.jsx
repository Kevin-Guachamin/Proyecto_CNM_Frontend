import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje';


function Busqueda() {
    const [periodo, setPeriodo] = useState("")
    const [cedula, setCedula] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const [asignaciones, setAsignaciones] = useState([])
    const [asignatura, setAsignatura] = useState("")
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    useEffect(() => {

        axios.get(`${API_URL}/periodo_academico/activo`)
            .then(response => {
                setPeriodo(response.data);
            })
            .catch(error => {
                ErrorMessage(error)

            });
    }, [API_URL]);


    function calcularEdad(fechaNacimiento) {
        console.log("esta fue la fecha", fechaNacimiento)
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
        try {
            if (!cedula) {
                return
            }
            const response = await axios.get(`${API_URL}/estdudiante/obtener/${cedula}`);
            setEstudiante(response)

        } catch (error) {
            ErrorMessage(error);

        }
    }
    const HandleBuscarAsignaturas = () => {
        axios.get(`${API_URL}/asignacion/obtener/materias/${periodo}/${estudiante.nivel}/${asignatura}`)
            .then((response) => {
                setAsignaciones(response.data)
            })
            .catch((error) => {
                ErrorMessage(error)
            }
            )
    }
    return (
        <div>
            <h1>{`Periodo académico activo ${periodo.descripcion}`}</h1>
            <div>
                <label htmlFor="">Buscar estudiante por cédula</label>
                <input type="text" value={cedula} onChange={handlenroCedulaChange} />
                <button onClick={HandleBuscarEstudiante}>Buscar</button>

            </div>
            <div className="Contendor-tabla">
                {buscado && !estudiante && (
                    <p className="no-registros">No se encontró el estudiante.</p>
                )}

                {estudiante && (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Primer nombre</th>
                                <th>Primer apellido</th>
                                <th>Edad</th>
                                <th>Género</th>
                                <th>Jornada</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{estudiante.nroCedula}</td>
                                <td>{estudiante.primer_nombre}</td>
                                <td>{estudiante.primer_apellido}</td>
                                <td>{calcularEdad(convertirFecha(estudiante.fecha_nacimiento))}</td>
                                <td>{estudiante.genero}</td>
                                <td>{estudiante.jornada}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
            <label htmlFor="">Ingrese el nombre de la Materia</label>
            <input type="text" />
            <button onClick={HandleBuscarAsignaturas}>Buscar</button>
            <div className="Contendor-tabla">
                {asignaciones.length === 0 ? (
                    <p className="no-registros">No se encontraron coincidencias</p>
                ) : (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th>Nivel</th>
                                <th>Paraleo</th>
                                <th>Docente</th>
                                <th>Materia</th>
                                <th>Días</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Cupos disponibles</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignaciones.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.Materia.nivel}</td>
                                    <td>{item.paralelo}</td>
                                    <td>{`${item.Docente.primer_nombre} ${item.Docente.primer_apellido}`}</td>
                                    <td>{item.Materia.nombre}</td>
                                    <td>{`${item.dias[0]}${item.dias[1] ? `-${item.dias[1]}` : ''}`}</td>
                                    <td>{item.horaInicio}</td>
                                    <td>{item.horaFin}</td>
                                    <td>{item.cuposDisponibles}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}



            </div>
        </div>
    )
}

export default Busqueda