import { useState } from "react";
import axios from "axios";
import ViewData from "../../Admin/Modules/Estudiantil/Estudiantes/ViewData";
import Header from "../../../components/Header";
import Boton from "../../../components/Boton";
import Loading from "../../../components/Loading";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerDatosRepresentante = () => {
	const [representante, setRepresentante] = useState([]);
	const location = useLocation();
	const [mostrarModal, setMostrarModal] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const [nroCedula, setNroCedula] = useState(""); // Inicializar con cadena vacia si es que hay valores undefined 
	const [primer_nombre, setPrimerNombre] = useState("");
	const [celular, setCelular] = useState("");
	const [primer_apellido, setPrimerApellido] = useState("");
	const [segundo_nombre, setSegundoNombre] =  useState("");
	const [segundo_apellido, setSegundoApellido] = useState("");
	const [convencional, setConvencional] = useState("");
	const [emergencia, setEmergencia] = useState(""); 
	const [email, setEmail] = useState("");
	// Falta cedulaPDF y croquisPDF
	
	// Variables para habilitar o deshabilitar la actualizacion de datos
	const [fechaInicio, setFechaInicio] = useState("");
	const [fechaFin, setFechaFIn] = useState("");
	const [dentroDeRango, setDentroDeRango] = useState("");

  /*
    OJO FALTA COMPROBAR EL FUNCIONAMIENTO CON LOS ARCHIVOS PDFS SUBIDOS
  */

  if (isLoading) { 
    <Loading></Loading>
  }

  useEffect(() => {
   if (representante) {
      setNroCedula(representante.nroCedula || ""); // Set cadena vacia en caso de que haya un dato undefined
      setPrimerNombre(representante.primer_nombre || "");
      setCelular(representante.celular || "");
      setPrimerApellido(representante.primer_apellido || "");
      setSegundoNombre(representante.segundo_nombre || "");
      setSegundoApellido(representante.segundo_apellido || "");
      setConvencional(representante.convencional || "");
      setEmergencia(representante.emergencia || "");
      setEmail(representante.email || "");
      // Falta cedulaPDF y croquisPDF
    } 
  }, [representante]);

  const cargarDatosRepresentante = async () => {
    try {
      setIsLoading(true);
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) {
        setRepresentante(JSON.parse(usuarioGuardado));
      }
	    const token = localStorage.getItem("token");
	    const baseURL = import.meta.env.VITE_URL_DEL_BACKEND;
	    const headers = {
		    headers: {
			    Authorization: `Bearer ${token}`
		    }
	    }
	

	    // Obtener la fecha actual del servidor
	    const fechaActual = await axios.get(
		    `${baseURL}/fechas_procesos/fecha_actual`,
		    headers
	    );
      // Obtener las fechas rango de la API para la actualizacion
	const fechaActualizacionDatos = await axios.get(
		`${baseURL}/fechas_procesos/actualizacion`,
		headers
	);
	    console.log(fechaActualizacionDatos);
	    console.log('Fecha actual: ', fechaActual);

    } catch (error) {
      setIsLoading(false);
      console.error('Error al obtener datos de representante: ', error);
    }
  }

  const OnCancel = () => {
    setMostrarModal(false); // Oculta el modal
    navigate(-1); // regresa a la pagina anterior
  }

  const handleSubmit = () => {
    // Se deben actualizar datos si es que la fecha lo permite
    // Comprobar si la fecha actual esta dentro de las fechas limite para actualizar datos

    // Comprobar que en la logica del servidor tambien verifique la hora para rechazar o validar la
    // peticion de actualizacion
  }

  const handleConfirmacion = () => {

  }

 /*  
////////////////////////////////////////////////////////

function MyComponent({ startDate, endDate }) {
  // startDate y endDate vienen del servidor, por ejemplo:
  // startDate = "2025-04-15T08:00:00Z"
  // endDate   = "2025-04-20T18:00:00Z"

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const nowLocal = new Date();

  // Para UX: bloqueo si el dispositivo está fuera de rango
  const withinLocalRange =
    nowLocal >= new Date(startDate) &&
    nowLocal <= new Date(endDate);

  async function handleSubmit(formData) {
    setError(null);
    setSubmitting(true);

    try {
      // Llamada al servidor: es él quien valida de verdad
      const resp = await fetch('/api/submit-modal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const body = await resp.json();
        throw new Error(body.message || 'Error en servidor');
      }

      // Éxito
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {!withinLocalRange && (
        <p className="warning">
          Atención: tu reloj local ({nowLocal.toLocaleString()})
          está fuera del periodo permitido.
        </p>
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit({  });
        }}
        >
          
          <button type="submit" disabled={!withinLocalRange || submitting}>
            Enviar
          </button>
        </form>
  
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
  

///////////////////////////////////////////////////////
 */


  useEffect(() => {
    cargarDatosRepresentante();
  }, []);

  return (
    <div>
      <div className="container-fluid p-0">
        {representante && <Header isAuthenticated={true} usuario={representante} />}
      </div>
      {/* <ViewData entity={representante} onCancel={OnCancel} isLoading={isLoading}></ViewData> */}
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="modal-title">Información completa de {`${primer_nombre} ${primer_apellido}`}</h2>
  
          <div className="modal-form">
            <div className='rows'>
              <div className="form-group">
                <label htmlFor="nroCedula">Número de cédula:</label>
                <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} placeholder="Ingrese un número de cédula" />
              </div>
              <div className="form-group">
                <label htmlFor="celular">#Celular:</label>
                <input id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ingrese un celular" />
              </div>
  
            </div>
            <div className='rows'>
              <div className="form-group">
                <label htmlFor="primer_nombre">Primer nombre:</label>
                <input id="primer_nombre" value={primer_nombre} onChange={(e) => setPrimerNombre(e.target.value)} placeholder="Ingrese un nombre" />
              </div>
  
              <div className="form-group">
                <label htmlFor="primer_apellido">Primer apellido:</label>
                <input id="primer_apellido" value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)} placeholder="Ingrese un apellido" />
              </div>
            </div>
  
            <div className='rows'>
              <div className="form-group">
                <label htmlFor="segundo_nombre">Segundo nombre:</label>
                <input id="segundo_nombre" value={segundo_nombre} onChange={(e) => setSegundoNombre(e.target.value)} placeholder="Ingrese un nombre" />
              </div>
  
              <div className="form-group">
                <label htmlFor="segundo_apellido">Segundo apellido:</label>
                <input id="segundo_apellido" value={segundo_apellido} onChange={(e) => setSegundoApellido(e.target.value)} placeholder="Ingrese un apellido" />
              </div>
  
            </div>
            <div className='rows'>
              <div className="form-group">
                <label htmlFor="convencional">#Convencional :</label>
                <input id="convencional" value={convencional} onChange={(e) => setConvencional(e.target.value)} placeholder="Este campo es opcional" />
              </div>
              <div className="form-group">
                <label htmlFor="convencional">#Emergencia :</label>
                <input id="convencional" value={emergencia} onChange={(e) => setEmergencia(e.target.value)} placeholder="Ingrese un celular" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingrese un correo electrónico" />
            </div>
            <div className='rows'>
              
              <label>
                Copia de Cédula:
                <input
                  type="file"
                  name="copiaCedula"
                  
                  //onChange={handleFileChange}
                  accept="application/pdf"
                />
              </label>
              <label>
                Croquis:
                <input
                  type="file"
                  name="croquis"
                  //onChange={handleFileChange}
                  accept="application/pdf"
                />
              </label>
              
            </div>
          </div>
  
          <div className="botones">
            <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
            <Boton texto="Cancelar" onClick={() => OnCancel()} estilo="boton-cancelar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerDatosRepresentante;
