import React,{useState} from 'react'
import Boton from '../../../components/Boton';
function CrearSolicitud({nroCedula,onSave,onCancel}) {
    const [motivo, setMotivo] = useState("");

    const handleSubmit = () => {
        const solicitud={nroCedula_docente: nroCedula, fechaSolicitud: new Date(), motivo: motivo ,fecha_inicio:null, fecha_fin:null}
        onSave(solicitud)
    };

    return (
        <div className="modal-overlay">
            <div className='modal-container'>
                <h2>Crear solicitud</h2>
                <div className="formulario">
                    <div className='rows'>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="motiva">Ingrese el motivo</label>
                                <input
                                    id="nombre"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                />
                            </div>

                        </div>




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



export default CrearSolicitud