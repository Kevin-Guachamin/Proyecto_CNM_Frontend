import React, { useState } from 'react';
import Filtro from './Filtro';
import Tabla from './Tabla';
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../Utils/CRUD/Editar';
import "../Styles/Contenedor.css"
import axios from 'axios';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';


function Contenedor({ setTotalPages,data, setData, headers, columnsToShow, filterKey, apiEndpoint,CrearEntidad, PK,extraIcon, Paginación, page,limit}) {
  
  const [entityToUpdate, setEntityToUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
  const token=localStorage.getItem("token")
  const [search,setSearch]=useState("")

  const fetchAsignaturas = async (e) => {
    e.preventDefault()
    setSearch(e.target.value)
    try {
      
      const { data } = await axios.get(
        `${API_URL}/materia/obtener?page=${page}&limit=${limit}&search=${e.target.value}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("esta es la data",data)
      setData(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      ErrorMessage(error);
    } 
  };
  

  const toggleModal = () => {
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
      
      <Filtro search={search} toggleModal={toggleModal} filterKey={filterKey} filtrar={fetchAsignaturas} />
      {isModalOpen && (
            <CrearEntidad
              onCancel={toggleModal}
              entityToUpdate={entityToUpdate}
              onSave={handleSaveEntity}
            />
      )}
      <Tabla
        filteredData={data}
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
