import React, { useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TablaEstudiantil from './TablaEstudiantes';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../../../Utils/CRUD/Editar';
import DownloadFiles from './DownloadFiles';
import "../../../Styles/Contenedor.css"


function ContenedorEstudiante({ search, filtrar,data, setData, headers, columnsToShow, filterKey, apiEndpoint, CrearEntidad, PK, OnView, Paginación,handleCursos }) {
  
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
 const [isDownloadOpen,setDownload]=useState(false)


  const toggleModal = (modal) => {
    if(modal==="download") return setDownload((prev)=>!prev)
    setIsModalOpen((prev) => !prev);
    setEntityToUpdate(null);
  };

  const handleSaveEntity = (newEntity, headers) => {
    console.log("estoy llegando hasta aca")
    Editar(entityToUpdate, newEntity, `${API_URL}/${apiEndpoint}`, setData, setIsModalOpen, PK, headers);
  };

  const handleEdit = (entity) => {
    setEntityToUpdate(entity);
    setIsModalOpen(true);
  };

  const handleDelete = (entity) => {
    Eliminar(entity, `${API_URL}/${apiEndpoint}/eliminar`, entity[filterKey], setData, PK);
  };
  

  return (
    <div className='Contenedor-general'>

     
      <div className="filter-container">
        <input
          value={search}
          onChange={(e) => filtrar(e)}
          className="search-input"
          placeholder={`Filtrar por ${filterKey}`}
        />
        <div className='form-group'>
                    <select
                        onChange={(e)=>handleCursos(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Selecciona un nivel </option>
                        <option value="1ro Básico Elemental">1ro Básico Elemental</option>
                        <option value="2do Básico Elemental">2do Básico Elemental</option>
                        <option value="1ro Básico Medio">1ro Básico Medio</option>
                        <option value="2do Básico Medio">2do Básico Medio</option>
                        <option value="3ro Básico Medio">3ro Básico Medio</option>
                        <option value="1ro Básico Superior">1ro Básico Superior</option>
                        <option value="2do Básico Superior">2do Básico Superior</option>
                        <option value="3ro Básico Superior">3ro Básico Superior</option>
                        <option value="1ro Bachillerato">3ro Básico Medio</option>
                        <option value="2do Bachillerato">2do Bachillerato</option>
                        <option value="3ro Bachillerato">3ro Bachillerato</option>
                    </select>
                </div>
        <button className="boton-download" onClick={()=>toggleModal("download")}><FontAwesomeIcon icon={faDownload} className="icon" />
                Descargar archivos</button>
        
      </div>

      {isModalOpen && (
        <CrearEntidad
          onCancel={toggleModal}
          entityToUpdate={entityToUpdate}
          onSave={handleSaveEntity}
        />
      )}
      {isDownloadOpen && (
            <DownloadFiles
              onCancel={()=>toggleModal("download")}
              setDownload={setDownload}
            />
      )}
      <TablaEstudiantil
        filteredData={data}
        OnEdit={handleEdit}
        OnDelete={handleDelete}
        OnView={OnView}
        headers={headers}
        columnsToShow={columnsToShow}
      />
      {Paginación && data.length > 0 && <div className='Paginación'>{Paginación}</div>}
    </div>
  );
}

export default ContenedorEstudiante;