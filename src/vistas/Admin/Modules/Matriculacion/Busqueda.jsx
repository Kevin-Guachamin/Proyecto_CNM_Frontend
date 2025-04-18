import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ErrorMessage } from '../../../../Utils/ErrorMesaje';
import Horarios from './Horarios';
import Swal from 'sweetalert2';
import BuscarEstudiante from '../../../components/BuscarEstudiante';
import InfoEstudiante from '../Estudiantil/Estudiantes/InfoEstudiante';
import '../../../components/BuscarEstudiante.css'
import { useNavigate } from 'react-router-dom';

function Busqueda() {
    const [periodo, setPeriodo] = useState("")
    const [cedula, setCedula] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    
    
    const [matricula, setMatricula] = useState("")
   
    
    const token = localStorage.getItem("token")
    const navigate=useNavigate()

    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    useEffect(() => {

        axios.get(`${API_URL}/periodo_academico/activo`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setPeriodo(response.data);
            })
            .catch(error => {
                ErrorMessage(error)

            });
    }, [API_URL, token]);
    
    const HandleMatricular = async () => {
            try {
                const response = await axios.get(`${API_URL}/matricula/estudiante/periodo/${estudiante.ID}/${periodo.ID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
        
                let dataMatricula = response.data;
        
                if (!dataMatricula) {
                    const newMatriculaResponse = await axios.post(`${API_URL}/matricula/crear`, {
                        nivel: estudiante.nivel,
                        estado: "En curso",
                        ID_estudiante: estudiante.ID,
                        ID_periodo_academico: periodo.ID
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    dataMatricula = newMatriculaResponse.data;
                }
        
                setMatricula(dataMatricula); // Actualizas el estado por si necesitas luego
                console.log("esta es la dataMatricula",dataMatricula)
                navigate('/admin/buscar_materias', {
                    state: { periodo, estudiante, matricula: dataMatricula.ID }
                });
        
            } catch (error) {
                ErrorMessage(error);
            }
        };
    
    return (
        <div className='Contenedor-general' >
            <h1 className="periodo-title">{`Periodo académico activo ${periodo.descripcion}`}</h1>
            <BuscarEstudiante estudiante={estudiante} setEstudiante={setEstudiante} setBuscado={setBuscado} cedula={cedula} setCedula={setCedula} />
            <div className="Contenedor-tabla">
                {buscado && !estudiante && (
                    <p className="no-registros">No se encontró el estudiante.</p>
                )}
                {estudiante && (
                    <div>
                        <InfoEstudiante estudiante={estudiante} />
                        <button className="btn-buscar" onClick={HandleMatricular}>
                            Empezar matrícula
                        </button>
                    </div>

                )}
            </div>

        </div>
    )
}

export default Busqueda