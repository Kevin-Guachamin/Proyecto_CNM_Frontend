// Tabla para REPRESENTANTE
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Tabla_Representante.css'

const Tabla = ({datos, isLoading, handleVerCalificaciones}) => {
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

    // Tabla de los estudiantes a cargo del REPRESENTANTE
   return(
    <div className="tableresponsive mt-3">
        <table className="table table-bordered table-striped estudiante-table">
            <thead>
                <tr className="bg-primary-subtle">
                    <th scope = "col" className="text-center bg-primary-subtle"> Estudiante </th> 
                    <th scope = "col" className="text-center bg-primary-subtle"> Jornada </th>
                    <th scope = "col" className="text-center bg-primary-subtle"> Especialidad</th>
                    <th scope = "col" className="text-center bg-primary-subtle"> Accion </th>
                </tr>
            </thead>
            <tbody>
                {datos.length > 0 ? 
                    (
                        datos.map((estudiante, i)=> (
                            <tr key={i}>
                                <td className="text-center"> 
                                    {estudiante.primer_nombre ?? '-'}{' '}
                                    {estudiante.segundo_nombre ?? '-'}{' '}
                                    {estudiante.primer_apellido ?? '-'}{' '}
                                    {estudiante.segundo_apellido ?? '-'}{' '}
                                 </td>
                                <td className="text-center"> {estudiante.jornada} </td>
                                <td className="text-center"> {estudiante.especialidad} </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm p-1"
                                        onClick={() => handleVerCalificaciones(estudiante.nroCedula)}
                                        title="Ver calificaciones"
                                    >
                                        <i className="bi bi-eye"> Ver calificaciones </i>
                                    </button>
                                </td>
                            </tr>           
                        ))
                    ):(
                        <tr>
                            <td className="text-center"> No hay datos disponibles </td>
                        </tr>
                    )}  
            </tbody>
        </table> 
    </div>
   ); 
}

export default Tabla;