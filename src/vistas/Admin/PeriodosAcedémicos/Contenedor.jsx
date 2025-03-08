import React,{useState, useEffect} from 'react'
import Filtro from './Filtro';
import CrearPeriodo from './CrearPeriodo';
import Tabla from './Tabla';
import axios from 'axios'
import { ErrorMessage } from '../../../Utils/ErrorMesaje';
import Swal from 'sweetalert2';
import "./Contenedor.css"

function Contenedor({periodos,setPeriodos}) {
  const [search, setSearch] = useState('');
  const [periodoToUpdate, setPeriodoToUpdate]=useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;

  const filteredPeriodos = periodos.filter((periodo) =>
    periodo.descripcion.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    console.log("Modal abierto:", isModalOpen);
  }, [isModalOpen]);
  const toggleModal = () => {
    
    setIsModalOpen((prev) => !prev);
    
    setPeriodoToUpdate(null); // Resetear usuario al abrir el modal
  };
  const handleSavePeriodo = (newPeriodo) => {
    console.log("este es el periodo",newPeriodo)
    if (periodoToUpdate) {
      // Si estamos editando un usuario, lo actualizamos
      axios
        .put(`${API_URL}/periodo_academico/editar/${periodoToUpdate.ID}`, newPeriodo)
        .then((res) => {
          // Actualizamos el array de usuarios con la respuesta del servidor
          setPeriodos((prevPeriodos) =>
            prevPeriodos.map((periodo) =>
              periodo.ID === periodoToUpdate.ID ? res.data : periodo
            )
          );
          setIsModalOpen(false); // Cerrar el modal
        })
        .catch((error) => {
          ErrorMessage(error)
          console.log(error)
        });
    } else {
      // Si no estamos editando, agregamos uno nuevo
      
      axios
        .post(`${API_URL}/periodo_academico/crear`, newPeriodo)
        .then((res) => {
          setPeriodos((prevPeriodos) => [...prevPeriodos, res.data]);
          setIsModalOpen(false); // Cerrar el modal
        })
        .catch((error) => {
          ErrorMessage(error)
          console.log(error)
        });
     
  
    
}
  }
  const handleEdit = (periodo) => {
    setPeriodoToUpdate(periodo); // Asignar el usuario a editar
    setIsModalOpen(true); // Abrir modal
  };
  const handleDelete = (periodo) => {
    
    Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres eliminar a ${periodo.descripcion}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Eliminar usuario por ID
            axios
                .delete(`${API_URL}/periodo_academico/eliminar/${periodo.ID}`)
                .then((res) => {
                  
                  setPeriodos((prevPeriodos) => prevPeriodos.filter((p) => p.ID !== periodo.ID));
                    Swal.fire(
                        'Eliminado!',
                        `El periodo ${res.data.descripcion} ha sido eliminado.`,
                        'success'
                    );
                })
                .catch((error) => {
                    ErrorMessage(error)
                });
        }
    });
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