// Tabla para REPRESENTANTE
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Tabla_Representante.css'
import { useNavigate } from "react-router-dom";

const Tabla = ({datos, isLoading, handleVerCalificaciones, handleVerDatosEstudiante, handleVerResumenSemanal}) => {
    const navigate = useNavigate();

    // Comprueba que los props sean arrays
    if(!Array.isArray(datos)) {
        return <div className="alert alert-danger"> Error: Los datos deben ser un array </div>
    }

    // Mensaje de "loading" cuando cargan los estudiantes
    if(isLoading) {
        return(
            <div className="d-flex justify-content-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <span className="ms-2">Cargando estudiantes...</span>
            </div>
        );
    }

    const handleOnClick = () => {
        navigate('/representante'); // Usa el navigate ya definido
    }
    
    // Tabla de los estudiantes a cargo del REPRESENTANTE con estilo de administración
   return(
    <div className="contenedor-tabla-representante">
        {datos.length === 0 ? (
            <p className="sin-registros-representante">No hay estudiantes disponibles.</p>
        ) : (
            <div className="scroll-tabla-representante">
                <table className="tabla-estudiantes-representante">
                    <thead>
                        <tr>
                            <th className="encabezado-tabla-representante">Estudiante</th>
                            <th className="encabezado-tabla-representante">Nivel</th>
                            <th className="encabezado-tabla-representante">Especialidad</th>
                            <th className="encabezado-tabla-representante">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((estudiante, i) => (
                            <tr key={i}>
                                <td className="celda-tabla-representante">
                                    {estudiante.primer_nombre ?? '-'}{' '}
                                    {estudiante.segundo_nombre ?? '-'}{' '}
                                    {estudiante.primer_apellido ?? '-'}{' '}
                                    {estudiante.segundo_apellido ?? '-'}
                                </td>
                                <td className="celda-tabla-representante">{estudiante.nivel}</td>
                                <td className="celda-tabla-representante">{estudiante.especialidad}</td>
                                <td className="acciones-tabla-representante">
                                    <i
                                        className="bi bi-card-checklist icono-accion-representante"
                                        onClick={() => handleVerCalificaciones(estudiante.nroCedula)}
                                        title="Ver calificaciones"
                                    ></i>
                                    <i
                                        className="bi bi-info-circle icono-accion-representante"
                                        onClick={() => handleVerDatosEstudiante(estudiante.nroCedula)}
                                        title="Ver información"
                                    ></i>
                                    <i
                                        className="bi bi-calendar-week icono-accion-representante"
                                        onClick={() => handleVerResumenSemanal(estudiante.nroCedula)}
                                        title="Ver horario"
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div> 
   ); 
}

export default Tabla;