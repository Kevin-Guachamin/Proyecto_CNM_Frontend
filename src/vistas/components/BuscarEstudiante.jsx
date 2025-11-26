import axios from 'axios';
import { ErrorMessage } from '../../Utils/ErrorMesaje';
function BuscarEstudiante({cedula,setCedula,setEstudiante,setBuscado}) {
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token=localStorage.getItem("token")
    const handlenroCedulaChange = (e) => {
        // Remover caracteres no numéricos
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        // Permitir solo hasta 10 dígitos
        if (onlyNumbers.length <= 10) {
            setCedula(onlyNumbers);
        }
    };
    const HandleBuscarEstudiante = async () => {
        setBuscado(true)
        setEstudiante(null)
        try {
            if (!cedula) {
                return
            }
            const response = await axios.get(`${API_URL}/estudiante/obtener/${cedula}`,{
                headers: { Authorization: `Bearer ${token}` },
              });
            setEstudiante(response.data)
        } catch (error) {
            ErrorMessage(error);
        }
    }
    return (
        <div className="search-container">
        <div className="search-input-container">
            <label htmlFor="cedula" className="label-search">Cédula o pasaporte</label>
            <input
                type="text"
                value={cedula}
                onChange={handlenroCedulaChange}
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

export default BuscarEstudiante