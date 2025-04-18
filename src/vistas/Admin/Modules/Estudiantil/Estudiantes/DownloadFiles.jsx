import React, { useState } from 'react'
import Boton from '../../../../../components/Boton'
import axios from 'axios'
import { ErrorMessage } from '../../../../../Utils/ErrorMesaje'

function DownloadFiles({ onCancel,setDownload }) {
    const [nivel, setNivel] = useState("")
    const [grupo, setGrupo] = useState("")
    
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const token = localStorage.getItem("token")
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setDownload(false)
        let estudiantes
        try {
           const data= await axios.get(`${API_URL}/estudiante/nivel/${nivel}`,{ headers: { Authorization: `Bearer ${token}` }})
            estudiantes=data.data
            console.log("estos son los estudiantes",estudiantes)
        } catch (error) {
            ErrorMessage(error)
        }
        const grupoMap = {
          "Cédulas representantes": (est) => est.Representante?.cedula_PDF,
          "Croquis": (est) => est.Representante?.croquis_PDF,
          "Cédulas estudiantes": (est) => est.cedula_PDF,
          "Matrículas IER": (est) => est.IER_PFD,
        };
      
        const getPath = grupoMap[grupo];
      
        if (!getPath) {
          ErrorMessage("Grupo no válido o no seleccionado.");
          return;
        }
      
        const fileList = estudiantes
          .map((estudiante) => {
            const fullPath = getPath(estudiante);
            if (!fullPath) return null;
      
            const parts = fullPath.split("\\");
            if (parts.length < 3) return null;
      
            const folder = parts[1];
            const filename = parts[2];
            return { folder, filename };
          })
          .filter(Boolean); // elimina nulos si algún path no existía
      
        try {
          const response = await axios.post(
            `${API_URL}/download-zip`,
            { files: fileList },
            {
              responseType: "blob",
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${grupo} ${nivel}.zip`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error al descargar el ZIP:", error);
          ErrorMessage(error);
        }
      };
      
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">Parametros de descarga</h2>

                <form onSubmit={(e) => handleSubmit(e)} className="modal-form">


                    <div className='rows'>

                        <div className="form-group">
                            <label htmlFor="nivel">Nivel de los estudiantes:</label>
                            <select required id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
                                <option value="" disabled selected>Selecciona un nivel</option>
                                <option value="1ro Básico Elemental">1ro BE</option>
                                <option value="2do Básico Elemental">2do BE</option>
                                <option value="1ro Básico Medio">1ro BM</option>
                                <option value="2do Básico Medio">2do BM</option>
                                <option value="3ro Básico Medio">3ro BM</option>
                                <option value="1ro Básico Superior">1ro BS</option>
                                <option value="2do Básico Superior">2do BS</option>
                                <option value="3ro Básico Superior">3ro BS</option>
                                <option value="1ro Bachillerato">1ro BCH</option>
                                <option value="2do Bachillerato">2do BCH</option>
                                <option value="3ro Bachillerato">3ro BCH</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="archivos">Grupo de archivos:</label>
                            <select required id="genero" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                                <option value="" disabled selected>Selecciona un grupo</option>
                                <option value="Cédulas representantes">Cédulas representantes</option>
                                <option value="Cédulas estudiantes">Cédulas estudiantes</option>
                                <option value="Croquis">Croquis </option>
                                <option value="Matrículas IER">Matrículas IER</option>
                            </select>
                        </div>
                    </div>


                    <div className='rows-botones'>
                        <div className="botones">
                            <button type='submit' className='boton-crear' >Confirmar</button>
                            <Boton texto="Cancelar" onClick={onCancel} estilo="boton-cancelar" />
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default DownloadFiles