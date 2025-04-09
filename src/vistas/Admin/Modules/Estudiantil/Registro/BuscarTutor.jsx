import React, { useState } from 'react';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import axios from 'axios';
import CrearRepresentante from '../Representantes/CrearRepresentante';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import CrearEstudiante from '../Estudiantes/CrearEstudiante';
import '../../../Styles/Inscripcion.css';

function BuscarTutor() {
    const [cedula, setCedula] = useState("");
    const [entityToUpdate, setEntityToUpdate] = useState(null);
    const [modalRepresentante, setModalRepresentante] = useState(false);
    const [modalEstudiante, setModalEstudiante] = useState(false);
    const [buscado, setBuscado] = useState(false);
    const [representante, setRepresentante] = useState(null);
    const [estudiante, setEstudiante] = useState(null);
    const [exist, setExist] = useState(false);
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
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

        return `${day}/${month}/${year}`;
    }
    const handleBuscarRepresentante = async () => {
        setBuscado(true);
        try {
            if (!cedula) {
                setRepresentante(null);
                return;
            }
            const response = await axios.get(`${API_URL}/representante/obtener/${cedula}`);
            setRepresentante(response.data);
            setExist(true);
        } catch (error) {
            if (error.response?.status === 404) {
                setRepresentante(null);
                return;
            }
            ErrorMessage(error);
        }
    };

    const handleSaveRepresentante = (formData) => {
        const formObject = Object.fromEntries(formData.entries());
        setRepresentante(formObject);
        setModalRepresentante(false);
    };

    const handleSaveEstudiante = (formData) => {
        const formObject = Object.fromEntries(formData.entries());
        setEstudiante(formObject);
        setModalEstudiante(false);
    };
    const handleEditEstudiante = (entity) => {
        setEntityToUpdate(entity);
        setModalEstudiante(true);
    };
    const handleEditRepresentante = (entity) => {
        setEntityToUpdate(entity);
        setModalRepresentante(true);
    };
    const toggleModalEstudiante = () => {
        setModalEstudiante((prev) => !prev);
        setEntityToUpdate(null);
    };
    const toggleModalRepresentante = () => {
        setExist(false)
        setCedula("")
        setModalRepresentante((prev) => !prev);
        setEntityToUpdate(null);
    };


    const handleDelete = (type) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar este ${type}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                if (type === 'representante') setRepresentante(null);
                if (type === 'estudiante') setEstudiante(null);
            }
        });
    };

    const handleRegistrar = async () => {
        try {
            if (!exist) {
                await axios.post(`${API_URL}/representante/crear`, representante, { headers: { "Content-Type": "multipart/form-data" } });
            }
            console.log("este es el estudiante antes de guardar", estudiante)
            await axios.post(`${API_URL}/estudiante/crear`, estudiante, { headers: { "Content-Type": "multipart/form-data" } });
            
            Swal.fire({
                icon: "success",
                title: `Estudiante ${estudiante.primer_nombre} ${estudiante.primer_apellido} con su representante ${representante.primer_nombre} ${representante.primer_apellido}`,
                iconColor: "#218838",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#003F89",
            });
            setEstudiante(null);
            setRepresentante(null);
            setBuscado(false);
            setCedula("")
            setExist(false)
        } catch (error) {
            ErrorMessage(error);
        }
    };

    return (
        <div>
            <div className='contenedor-buscar'>
                <div className="buscar-representante">
                    <label htmlFor="cedula">Buscar representante por cédula:</label>
                    <input type="text" id="cedula" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                    <button onClick={handleBuscarRepresentante}>Buscar</button>
                </div>
            </div>
            {modalRepresentante && <CrearRepresentante onCancel={toggleModalRepresentante} onSave={handleSaveRepresentante} entityToUpdate={entityToUpdate} />}
            {!representante && (
                <div className="contenedor-agregar">
                    <button className="agregar-representante" onClick={toggleModalRepresentante}>Agregar representante</button>
                </div>
            )}
            {buscado && !representante && (
                <div>
                    <p className="no-registros">No se encontró el representante.</p>

                </div>
            )}
            {representante && (
                <div>
                    <div className='Contendor-tabla'>
                        <table className="tabla_registros">
                            <thead>
                                <tr>
                                    <th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Email</th><th>Celular</th><th>Acciones</th>
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
                                        {!exist && (<FaEdit className="icon edit-icon" onClick={() => handleEditRepresentante(representante)} />)}

                                        <FaTrash className="icon delete-icon" onClick={() => handleDelete('representante')} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {!estudiante && (
                        <div className="contenedor-agregar">
                            <button className="agregar-representante" onClick={toggleModalEstudiante}>Agregar estudiante</button>
                        </div>
                    )}
                    {modalEstudiante && <CrearEstudiante onCancel={toggleModalEstudiante} onSave={handleSaveEstudiante} representante={representante.nroCedula} entityToUpdate={entityToUpdate} />}
                    {estudiante && (
                        <div>
                            <div className='Contendor-tabla'>
                                <table className="tabla_registros">
                                    <thead>
                                        <tr>
                                            <th>Cédula</th><th>Nombre</th><th>Apellido</th><th>Fecha Nacimiento</th><th>Género</th><th>Jornada</th><th>Acciones</th>
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
                                                <FaEdit className="icon edit-icon" onClick={() => handleEditEstudiante(estudiante)} />
                                                <FaTrash className="icon delete-icon" onClick={() => handleDelete('estudiante')} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='contenedor-botonesFinales'>

                                <div className="botones-finales">
                                    <button onClick={handleRegistrar}>Guardar</button>
                                    <button onClick={() => { setEstudiante(null); setRepresentante(null); setBuscado(false) }}>Cancelar</button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default BuscarTutor;
