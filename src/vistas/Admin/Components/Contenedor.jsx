import React, { useState } from 'react';
import Filtro from './Filtro';
import Tabla from './Tabla';
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../Utils/CRUD/Editar';
import "../Styles/Contenedor.css"


function Contenedor({ data, setData, headers, columnsToShow, filterKey, apiEndpoint,CrearEntidad, PK,extraIcon, Paginación}) {
  const [search, setSearch] = useState('');
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
 

  
  const filteredData = data.filter((item) =>
    item[filterKey]?.toLowerCase()
  );

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    setEntityToUpdate(null);
  };

  const handleSaveEntity = (newEntity,headers) => {
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
      
      <Filtro search={search} setSearch={setSearch} toggleModal={toggleModal} filterKey={filterKey}/>
      {isModalOpen && (
            <CrearEntidad
              onCancel={toggleModal}
              entityToUpdate={entityToUpdate}
              onSave={handleSaveEntity}
            />
      )}
      <Tabla
        filteredData={filteredData}
        OnEdit={handleEdit}
        OnDelete={handleDelete}
        headers={headers}
        columnsToShow={columnsToShow}
        extraIcon={extraIcon}
      />
      {Paginación && data.length > 0 && <div className='Paginación'>{Paginación}</div>}
    </div>
  );
}

export default Contenedor;
