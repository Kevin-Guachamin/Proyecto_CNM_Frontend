// Tabla para REPRESENTANTE
import "bootstrap/dist/css/bootstrap.min.css";

const Tabla = ({datos, isLoading}) => {
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
        <table className="table table-bordered table-striped custom-table">
            <thead>
                <tr className="table-primary">
                    <th scope = "col" className="text-center grouped-header"> Estudiante </th> 
                    <th scope = "col" className="text-center grouped-header"> Curso </th>
                    <th scope = "col" className="text-center grouped-header"> Especialidad</th>
                    <th scope = "col" className="text-center grouped-header"> Accion </th>
                </tr>
            </thead>
            <tbody>
                {datos.length > 0 ? 
                    (
                        datos.map((estudiante, i)=> (
                            <tr key={i}>
                                <td className="text-center"> {estudiante.Estudiante} </td>
                                <td className="text-center"> {estudiante.Curso} </td>
                                <td className="text-center"> {estudiante.Especialidad} </td>
                                <td className="text-center"> {estudiante.Acciones} </td>
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