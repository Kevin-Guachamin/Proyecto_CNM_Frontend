import React,{useState}from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importa el CSS de react-datepicker
import '../../Admin/Styles/CrearEntidad.css'
import Boton from '../../../components/Boton';
function EstablecerPlazos({id,estado,onSave,onCancel}) {
    const [fecha_inicio, setFecha_inicio] = useState("");
    const [fecha_fin, setFecha_fin] = useState("");

    const handleSubmit = () => {
        onSave(id,estado,fecha_inicio,fecha_fin)
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
                <h2 className='modal-title'>Establecer plazo</h2>
                <div className="modal-form">
                   

                    <div className="form-group">
                        <label htmlFor="fecha_inicio">Fecha inicio</label>
                        <DatePicker
                            selected={fecha_inicio}
                            onChange={(date) => {

                                setFecha_inicio(date)
                            }} // Establecer directamente como Date
                            dateFormat="dd/MM/yyyy"
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fecha_fin">Fecha fin</label>
                        <DatePicker
                            selected={fecha_fin}
                            onChange={(date) => setFecha_fin(date)} // Establecer directamente como Date
                            dateFormat="dd/MM/yyyy"
                            className="input-field"
                        />
                    </div>

                </div>

                <div className="botones">
                    <Boton texto="Guardar" onClick={() => handleSubmit()} estilo="boton-crear" />
                    <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
                </div>
            </div>

        </div>
    );
}

export default EstablecerPlazos