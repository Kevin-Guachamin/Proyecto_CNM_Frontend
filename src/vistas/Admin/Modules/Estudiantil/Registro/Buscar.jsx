import React, { useState } from 'react'
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import axios from 'axios';
import CrearRepresentante from '../Representantes/CrearRepresentante';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import Swal from 'sweetalert2';
import CrearEstudiante from '../Estudiantes/CrearEstudiante';;
import '../Styles/Inscripcion.css'

function BuscarTutor() {
    const [cedula, setCedula] = useState("")
    const [entityToUpdate, setEntityToUpdate] = useState(null);
    const [modalRepresentante, setModalRepresentante] = useState(false);
    const [modalEstudiante, setModalEstudiante] = useState(false)
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const [representante, setRepresentante] = useState("")
    const [formRepresentante, setFormRepresentante] = useState("")
    const [formEstudiante, setFormEstudiante] = useState("")
    const [estudiante, setEstudiante] = useState("")
    const [exist, setExist] = useState(false)

    function formatDate(date) {
        // Si el valor es una cadena, lo convertimos a un objeto Date
        if (typeof date === "string") {
            date = new Date(date);
        }

        // Verificamos que sea un objeto Date válido
        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error("Invalid date");
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexed
        const year = date.getFullYear();

        return ${day}/${month}/${year};
    }
    const handlenroCedulaChange = (e) => {
        // Remover caracteres no numéricos
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        // Permitir solo hasta 10 dígitos
        if (onlyNumbers.length <= 10) {
            setCedula(onlyNumbers);
        }
    };
    const handleSaveRepresentante = (formData) => {

        setFormRepresentante(formData)
        const formObject = {};

        // Convertir FormData en un objeto
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        setRepresentante(formObject);
        setModalRepresentante(false); // Cerrar el modal
    };

    const handleEditEstudiante = (entity) => {
        setEntityToUpdate(entity);
        setModalEstudiante(true);
    };
    const handleEditRepresentante = (entity) => {
        setEntityToUpdate(entity);
        setModalRepresentante(true);
    };
    const handleSaveEstudiante = (formData) => {
        setFormEstudiante(formData)
        const formObject = {};

        // Convertir FormData en un objeto
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        setEstudiante(formObject);
        setModalEstudiante(false); // Cerrar el modal       
    }
        ;
    const handleDeleteEstudiante = (estudiante) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: ¿Quieres eliminar a ${estudiante.primer_nombre} ${estudiante.primer_apellido}?,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setEstudiante();
            }
        });
    };
    const handleDeleteRepresentante = (representante) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: ¿Quieres eliminar a ${representante.primer_nombre} ${representante.primer_apellido}?,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setRepresentante();
            }
        });
    };
    const HandleBuscarRepresentante = async () => {
        setBuscado(true)
        try {
            if (!cedula) {
                setRepresentante()
                return
            }
            const response = await axios.get(${API_URL}/representante/obtener/${cedula});
            setRepresentante(response.data)
            setExist(true)

        } catch (error) {

            if (error.status == 404) {

                setRepresentante()
                return
            }
            ErrorMessage(error)
        }
    }
    const toggleModalEstudiante = () => {
        setModalEstudiante((prev) => !prev);
        setEntityToUpdate(null);
    };
    const toggleModalRepresentante = () => {
        setModalRepresentante((prev) => !prev);
        setEntityToUpdate(null);
    };

    const HandleRegistrar = async () => {
        try {
            let representanteData = representante;

            // Si no existe el representante, primero lo creamos
            if (!exist) {
                const res1 = await axios.post(${API_URL}/representante/crear, formRepresentante, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                representanteData = res1.data;
            }

            // Crear el estudiante usando los datos del representante (existente o nuevo)
            const res2 = await axios.post(${API_URL}/estudiante/crear, formEstudiante, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire(
                "Registro exitoso!",
                ${res2.data.primer_nombre} ${res2.data.primer_apellido} con representante ${representanteData.primer_nombre} ${representanteData.primer_apellido},
                "success"
            );

            // Resetear los formularios y estados
            setEstudiante(null);
            setRepresentante(null);
            setFormEstudiante(null);
            setFormRepresentante(null);
            setBuscado(false);
        } catch (error) {
            ErrorMessage(error);
            console.log(error);
        }
    };

    const HandleCancelar = () => {
        setEstudiante()
        setRepresentante()
    }
    return (
        <div>
            <div className='contenedor-buscar'>
                <div className="buscar-representante">
                    <label htmlFor="cedula">Buscar representante por cédula:</label>
                    <input type="text" id="cedula" value={cedula} onChange={handlenroCedulaChange} />
                    <button onClick={HandleBuscarRepresentante}>Buscar</button>
                </div>
            </div>
            {modalRepresentante && (
                <CrearRepresentante
                    onCancel={toggleModalRepresentante}
                    onSave={handleSaveRepresentante}
                    entityToUpdate={entityToUpdate}
                />
            )}
            {!representante && (
                <div className="contenedor-agregar">
                    <button className="agregar-representante" onClick={toggleModalRepresentante}>
                        Agregar representante
                    </button>
                </div>
            )}
            <div className="Tablas">
                {buscado && !representante && (
                    <div>
                        <p className="no-registros">No se encontró el representante.</p>

                    </div>
                )}

                {representante && (

                    <div>
                        {console.log("este es el representante", representante)}
                        <div className='Contenedor-tabla'>
                            <table className="tabla_registros">
                                <thead>
                                    <tr>
                                        <th>Cédula</th>
                                        <th>Primer nombre</th>
                                        <th>Primer apellido</th>
                                        <th>Email</th>
                                        <th>Celular</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{representante.nroCedula}</td>
                                        <td>{representante.primer_nombre}</td>
                                        <td>{representante.primer_apellido}</td>
                                        <td>{representante.email}</td>
                                        <td>{representante.celular}</td>
                                        <td>
                                            <FaEdit
                                                className="icon edit-icon"
                                                onClick={() => handleEditRepresentante(representante)}
                                                title='editar'
                                            />
                                            <FaTrash
                                                className="icon delete-icon"
                                                onClick={() => handleDeleteRepresentante(representante)}
                                                title='eliminar'
                                            />
                                        </td>

                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        {!estudiante && (<div className="contenedor-agregar">
                            <button className="agregar-representante" onClick={toggleModalEstudiante}>
                                Agregar estudiante
                            </button>
                        </div>)}

                        {modalEstudiante && (
                            <CrearEstudiante
                                onCancel={toggleModalEstudiante}
                                onSave={handleSaveEstudiante}
                                entityToUpdate={entityToUpdate}
                                representante={representante.nroCedula}
                            />
                        )}

                        {estudiante && (

                            <div>

                                <div className='Contenedor-tabla'>
                                    <table className="tabla_registros">
                                        <thead>
                                            <tr>
                                                <th>Cédula</th>
                                                <th>Primer nombre</th>
                                                <th>Primer apellido</th>
                                                <th>Fecha Nacimiento</th>
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
                                                <td>{formatDate(estudiante.fecha_nacimiento)}</td>
                                                <td>{estudiante.genero}</td>
                                                <td>{estudiante.jornada}</td>
                                                <td>
                                                    <FaEdit
                                                        className="icon edit-icon"
                                                        onClick={() => handleEditEstudiante(estudiante)}
                                                    />
                                                    <FaTrash
                                                        className="icon delete-icon"
                                                        onClick={() => handleDeleteEstudiante(estudiante)}
                                                    />
                                                </td>

                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <button onClick={HandleRegistrar}>Confirmar registro</button>
                                <button onClick={HandleCancelar}> Cancelar</button>
                            </div>
                        )}

                    </div>

                )}

            </div>

        </div>
    )
}

export default BuscarTutor