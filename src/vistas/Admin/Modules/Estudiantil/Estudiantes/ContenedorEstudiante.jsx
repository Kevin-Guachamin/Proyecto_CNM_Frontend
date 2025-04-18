import React, { useState } from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TablaEstudiantes from './TablaEstudiantes';
import { Eliminar } from '../../../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../../../Utils/CRUD/Editar';
import DownloadFiles from './DownloadFiles';
import "../../../Styles/Contenedor.css"


function ContenedorEstudiante({ data, setData, headers, columnsToShow, filterKey, apiEndpoint,CrearEntidad, PK,OnView, Paginación}) {
  const [search, setSearch] = useState('');
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
 const [isDownloadOpen,setDownload]=useState(false)


  const filteredData = data.filter((item) =>
    item[filterKey]?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModal = (modal) => {
    if(modal==="download") return setDownload((prev)=>!prev)
    setIsModalOpen((prev) => !prev);
    setEntityToUpdate(null);
    
  };

  const handleSaveEntity = (newEntity,headers) => {
    console.log("estoy llegando hasta aca")
    Editar(entityToUpdate, newEntity, `${API_URL}/${apiEndpoint}`, setData, setIsModalOpen,PK,headers);
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
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          placeholder={`Filtrar por ${filterKey}`}
        />
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
      <TablaEstudiantes
        filteredData={filteredData}
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