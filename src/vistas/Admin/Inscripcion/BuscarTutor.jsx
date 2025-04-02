import React, { useState } from 'react'
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import axios from 'axios';
import CrearRepresentante from '../Representantes/CrearRepresentante';

function BuscarTutor() {
    const [cedula, setCedula] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buscado, setBuscado] = useState(false); // Estado para saber si ya se buscó
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const [representante, setRepresentante] = useState("")

    const handlenroCedulaChange = (e) => {
        // Remover caracteres no numéricos
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        // Permitir solo hasta 10 dígitos
        if (onlyNumbers.length <= 10) {
            setCedula(onlyNumbers);
        }
    };
    const handleSaveEntity = (newDocente,headers) => {
        axios
          .post(`${API_URL}/representante/crear`, newDocente,headers)
          .then((res) => {
            console.log("este llego de la base despues de crear",res.data)
            setRepresentante(res.data);
            setIsModalOpen(false); // Cerrar el modal
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
      };
    const HandleBuscarRepresentante = async () => {
        setBuscado(true)
        try {
            if (!cedula) {
                return
            }
            const response = await axios.get(`${API_URL}/representante/obtener/${cedula}`);
            setRepresentante(response)

        } catch (error) {
            ErrorMessage(error);

        }
    }
    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
        
      };
    return (
        <div>
            <div>
                <label htmlFor="">Buscar representante por cédula</label>
                <input type="text" value={cedula} onChange={handlenroCedulaChange} />
                <button onClick={HandleBuscarRepresentante}>Buscar</button>

            </div>
            {isModalOpen && (
            <CrearRepresentante
              onCancel={toggleModal}
              onSave={handleSaveEntity}
            />
      )}
            <div className="Contendor-tabla">
                {buscado && !representante && (
                    <div>
                        <p className="no-registros">No se encontró el representante.</p>
                        <button onClick={toggleModal}> Agrear representante</button>
                    </div>
                )}

                {representante && (
                    <table className="tabla_registros">
                        <thead>
                            <tr>
                                <th>Cédula</th>
                                <th>Primer nombre</th>
                                <th>Primer apellido</th>
                                <th>Email</th>
                                <th>Celular</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{representante.nroCedula}</td>
                                <td>{representante.primer_nombre}</td>
                                <td>{representante.primer_apellido}</td>
                                <td>{representante.email}</td>
                                <td>{representante.celular}</td>

                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    )
}

export default BuscarTutor