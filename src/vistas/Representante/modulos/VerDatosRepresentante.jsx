import { useState } from "react";
import axios from "axios";
import ViewData from "../../Admin/Modules/Estudiantil/Estudiantes/ViewData";
import Header from "../../../components/Header";
import Layout from "../../../layout/Layout";
import Boton from "../../../components/Boton";
import Loading from "../../../components/Loading";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { modulosRepresentante } from "../components/ModulosRepresentante";
import "../Styles/VerDatosRepresentante.css";
import Swal from 'sweetalert2';
import { ErrorMessage } from "../../../Utils/ErrorMesaje";

const VerDatosRepresentante = () => {
	const [representante, setRepresentante] = useState([]);
	const location = useLocation();
	const [mostrarModal, setMostrarModal] = useState(false); // Cambiar a false para no mostrar el modal inicialmente
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
	
	// Estado para manejar archivos
	const [files, setFiles] = useState({
		croquis: null,
		copiaCedula: null
	});
	
	// Variables para habilitar o deshabilitar la actualizacion de datos
	const [dentroDeRango, setDentroDeRango] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    
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
        const {data: response} = await axios.get(
            `${baseURL}/fechas_procesos/fecha_actual`,
            headers
        );
        const fechaActual = response.fechaActual;

        // Obtener las fechas rango de la API para la actualizacion
        const {data: fechaActualizacionDatos} = await axios.get(
            `${baseURL}/fechas_procesos/actualizacion`,
            headers
        );

        // Comprueba que haya datos en fechaActualizacionDatos
        if(fechaActualizacionDatos) {
            setFechaInicio(fechaActualizacionDatos.fechaInicioProceso);
            setFechaFin(fechaActualizacionDatos.fechaFinProceso);
        }

        const inicio = fechaActualizacionDatos.fechaInicioProceso;
        const fin = fechaActualizacionDatos.fechaFinProceso;
        
        // Establece si la fecha actual esta dentro del rango de la
        // fecha del proceso 
        if (fechaActual >= inicio && fechaActual <= fin) {
            setDentroDeRango(true);

        }else {
            setDentroDeRango(false);
        }

    } catch (error) {
      console.error('Error al obtener datos de representante: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const OnCancel = () => {
    // Simplemente navegar hacia atrás sin confirmaciones adicionales
    navigate(-1);
  }

  const abrirModalActualizar = () => {
    setMostrarModal(true);
  }

  const cerrarModal = () => {
    setMostrarModal(false);
  }

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFiles((prevState) => ({
      ...prevState,
      [name]: files[0], // Solo se selecciona un archivo por input
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!dentroDeRango) {
      Swal.fire({
        icon: "warning",
        title: "Fuera de fecha",
        text: "No se pueden actualizar datos fuera del período permitido.",
        confirmButtonColor: "#003F89",
      });
      return;
    }

    setSubmitting(true);
    
    // Crear FormData igual que en CrearRepresentante
    const formData = new FormData();
    formData.append("copiaCedula", files.copiaCedula);
    formData.append("croquis", files.croquis);
    formData.append("nroCedula", nroCedula);
    formData.append("primer_nombre", primer_nombre);
    formData.append("primer_apellido", primer_apellido);
    formData.append("segundo_nombre", segundo_nombre);
    formData.append("segundo_apellido", segundo_apellido);
    formData.append("email", email);
    formData.append("celular", celular);
    formData.append("convencional", convencional);
    formData.append("emergencia", emergencia);

    // Llamar al endpoint igual que en la función Editar
    const baseURL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token");
    
    axios
      .put(`${baseURL}/representante/editar/${nroCedula}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setSubmitting(false);
        Swal.fire({
          icon: "success",
          title: "Datos actualizados con éxito",
          iconColor: "#218838",
          confirmButtonText: "Entendido",
          confirmButtonColor: "#003F89",
        }).then(() => {
          // Actualizar los datos locales del usuario
          const usuarioActualizado = res.data;
          localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
          setRepresentante(usuarioActualizado);
          
          // Preguntar si quiere regresar o seguir editando
          Swal.fire({
            title: '¿Qué deseas hacer?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Regresar',
            denyButtonText: 'Seguir editando',
            confirmButtonColor: '#003F89',
            denyButtonColor: '#6c757d'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(0);
            } else {
              // Si elige "Seguir editando", cerrar el modal pero quedarse en la vista
              setMostrarModal(false);
            }
          });
        });
      })
      .catch((error) => {
        setSubmitting(false);
        ErrorMessage(error);
        console.log(error);
      });
  }

  const handleConfirmacion = () => {

  }


    const formatearFecha = (fechaIso) => {
        return new Date(fechaIso).toLocaleDateString('es-EC');
    }

  useEffect(() => {
    cargarDatosRepresentante();
  }, []);

  return (
    <div>
      <div className="container-fluid p-0">
        {representante && <Header isAuthenticated={true} usuario={representante} />}
      </div>
      
      <Layout modules={modulosRepresentante} activeModule={1}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {/* Vista principal de información del representante */}
            <div className="info-representante-container">
              <div className="card-representante">
                <div className="card-header-representante">
                  <h3 className="mb-0">Información de {`${primer_nombre} ${primer_apellido}`}</h3>
                  <div>
                    <button 
                      className="btn btn-primary" 
                      onClick={abrirModalActualizar}
                      disabled={!dentroDeRango}
                      title={!dentroDeRango ? "Fuera del período de actualización" : "Actualizar información"}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Actualizar Información
                    </button>
                  </div>
                </div>
                
                <div className="card-body-representante">
                  <div className="row">
                    <div className="col-md-6 campo-info">
                      <strong>Número de Cédula:</strong>
                      <p>{representante.nroCedula || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6 campo-info">
                      <strong>Celular:</strong>
                      <p>{representante.celular || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 campo-info">
                      <strong>Primer Nombre:</strong>
                      <p>{representante.primer_nombre || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6 campo-info">
                      <strong>Primer Apellido:</strong>
                      <p>{representante.primer_apellido || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 campo-info">
                      <strong>Segundo Nombre:</strong>
                      <p>{representante.segundo_nombre || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6 campo-info">
                      <strong>Segundo Apellido:</strong>
                      <p>{representante.segundo_apellido || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 campo-info">
                      <strong>Teléfono Convencional:</strong>
                      <p>{representante.convencional || 'No especificado'}</p>
                    </div>
                    <div className="col-md-6 campo-info">
                      <strong>Teléfono de Emergencia:</strong>
                      <p>{representante.emergencia || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 campo-info">
                      <strong>Email:</strong>
                      <p>{representante.email || 'No especificado'}</p>
                    </div>
                  </div>

                  {!dentroDeRango && (
                    <div className="alert alert-warning mt-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Actualización no disponible:</strong> No se pueden actualizar datos fuera del período permitido.
                      <br />
                      <small>Período de actualización: {formatearFecha(fechaInicio)} al {formatearFecha(fechaFin)}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>          {/* Modal de actualización */}
          {mostrarModal && (
            <div className="modal-overlay">
              <div className="modal-container modal-representante">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="modal-title mb-0">Actualizar información de {`${primer_nombre} ${primer_apellido}`}</h2>
                  
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="modal-form">
                  <div className='rows'>
                    <div className="form-group">
                      <label htmlFor="nroCedula">Número de cédula:</label>
                      <input id="nroCedula" value={nroCedula} onChange={(e) => setNroCedula(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="celular">#Celular:</label>
                      <input id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} />
                    </div>
                  </div>

                  <div className='rows'>
                    <div className="form-group">
                      <label htmlFor="primer_nombre">Primer nombre:</label>
                      <input id="primer_nombre" value={primer_nombre} onChange={(e) => setPrimerNombre(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="primer_apellido">Primer apellido:</label>
                      <input id="primer_apellido" value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)} />
                    </div>
                  </div>

                  <div className='rows'>
                    <div className="form-group">
                      <label htmlFor="segundo_nombre">Segundo nombre:</label>
                      <input id="segundo_nombre" value={segundo_nombre} onChange={(e) => setSegundoNombre(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="segundo_apellido">Segundo apellido:</label>
                      <input id="segundo_apellido" value={segundo_apellido} onChange={(e) => setSegundoApellido(e.target.value)} />
                    </div>
                  </div>

                  <div className='rows'>
                    <div className="form-group">
                      <label htmlFor="convencional">#Convencional:</label>
                      <input id="convencional" value={convencional} onChange={(e) => setConvencional(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="emergencia">#Emergencia:</label>
                      <input id="emergencia" value={emergencia} onChange={(e) => setEmergencia(e.target.value)} />
                    </div>
                  </div>

                  <div className='rows'>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='form-group'>
                      {/* Espacio vacío para mantener la estructura */}
                    </div>
                  </div>

                  <div className='file-upload-container'>
                    <div className='file-upload'>
                      <label className='custom-file-label'>
                        Copia de Cédula:
                      </label>
                      <input
                        type="file"
                        name="copiaCedula"
                        className='custom-file-input'
                        onChange={handleFileChange}
                        accept="application/pdf"
                      />
                    </div>

                    <div className='file-upload'>
                      <label className='custom-file-label'>
                        Croquis:
                      </label>
                      <input
                        className='custom-file-input'
                        type="file"
                        name="croquis"
                        onChange={handleFileChange}
                        accept="application/pdf"
                      />
                    </div>
                  </div>

                  {!dentroDeRango && (
                    <div className="alert-container">
                      <p className="alert-text">
                        No se pueden actualizar datos fuera de fecha.
                      </p>
                      <p className="alert-text">
                        Fecha: {formatearFecha(fechaInicio)} al {formatearFecha(fechaFin)}
                      </p>
                    </div>
                  )}

                  <div className='rows-botones'>
                    <div className="botones">
                      <button 
                        type='submit' 
                        className='boton-crear' 
                        disabled={!dentroDeRango || submitting}
                      >
                        {submitting ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        className="boton-cancelar"
                        onClick={cerrarModal}
                        disabled={submitting}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          </>
        )}
      </Layout>
    </div>
  );
}

export default VerDatosRepresentante;
