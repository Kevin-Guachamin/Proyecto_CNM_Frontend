import React, { useState, useEffect } from 'react';
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

  // ======= Función para hacer peticiones con filtro =======
  const fetchEntidadesConFiltro = async (searchTerm = search, currentPage = page) => {
    try {
      console.log("Buscando con:", { searchTerm, currentPage, limit });
      const { data } = await axios.get(
        `${API_URL}/${apiEndpoint}/obtener?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Datos recibidos:", data);
      setData(data.data);
      if (setTotalPages) setTotalPages(data.totalPages);
    } catch (error) {
      ErrorMessage(error);
    } 
  };

  // ======= Ejecutar búsqueda cuando cambie la página (manteniendo filtro) =======
  useEffect(() => {
    if (page && limit) {
      fetchEntidadesConFiltro(search, page);
    }
  }, [page]); // Solo cuando cambie la página

  const fetchEntidades = async (e) => {
    e.preventDefault()
    const newSearch = e.target.value;
    setSearch(newSearch);
    // Hacer búsqueda en página 1 cuando cambie el filtro
    fetchEntidadesConFiltro(newSearch, 1);
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
      
      <Filtro search={search} toggleModal={toggleModal} filterKey={filterKey} filtrar={fetchEntidades} />
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
