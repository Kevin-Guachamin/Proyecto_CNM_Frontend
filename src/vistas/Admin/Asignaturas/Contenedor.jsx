import React,{useState, useRef} from 'react'
import BotonAdd from '../../../components/BotonAdd'
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importar íconos
import { Eliminar } from '../../../Utils/CRUD/Eliminar';
import { Editar } from '../../../Utils/CRUD/Editar';
import { FaLessThanEqual } from 'react-icons/fa6';



function Contenedor({asignaturas, setAsginaturas}) {
    const [nombre,setNombre]=useState("")
    const [asignaturaToUpdate,setAsginaturaToUpdate]=useState(null)
    const [modal, setModal]=useState(FaLessThanEqual)
    const inputRef= useRef(null)
    const API_URL = import.meta.env.VITE_URL_DEL_BACKEND;
    const OnEdit=(asignatura)=>{

        setNombre(asignatura.nombre)
        if(inputRef.current){
            inputRef.current.focus()
        }
        setAsginaturaToUpdate(asignatura)
        
    }
    const OnSave=()=>{
        
        const newAsignatura={nombre}
        Editar(asignaturaToUpdate,newAsignatura,`${API_URL}/materia`,setAsginaturas,setModal)
        console.log(modal)
        setNombre("")
        setAsginaturaToUpdate(null)
        
    }
    const OnDelete= (asignatura)=>{
        Eliminar(asignatura, `${API_URL}/materia/eliminar`,asignatura.nombre,setAsginaturas)
    }
    

    return (
        <div>
            <div>
                <h1>Crear o editar nueva asignatura</h1>
                <div>
                    <label htmlFor="">Nombre</label>
                    <input type="text" 
                    ref={inputRef}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder='Nombre de la asignatura'
                    />
                    <BotonAdd onClick={()=>OnSave()}/>
                </div>
                
         </div>
            {asignaturas.length === 0 ? (
                    <p className="no-periodos">No hay asignaturas registradas.</p>
                    ) : (
                    <table className="tabla_periodos">
                        <thead>
                        <tr>
                         <th>ID</th>
                        </tr>
                     </thead>
                     <tbody>
                         {asignaturas.map((as, index) => (
                            <tr key={index}>
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