import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje'
import BuscarEstudiante from '../../components/BuscarEstudiante'
import InfoEstudiante from '../../Admin/Modules/Estudiantil/Estudiantes/InfoEstudiante'
import MatriculaIndividual from './MatriculaIndividual'
import Swal from 'sweetalert2'

function Busqueda({ docente }) {
    const [periodo, setPeriodo] = useState("")
    const [cedula, setCedula] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const token = localStorage.getItem("token")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idAsignacion, setIdAsignacion] = useState("")
    console.log("este es el docente", docente)
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
    const HandleMatricular = async (asignacion) => {
        setIsModalOpen(false)
        try {
            console.log("esta es el estudiante", estudiante)
            const matricula = await axios.get(`${API_URL}/matricula/estudiante/periodo/${estudiante.ID}/${periodo.ID}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("esto es la asignacion", asignacion)
            if (idAsignacion) {
                const oldAsignacion = await axios.get(`${API_URL}/asignacion/obtener/${idAsignacion}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                console.log("este fue por cruze", oldAsignacion)
                if (oldAsignacion) {
                    axios.put(`${API_URL}/asignacion/editar/${idAsignacion}`, asignacion, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                }
            }


            const newAsignacion = await axios.post(`${API_URL}/asignacion/crear`, asignacion, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setBuscado(newAsignacion.data.ID)
            await axios.post(`${API_URL}/inscripcion/crear`, { ID_asignacion: newAsignacion.data.ID, ID_matricula: matricula.data.ID }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            Swal.fire({
                icon: "success",
                title: "Inscripción exitosa",
                iconColor: "#218838",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#003F89",
            });


        } catch (error) {
            ErrorMessage(error)
            console.log(error)
        }
    }
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);

    };


    return (
        <div className='Contenedor-general' >
            <h1 className="periodo-title">{`Periodo académico activo ${periodo.descripcion}`}</h1>
            <BuscarEstudiante estudiante={estudiante} setEstudiante={setEstudiante} setBuscado={setBuscado} cedula={cedula} setCedula={setCedula} />
            {isModalOpen && <MatriculaIndividual docente={docente} periodo={periodo.ID} onSave={HandleMatricular} onCancel={toggleModal} />}
            <div className="Contenedor-tabla">
                {buscado && !estudiante && (
                    <p className="no-registros">No se encontró el estudiante.</p>
                )}
                {estudiante && (
                    <div>
                        <InfoEstudiante estudiante={estudiante} />
                        <button className="btn-buscar" onClick={toggleModal}>
                            Empezar matrícula
                        </button>
                    </div>

                )}
            </div>

        </div>
    )
}

export default Busqueda