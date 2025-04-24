
import React, { useState, useEffect } from 'react';
import '../../../Styles/CrearEntidad.css';
import "react-datepicker/dist/react-datepicker.css";
import InfoRepresentante from './InfoRepresentante';
import InfoEstudiante from './InfoEstudiante';
import axios from 'axios';
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje';
import CrearRepresentante from '../Representantes/CrearRepresentante'
import Swal from 'sweetalert2';

function ViewData({ estudiante }) {
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token = localStorage.getItem("token")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [representante, setRepresentante] = useState("")

  useEffect(() => {
    const obtenerRepresentante = async () => {
      try {
        const response = await axios.get(`${API_URL}/representante/obtener/${estudiante.nroCedula_representante}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRepresentante(response.data)
      } catch (error) {
        ErrorMessage(error);
      }
    };

    obtenerRepresentante();
  }, []);
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  }
  const handleActualizar = (newRepresentante) => {
    axios.put(`${API_URL}/representante/editar/${representante.nroCedula}`, newRepresentante, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setIsModalOpen(false)
        setRepresentante(res.data)
        Swal.fire({
          icon: "success",
          title: "Actualización de datos exitosa",
          iconColor: "#218838",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#003F89",
        });
      })
      .catch(err => {
        ErrorMessage(err)
      })
  }
  return (
    <div className="contenedor-detalle-estudiante">
      <InfoEstudiante estudiante={estudiante} />
      {isModalOpen && <CrearRepresentante onCancel={toggleModal} entityToUpdate={representante} onSave={handleActualizar} />}
      <InfoRepresentante representante={representante} />
      <div >
        <button className='btn-buscar' onClick={toggleModal}>Actualizar representante</button>
      </div>
    </div>
  );
}

export default ViewData