import axios from 'axios';
import { ErrorMessage } from '../../Utils/ErrorMesaje';
function BuscarEstudianteByApellido({apellido,setApellido,setEstudiantes,setBuscado}) {
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token=localStorage.getItem("token")
    const handleApellidoChange = (e) => {
       setApellido(e.target.value);
    };
    const HandleBuscarEstudiante = async () => {
        setBuscado(true)
        setEstudiantes([])
        try {
            if (!apellido) {
                return
            }
            const response = await axios.get(`${API_URL}/estudiante/obtenerPorApellido?search=${apellido}`,{
                headers: { Authorization: `Bearer ${token}` },
              });
              console.log(response.data.estudiantes)
            setEstudiantes(response.data.estudiantes)
        } catch (error) {
            ErrorMessage(error);
        }
    }
    return (
        <div className="search-container">
        <div className="search-input-container">
            <label htmlFor="cedula" className="label-search">Apellido estudiante</label>
            <input
                type="text"
                value={apellido}
                onChange={handleApellidoChange}
                className="input-cedula"
            />
             <button onClick={HandleBuscarEstudiante} className="btn-buscar">
            Buscar
        </button>
        </div>
       <div></div>
    </div>
    )
}

export default BuscarEstudianteByApellido