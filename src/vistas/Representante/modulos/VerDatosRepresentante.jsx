import { useState } from "react";
import axios from "axios";
import ViewData from "../../Admin/Estudiantes/ViewData";
import Header from "../../../components/Header";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerDatosRepresentante = () => {
  const [representante, setRepresentante] = useState([]);
  const location = useLocation();
  const nroCedulaRepresentante = location.state?.nroCedula;
  const [mostrarModal, setMostrarModal] = useState(true);
  const navigate = useNavigate();

  const cargarDatosRepresentante = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:8000/representante/obtener/${nroCedulaRepresentante}`)
      setRepresentante(respuesta.data);
    } catch (error) {
      console.error('Error al obtener datos de representante: ', error);
    }
  }

  const OnCancel = () => {
    setMostrarModal(false); // Oculta el modal
    navigate(-1); // regresa a la pagina anterior
  }

  useEffect(() => {
    cargarDatosRepresentante();
  }, []);

  return (
    <div>
      <div className="container-fluid p-0">
        {representante && <Header isAuthenticated={true} usuario={representante} />}
      </div>
      <ViewData entity={representante} onCancel={OnCancel}></ViewData>
    </div>
  );
}

export default VerDatosRepresentante;