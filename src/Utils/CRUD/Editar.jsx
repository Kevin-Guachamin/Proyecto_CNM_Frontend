import axios from 'axios'
import { ErrorMessage } from '../ErrorMesaje';
import Swal from 'sweetalert2';


export function Editar (dataToUpdate,newData, URL, setData, setIsModalOpen, PK,headers){
    
    if (dataToUpdate) {
        // Si estamos editando un usuario, lo actualizamos
        
        axios
          .put(`${URL}/editar/${dataToUpdate[PK]}`, newData,headers)
          .then((res) => {
            
            setData((prevData) => {
              return prevData.map((data) =>
                data[PK] === dataToUpdate[PK] ? res.data : data
              );
            });
            
            setIsModalOpen(false); // Cerrar el modal
           Swal.fire({
                 icon: "success",
                 title: "Cambios guardados con éxito",
                 iconColor: "#218838",
                 confirmButtonText: "Entendido",
                 confirmButtonColor: "#003F89",
               });
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
      } else {
        // Si no estamos editando, agregamos uno nuevo
        
        axios
          .post(`${URL}/crear`, newData,headers)
          .then((res) => {
            console.log("este llego de la base despues de crear",res.data)
            setData((prevData) => [...prevData, res.data]);
            Swal.fire({
              icon: "success",
              title: "Datos creados con éxito",
              iconColor: "#218838",
              confirmButtonText: "Entendido",
              confirmButtonColor: "#003F89",
            });
            setIsModalOpen(false); // Cerrar el modal
          })
          .catch((error) => {
            ErrorMessage(error)
            console.log(error)
          });
       
}
}