import React, { useState } from 'react'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import { useNavigate } from 'react-router-dom';

function Busqueda() {
    const navigate=useNavigate()
    const [cedula, setCedula] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

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
    const handleNavigate = ()=>{
        const encodedEstudiante = encodeURIComponent(JSON.stringify(estudiante)); 
        navigate(`/admin/horarios/?estudiante=${encodedEstudiante}`);
    }
    const HandleBuscar = async () => {
        setBuscado(true)
        try {
            if (!cedula) {
                return
            }
            const response = await axios.get(`${API_URL}/estdudiante/${cedula}`);
            setEstudiante(response)

        } catch (error) {
            ErrorMessage(error);

        }
    }
    return (
        <div>
            <div>
                <label htmlFor="">Buscar estudiante por cédula</label>
                <input type="text" value={cedula} onChange={handlenroCedulaChange} />
                <button onClick={HandleBuscar}>Buscar</button>

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
                                <th>Acciones</th>
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
                                <td>
                                    <button onClick={handleNavigate}>Seleccionar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Busqueda