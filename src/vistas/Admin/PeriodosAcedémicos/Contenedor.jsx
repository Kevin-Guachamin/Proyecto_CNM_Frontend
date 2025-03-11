import React,{useState, useEffect} from 'react'
import Filtro from './Filtro';
import CrearPeriodo from './CrearPeriodo';
import Tabla from './Tabla';
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import Swal from 'sweetalert2';
import "./Contenedor.css"
import { Editar } from '../../../Utils/CRUD/Editar';

function Contenedor({periodos,setPeriodos}) {
  const [search, setSearch] = useState('');
  const [periodoToUpdate, setPeriodoToUpdate]=useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

  const filteredPeriodos = periodos.filter((periodo) =>
    periodo.descripcion.toLowerCase().includes(search.toLowerCase())
  );
  const toggleModal = () => {
    
    setIsModalOpen((prev) => !prev);
    
    setPeriodoToUpdate(null); // Resetear usuario al abrir el modal
  };
  const handleSavePeriodo = (newPeriodo) => {
    Editar(periodoToUpdate,newPeriodo,`${API_URL}/periodo_academico`,setPeriodos,setIsModalOpen)
  }
  const handleEdit = (periodo) => {
    setPeriodoToUpdate(periodo); // Asignar el usuario a editar
    setIsModalOpen(true); // Abrir modal
  };
  const handleDelete = (periodo) => {
    Eliminar(periodo, `${API_URL}/periodo_academico/eliminar`,periodo.descripcion,setPeriodos)
};
  return (
    <div className='Contenedor-general'>
      <Filtro search={search} setSearch={setSearch} toggleModal={toggleModal}/>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content-periodos">
            <CrearPeriodo
              onCancel={toggleModal}
              periodoToUpdate={periodoToUpdate}
              onSave={handleSavePeriodo}
            />
          </div>
        </div>
      )}
      <Tabla filteredPeriodos={filteredPeriodos} OnEdit={handleEdit} OnDelete={handleDelete} ></Tabla>
      </div> 
  )
  
}

export default Contenedor