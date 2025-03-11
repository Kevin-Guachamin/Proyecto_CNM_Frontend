import React,{useState} from 'react'
import BotonAdd from '../../../components/BotonAdd'
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../Utils/CRUD/Editar';
import CrearAsignatura from './CrearAsignatura';

function Contenedor({asignaturas, setAsginaturas}) {
    const [asignaturaToUpdate,setAsginaturaToUpdate]=useState(null)
    const [modal, setModal]=useState(false)
    
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const toggleModal = () => {
        setModal((prev) => !prev);
        setAsginaturaToUpdate(null); // Resetear usuario al abrir el modal
      };
    const OnEdit=(asignatura)=>{
        
        setAsginaturaToUpdate(asignatura)
        setModal(true)
    }
    const handleSave=(newAsignatura)=>{
        Editar(asignaturaToUpdate,newAsignatura,`${API_URL}/materia`,setAsginaturas,setModal)
        
    }
    const OnDelete= (asignatura)=>{
        Eliminar(asignatura, `${API_URL}/materia/eliminar`,asignatura.nombre,setAsginaturas)
    }
    

    return (
        <div>
           <div>
                <BotonAdd onClick={()=>toggleModal()}/>
            </div>
                
            {modal && (
             <div className="modal">
                <div className="modal-content-periodos">
                 <CrearAsignatura
                    onCancel={toggleModal}
                    asignaturaToUpdate={asignaturaToUpdate}
                    onSave={handleSave}
                    />
          </div>
        </div>
      )}
            {asignaturas.length === 0 ? (
                    <p className="no-periodos">No hay asignaturas registradas.</p>
                    ) : (
                    <table className="tabla_periodos">
                        <thead>
                        <tr>
                         <th>ID</th>
                         <th>Nombre</th>
                         <th>Acciones</th>
                        </tr>
                     </thead>
                     <tbody>
                         {asignaturas.map((as, index) => (
                            <tr key={index}>
                            <td>{as.ID}</td>
                              <td>{as.nombre}</td>
                             <td>
                                <FaEdit
                               className="icon edit-icon"
                                  onClick={() => OnEdit(as)}
                               />
                              <FaTrash
                                className="icon delete-icon"
                                onClick={() => OnDelete(as)}
                              />
                             </td>
                         </tr>
                         ))}
                   </tbody>
                      </table>
                    )}
        </div>
  )
}

export default Contenedor